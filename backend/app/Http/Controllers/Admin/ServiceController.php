<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query()
            ->withCount(['bookings', 'extras'])
            ->orderBy('name');

        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_de' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_de' => 'nullable|string',
            'hourly_rate' => 'required|numeric|min:0',
            'is_quote_based' => 'boolean',
            'is_active' => 'boolean',
            'slug' => 'nullable|string|max:255',
        ]);

        $slug = $this->uniqueSlug(
            filled($validated['slug'] ?? null)
                ? Str::slug($validated['slug'])
                : Str::slug($validated['name'])
        );

        unset($validated['slug']);

        $data = array_merge($validated, ['slug' => $slug]);
        if (! array_key_exists('is_active', $validated)) {
            $data['is_active'] = true;
        }

        $service = Service::create($data);

        return response()->json($service->fresh()->loadCount(['bookings', 'extras']), 201);
    }

    public function show(Service $service)
    {
        return response()->json($service->loadCount(['bookings', 'extras']));
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_de' => 'nullable|string|max:255',
            'description' => 'sometimes|required|string',
            'description_de' => 'nullable|string',
            'hourly_rate' => 'sometimes|required|numeric|min:0',
            'is_quote_based' => 'boolean',
            'is_active' => 'boolean',
            'slug' => 'sometimes|required|string|max:255',
        ]);

        if (isset($validated['slug'])) {
            $validated['slug'] = $this->uniqueSlug(Str::slug($validated['slug']), $service->id);
        }

        $service->update($validated);

        return response()->json($service->fresh()->loadCount(['bookings', 'extras']));
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(int $id)
    {
        $service = Service::onlyTrashed()->findOrFail($id);
        $service->restore();

        return response()->json($service->fresh()->loadCount(['bookings', 'extras']));
    }

    public function forceDestroy(int $id)
    {
        $service = Service::onlyTrashed()->findOrFail($id);

        if ($service->bookings()->exists()) {
            return response()->json([
                'message' => 'Cannot permanently delete this service while bookings still reference it.',
            ], 422);
        }

        $service->forceDelete();

        return response()->json(['message' => 'Permanently deleted']);
    }

    /**
     * @param  int|null  $ignoreId  Service id to ignore when checking uniqueness (updates)
     */
    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug !== '' ? $slug : 'service';
        $candidate = $base;
        $n = 2;

        while (
            Service::withTrashed()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $base.'-'.$n;
            $n++;
        }

        return $candidate;
    }
}
