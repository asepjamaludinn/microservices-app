<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

class CategoryController extends Controller
{
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->all());
        return $this->successResponse($category, 'Kategori berhasil ditambahkan.', 201);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());
        return $this->successResponse($category, 'Kategori berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category->menus()->exists()) {
            return $this->errorResponse('Kategori tidak dapat dihapus karena masih digunakan oleh beberapa menu.', 400);
        }

        $category->delete(); 
        return $this->successResponse(null, 'Kategori berhasil dihapus.');
    }
}