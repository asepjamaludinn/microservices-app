<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TableService;

class TableController extends Controller
{
    protected $tableService;

    public function __construct(TableService $tableService)
    {
        $this->tableService = $tableService;
    }

    public function index()
    {
        $tables = $this->tableService->getAllTables();
        return $this->successResponse($tables, 'Data meja berhasil diambil.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|string|unique:tables',
            'name' => 'nullable|string',
            'area' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:available,in_use,reserved,maintenance',
        ]);

        $table = $this->tableService->createTable($validated);
        return $this->successResponse($table, 'Meja baru berhasil ditambahkan.', 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,in_use,reserved,maintenance',
        ]);

        $table = $this->tableService->updateTableStatus($id, $validated['status']);
        return $this->successResponse($table, "Status meja {$table->table_number} berhasil diubah.");
    }
}