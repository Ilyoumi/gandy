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
            // Add modifiedBy column
            $table->unsignedBigInteger('modifiedBy')->nullable();

            // Add updatedAt column
            $table->timestamp('updatedAt')->nullable();
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
            // Drop modifiedBy column
            $table->dropColumn('modifiedBy');

            // Drop updatedAt column
            $table->dropColumn('updatedAt');
        });
    }
};
