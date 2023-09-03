"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5 mt-24">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The Ultimate AI Platform for...</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#6dffee] via-[#0eedf4] to-[#0eedf4] text-[#5CE2E7] pb-2">
          <TypewriterComponent
            options={{
              strings: [
                "Chat.",
                "Photo Generation.",
                "Logo Generation.",
                "Music Generation.",
                "Video Generation.",
                "Blog Writing.",
                "Writing Code."
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
              delay: 75,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-200">
      The Future of Creativity is Here. Experience AI&apos;s Power.
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="new" className="md:text-lg p-4 md:p-6 rounded-full ">
            Start Creating Now
          </Button>
        </Link>
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
      Start today, no credit card needed. 
      </div>
    </div>
  );
};