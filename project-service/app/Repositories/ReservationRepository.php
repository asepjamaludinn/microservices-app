<?php

namespace App\Repositories;

use App\Models\Reservation;

class ReservationRepository
{
    public function getAllPaginated($perPage = 15)
    {
        return Reservation::with('table')->orderBy('reservation_time', 'asc')->paginate($perPage);
    }

    public function findById($id)
    {
        return Reservation::with('table')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Reservation::create($data);
    }

    public function update(Reservation $reservation, array $data)
    {
        $reservation->update($data);
        return $reservation;
    }
}