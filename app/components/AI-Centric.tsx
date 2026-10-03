"use client";

import Image from "next/image";

const LeftCard = ({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) => (
  <div className="rounded-2xl bg-gradient-to-br from-[#0B0F1A] to-[#020617] p-6 shadow-[0_0_40px_rgba(0,255,220,0.08)]">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    {subtitle && (
      <p className="mt-2 text-sm text-cyan-300">{subtitle}</p>
    )}
    {badge && (
      <span className="mt-4 inline-block rounded-full border border-cyan-400 px-4 py-1 text-xs text-cyan-300">
        {badge}
      </span>
    )}
  </div>
);

const RightCard = ({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) => (
  <div className="rounded-2xl bg-gradient-to-br from-[#0B0F1A] to-[#020617] p-6 shadow-[0_0_40px_rgba(0,255,220,0.08)]">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-cyan-300">{desc}</p>
  </div>
);

const BeeHeroSection = () => {
  return (
    <section className="w-full bg-black py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          <LeftCard
            title="EVO AI"
            subtitle="Core Approach"
          />

          <LeftCard
            title="Project Ideation & Planning"
            badge="14 days trial"
          />

          <LeftCard
            title="Smart Contract Accuracy"
            subtitle="AI validated execution"
          />
        </div>

        {/* CENTER IMAGE */}
        <div className="relative flex justify-center">
          <div className="relative w-[420px] h-[520px]">
            {/* <Image
              src="/Group 1707480382.png"
              alt="Beelockchain Core"
              fill
              className="object-contain"
              priority
            /> */}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          <RightCard
            title="Design & UI/UX"
            desc="Human-centered, futuristic interfaces"
          />

          <RightCard
            title="Execution Consistency"
            desc="Faster time-to-market with AI pipelines"
          />

          <RightCard
            title="Maintenance & Upgrades"
            desc="Continuous optimization & support"
          />
        </div>

      </div>
    </section>
  );
};

export default BeeHeroSection;
