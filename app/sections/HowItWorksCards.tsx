import Image from "next/image";

const HowItWorksSection = () => {
  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden bg-[#00020f]">

      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{
          backgroundImage: "url('/assets/images/howitworks-bg-cards.png')",
        }}
      />

      {/* Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <h2 className="
          text-center text-transparent bg-clip-text
          bg-[linear-gradient(90deg,#00A993_0%,#57ADCD_54%,#FFFFFF_60%)]
          text-3xl sm:text-4xl lg:text-5xl md:text-6xl
          font-semibold mb-10 sm:mb-14 lg:mb-16
        ">
          How It Works
        </h2>

        {/* Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Card 1 */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-b from-emerald-950 to-teal-800 border border-slate-600 shadow-xl overflow-hidden">
            <div className="p-5 sm:p-6 lg:p-8">
              <h3 className="text-gray-200 text-lg sm:text-xl lg:text-2xl font-medium mb-3 sm:mb-4">
                User enters an idea :
              </h3>
              <p className="text-stone-300 text-sm sm:text-base lg:text-lg">
                “Example: I want a staking platform where users earn rewards based on holding time.”
              </p>
            </div>

            <Image
              src="/assets/images/howworks3.png"
              alt="User idea input"
              width={900}
              height={400}
              className="w-full object-cover"
            />
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-gradient-to-b from-teal-500 to-black border border-slate-600 shadow-xl overflow-hidden">
            <Image
              src="/assets/images/photo-7-2.jpg.svg"
              alt="AI analysis"
              width={400}
              height={300}
              className="w-full object-cover"
            />
            <div className="p-5 sm:p-6">
              <h3 className="text-gray-200 text-lg sm:text-xl lg:text-2xl font-medium mb-2 sm:mb-3">
                EVO AI analyzes the concept
              </h3>
              <p className="text-stone-300 text-sm sm:text-base lg:text-lg">
                Our AI breaks the idea into technology requirements, features,
                modules, user flows, and blockchain logic.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-gradient-to-b from-teal-500 to-black border border-slate-600 shadow-xl overflow-hidden">
            <Image
              src="/assets/images/photo-5-1.jpg.svg"
              alt="Blueprint generation"
              width={400}
              height={300}
              className="w-full object-cover"
            />
            <div className="p-5 sm:p-6">
              <h3 className="text-gray-200 text-lg sm:text-xl lg:text-2xl font-medium mb-2 sm:mb-3">
                AI auto-generates the full blueprint
              </h3>
              <p className="text-stone-300 text-sm sm:text-base lg:text-lg">
                Within seconds, you get a structured project document.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl bg-gradient-to-b from-teal-500 to-black border border-slate-600 shadow-xl overflow-hidden">
            <Image
              src="/assets/images/howworks5.png"
              alt="Structured document"
              width={400}
              height={300}
              className="w-full object-cover"
            />
            <div className="p-5 sm:p-6">
              <h3 className="text-gray-200 text-lg sm:text-xl lg:text-2xl font-medium mb-2 sm:mb-3">
                Structured project document
              </h3>
              <p className="text-stone-300 text-sm sm:text-base lg:text-lg">
                Within seconds, you get a clear, ready-to-build project blueprint.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl bg-gradient-to-b from-teal-500 to-black border border-slate-600 shadow-xl overflow-hidden">
            <Image
              src="/assets/images/photo-9-1.jpg.svg"
              alt="Download PDF"
              width={400}
              height={300}
              className="w-full object-cover"
            />
            <div className="p-5 sm:p-6">
              <h3 className="text-gray-200 text-lg sm:text-xl lg:text-2xl font-medium mb-2 sm:mb-3">
                Download as PDF
              </h3>
              <p className="text-stone-300 text-sm sm:text-base lg:text-lg">
                Share it with your team, investors, or kickstart development
                with Beelockchain.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
