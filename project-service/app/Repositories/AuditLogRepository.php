<?php

namespace App\Repositories;

use App\Models\AuditLog;

class AuditLogRepository
{
    public function getPaginatedLogs($entityType = null, $perPage = 20)
    {
        $query = AuditLog::orderBy('created_at', 'desc');

        if ($entityType) {
            $query->where('entity_type', $entityType);
        }

        return $query->paginate($perPage);
    }

    public function create(array $data)
    {
        return AuditLog::create($data);
    }
}