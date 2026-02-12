import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { PageLayout } from "@/components/layout/page-layout";
import { LandingPage } from "@/pages/landing";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
import { ProfilePage } from "@/pages/profile";
import { AboutPage } from "@/pages/about";
import { ContactPage } from "@/pages/contact";

export function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <Routes>
          {/* Landing page has its own layout (fullscreen scroll canvas) */}
          <Route path="/" element={<LandingPage />} />

          {/* All other pages use the standard PageLayout */}
          <Route path="/login" element={<PageLayout title="Sign In"><LoginPage /></PageLayout>} />
          <Route path="/signup" element={<PageLayout title="Create Account"><SignupPage /></PageLayout>} />
          <Route path="/profile" element={<PageLayout title="Operative Profile"><ProfilePage /></PageLayout>} />
          <Route path="/about" element={<PageLayout><AboutPage /></PageLayout>} />
          <Route path="/contact" element={<PageLayout><ContactPage /></PageLayout>} />
        </Routes>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}
