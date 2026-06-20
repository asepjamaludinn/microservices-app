<?php

namespace App\Repositories;

use App\Models\Reservation;

class ReservationRepository
{
    public function getAllPaginated($perPage = 15, $search = null)
    {
        $query = Reservation::with('table')->orderBy('reservation_time', 'asc');

        if ($search) {
            $query->where('customer_name', 'like', '%' . $search . '%')
                  ->orWhere('contact_number', 'like', '%' . $search . '%')
                  ->orWhereHas('table', function ($q) use ($search) {
                      $q->where('table_number', 'like', '%' . $search . '%');
                  });
        }

        return $query->paginate($perPage);
    }

    public function findById($id) { return Reservation::with('table')->findOrFail($id); }
    public function create(array $data) { return Reservation::create($data); }
    public function update(Reservation $reservation, array $data) { 
        $reservation->update($data); return $reservation; 
    }
}