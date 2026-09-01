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
      className="relative w-full overflow-hidden bg-slate-950 shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Carousel Container */}
      <div
        className="flex transition-transform duration-700 ease-out h-[360px] sm:h-[480px] md:h-[540px] lg:h-[600px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="relative w-full h-full shrink-0 overflow-hidden">
            {/* Background Banner Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Subtle Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl space-y-3 sm:space-y-4">
                  
                  {/* Tagline Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-brand/90 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    <span>{slide.tagline}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
                    {slide.subtitle}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">
                    <Button asChild size="sm" className="sm:size-lg bg-brand hover:bg-brand-700 text-white font-extrabold shadow-xl text-xs sm:text-sm">
                      <Link href={slide.primaryButtonLink}>
                        {slide.primaryButtonText} <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>

                    {slide.secondaryButtonText && (
                      <Button asChild variant="outline" size="sm" className="sm:size-lg border-white/80 text-white hover:bg-white/20 backdrop-blur-sm font-bold text-xs sm:text-sm">
                        <Link href={slide.secondaryButtonLink || "/products"}>
                          <Scissors className="mr-1.5 h-4 w-4 text-rose-300" />
                          {slide.secondaryButtonText}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-slate-950/60 hover:bg-brand text-white p-2 sm:p-3 rounded-full backdrop-blur-md opacity-80 hover:opacity-100 transition-all shadow-lg border border-white/10 z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-slate-950/60 hover:bg-brand text-white p-2 sm:p-3 rounded-full backdrop-blur-md opacity-80 hover:opacity-100 transition-all shadow-lg border border-white/10 z-20"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-8 bg-brand ring-2 ring-brand/40"
                : "w-2 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
