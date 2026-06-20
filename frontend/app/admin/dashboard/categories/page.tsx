import { Suspense } from "react";
import CategoriesFeature from "@/features/categories/components/CategoriesFeature";

export const metadata = { title: "Categories | Admin Dashboard" };

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesFeature />
    </Suspense>
  );
}
