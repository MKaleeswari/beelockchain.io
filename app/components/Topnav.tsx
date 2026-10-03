"use client";

import { useState } from "react";
import Image from "next/image";
import GradientGlowButton from "./GradientGlowButton";

const Topnav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full relative z-50">
      {/* NAV BAR */}
      <div className="flex justify-center">
        <div className="
            w-full md:w-[90%] lg:w-[80%] xl:w-[72%] 2xl:w-[65%]
            h-14 sm:h-16 lg:h-[72px]
            flex justify-between items-center
            bg-black rounded-none lg:rounded-full md:rounded-full px-3 sm:px-4 md:px-6 lg:px-8 mt-0 lg:mt-5"
        >
          {/* LOGO */}
          <img src="/assets/images/Group 10.svg" alt="Logo" className="w-20 sm:w-24 md:w-28 lg:w-32" />

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
            {/* CTA BUTTON */}
            <GradientGlowButton className="scale-90 sm:scale-95 md:scale-100">Get Started</GradientGlowButton>

            {/* MENU ICON (MOBILE ONLY) */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex-shrink-0" aria-label="Toggle menu">
              <Image src="/assets/images/menu-icon.png" alt="Menu" width={22} height={22} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU ONLY */}
      <div
        className={`md:hidden absolute left-0 right-0 top-14 sm:top-16 bg-black transition-all duration-300 ease-out
          ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <nav className="flex flex-col divide-y divide-white/10">
          <button
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-white text-left hover:bg-white/5 transition"
          >
            Services
          </button>

          <button
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-white text-left hover:bg-white/5 transition"
          >
            Contact Us
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Topnav;
