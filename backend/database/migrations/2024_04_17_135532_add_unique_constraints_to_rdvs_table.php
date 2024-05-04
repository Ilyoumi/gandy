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
        // Drop existing start_date and end_date columns
        Schema::table('rdvs', function (Blueprint $table) {
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
        });

        // Add start_date and end_date columns with unique constraint
        Schema::table('rdvs', function (Blueprint $table) {
            $table->dateTime('start_date')->after('id_agenda')->nullable();
            $table->dateTime('end_date')->after('start_date')->nullable();

            $table->unique(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Remove the unique constraint and drop the columns
        Schema::table('rdvs', function (Blueprint $table) {
            $table->dropUnique(['start_date', 'end_date']);
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
        });
    }
};
