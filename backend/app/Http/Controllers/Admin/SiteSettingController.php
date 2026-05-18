<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function show()
    {
        return response()->json(SiteSetting::getSingleton());
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'sometimes|string|max:255',
            'app_name_de' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'tagline_de' => 'nullable|string|max:500',
            'logo_url' => 'nullable|string|max:2048',
            'legal_name' => 'nullable|string|max:255',
            'contact_email' => 'sometimes|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'contact_address' => 'nullable|string',
            'support_intro' => 'nullable|string',
            'support_intro_de' => 'nullable|string',
            'support_hours_phone' => 'nullable|string|max:255',
            'support_hours_email' => 'nullable|string|max:255',
            'support_hours_chat' => 'nullable|string|max:255',
            'support_chat_label' => 'nullable|string|max:255',
            'support_chat_label_de' => 'nullable|string|max:255',
            'country_code' => 'nullable|string|max:5',
            'hero_badge_en' => 'nullable|string|max:255',
            'hero_badge_de' => 'nullable|string|max:255',
            'meta' => 'nullable|array',
        ]);

        $setting = SiteSetting::getSingleton();
        $setting->update($validated);

        return response()->json($setting->fresh());
    }
}
