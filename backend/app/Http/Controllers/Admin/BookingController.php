<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ChargeBalanceJob;
use App\Models\Booking;
use App\Models\Cleaner;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'service', 'city', 'cleaner.user', 'payments']);

        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }
        if ($request->has('from')) {
            $query->where('scheduled_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->where('scheduled_at', '<=', $request->to);
        }

        return response()->json($query->orderBy('scheduled_at', 'desc')->paginate(20));
    }

    public function show(int $id)
    {
        $booking = Booking::withTrashed()
            ->with(['user', 'service', 'city', 'cleaner.user', 'payments', 'extras', 'review'])
            ->findOrFail($id);
        return response()->json($booking);
    }

    public function update(Request $request, int $id)
    {
        $booking = Booking::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,in_progress,completed,cancelled',
            'scheduled_at' => 'sometimes|date',
            'notes' => 'sometimes|nullable|string',
        ]);
        $booking->update($validated);
        return response()->json($booking->fresh());
    }

    public function destroy(int $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(int $id)
    {
        $booking = Booking::onlyTrashed()->findOrFail($id);
        $booking->restore();
        return response()->json($booking->fresh()->load(['user', 'service', 'city', 'cleaner.user', 'payments']));
    }

    public function forceDestroy(int $id)
    {
        Booking::onlyTrashed()->findOrFail($id)->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }

    public function assignCleaner(Request $request, int $id)
    {
        $request->validate([
            'cleaner_id' => ['required', Rule::exists(Cleaner::class, 'id')],
        ]);

        $booking = Booking::findOrFail($id);
        $cleaner = Cleaner::findOrFail($request->cleaner_id);

        $booking->update([
            'cleaner_id' => $cleaner->id,
            'status' => 'confirmed',
        ]);

        return response()->json($booking->load('cleaner.user'));
    }

    public function complete(Request $request, int $id)
    {
        $request->validate(['actual_hours' => 'required|numeric|min:1']);

        $booking = Booking::with('service')->findOrFail($id);
        $totalAmount = $booking->service->hourly_rate * $request->actual_hours;

        $booking->update([
            'status' => 'completed',
            'total_amount' => $totalAmount,
            'estimated_hours' => $request->actual_hours,
        ]);

        ChargeBalanceJob::dispatch($booking)->delay(now()->addHours(48));

        return response()->json($booking->fresh());
    }
}
