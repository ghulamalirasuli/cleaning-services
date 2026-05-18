<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(
            Testimonial::query()
                ->published()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
        );
    }
}
