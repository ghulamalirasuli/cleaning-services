<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceExtra;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            CustomerSeeder::class,
            SiteSettingSeeder::class,
            CmsBlockSeeder::class,
            CitySeeder::class,
            TestimonialSeeder::class,
        ]);

        // Services (idempotent on slug — safe to re-run db:seed)
        $regularBasic = Service::updateOrCreate(
            ['slug' => 'regular-basic'],
            [
                'name' => 'Regular Basic Cleaning',
                'name_de' => 'Regelmäßige Grundreinigung',
                'description' => 'Our most affordable option for regular home cleaning. Subscribe and save with consistent, reliable service from the same dedicated cleaner every time. Flexible scheduling with weekly, biweekly, or monthly options.',
                'description_de' => 'Unsere günstigste Option für regelmäßige Hausreinigung. Abonnieren und sparen Sie mit konsistentem, zuverlässigem Service vom gleichen engagierten Reiniger jedes Mal.',
                'hourly_rate' => 28.90,
                'is_quote_based' => false,
            ]
        );

        $basic = Service::updateOrCreate(
            ['slug' => 'basic-cleaning'],
            [
                'name' => 'Basic Cleaning',
                'name_de' => 'Grundreinigung',
                'description' => 'A reliable one-time home cleaning service. Perfect when you need a thorough clean without committing to a regular schedule. Available on short notice for last-minute needs.',
                'description_de' => 'Ein zuverlässiger einmaliger Reinigungsservice für Ihr Zuhause. Perfekt, wenn Sie eine gründliche Reinigung benötigen, ohne sich an einen regelmäßigen Zeitplan zu binden.',
                'hourly_rate' => 31.90,
                'is_quote_based' => false,
            ]
        );

        $deep = Service::updateOrCreate(
            ['slug' => 'deep-cleaning'],
            [
                'name' => 'Deep Cleaning',
                'name_de' => 'Tiefenreinigung',
                'description' => 'Intensive deep cleaning service for homes needing extra attention. Ideal for after-builders cleanup, pre-move preparation, or periodic thorough cleaning including hard-to-reach areas.',
                'description_de' => 'Intensiver Tiefenreinigungsservice für Häuser, die besondere Aufmerksamkeit benötigen. Ideal für Bauendreinigung, Umzugsvorbereitung oder regelmäßige gründliche Reinigung.',
                'hourly_rate' => 34.90,
                'is_quote_based' => false,
            ]
        );

        $moveInOut = Service::updateOrCreate(
            ['slug' => 'move-in-out'],
            [
                'name' => 'Move-In / Move-Out Cleaning',
                'name_de' => 'Ein-/Auszugsreinigung',
                'description' => 'Comprehensive cleaning service specifically designed for moving transitions. Ensure your old place is spotless for the landlord inspection or make your new home fresh and ready to live in.',
                'description_de' => 'Umfassender Reinigungsservice speziell für Umzüge. Stellen Sie sicher, dass Ihre alte Wohnung makellos für die Vermieterinspektion ist.',
                'hourly_rate' => 34.90,
                'is_quote_based' => false,
            ]
        );

        Service::updateOrCreate(
            ['slug' => 'office-cleaning'],
            [
                'name' => 'Office Cleaning',
                'name_de' => 'Büroreinigung',
                'description' => 'Professional office cleaning solutions customized to your business needs. Flexible plans for small and medium-sized businesses with a dedicated English-speaking account manager.',
                'description_de' => 'Professionelle Büroreinigungslösungen, maßgeschneidert für Ihre Geschäftsanforderungen. Flexible Pläne für kleine und mittlere Unternehmen.',
                'hourly_rate' => 35.00,
                'is_quote_based' => true,
            ]
        );

        // Service Extras (shared across applicable services)
        $sharedExtras = [
            ['name' => 'Window Cleaning', 'name_de' => 'Fensterreinigung', 'description' => 'Interior and exterior window cleaning', 'description_de' => 'Innen- und Außenfensterreinigung', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Oven Cleaning', 'name_de' => 'Ofenreinigung', 'description' => 'Deep clean inside the oven', 'description_de' => 'Tiefenreinigung des Ofens', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Fridge Cleaning', 'name_de' => 'Kühlschrankreinigung', 'description' => 'Interior fridge deep clean', 'description_de' => 'Tiefenreinigung des Kühlschranks', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Ironing', 'name_de' => 'Bügeln', 'description' => 'Ironing service for clothes', 'description_de' => 'Bügelservice für Kleidung', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Laundry', 'name_de' => 'Wäsche', 'description' => 'On-premise laundry service', 'description_de' => 'Wäscheservice vor Ort', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Balcony Cleaning', 'name_de' => 'Balkonreinigung', 'description' => 'Thorough balcony cleaning', 'description_de' => 'Gründliche Balkonreinigung', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Dishwashing', 'name_de' => 'Geschirrspülen', 'description' => 'Hand dishwashing service', 'description_de' => 'Handgeschirrspülservice', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Watering Plants', 'name_de' => 'Pflanzen gießen', 'description' => 'Water all indoor plants', 'description_de' => 'Alle Zimmerpflanzen gießen', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Mop (Equipment)', 'name_de' => 'Wischmopp (Ausrüstung)', 'description' => 'Cleaner brings a mop', 'description_de' => 'Reiniger bringt einen Wischmopp mit', 'price' => 9.90, 'requires_equipment' => true],
            ['name' => 'Vacuum Cleaner (Equipment)', 'name_de' => 'Staubsauger (Ausrüstung)', 'description' => 'Cleaner brings a vacuum cleaner', 'description_de' => 'Reiniger bringt einen Staubsauger mit', 'price' => 9.90, 'requires_equipment' => true],
            ['name' => 'Cleaning Solvents (Equipment)', 'name_de' => 'Reinigungsmittel (Ausrüstung)', 'description' => 'Cleaner brings cleaning solvents', 'description_de' => 'Reiniger bringt Reinigungsmittel mit', 'price' => 9.90, 'requires_equipment' => true],
            ['name' => 'Chandelier Cleaning', 'name_de' => 'Kronleuchterreinigung', 'description' => 'Careful chandelier cleaning', 'description_de' => 'Sorgfältige Kronleuchterreinigung', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Limescale Removal', 'name_de' => 'Kalkentfernung', 'description' => 'Remove limescale from surfaces', 'description_de' => 'Kalk von Oberflächen entfernen', 'price' => 0, 'requires_equipment' => false],
        ];

        $homeServices = [$regularBasic, $basic, $deep, $moveInOut];
        foreach ($homeServices as $service) {
            foreach ($sharedExtras as $extra) {
                ServiceExtra::updateOrCreate(
                    ['service_id' => $service->id, 'name' => $extra['name']],
                    array_merge($extra, ['service_id' => $service->id])
                );
            }
        }

        // Deep cleaning extra services
        $deepExtras = [
            ['name' => 'After Builders Cleanup', 'name_de' => 'Bauendreinigung', 'description' => 'Post-construction cleaning', 'description_de' => 'Reinigung nach Bauarbeiten', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Carpet Cleaning', 'name_de' => 'Teppichreinigung', 'description' => 'Professional carpet cleaning', 'description_de' => 'Professionelle Teppichreinigung', 'price' => 0, 'requires_equipment' => false],
            ['name' => 'Mold Removal', 'name_de' => 'Schimmelentfernung', 'description' => 'Mold treatment and removal', 'description_de' => 'Schimmelbehandlung und -entfernung', 'price' => 0, 'requires_equipment' => false],
        ];

        foreach ($deepExtras as $extra) {
            ServiceExtra::updateOrCreate(
                ['service_id' => $deep->id, 'name' => $extra['name']],
                array_merge($extra, ['service_id' => $deep->id])
            );
        }
    }
}
