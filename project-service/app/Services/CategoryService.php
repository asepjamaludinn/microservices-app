<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    public function createCategory(array $data)
    {
        return Category::create($data);
    }

    public function updateCategory($id, array $data)
    {
        $category = Category::findOrFail($id);
        $category->update($data);
        return $category;
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        
        if ($category->menus()->exists()) {
            throw new \Exception('Kategori tidak dapat dihapus karena masih digunakan oleh beberapa menu.', 400);
        }

        $category->delete();
    }
}