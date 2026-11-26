import { Suspense, lazy, useEffect, useMemo, useState } from "react";

// Lazy-loaded so Three.js (~150KB+ gzipped) doesn't block first paint.
// Vite will split this into its own chunk automatically.
const Scene = lazy(() => import("./HeroScene"));

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

function useIsSmallViewport() {
  const [isSmall, setIsSmall] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isSmall;
}

// Static fallback: same visual slot, no WebGL, no motion.
// Used for reduced-motion users and as the Suspense fallback.
function StaticFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(139,92,246,0.25), transparent 60%)",
      }}
    />
  );
}

export function Hero3D() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSmallViewport = useIsSmallViewport();

  // Fewer particles / lower DPR ceiling on small screens — passed down to the scene.
  const quality = useMemo(
    () => ({
      particleCount: isSmallViewport ? 60 : 180,
      maxDpr: isSmallViewport ? 1.5 : 2,
    }),
    [isSmallViewport]
  );

  if (prefersReducedMotion) return <StaticFallback />;

  return (
    <Suspense fallback={<StaticFallback />}>
      <Scene particleCount={quality.particleCount} maxDpr={quality.maxDpr} />
    </Suspense>
  );
}
