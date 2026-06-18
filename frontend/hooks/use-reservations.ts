"use client";

import { useCallback, useEffect, useState } from "react";
import { Reservation } from "@/types/reservation";
import {
  getReservations,
  createReservation,
  processReservationAction,
} from "@/services/reservations.service";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchReservations = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await getReservations(page);
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
    fetchReservations();
  }, [fetchReservations]);

  const addReservation = async (payload: any) => {
    await createReservation(payload);
    await fetchReservations(1);
  };

  const changeStatus = async (
    id: number,
    action: "confirm" | "complete" | "cancel",
  ) => {
    setIsProcessing(true);
    try {
      await processReservationAction(id, action);
      await fetchReservations(currentPage);
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
    fetchReservations,
    addReservation,
    changeStatus,
  };
}
