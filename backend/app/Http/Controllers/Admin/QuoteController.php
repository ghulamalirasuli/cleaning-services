<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Quote::with('city');
        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        $query->orderBy('created_at', 'desc');

        return response()->json($query->paginate(20));
    }

    public function show(int $id)
    {
        return response()->json(Quote::withTrashed()->with('city')->findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $quote = Quote::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'status' => 'sometimes|in:new,contacted,quoted,won,lost',
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'city_id' => ['sometimes', Rule::exists(City::class, 'id')],
            'description' => 'sometimes|string',
        ]);
        $quote->update($validated);
        return response()->json($quote->fresh()->load('city'));
    }

    public function destroy(int $id)
    {
        Quote::findOrFail($id)->delete();
        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(int $id)
    {
        $quote = Quote::onlyTrashed()->findOrFail($id);
        $quote->restore();
        return response()->json($quote->fresh()->load('city'));
    }

    public function forceDestroy(int $id)
    {
        Quote::onlyTrashed()->findOrFail($id)->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }
}
