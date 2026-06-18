<?php

namespace App\Services;

use App\Models\AuditLog;

class AuditLogService
{
    public function getLogs($entityType = null, $perPage = 20)
    {
        $query = AuditLog::orderBy('created_at', 'desc');

        if ($entityType) {
            $query->where('entity_type', $entityType);
        }

        return $query->paginate($perPage);
    }
}