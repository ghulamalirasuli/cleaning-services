<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\City;
use App\Models\Service;
use App\Models\Payment;
use App\Models\ServiceExtra;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Stripe\StripeClient;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => ['required', Rule::exists('services', 'id')->whereNull('deleted_at')],
            'city_id' => ['required', Rule::exists(City::class, 'id')],
            'address' => 'required|string',
            'scheduled_at' => 'required|date|after:now',
            'frequency' => 'required|in:once,weekly,biweekly,monthly',
            'estimated_hours' => 'required|numeric|min:2',
            'english_speaker_requested' => 'boolean',
            'extras' => 'array',
            'extras.*' => 'exists:service_extras,id',
            'notes' => 'nullable|string',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        if (! $service->is_active) {
            return response()->json(['message' => 'This service is not available for booking.'], 422);
        }

        if ($service->is_quote_based) {
            return response()->json(['message' => 'This service requires a quote. Please submit a quote request.'], 422);
        }

        if (! empty($validated['extras'])) {
            $validCount = ServiceExtra::query()
                ->where('service_id', $service->id)
                ->whereIn('id', $validated['extras'])
                ->where('is_active', true)
                ->count();
            if ($validCount !== count($validated['extras'])) {
                return response()->json(['message' => 'One or more selected extras are invalid or inactive.'], 422);
            }
        }

        $depositAmount = $service->hourly_rate;
        $reference = Booking::generateReference();

        $user = $request->user();

        $stripe = new StripeClient(config('services.stripe.secret'));

        if (!$user->stripe_customer_id) {
            $customer = $stripe->customers->create([
                'email' => $user->email,
                'name' => $user->name,
            ]);
            $user->update(['stripe_customer_id' => $customer->id]);
        }

        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => (int) ($depositAmount * 100),
            'currency' => 'eur',
            'customer' => $user->stripe_customer_id,
            'setup_future_usage' => 'off_session',
            'metadata' => ['reference' => $reference],
        ]);

        $booking = Booking::create([
            'reference' => $reference,
            'user_id' => $user->id,
            'service_id' => $validated['service_id'],
            'city_id' => $validated['city_id'],
            'address' => $validated['address'],
            'scheduled_at' => $validated['scheduled_at'],
            'frequency' => $validated['frequency'],
            'estimated_hours' => $validated['estimated_hours'],
            'deposit_amount' => $depositAmount,
            'english_speaker_requested' => $validated['english_speaker_requested'] ?? false,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        if (!empty($validated['extras'])) {
            $booking->extras()->attach($validated['extras']);
        }

        Payment::create([
            'booking_id' => $booking->id,
            'type' => 'deposit',
            'amount' => $depositAmount,
            'status' => 'pending',
            'stripe_payment_intent_id' => $paymentIntent->id,
        ]);

        return response()->json([
            'booking' => $booking->load(['service', 'city', 'extras']),
            'client_secret' => $paymentIntent->client_secret,
        ], 201);
    }

    public function index(Request $request)
    {
        $query = $request->user()->bookings()->with(['service', 'city', 'cleaner.user', 'payments']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->orderBy('scheduled_at', 'desc')->paginate(15);

        return response()->json($bookings);
    }

    public function show(Request $request, string $reference)
    {
        $booking = $request->user()->bookings()
            ->with(['service', 'city', 'cleaner.user', 'payments', 'extras', 'review'])
            ->where('reference', $reference)
            ->firstOrFail();

        return response()->json($booking);
    }

    public function cancel(Request $request, int $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);

        if ($booking->status === 'cancelled') {
            return response()->json(['message' => 'Booking is already cancelled'], 422);
        }

        if (in_array($booking->status, ['in_progress', 'completed'])) {
            return response()->json(['message' => 'Cannot cancel a booking that is in progress or completed'], 422);
        }

        $booking->update(['status' => 'cancelled']);

        $depositPayment = $booking->depositPayment;
        if ($depositPayment && $depositPayment->status === 'paid') {
            $hoursUntilService = now()->diffInHours($booking->scheduled_at, false);
            if ($hoursUntilService >= 48) {
                try {
                    $stripe = new StripeClient(config('services.stripe.secret'));
                    $stripe->refunds->create([
                        'payment_intent' => $depositPayment->stripe_payment_intent_id,
                    ]);
                    $depositPayment->update(['status' => 'refunded']);
                } catch (\Exception $e) {
                    // Log refund failure but still cancel booking
                }
            }
        }

        return response()->json(['message' => 'Booking cancelled', 'booking' => $booking->fresh()]);
    }

    public function requestCorrection(Request $request, int $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);

        if ($booking->status !== 'completed') {
            return response()->json(['message' => 'Correction can only be requested for completed bookings'], 422);
        }

        $hoursAfterCompletion = $booking->updated_at->diffInHours(now());
        if ($hoursAfterCompletion > 24) {
            return response()->json(['message' => 'Correction must be requested within 24 hours of completion'], 422);
        }

        $newReference = Booking::generateReference();
        $correctionBooking = Booking::create([
            'reference' => $newReference,
            'user_id' => $booking->user_id,
            'service_id' => $booking->service_id,
            'city_id' => $booking->city_id,
            'address' => $booking->address,
            'scheduled_at' => now()->addDay(),
            'frequency' => 'once',
            'estimated_hours' => 2,
            'deposit_amount' => 0,
            'english_speaker_requested' => $booking->english_speaker_requested,
            'notes' => 'Correction for booking ' . $booking->reference,
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Correction booking created',
            'booking' => $correctionBooking->load(['service', 'city']),
        ], 201);
    }
}
