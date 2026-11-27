import { useEffect, useState } from "react";

const WIDTH_QUERY = "(min-width: 768px)";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the persistent 3D scene should be mounted at all. False below the
 * 768px breakpoint and when the user prefers reduced motion.
 *
 * This is checked live via matchMedia listeners, not just once at mount —
 * resizing a desktop window below 768px (or toggling reduced-motion in OS
 * settings) actually flips this and unmounts the scene, rather than only
 * taking effect on the next full re-render.
 *
 * Gate the lazy import with this in the parent (e.g. App.jsx) so the
 * Three.js chunk is never fetched at all when it wouldn't be shown —
 * React.lazy's dynamic import() only fires once the component is actually
 * rendered, so mounting <Scene3D /> conditionally on this value (rather than
 * always mounting it and having Scene3D itself decide to render null) is
 * what actually saves the download on mobile.
 */
export function useShouldRenderScene3D() {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === "undefined") return false;
    const isWide = window.matchMedia(WIDTH_QUERY).matches;
    const reducedMotion = window.matchMedia(MOTION_QUERY).matches;
    return isWide && !reducedMotion;
  });

  useEffect(() => {
    const widthMq = window.matchMedia(WIDTH_QUERY);
    const motionMq = window.matchMedia(MOTION_QUERY);

    const update = () => {
      setShouldRender(widthMq.matches && !motionMq.matches);
    };

    widthMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      widthMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
    };
  }, []);

  return shouldRender;
}
