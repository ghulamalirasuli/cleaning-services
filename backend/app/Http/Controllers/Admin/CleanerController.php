<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\City;
use App\Models\Cleaner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CleanerController extends Controller
{
    public function index(Request $request)
    {
        $query = Cleaner::with(['user', 'city']);
        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }
        $query->orderByDesc('id');

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => [
                'required',
                'exists:users,id',
                Rule::unique('cleaners', 'user_id')->whereNull('deleted_at'),
            ],
            'bio' => 'nullable|string',
            'is_english_speaking' => 'boolean',
            'is_background_checked' => 'boolean',
            'is_active' => 'boolean',
            'city_id' => ['required', Rule::exists(City::class, 'id')],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $user->update(['role' => 'cleaner']);

        $cleaner = Cleaner::create($validated);

        return response()->json($cleaner->load(['user', 'city']), 201);
    }

    public function show(int $id)
    {
        return response()->json(Cleaner::withTrashed()->with(['user', 'city', 'reviews'])->findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $cleaner = Cleaner::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'bio' => 'nullable|string',
            'is_english_speaking' => 'boolean',
            'is_background_checked' => 'boolean',
            'is_active' => 'boolean',
            'city_id' => ['sometimes', Rule::exists(City::class, 'id')],
        ]);
        $cleaner->update($validated);
        return response()->json($cleaner->fresh()->load(['user', 'city']));
    }

    public function destroy(int $id)
    {
        $cleaner = Cleaner::findOrFail($id);
        $cleaner->user->update(['role' => 'customer']);
        $cleaner->delete();
        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(int $id)
    {
        $cleaner = Cleaner::onlyTrashed()->findOrFail($id);
        $cleaner->restore();
        $cleaner->user->update(['role' => 'cleaner']);
        return response()->json($cleaner->fresh()->load(['user', 'city']));
    }

    public function forceDestroy(int $id)
    {
        $cleaner = Cleaner::onlyTrashed()->findOrFail($id);
        if (Booking::withTrashed()->where('cleaner_id', $cleaner->id)->exists()) {
            return response()->json([
                'message' => 'Cannot permanently delete this cleaner while bookings still reference them.',
            ], 422);
        }
        $cleaner->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }
}
