<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceExtra extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'service_id', 'name', 'name_de', 'description', 'description_de', 'price', 'requires_equipment', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'requires_equipment' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_extras');
    }
}
