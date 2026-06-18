import Navbar from "@/components/layouts/users/Navbar";
import Hero from "@/components/home/Hero";
import StripeBanner from "@/components/home/StripeBanner";
import MenuList from "@/components/home/MenuList";
import Features from "@/components/home/Features";
import Footer from "@/components/layouts/users/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans selection:bg-[#c94430] selection:text-white relative">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Hero />
        <StripeBanner />
        <MenuList />
        <Features />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
