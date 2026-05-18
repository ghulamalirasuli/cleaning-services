<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        if (empty($webhookSecret) || $webhookSecret === 'whsec_placeholder') {
            \Log::warning('Stripe webhook: STRIPE_WEBHOOK_SECRET is not set. Deposit confirmations via webhook will not update the database. For local testing run: stripe listen --forward-to '.url('/api/webhooks/stripe').' and paste the whsec_ value into .env');

            return response()->json([
                'status' => 'ignored',
                'message' => 'Webhook secret not configured',
            ], 200);
        }

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $this->handlePaymentSucceeded($event->data->object);
                break;
            case 'payment_intent.payment_failed':
                $this->handlePaymentFailed($event->data->object);
                break;
        }

        return response()->json(['status' => 'ok']);
    }

    protected function handlePaymentSucceeded($paymentIntent)
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();
        if ($payment) {
            $payment->update([
                'status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $paymentIntent->payment_method,
            ]);

            if ($payment->type === 'deposit') {
                $payment->booking->update(['status' => 'confirmed']);
            }
        }
    }

    protected function handlePaymentFailed($paymentIntent)
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();
        if ($payment) {
            $payment->update(['status' => 'failed']);
        }
    }
}
