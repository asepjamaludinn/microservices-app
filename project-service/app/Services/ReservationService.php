<?php

namespace App\Services;

use App\Repositories\ReservationRepository;
use App\Repositories\TableRepository;
use Illuminate\Support\Facades\DB;

class ReservationService
{
    protected $reservationRepo;
    protected $tableRepo;

    public function __construct(ReservationRepository $reservationRepo, TableRepository $tableRepo)
    {
        $this->reservationRepo = $reservationRepo;
        $this->tableRepo = $tableRepo;
    }

    public function getAllReservations()
    {
        return $this->reservationRepo->getAllPaginated();
    }

    public function createReservation(array $data)
    {
        return DB::transaction(function () use ($data) {
            $table = $this->tableRepo->findLockedById($data['table_id']);
            
            if ($table->capacity < $data['guest_count']) {
                throw new \Exception("Kapasitas meja tidak mencukupi untuk {$data['guest_count']} orang.");
            }

            $reservation = $this->reservationRepo->create($data);
            return $reservation->load('table');
        });
    }

   public function getReservationById($id)
    {
        return $this->reservationRepo->findById($id);
    }

    public function confirm($id)
    {
        return DB::transaction(function () use ($id) {
            $reservation = $this->reservationRepo->findById($id);
            
            if ($reservation->status !== 'pending') {
                throw new \Exception("Hanya reservasi berstatus 'pending' yang dapat dikonfirmasi.");
            }

            $table = $this->tableRepo->findLockedById($reservation->table_id);
            $this->tableRepo->update($table, ['status' => 'reserved']);

            return $this->reservationRepo->update($reservation, ['status' => 'confirmed']);
        });
    }

    public function complete($id)
    {
        return DB::transaction(function () use ($id) {
            $reservation = $this->reservationRepo->findById($id);
            
            if ($reservation->status !== 'confirmed') {
                throw new \Exception("Hanya reservasi berstatus 'confirmed' yang dapat diselesaikan.");
            }

            $table = $this->tableRepo->findLockedById($reservation->table_id);
            $this->tableRepo->update($table, ['status' => 'available']);

            return $this->reservationRepo->update($reservation, ['status' => 'completed']);
        });
    }

    public function cancel($id)
    {
        return DB::transaction(function () use ($id) {
            $reservation = $this->reservationRepo->findById($id);
            
            if (in_array($reservation->status, ['completed', 'cancelled'])) {
                throw new \Exception("Reservasi yang sudah '{$reservation->status}' tidak dapat dibatalkan.");
            }

            if ($reservation->status === 'confirmed') {
                $table = $this->tableRepo->findLockedById($reservation->table_id);
                $this->tableRepo->update($table, ['status' => 'available']);
            }

            return $this->reservationRepo->update($reservation, ['status' => 'cancelled']);
        });
    }
}