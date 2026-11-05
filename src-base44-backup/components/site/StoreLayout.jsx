import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export default function StoreLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}