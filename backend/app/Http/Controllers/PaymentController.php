<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    public function payBalance(Request $request, int $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);

        if ($booking->status !== 'completed') {
            return response()->json(['message' => 'Booking must be completed before paying balance'], 422);
        }

        if (!$booking->total_amount) {
            return response()->json(['message' => 'Total amount not yet calculated'], 422);
        }

        $existingBalance = $booking->balancePayment;
        if ($existingBalance && $existingBalance->status === 'paid') {
            return response()->json(['message' => 'Balance already paid'], 422);
        }

        $balanceAmount = $booking->total_amount - $booking->deposit_amount;
        if ($balanceAmount <= 0) {
            return response()->json(['message' => 'No balance due'], 200);
        }

        $user = $request->user();
        $stripe = new StripeClient(config('services.stripe.secret'));

        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => (int) ($balanceAmount * 100),
            'currency' => 'eur',
            'customer' => $user->stripe_customer_id,
            'metadata' => ['booking_reference' => $booking->reference, 'type' => 'balance'],
        ]);

        $payment = Payment::updateOrCreate(
            ['booking_id' => $booking->id, 'type' => 'balance'],
            [
                'amount' => $balanceAmount,
                'status' => 'pending',
                'stripe_payment_intent_id' => $paymentIntent->id,
            ]
        );

        return response()->json([
            'client_secret' => $paymentIntent->client_secret,
            'amount' => $balanceAmount,
            'payment' => $payment,
        ]);
    }
}
