<?php

namespace App\Http\Requests;

use App\Http\Requests\BaseApiRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends BaseApiRequest 
{
    public function authorize(): bool
    {
        return true; 
    }

   public function rules(): array
    {
        return [
            'old_password' => 'required|string',
            'new_password' => ['required', 'string', Password::min(8)->mixedCase()->numbers()->symbols()],
        ];
    }
}