<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsBlock;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CmsBlockController extends Controller
{
    private const PAGES = ['about', 'contact', 'cities', 'services', 'home'];

    public function index(Request $request)
    {
        $query = CmsBlock::query()->orderBy('page')->orderBy('sort_order')->orderBy('id');

        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }

        if ($request->filled('page') && in_array($request->string('page'), self::PAGES, true)) {
            $query->where('page', $request->string('page'));
        }

        return response()->json($query->paginate(50));
    }

    public function store(Request $request)
    {
        $validated = $this->validateBlock($request, false);
        $row = CmsBlock::create($validated);

        return response()->json($row, 201);
    }

    public function show(string $cms_block)
    {
        return response()->json(CmsBlock::withTrashed()->findOrFail((int) $cms_block));
    }

    public function update(Request $request, string $cms_block)
    {
        $row = CmsBlock::withTrashed()->findOrFail((int) $cms_block);
        $validated = $this->validateBlock($request, true);
        $row->update($validated);

        return response()->json($row->fresh());
    }

    public function destroy(string $cms_block)
    {
        $row = CmsBlock::findOrFail((int) $cms_block);
        $row->delete();

        return response()->json(['message' => 'Moved to trash']);
    }

    public function restore(string $id)
    {
        $row = CmsBlock::onlyTrashed()->findOrFail((int) $id);
        $row->restore();

        return response()->json($row->fresh());
    }

    public function forceDestroy(string $id)
    {
        $row = CmsBlock::onlyTrashed()->findOrFail((int) $id);
        $row->forceDelete();

        return response()->json(['message' => 'Permanently deleted']);
    }

    private function validateBlock(Request $request, bool $partial): array
    {
        $rules = [
            'page' => ($partial ? 'sometimes' : 'required').'|string|in:'.implode(',', self::PAGES),
            'section_key' => ($partial ? 'sometimes' : 'required').'|string|max:64',
            'sort_order' => 'nullable|integer|min:0|max:999999',
            'title_en' => 'nullable|string',
            'title_de' => 'nullable|string',
            'body_en' => 'nullable|string',
            'body_de' => 'nullable|string',
            'icon' => 'nullable|string|max:64',
            'is_active' => 'boolean',
        ];

        $validated = $request->validate($rules);
        if (! $partial && ! array_key_exists('sort_order', $validated)) {
            $validated['sort_order'] = 0;
        }
        if (! $partial && ! array_key_exists('is_active', $validated)) {
            $validated['is_active'] = true;
        }

        $hasContent = ! empty($validated['title_en'] ?? null)
            || ! empty($validated['title_de'] ?? null)
            || ! empty($validated['body_en'] ?? null)
            || ! empty($validated['body_de'] ?? null);
        if (! $partial && ! $hasContent) {
            throw ValidationException::withMessages([
                'title_en' => ['Provide at least one title or body field (English or German).'],
            ]);
        }

        return $validated;
    }
}
