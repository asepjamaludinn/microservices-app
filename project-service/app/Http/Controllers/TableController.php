<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::orderBy('area')->orderBy('table_number')->get();
        return $this->successResponse($tables, 'Data meja berhasil diambil.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'table_number' => 'required|string|unique:tables',
            'name' => 'nullable|string',
            'area' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:available,in_use,reserved,maintenance',
        ]);

        $table = Table::create($request->all());
        return $this->successResponse($table, 'Meja baru berhasil ditambahkan.', 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:available,in_use,reserved,maintenance',
        ]);

        $table = Table::findOrFail($id);
        $table->status = $request->status;
        $table->save();

        return $this->successResponse($table, "Status meja {$table->table_number} berhasil diubah.");
    }
}