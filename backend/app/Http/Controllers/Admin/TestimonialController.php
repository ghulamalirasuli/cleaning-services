<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::query()->orderBy('sort_order')->orderBy('id');
        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }
        return response()->json($query->paginate(30));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'author_name' => 'required|string|max:255',
            'author_name_de' => 'nullable|string|max:255',
            'body' => 'required|string',
            'body_de' => 'nullable|string',
            'rating' => 'required|integer|min:1|max:5',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if (! array_key_exists('is_active', $validated)) {
            $validated['is_active'] = true;
        }
        if (! array_key_exists('sort_order', $validated)) {
            $validated['sort_order'] = 0;
        }

        $row = Testimonial::create($validated);
        return response()->json($row, 201);
    }

    public function show(int $id)
    {
        return response()->json(Testimonial::withTrashed()->findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $row = Testimonial::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'author_name' => 'sometimes|required|string|max:255',
            'author_name_de' => 'nullable|string|max:255',
            'body' => 'sometimes|required|string',
            'body_de' => 'nullable|string',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);
        $row->update($validated);
        return response()->json($row->fresh());
    }

    public function destroy(int $id)
    {
        Testimonial::findOrFail($id)->delete();
        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(int $id)
    {
        $row = Testimonial::onlyTrashed()->findOrFail($id);
        $row->restore();
        return response()->json($row->fresh());
    }

    public function forceDestroy(int $id)
    {
        $row = Testimonial::onlyTrashed()->findOrFail($id);
        $row->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }
}
