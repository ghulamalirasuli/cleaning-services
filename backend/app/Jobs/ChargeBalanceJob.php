<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Stripe\StripeClient;

class ChargeBalanceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Booking $booking) {}

    public function handle(): void
    {
        $booking = $this->booking->fresh();

        if ($booking->status !== 'completed' || !$booking->total_amount) {
            return;
        }

        $balanceAmount = $booking->total_amount - $booking->deposit_amount;
        if ($balanceAmount <= 0) {
            return;
        }

        $existingBalance = $booking->balancePayment;
        if ($existingBalance && $existingBalance->status === 'paid') {
            return;
        }

        $user = $booking->user;
        if (!$user->stripe_customer_id) {
            return;
        }

        try {
            $stripe = new StripeClient(config('services.stripe.secret'));

            $paymentMethods = $stripe->paymentMethods->all([
                'customer' => $user->stripe_customer_id,
                'type' => 'card',
            ]);

            if (empty($paymentMethods->data)) {
                return;
            }

            $paymentMethod = $paymentMethods->data[0]->id;

            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => (int) ($balanceAmount * 100),
                'currency' => 'eur',
                'customer' => $user->stripe_customer_id,
                'payment_method' => $paymentMethod,
                'off_session' => true,
                'confirm' => true,
                'metadata' => [
                    'booking_reference' => $booking->reference,
                    'type' => 'balance',
                ],
            ]);

            Payment::updateOrCreate(
                ['booking_id' => $booking->id, 'type' => 'balance'],
                [
                    'amount' => $balanceAmount,
                    'status' => 'paid',
                    'paid_at' => now(),
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'payment_method' => $paymentMethod,
                ]
            );
        } catch (\Exception $e) {
            Payment::updateOrCreate(
                ['booking_id' => $booking->id, 'type' => 'balance'],
                [
                    'amount' => $balanceAmount,
                    'status' => 'failed',
                    'stripe_payment_intent_id' => null,
                ]
            );
        }
    }
}
