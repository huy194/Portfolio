import { useEffect, useRef } from "react";

/**
 * Tracks scroll position against a list of section element IDs (in page order)
 * and exposes a continuous "scene index" via a ref — e.g. 0 = top of first
 * section, 1.4 = 40% of the way from section[1] into section[2].
 *
 * Returns a ref (not state) deliberately: this updates on every scroll frame,
 * and we don't want that to trigger React re-renders. Read progressRef.current
 * inside an R3F useFrame loop instead.
 *
 * @param {string[]} sectionIds - DOM ids in page order, e.g. ["hero","about","projects","contact"]
 */
export function useScrollProgress(sectionIds) {
  const progressRef = useRef(0);
  const offsetsRef = useRef([]);

  useEffect(() => {
    function measure() {
      offsetsRef.current = sectionIds.map((id) => {
        const el = document.getElementById(id);
        return el ? el.offsetTop : 0;
      });
    }

    function onScroll() {
      const offsets = offsetsRef.current;
      const scrollY = window.scrollY;
      let idx = 0;

      for (let i = 0; i < offsets.length - 1; i++) {
        if (scrollY >= offsets[i]) {
          const segStart = offsets[i];
          const segEnd = offsets[i + 1];
          const span = segEnd - segStart;
          const frac = span > 0 ? (scrollY - segStart) / span : 0;
          idx = i + Math.min(Math.max(frac, 0), 1);
        }
      }
      if (scrollY >= offsets[offsets.length - 1]) {
        idx = offsets.length - 1;
      }
      progressRef.current = idx;
    }

    measure();
    onScroll();

    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionIds]);

  return progressRef;
}
