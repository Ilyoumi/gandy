<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Rdv extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Définir les relations
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function agenda()
    {
        return $this->belongsTo(Agenda::class, 'id_agenda');
    }
}
