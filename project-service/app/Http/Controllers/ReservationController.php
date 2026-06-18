<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ReservationService;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationResource;

class ReservationController extends Controller
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    public function index()
    {
        $reservations = $this->reservationService->getAllReservations();
        return $this->successResponse(ReservationResource::collection($reservations)->response()->getData(true), 'Data reservasi berhasil diambil.');
    }

    public function store(StoreReservationRequest $request)
    {
        $reservation = $this->reservationService->createReservation($request->validated());
        return $this->successResponse(new ReservationResource($reservation), 'Reservasi berhasil dibuat.', 201);
    }

    public function show($id)
    {
        $reservation = $this->reservationService->getReservationById($id);
        return $this->successResponse(new ReservationResource($reservation), 'Detail reservasi berhasil diambil.');
    }

    public function confirm($id)
    {
        $reservation = $this->reservationService->confirm($id);
        return $this->successResponse(new ReservationResource($reservation), 'Reservasi berhasil dikonfirmasi.');
    }

    public function complete($id)
    {
        $reservation = $this->reservationService->complete($id);
        return $this->successResponse(new ReservationResource($reservation), 'Reservasi telah selesai.');
    }

    public function cancel($id)
    {
        $reservation = $this->reservationService->cancel($id);
        return $this->successResponse(new ReservationResource($reservation), 'Reservasi berhasil dibatalkan.');
    }
}