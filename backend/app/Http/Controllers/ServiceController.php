<?php

namespace App\Http\Controllers;

use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(
            Service::query()
                ->with(['extras' => fn ($q) => $q->where('is_active', true)])
                ->where('is_active', true)
                ->get()
        );
    }

    public function show(string $slug)
    {
        $service = Service::query()
            ->with(['extras' => fn ($q) => $q->where('is_active', true)])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($service);
    }
}
