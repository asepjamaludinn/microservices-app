"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Reservation } from "@/types/reservation";
import {
  getReservations,
  createReservation,
  processReservationAction,
} from "@/services/reservations.service";

export function useReservations() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const fetchReservations = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getReservations(page, search);
      setReservations(data.reservations);
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
      fetchReservations(1, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchReservations]);

  const addReservation = async (payload: any) => {
    await createReservation(payload);
    await fetchReservations(1, searchQuery);
  };

  const changeStatus = async (
    id: number,
    action: "confirm" | "complete" | "cancel",
  ) => {
    setIsProcessing(true);
    try {
      await processReservationAction(id, action);
      await fetchReservations(currentPage, searchQuery);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    reservations,
    loading,
    currentPage,
    totalPages,
    isProcessing,
    searchQuery,
    setSearchQuery,
    fetchReservations,
    addReservation,
    changeStatus,
  };
}
