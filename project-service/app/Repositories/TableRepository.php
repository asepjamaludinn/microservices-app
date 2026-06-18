<?php

namespace App\Repositories;

use App\Models\Table;

class TableRepository
{
    public function getAllSorted()
    {
        return Table::orderBy('area')->orderBy('table_number')->get();
    }

    public function findById($id)
    {
        return Table::findOrFail($id);
    }

    public function findLockedById($id)
    {
        return Table::lockForUpdate()->findOrFail($id);
    }

    public function create(array $data)
    {
        return Table::create($data);
    }

    public function update(Table $table, array $data)
    {
        $table->update($data);
        return $table;
    }

    public function delete(Table $table)
    {
        return $table->delete();
    }
}