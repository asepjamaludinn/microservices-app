"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";

export const CategoryTable = ({ categories, onEdit, onDelete }: any) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-slate-400 font-semibold uppercase bg-slate-50 border-b border-slate-100">
        <tr>
          <th className="px-6 py-4">Nama Kategori</th>
          <th className="px-6 py-4">Slug</th>
          <th className="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
        {categories.map((category: Category) => (
          <tr
            key={category.id}
            className="hover:bg-slate-50/60 transition-colors"
          >
            <td className="px-6 py-4 font-bold text-slate-900">
              {category.name}
            </td>
            <td className="px-6 py-4">
              <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-xs font-mono">
                {category.slug}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(category)}
                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
