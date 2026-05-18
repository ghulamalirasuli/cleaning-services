<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'body' => 'nullable|string',
        ]);

        $booking = $request->user()->bookings()->findOrFail($validated['booking_id']);

        if ($booking->status !== 'completed') {
            return response()->json(['message' => 'Can only review completed bookings'], 422);
        }

        if ($booking->review) {
            return response()->json(['message' => 'Booking already has a review'], 422);
        }

        if (!$booking->cleaner_id) {
            return response()->json(['message' => 'No cleaner assigned to this booking'], 422);
        }

        $review = Review::create([
            'booking_id' => $booking->id,
            'user_id' => $request->user()->id,
            'cleaner_id' => $booking->cleaner_id,
            'rating' => $validated['rating'],
            'body' => $validated['body'] ?? null,
        ]);

        $cleaner = $booking->cleaner;
        $avgRating = $cleaner->reviews()->avg('rating');
        $cleaner->update(['rating' => round($avgRating, 2)]);

        return response()->json($review, 201);
    }
}
