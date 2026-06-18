<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableStatusRequest;
use App\Services\TableService;
use App\Http\Resources\TableResource; 

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
        return $this->successResponse(TableResource::collection($tables), 'Data meja berhasil diambil.');
    }

    public function store(StoreTableRequest $request)
    {
        $table = $this->tableService->createTable($request->validated());
        return $this->successResponse(new TableResource($table), 'Meja baru berhasil ditambahkan.', 201);
    }

    public function updateStatus(UpdateTableStatusRequest $request, $id)
    {
        $validated = $request->validated();
        
        $table = $this->tableService->updateTableStatus($id, $validated['status']);
        return $this->successResponse(new TableResource($table), "Status meja {$table->table_number} berhasil diubah.");
    }
}