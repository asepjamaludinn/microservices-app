"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuditLog } from "@/types/audit-log";
import { getAuditLogs } from "@/services/audit-logs.service";

export const ENTITY_TYPES = [
  "All",
  "Order",
  "Menu",
  "Table",
  "Category",
  "Inventory",
  "User",
] as const;

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [entityType, setEntityType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = useCallback(async (page: number, type: string) => {
    setLoading(true);
    try {
      const data = await getAuditLogs(page, type);
      setLogs(data.logs);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(1, entityType);
  }, [entityType, fetchLogs]);

  const handlePageChange = (newPage: number) => {
    fetchLogs(newPage, entityType);
  };

  const openDetailModal = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLog(null), 200);
  };

  return {
    logs,
    loading,
    entityType,
    setEntityType,
    currentPage,
    totalPages,
    handlePageChange,
    selectedLog,
    isModalOpen,
    openDetailModal,
    closeDetailModal,
  };
}
