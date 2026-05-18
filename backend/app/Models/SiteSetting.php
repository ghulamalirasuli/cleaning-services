<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'app_name',
        'app_name_de',
        'tagline',
        'tagline_de',
        'logo_url',
        'legal_name',
        'contact_email',
        'contact_phone',
        'contact_address',
        'support_intro',
        'support_intro_de',
        'support_hours_phone',
        'support_hours_email',
        'support_hours_chat',
        'support_chat_label',
        'support_chat_label_de',
        'country_code',
        'hero_badge_en',
        'hero_badge_de',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
        ];
    }

    /**
     * Single global row (id = 1).
     */
    public static function getSingleton(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'app_name' => 'CleanPro',
                'app_name_de' => 'CleanPro',
                'contact_email' => 'info@cleanpro.com',
            ]
        );
    }
}
