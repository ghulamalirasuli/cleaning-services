<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quote extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'email', 'phone', 'company', 'city_id', 'description', 'status'];

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
