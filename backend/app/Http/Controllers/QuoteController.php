<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'city_id' => ['required', Rule::exists(City::class, 'id')],
            'description' => 'required|string',
        ]);

        $quote = Quote::create($validated);

        return response()->json($quote, 201);
    }
}
