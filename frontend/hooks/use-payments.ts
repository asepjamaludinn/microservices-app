"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Payment } from "@/types/payment";
import { getPayments, refundPayment } from "@/services/payments.service";

export function usePayments() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const fetchPayments = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getPayments(page, search);
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
    const delayDebounceFn = setTimeout(() => {
      fetchPayments(1, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchPayments]);

  const handleRefund = async (id: number) => {
    setIsProcessing(true);
    try {
      await refundPayment(id);
      await fetchPayments(currentPage, searchQuery);
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
    searchQuery,
    setSearchQuery,
    fetchPayments,
    handleRefund,
  };
}
