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
        Schema::table('rdvs', function (Blueprint $table) {
            // Make the 'tva', 'gsm', and 'nom_ste' fields nullable
            $table->string('tva')->nullable()->change();
            $table->string('gsm')->nullable()->change();
            $table->string('nom_ste')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rdvs', function (Blueprint $table) {
            // Revert the changes if needed
            $table->string('tva')->change();
            $table->string('gsm')->change();
            $table->string('nom_ste')->change();
        });
    }
};
