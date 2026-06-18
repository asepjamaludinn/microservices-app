<?php

namespace App\Http\Requests;

class UpdateTableStatusRequest extends BaseApiRequest
{
    public function authorize(): bool 
    { 
        return true; 
    }

    public function rules(): array 
    {
        return [
            'status' => 'required|string|in:available,in_use,reserved,maintenance',
        ];
    }
}