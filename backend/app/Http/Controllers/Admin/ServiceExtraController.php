<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceExtra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ServiceExtraController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceExtra::query()
            ->with('service:id,name,slug,is_active,deleted_at')
            ->orderBy('service_id')
            ->orderBy('name');

        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->integer('service_id'));
        }

        return response()->json($query->paginate(30));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => ['required', Rule::exists('services', 'id')->whereNull('deleted_at')],
            'name' => 'required|string|max:255',
            'name_de' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_de' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'requires_equipment' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if (! array_key_exists('is_active', $validated)) {
            $validated['is_active'] = true;
        }

        $extra = ServiceExtra::create($validated);

        return response()->json($extra->load('service:id,name,slug'), 201);
    }

    public function show(ServiceExtra $service_extra)
    {
        return response()->json($service_extra->load('service:id,name,slug'));
    }

    public function update(Request $request, ServiceExtra $service_extra)
    {
        $validated = $request->validate([
            'service_id' => ['sometimes', 'required', Rule::exists('services', 'id')->whereNull('deleted_at')],
            'name' => 'sometimes|required|string|max:255',
            'name_de' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_de' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'requires_equipment' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $service_extra->update($validated);

        return response()->json($service_extra->fresh()->load('service:id,name,slug'));
    }

    public function destroy(ServiceExtra $service_extra)
    {
        $service_extra->delete();

        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(int $id)
    {
        $extra = ServiceExtra::onlyTrashed()->findOrFail($id);
        $extra->restore();

        return response()->json($extra->fresh()->load('service:id,name,slug'));
    }

    public function forceDestroy(int $id)
    {
        $extra = ServiceExtra::onlyTrashed()->findOrFail($id);

        if (DB::table('booking_extras')->where('service_extra_id', $extra->id)->exists()) {
            return response()->json([
                'message' => 'Cannot permanently delete this extra while bookings still reference it.',
            ], 422);
        }

        $extra->forceDelete();

        return response()->json(['message' => 'Permanently deleted']);
    }
}
