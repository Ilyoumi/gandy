<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;

    protected $fillable = [
        'agenda_id', // Add the agenda_id field
        'agenda_name', // Add the agenda_name field
        'created_at', // Add the created_at field
        'updated_at', // Add the updated_at field
    ];

    public function agendas()
{
    return $this->belongsToMany(Agenda::class);
}
}
