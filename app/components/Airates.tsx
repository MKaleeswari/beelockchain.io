const Airates = () => {
    return (
        <section className="w-full bg-black flex justify-center">
            {/* OUTER CONTAINER */}
            <div className="relative w-[92%] max-w-[1000px] rounded-[32px] overflow-hidden
        bg-gradient-to-b from-[#2b2b2b] via-[#141414] to-[#050505]
        border border-white/10">

                {/* TOP FADE */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />

                {/* CONTENT */}
                <div className="relative ">

                    {/* BADGE */}
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full
              bg-white/5 border border-white/10 text-sm text-white">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            Simple Process
                        </div>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-center text-[42px] leading-[1.25] font-semibold text-white mb-12">
                        3x your reply rates with AI
                    </h2>
                    <p className="text-center">Generate highly-personalized campaigns with AI.<br/>
 Expert quality, no expertise required!</p>

                    {/* VIDEO / VISUAL BLOCK */}
                    <div className="relative w-full rounded-2xl overflow-hidden mb-12">
                        <img
                            src="/Frame 1561446100.svg"   // replace with video/image
                            alt="Process"
                            className="w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>
                 

                </div>
            </div>
        </section>
    );
}

export default Airates;