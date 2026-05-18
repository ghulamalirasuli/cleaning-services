<?php

namespace App\Http\Controllers;

use App\Models\CmsBlock;
use Illuminate\Http\Request;

class CmsBlockController extends Controller
{
    private const PAGES = ['about', 'contact', 'cities', 'services', 'home'];

    public function index(Request $request)
    {
        $validated = $request->validate([
            'page' => 'required|string|in:'.implode(',', self::PAGES),
        ]);

        $rows = CmsBlock::query()
            ->where('page', $validated['page'])
            ->published()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json($rows);
    }
}
