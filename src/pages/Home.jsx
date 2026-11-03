import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CraftStory from "@/components/home/CraftStory";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { data: products = [] } = useProducts();
  const featured = products.filter((p) => p.featured);
  const selection = (featured.length ? featured : products).slice(0, 6);

  return (
    <>
      <Hero />
      <Marquee />
      <CategoryGrid />
      {selection.length > 0 && <FeaturedProducts products={selection} />}
      <CraftStory />
      <Testimonials />
      <Newsletter />
    </>
  );
}