<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'app_name' => 'CleanPro',
                'app_name_de' => 'CleanPro',
                'tagline' => 'Premium cleaning for homes & offices across Germany',
                'tagline_de' => 'Premium-Reinigung für Zuhause und Büro in Deutschland',
                'logo_url' => null,
                'legal_name' => 'CleanPro GmbH',
                'contact_email' => 'info@cleanpro.com',
                'contact_phone' => '+49 30 123 456 78',
                'contact_address' => "CleanPro GmbH\nMusterstraße 1\n10115 Berlin\nGermany",
                'support_intro' => 'Not sure which city to pick or how to enter your address? English-speaking support is here to help.',
                'support_intro_de' => 'Unsicher bei Stadt oder Adresse? Unser englischsprachiger Support hilft Ihnen gerne.',
                'support_hours_phone' => '8 am – 6 pm (Monday – Sunday)',
                'support_hours_email' => '24/7 (every day)',
                'support_hours_chat' => '8 am – 6 pm (Monday – Sunday)',
                'support_chat_label' => 'Chat on our website',
                'support_chat_label_de' => 'Chat auf unserer Website',
                'country_code' => 'DE',
                'hero_badge_en' => 'Trusted by 25,000+ customers',
                'hero_badge_de' => 'Über 25.000 zufriedene Kunden',
                'meta' => [
                    'facebook_url' => null,
                    'instagram_url' => null,
                    'linkedin_url' => null,
                    'twitter_url' => null,
                ],
            ]
        );
    }
}
