<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Cleaner;
use App\Models\City;
use App\Models\Quote;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $query = City::query();
        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }
        $query->orderBy('name');

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country_code' => 'required|string|max:5',
            'is_active' => 'boolean',
        ]);
        $city = City::create($validated);
        return response()->json($city, 201);
    }

    public function show(int $id)
    {
        return response()->json(City::withTrashed()->findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $city = City::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'country_code' => 'sometimes|string|max:5',
            'is_active' => 'boolean',
        ]);
        $city->update($validated);
        return response()->json($city->fresh());
    }

    public function destroy(int $id)
    {
        City::findOrFail($id)->delete();
        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(int $id)
    {
        $city = City::onlyTrashed()->findOrFail($id);
        $city->restore();
        return response()->json($city->fresh());
    }

    public function forceDestroy(int $id)
    {
        $city = City::onlyTrashed()->findOrFail($id);
        $hasRefs = Booking::withTrashed()->where('city_id', $city->id)->exists()
            || Cleaner::withTrashed()->where('city_id', $city->id)->exists()
            || Quote::withTrashed()->where('city_id', $city->id)->exists();
        if ($hasRefs) {
            return response()->json([
                'message' => 'Cannot permanently delete this city while bookings, cleaners, or quotes still reference it.',
            ], 422);
        }
        $city->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }
}
