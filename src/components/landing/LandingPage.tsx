"use client";

import React, { useEffect } from "react";
import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { LandingFooter } from "./LandingFooter";

export function LandingPage() {
  useEffect(() => {
    // Scroll reveal observer for elements with .reveal class
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    reveals.forEach((el) => revealObserver.observe(el));

    // Magnetic CTA hover micro-interaction
    const magneticButtons = document.querySelectorAll<HTMLElement>(".btn-magnetic");
    const cleanupFns: Array<() => void> = [];

    magneticButtons.forEach((btn) => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      };

      const handleMouseLeave = () => {
        btn.style.transform = "";
      };

      btn.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);

      cleanupFns.push(() => {
        btn.removeEventListener("mousemove", handleMouseMove);
        btn.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    return () => {
      revealObserver.disconnect();
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="font-sans antialiased bg-[#FAF8FF] text-slate-900 selection:bg-[#701127] selection:text-white relative overflow-x-hidden min-h-screen">
      {/* Fixed Grid Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-grid-cross z-0 opacity-80" />

      {/* Decorative Corner Crosshairs positioned across screen layout */}
      <div className="crosshair-corner top-24 left-12 z-0 hidden lg:block" />
      <div className="crosshair-corner top-24 right-12 z-0 hidden lg:block" />
      <div className="crosshair-corner top-96 left-20 z-0 hidden lg:block" />
      <div className="crosshair-corner top-96 right-20 z-0 hidden lg:block" />
      <div className="crosshair-corner top-[1200px] left-8 z-0 hidden lg:block" />
      <div className="crosshair-corner top-[1200px] right-8 z-0 hidden lg:block" />

      {/* Landing Header */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Problems Section */}
      <ProblemSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How it works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Final CTA Section */}
      <FinalCtaSection />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
