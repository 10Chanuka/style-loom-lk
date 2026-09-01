"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Scissors, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  tagline: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    image: "/images/slider/hero-1.jpg",
    title: "Style That Speaks, Quality That Lasts.",
    subtitle: "Crafted for comfort. Designed to go anywhere. The perfect balance of fit, fabric, and finesse.",
    tagline: "ELEGANCE FASHION",
    primaryButtonText: "Explore Collection",
    primaryButtonLink: "/products",
    secondaryButtonText: "Custom Design",
    secondaryButtonLink: "/customize",
  },
  {
    id: 2,
    image: "/images/slider/hero-2.jpg",
    title: "Our Customize T-Shirt Collection",
    subtitle: "Wear your story. Create your style. Premium quality t-shirts made for connection.",
    tagline: "UNISEX T-SHIRTS",
    primaryButtonText: "Shop T-Shirts",
    primaryButtonLink: "/category/t-shirts",
    secondaryButtonText: "Start Customizing",
    secondaryButtonLink: "/customize",
  },
  {
    id: 3,
    image: "/images/slider/hero-3.jpg",
    title: "Introducing Our Debut Collection",
    subtitle: "Festive Kurthas & Modern Elegance. Traditional Sri Lankan craftsmanship meets modern fit.",
    tagline: "NEW ARRIVALS",
    primaryButtonText: "Shop Kurthas",
    primaryButtonLink: "/category/kurtas",
    secondaryButtonText: "View All Products",
    secondaryButtonLink: "/products",
  },
  {
    id: 4,
    image: "/images/slider/hero-4.jpg",
    title: "Customize Your T-Shirt",
    subtitle: "Premium Quality & All Day Comfort. Print your custom logo, text, or graphic design.",
    tagline: "CUSTOM PRINTING",
    primaryButtonText: "Request Custom Design",
    primaryButtonLink: "/customize",
    secondaryButtonText: "Browse Shop",
    secondaryButtonLink: "/products",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 py-8 sm:py-12 shadow-2xl group border-b border-slate-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* 3D Center Focus Stage Container */}
      <div className="relative max-w-7xl mx-auto px-4 h-[380px] sm:h-[480px] md:h-[540px] flex items-center justify-center">
        {SLIDES.map((slide, index) => {
          // Calculate relative index position (-1, 0, 1, etc.)
          let offset = index - currentIndex;
          if (offset < -1) offset += SLIDES.length;
          if (offset > 1) offset -= SLIDES.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;

          // Determine styling based on position
          let positionClasses = "opacity-0 scale-50 z-0 pointer-events-none";
          if (isCenter) {
            positionClasses = "opacity-100 scale-100 z-30 translate-x-0 shadow-2xl ring-1 ring-white/20";
          } else if (isLeft) {
            positionClasses = "opacity-40 scale-80 sm:scale-85 -translate-x-[65%] sm:-translate-x-[55%] z-10 cursor-pointer hover:opacity-70 blur-[1px] hover:blur-none";
          } else if (isRight) {
            positionClasses = "opacity-40 scale-80 sm:scale-85 translate-x-[65%] sm:translate-x-[55%] z-10 cursor-pointer hover:opacity-70 blur-[1px] hover:blur-none";
          }

          return (
            <div
              key={slide.id}
              onClick={() => {
                if (isLeft) prevSlide();
                if (isRight) nextSlide();
              }}
              className={`absolute top-0 w-[88%] sm:w-[75%] md:w-[68%] lg:w-[62%] h-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-700 ease-out bg-slate-900 flex flex-col justify-end ${positionClasses}`}
            >
              {/* Full Uncropped Image with Blurred Backdrop */}
              <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
                {/* Blurred Background Fill */}
                <img
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl scale-110"
                />

                {/* Main Full Uncropped Banner Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative max-w-full max-h-full object-contain mx-auto transition-transform duration-500 hover:scale-[1.02]"
                />

                {/* Subtle Gradient Shadow Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>

              {/* Slide Content Overlay (Visible on Center Slide) */}
              {isCenter && (
                <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-6 p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3 text-center sm:text-left z-20 shadow-2xl">
                  
                  {/* Tagline Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    <Sparkles className="h-3 w-3 text-slate-950" />
                    <span>{slide.tagline}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-2xl leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Action Buttons with High-Contrast Colors */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 pt-1">
                    <Button asChild size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-xl text-xs px-4 py-2 rounded-xl">
                      <Link href={slide.primaryButtonLink}>
                        {slide.primaryButtonText} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>

                    {slide.secondaryButtonText && (
                      <Button asChild variant="outline" size="sm" className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold shadow-xl border-white text-xs px-4 py-2 rounded-xl">
                        <Link href={slide.secondaryButtonLink || "/products"}>
                          <Scissors className="mr-1.5 h-3.5 w-3.5 text-rose-600" />
                          {slide.secondaryButtonText}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-brand text-white p-2.5 sm:p-3.5 rounded-full backdrop-blur-md transition-all shadow-2xl border border-white/20 z-40"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-brand text-white p-2.5 sm:p-3.5 rounded-full backdrop-blur-md transition-all shadow-2xl border border-white/20 z-40"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-4 relative z-40">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-8 bg-brand ring-2 ring-brand/40"
                : "w-2 bg-slate-700 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
