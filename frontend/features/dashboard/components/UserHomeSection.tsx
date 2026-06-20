import Hero from "@/components/home/Hero";
import StripeBanner from "@/components/home/StripeBanner";
import MenuList from "@/components/home/MenuList";
import Features from "@/components/home/Features";

export default function UserHomeSection() {
  return (
    <div className="animate-in fade-in duration-500">
      <Hero />
      <StripeBanner />
      <MenuList />
      <Features />
    </div>
  );
}
