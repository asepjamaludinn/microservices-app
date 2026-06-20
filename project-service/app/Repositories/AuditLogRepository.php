<?php

namespace App\Repositories;

use App\Models\AuditLog;

class AuditLogRepository
{
    public function getPaginatedLogs($entityType = null, $perPage = 20, $search = null)
    {
        $query = AuditLog::orderBy('created_at', 'desc');

        if ($entityType && $entityType !== 'All') {
            $query->where('entity_type', $entityType);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', '%' . $search . '%')
                  ->orWhere('details', 'like', '%' . $search . '%')
                  ->orWhere('user_name', 'like', '%' . $search . '%'); 
            });
        }

        return $query->paginate($perPage);
    }

    public function create(array $data) 
    { 
        
        if (!isset($data['user_name']) && auth()->check()) {
            $data['user_name'] = auth()->user()->name;
        }

        return AuditLog::create($data); 
    }
}