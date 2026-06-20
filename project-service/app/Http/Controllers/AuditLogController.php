<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuditLogService;
use App\Http\Resources\AuditLogResource;

class AuditLogController extends Controller
{
    protected $auditLogService;

    public function __construct(AuditLogService $auditLogService)
    {
        $this->auditLogService = $auditLogService;
    }

    public function index(Request $request)
{
    $logs = $this->auditLogService->getLogs(
        $request->query('entity_type'), 
        $request->query('per_page', 20),
        $request->query('search')
    );
    
    return $this->paginatedResponse(AuditLogResource::collection($logs), 'Data riwayat audit berhasil diambil.');
}
}