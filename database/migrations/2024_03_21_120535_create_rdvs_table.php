<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rdvs', function (Blueprint $table) {
            $table->string('nom');
            $table->string('prenom');
            $table->string('nom_ste');
            $table->string('tva');
            $table->string('tel');
            $table->string('gsm');
            $table->boolean('fournisseur');
            $table->string('tarification');
            $table->integer('nbr_comp_elect');
            $table->integer('nbr_comp_gaz');
            $table->boolean('tarif');
            $table->boolean('haute_tension');
            $table->text('commentaire')->nullable();
            $table->unsignedBigInteger('id_agent'); // Ajout de la clé étrangère id_user
            $table->unsignedBigInteger('id_agenda'); // Ajout de la clé étrangère id_agenda
            $table->foreign('id_agent')->references('id')->on('users');
            $table->foreign('id_agenda')->references('id')->on('agendas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rdvs');
    }
};
