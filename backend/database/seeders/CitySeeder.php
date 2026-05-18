<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            ['name' => 'Berlin', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Munich', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Hamburg', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Frankfurt', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Cologne', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Stuttgart', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Düsseldorf', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Leipzig', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Dortmund', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Essen', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Bremen', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Dresden', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Hanover', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Nuremberg', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Bonn', 'country_code' => 'DE', 'is_active' => true],
            ['name' => 'Münster', 'country_code' => 'DE', 'is_active' => true],
        ];

        foreach ($cities as $city) {
            City::firstOrCreate(
                ['name' => $city['name'], 'country_code' => $city['country_code']],
                ['is_active' => $city['is_active']]
            );
        }
    }
}
