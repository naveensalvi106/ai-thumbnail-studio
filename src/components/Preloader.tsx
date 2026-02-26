import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({ onComplete });
        exitTl
          .to(barRef.current, { opacity: 0, y: 20, duration: 0.4, ease: "power2.in" })
          .to(percentRef.current, { opacity: 0, duration: 0.3 }, "<")
          .to(logoRef.current, { scale: 1.3, opacity: 0, duration: 0.6, ease: "power2.in" }, "-=0.2")
          .to(containerRef.current, { opacity: 0, duration: 0.4 }, "-=0.2");
      },
    });

    // Logo entrance
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Progress bar fill
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function () {
          const v = Math.round(this.targets()[0].val);
          setProgress(v);
          if (fillRef.current) fillRef.current.style.width = `${v}%`;
        },
      },
      "-=0.3"
    );

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      {/* Ambient orbs */}
      <div className="glow-orb w-72 h-72 bg-primary/30 top-1/4 left-1/3" style={{ position: "absolute" }} />
      <div className="glow-orb w-56 h-56 bg-accent/30 bottom-1/4 right-1/3" style={{ position: "absolute" }} />

      <div ref={logoRef} className="text-center mb-12 opacity-0">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter gradient-text logo-glow-anim">
          AntiGeneric AI
        </h1>
        <p className="text-muted-foreground text-sm mt-3 tracking-wide">PREMIUM THUMBNAIL STUDIO</p>
      </div>

      <div className="w-64 sm:w-80 space-y-3">
        <div ref={barRef} className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            ref={fillRef}
            className="h-full rounded-full"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, hsl(250 85% 65%), hsl(200 90% 55%), hsl(280 75% 60%))",
            }}
          />
        </div>
        <span ref={percentRef} className="block text-center text-xs text-muted-foreground font-medium tracking-widest">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default Preloader;
