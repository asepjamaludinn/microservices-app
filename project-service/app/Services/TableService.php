<?php

namespace App\Services;

use App\Models\Table;

class TableService
{
    public function getAllTables()
    {
        return Table::orderBy('area')->orderBy('table_number')->get();
    }

    public function createTable(array $data)
    {
        return Table::create($data);
    }

    public function updateTableStatus($id, $status)
    {
        $table = Table::findOrFail($id);
        $table->status = $status;
        $table->save();
        return $table;
    }
    public function deleteTable($id)
    {
        $table = Table::findOrFail($id);
        
        if (in_array($table->status, ['in_use', 'reserved'])) {
            throw new \Exception('Meja sedang digunakan atau direservasi, tidak dapat dihapus.', 400);
        }

        return $table->delete();
    }
}