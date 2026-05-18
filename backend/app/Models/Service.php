<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug', 'name', 'name_de', 'description', 'description_de', 'hourly_rate', 'is_quote_based', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'hourly_rate' => 'decimal:2',
            'is_quote_based' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function extras()
    {
        return $this->hasMany(ServiceExtra::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
