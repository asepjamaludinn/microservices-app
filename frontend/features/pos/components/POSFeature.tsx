"use client";

import toast from "react-hot-toast";
import { usePOS } from "@/hooks/use-pos";
import type { Menu } from "@/types/menu";

import POSMenuCatalog from "./POSMenuCatalog";
import POSCheckoutPanel from "./POSCheckoutPanel";

export default function POSFeature() {
  const {
    menus,
    tables,
    loading,
    searchQuery,
    setSearchQuery,
    isSubmitting,
    form,
    onSubmit,
    cartStore,
  } = usePOS();

  const handleAddToCart = (menu: Menu) => {
    cartStore.addToCart(menu);
    toast.success(`${menu.name} ditambahkan ke pesanan!`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] relative">
      <POSMenuCatalog
        menus={menus}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddToCart={handleAddToCart}
      />

      <POSCheckoutPanel
        form={form}
        onSubmit={onSubmit}
        cartStore={cartStore}
        tables={tables}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
