<?php

namespace App\Services;

use App\Repositories\AuditLogRepository;

class AuditLogService
{
    protected $auditLogRepo;

    public function __construct(AuditLogRepository $auditLogRepo)
    {
        $this->auditLogRepo = $auditLogRepo;
    }

   public function getLogs($entityType = null, $perPage = 20, $search = null)
    {
        return $this->auditLogRepo->getPaginatedLogs($entityType, $perPage, $search);
    }
}