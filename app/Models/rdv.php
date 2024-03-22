<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Rdv extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'prenom', 'nom_ste', 'tva', 'tel', 'gsm', 'fournisseur',
        'tarification', 'nbr_comp_elect', 'nbr_comp_gaz', 'tarif',
        'haute_tension', 'commentaire', 'id_user', 'id_agenda'
    ];

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
