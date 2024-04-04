<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class agenda extends Model
{
    use HasFactory, softDeletes;
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'contact_id', 'name', 'description', // Add other fillable fields as needed
    ];

    /**
     * Get the user that owns the agenda item.
     */
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
    public function rdvs()
    {
        return $this->hasMany(Rdv::class, 'id_agenda');
    }



    public function user()
    {
        return $this->belongsTo(User::class, 'contact_id');
    }
}
