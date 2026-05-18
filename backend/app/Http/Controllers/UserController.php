<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'preferred_language' => 'nullable|in:en,de',
        ]);

        $request->user()->update($validated);

        return response()->json($request->user()->fresh());
    }
}
