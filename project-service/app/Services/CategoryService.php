<?php

namespace App\Services;

use App\Repositories\CategoryRepository;

class CategoryService
{
    protected $categoryRepo;

    public function __construct(CategoryRepository $categoryRepo)
    {
        $this->categoryRepo = $categoryRepo;
    }

    public function createCategory(array $data)
    {
        return $this->categoryRepo->create($data);
    }

    public function updateCategory($id, array $data)
    {
        $category = $this->categoryRepo->findById($id);
        return $this->categoryRepo->update($category, $data);
    }

    public function deleteCategory($id)
    {
        $category = $this->categoryRepo->findById($id);
        
        if ($category->menus()->exists()) {
            throw new \Exception('Kategori tidak dapat dihapus karena masih digunakan oleh beberapa menu.', 400);
        }

        $this->categoryRepo->delete($category);
    }
}