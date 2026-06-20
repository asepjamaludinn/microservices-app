<?php

namespace App\Services;

use App\Repositories\TableRepository;

class TableService
{
    protected $tableRepo;

    public function __construct(TableRepository $tableRepo)
    {
        $this->tableRepo = $tableRepo;
    }

    public function getAllTables()
    {
        return $this->tableRepo->getAllSorted();
    }

    public function createTable(array $data)
    {
        return $this->tableRepo->create($data);
    }

    public function updateTableStatus($id, $status)
    {
        $table = $this->tableRepo->findById($id);
        
        return $this->tableRepo->update($table, ['status' => $status]);
    }

    public function deleteTable($id)
    {
        $table = $this->tableRepo->findById($id);
        
        if (in_array($table->status, ['in_use', 'reserved'])) {
            throw new \Exception('Meja sedang digunakan atau direservasi, tidak dapat dihapus.', 400);
        }

        return $this->tableRepo->delete($table);
    }
}