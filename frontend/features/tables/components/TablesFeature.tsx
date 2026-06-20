// frontend/features/tables/components/TablesFeature.tsx
"use client";

import { useState } from "react";
import { useTables } from "@/hooks/use-tables";
import { useAddTableModal } from "../hooks/use-add-table-modal";
import { useDeleteTableModal } from "../hooks/use-delete-table-modal";

import TablesToast from "./TablesToast";
import TablesSummaryCards from "./TablesSummaryCards";
import TablesToolbar from "./TablesToolbar";
import TablesTableSkeleton from "./TablesTableSkeleton";
import TablesEmptyState from "./TablesEmptyState";
import TablesTable from "./TablesTable";
import AddTableModal from "./AddTableModal";
import DeleteTableModal from "./DeleteTableModal";

export default function TablesFeature() {
  const {
    processedTables,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterArea,
    setFilterArea,
    summary,
    uniqueAreas,
    changeStatus,
    addTable,
    removeTable,
  } = useTables();

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const {
    isAddModalOpen,
    setIsAddModalOpen,
    isSubmitting,
    newTable,
    setNewTable,
    handleAddSubmit,
  } = useAddTableModal(addTable, showToast);

  const { confirmModal, handleDelete, closeConfirmModal } = useDeleteTableModal(
    removeTable,
    showToast,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <TablesToast toast={toast} />

      <DeleteTableModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      <TablesSummaryCards summary={summary} />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <TablesToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterArea={filterArea}
          setFilterArea={setFilterArea}
          uniqueAreas={uniqueAreas}
          openAddModal={() => setIsAddModalOpen(true)}
        />

        {loading ? (
          <TablesTableSkeleton />
        ) : processedTables.length === 0 ? (
          <TablesEmptyState />
        ) : (
          <TablesTable
            processedTables={processedTables}
            changeStatus={changeStatus}
            handleDelete={handleDelete}
          />
        )}
      </div>

      <AddTableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newTable={newTable}
        setNewTable={setNewTable}
        handleAddSubmit={handleAddSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
