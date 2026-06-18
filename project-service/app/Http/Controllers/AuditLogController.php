<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::orderBy('created_at', 'desc');

        if ($request->has('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        $logs = $query->paginate(20);
        
        return $this->successResponse($logs, 'Data riwayat audit berhasil diambil.');
    }
}