<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cleaner extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'bio', 'is_english_speaking', 'is_background_checked', 'is_active', 'rating', 'city_id',
    ];

    protected function casts(): array
    {
        return [
            'is_english_speaking' => 'boolean',
            'is_background_checked' => 'boolean',
            'is_active' => 'boolean',
            'rating' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
