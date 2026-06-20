"use client";

import { useState } from "react";
import { useUserDashboard } from "@/hooks/use-user-dashboard";
import { useCartStore } from "@/store/useCartStore";
import { useReviewModal } from "../hooks/use-review-modal";

import UserDashboardNavbar from "./UserDashboardNavbar";
import UserHomeSection from "./UserHomeSection";
import UserOrdersSection from "./UserOrdersSection";
import ReviewModal from "./ReviewModal";
import UserDashboardLoading from "./UserDashboardLoading";

import Footer from "@/components/layouts/users/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function UserDashboardFeature() {
  const { user, orders, loading, handleLogout } = useUserDashboard();
  const { cart, setIsCartOpen } = useCartStore();
  const [activeSection, setActiveSection] = useState<"home" | "orders">("home");

  const {
    reviewModal,
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    openReviewModal,
    closeReviewModal,
    submitReview,
  } = useReviewModal(user?.name);

  if (loading) return <UserDashboardLoading />;

  return (
    <div className="min-h-screen bg-[#fff4dc] text-slate-950 font-sans selection:bg-[#cf432f] selection:text-white flex flex-col">
      <UserDashboardNavbar
        user={user}
        cartLength={cart.length}
        setIsCartOpen={setIsCartOpen}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col">
        {activeSection === "home" ? (
          <UserHomeSection />
        ) : (
          <UserOrdersSection
            orders={orders}
            setActiveSection={setActiveSection}
            openReviewModal={openReviewModal}
          />
        )}
      </main>

      <Footer />
      <CartDrawer />

      <ReviewModal
        isOpen={reviewModal.isOpen}
        orderId={reviewModal.orderId}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        isSubmitting={isSubmitting}
        submitReview={submitReview}
        closeReviewModal={closeReviewModal}
      />
    </div>
  );
}
