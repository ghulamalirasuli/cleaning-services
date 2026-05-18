<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reference', 'user_id', 'cleaner_id', 'service_id', 'city_id', 'address',
        'scheduled_at', 'frequency', 'estimated_hours', 'deposit_amount', 'total_amount',
        'status', 'english_speaker_requested', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'estimated_hours' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'english_speaker_requested' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cleaner()
    {
        return $this->belongsTo(Cleaner::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function extras()
    {
        return $this->belongsToMany(ServiceExtra::class, 'booking_extras');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function depositPayment()
    {
        return $this->hasOne(Payment::class)->where('type', 'deposit');
    }

    public function balancePayment()
    {
        return $this->hasOne(Payment::class)->where('type', 'balance');
    }

    public static function generateReference(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
        return "CLN-{$date}-{$random}";
    }
}
