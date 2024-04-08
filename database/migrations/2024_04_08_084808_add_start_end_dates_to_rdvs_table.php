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
            // Add start_date and end_date columns
            $table->dateTime('start_date')->after('id_agenda')->nullable();
            $table->dateTime('end_date')->after('start_date')->nullable();
            // Remove the previous appointment_date column
            $table->dropColumn('appointment_date');
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
            // Rollback changes
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
            // Add back the previous appointment_date column
            $table->dateTime('appointment_date')->after('id_agenda')->nullable();
        });
    }
};
