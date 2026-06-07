"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleBeginJourney = () => {
    if (user) {
      router.push('/editor');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
      <section
        className="pb-40 w-full flex flex-col items-center justify-center"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-display font-normal text-black leading-[0.95] tracking-[-2.46px] animate-fade-rise"
        >
          Code in the language of the mountains. <span className="italic text-[#6F6F6F]">Think in Hindi,</span> <span className="italic text-[#6F6F6F]">Build in code.</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] font-body animate-fade-rise-delay">
          A web-based interpreter for HimalayanCode — a beginner-friendly programming language using Hindi keywords (like agar, bol, phir) to help Hindi-speaking engineering students learn coding concepts without the barrier of English syntax. Built with Python & Flask.
        </p>

        {/* Hero CTA Button */}
        <button
          onClick={handleBeginJourney}
          className="rounded-full px-14 py-5 text-base bg-black text-white hover:scale-[1.03] transition-transform duration-300 ease-out mt-12 font-medium animate-fade-rise-delay-2"
        >
          Begin Journey
        </button>
      </section>
    </div>
  );
}
