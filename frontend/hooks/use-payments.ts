"use client";

import { useCallback, useEffect, useState } from "react";
import { Payment } from "@/types/payment";
import { getPayments, refundPayment } from "@/services/payments.service";

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPayments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await getPayments(page);
      setPayments(data.payments);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleRefund = async (id: number) => {
    setIsProcessing(true);
    try {
      await refundPayment(id);
      await fetchPayments(currentPage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    payments,
    loading,
    currentPage,
    totalPages,
    isProcessing,
    fetchPayments,
    handleRefund,
  };
}
