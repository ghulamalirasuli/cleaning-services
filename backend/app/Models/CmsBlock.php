<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CmsBlock extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'page',
        'section_key',
        'sort_order',
        'title_en',
        'title_de',
        'body_en',
        'body_de',
        'icon',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_active', true);
    }
}
