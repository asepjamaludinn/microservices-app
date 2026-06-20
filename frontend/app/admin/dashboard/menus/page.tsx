import { Suspense } from "react";
import MenusFeature from "@/features/menus/components/MenusFeature";

export const metadata = {
  title: "Menus | Admin Dashboard",
};

export default function MenusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenusFeature />
    </Suspense>
  );
}
