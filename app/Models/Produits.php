<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produits extends Model
{
    use HasFactory;

    protected $table = 'produits';

    protected $fillable = [
        "nom",
        'description',
        'prix',
        'image',
    ];

    public function shops()
{
    return $this->hasMany(Shop::class);
}

}
