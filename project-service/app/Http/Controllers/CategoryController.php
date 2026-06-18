<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Services\CategoryService;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->createCategory($request->validated());
        return $this->successResponse(new CategoryResource($category), 'Kategori berhasil ditambahkan.', 201);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = $this->categoryService->updateCategory($id, $request->validated());
        return $this->successResponse(new CategoryResource($category), 'Kategori berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->categoryService->deleteCategory($id);
        return $this->successResponse(null, 'Kategori berhasil dihapus.');
    }
}