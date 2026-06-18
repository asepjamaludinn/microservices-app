<?php

namespace App\Http\Requests;

class StoreTableRequest extends BaseApiRequest
{
    public function authorize(): bool 
    { 
        return true; 
    }

    public function rules(): array 
    {
        return [
            'table_number' => 'required|string|unique:tables,table_number',
            'name' => 'nullable|string',
            'area' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:available,in_use,reserved,maintenance',
        ];
    }
}