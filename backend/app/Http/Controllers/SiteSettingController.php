<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;

class SiteSettingController extends Controller
{
    /**
     * Public site branding & contact (no auth).
     */
    public function show()
    {
        $s = SiteSetting::getSingleton();

        return response()->json($s);
    }
}
