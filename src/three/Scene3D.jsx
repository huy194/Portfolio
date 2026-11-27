import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useScrollProgress } from "../hooks/useScrollProgress";

// Purple-only palette: bright violet -> deep violet -> vivid purple ->
// deep-violet planet with lavender rim light and glow. No cyan anywhere.
// PRIMARY and SECONDARY_FG mirror the @theme tokens in index.css.
const PRIMARY = "#8b5cf6"; // Hero / Spark
const DEEP_VIOLET = "#6d28d9"; // About / Structure
const VIVID_PURPLE = "#a855f7"; // Projects / Modules
const PLANET_CORE = PRIMARY; // Contact / Resolution: planet body (same violet as the Hero swarm)
const SECONDARY_FG = "#c4b5fd"; // Contact / Resolution: rim light, glow, ring
const BG = "#0b0a12";

const SECTION_IDS = ["hero", "about", "projects", "contact"];
const ZONE_SPACING = 14;
const PARTICLE_COUNT = 220;

// --- Resolution state: a finished planet with a Saturn-style ring ---------
// All numbers are in world units.
const PLANET_RADIUS = 1.6;
const RING_RADIUS = PLANET_RADIUS * 2.1; // clear visible gap to the surface
const RING_RADIAL_SPREAD = 0.1; // ring is a thin band, not a hairline
const RING_PARTICLES = 200; // evenly spaced around the FULL circle
const CORE_PARTICLES = PARTICLE_COUNT - RING_PARTICLES; // sink into the planet
const RING_TILT = THREE.MathUtils.degToRad(18); // elevation as seen by the camera
const RING_ROLL = THREE.MathUtils.degToRad(-10); // slight Saturn-style lean
const RING_ORBIT_SPEED = 0.06; // radians / second — slow, scroll-independent
const PLANET_SPIN_SPEED = 0.08; // radians / second
// Horizontal half-extent the ring needs, so the camera can back off on
// narrow / tall viewports instead of clipping it.
const RESOLUTION_HALF_WIDTH = RING_RADIUS * 1.12;
const RESOLUTION_MIN_CAM_OFFSET = 7;

// One shared particle swarm passes through these four states as the person
// scrolls — not four separate objects, one entity that progressively
// organizes itself: Spark (Hero) -> Structure (About) -> Modules (Projects)
// -> Resolution (Contact). Color and camera position are driven by the same
// underlying progress value so everything stays visually synchronized.
const ZONES = [
  { x: 0, y: 0, z: 0, color: PRIMARY, camOffset: 5 },
  { x: 3, y: 0, z: -ZONE_SPACING, color: DEEP_VIOLET, camOffset: 5 },
  { x: 0, y: 0, z: -ZONE_SPACING * 2, color: VIVID_PURPLE, camOffset: 5 },
  // Contact: centered in the viewport. camOffset is a floor — see
  // zoneCamOffset(), which pulls back further when the viewport is narrow.
  { x: 0, y: 0, z: -ZONE_SPACING * 3, color: SECONDARY_FG, camOffset: RESOLUTION_MIN_CAM_OFFSET },
];

// Camera distance for a zone. The Resolution zone backs off on narrow
// viewports so the whole ring stays in frame.
function zoneCamOffset(i, fovDeg, aspect) {
  if (i !== 3) return ZONES[i].camOffset;
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(fovDeg / 2));
  const needed = RESOLUTION_HALF_WIDTH / (tanHalfFov * aspect);
  return Math.max(ZONES[i].camOffset, needed);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp01(v) {
  return Math.min(Math.max(v, 0), 1);
}

// Deterministic pseudo-random so formations are stable across reloads.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Formation builders -------------------------------------------------
// Each returns a Float32Array of PARTICLE_COUNT*3 local offsets. These are
// the four "states" the single swarm interpolates between.

function buildSparkFormation() {
  // Hero: loose, undirected cloud — the idea before it has form.
  const rand = mulberry32(1);
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 2 + rand() * 2.5;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function fibonacciSphere(count, radius) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

function buildStructureFormation() {
  // About: the idea becomes logic — nodes on a sparse, evenly spaced network.
  const pts = fibonacciSphere(PARTICLE_COUNT, 2.6);
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  pts.forEach(([x, y, z], i) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  });
  return positions;
}

function buildModulesFormation() {
  // Projects: five discrete clusters placed in the free bands of the Projects
  // layout instead of behind the card grid. Coordinates are in swarm-local
  // units at the Projects camera distance (ZONES[2].camOffset = 5, fov 45:
  // roughly +-2.07 units vertically and +-3.3 horizontally at 16:10).
  //  - two clusters in the upper band, one on each side of the heading
  //    (the center is left clear so they never sit on the heading text)
  //  - three clusters in the lower band, spread across the width below the
  //    last row of cards
  // Note the swarm is fixed to the viewport while the page scrolls, so the
  // upper clusters are clearest at the top of the section and the lower
  // ones once the last card row has scrolled into view.
  const rand = mulberry32(7);
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const CENTERS = [
    [-2.6, 1.1, 0],
    [2.6, 1.1, 0],
    [-2.4, -1.6, 0],
    [0, -1.65, 0],
    [2.4, -1.6, 0],
  ];
  const CLUSTERS = CENTERS.length;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const [cx, cy, cz] = CENTERS[i % CLUSTERS];
    const jitter = 0.3;
    positions[i * 3] = cx + (rand() - 0.5) * jitter;
    positions[i * 3 + 1] = cy + (rand() - 0.5) * jitter;
    positions[i * 3 + 2] = cz + (rand() - 0.5) * jitter;
  }
  return positions;
}

// Resolution: the first RING_PARTICLES particles form a closed ring, spaced
// at EXACT equal angles over the full 0..2*PI (angle = 2*PI * k / N — no
// random sampling, no partial sweep). The remaining CORE_PARTICLES sink into
// the planet's volume, where the opaque sphere hides them. The ring lies in
// the planet's equatorial plane, tilted RING_TILT toward the camera (so it
// reads as an ellipse of aspect sin(RING_TILT), like Saturn) and rolled
// slightly.
const RING_RADIAL_JITTER = (() => {
  // Alternating inner / outer offsets so the band has visible structure
  // (and the orbit is perceptible even though the spacing is uniform).
  const rand = mulberry32(13);
  return Array.from({ length: RING_PARTICLES }, (_, k) => ({
    dr: ((k % 2 === 0 ? -1 : 1) * 0.5 + (rand() - 0.5) * 0.5) * RING_RADIAL_SPREAD,
    dy: (rand() - 0.5) * 0.05,
  }));
})();

const CORE_OFFSETS = (() => {
  const rand = mulberry32(21);
  return Array.from({ length: CORE_PARTICLES }, () => {
    const r = PLANET_RADIUS * 0.5 * Math.cbrt(rand());
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    return [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ];
  });
})();

const RESOLUTION_FORMATION = new Float32Array(PARTICLE_COUNT * 3);

// Writes the Resolution formation for a given time. The ring is re-laid every
// frame with a time-driven angular offset so it keeps orbiting regardless of
// scroll position.
function updateResolutionFormation(time) {
  const cosT = Math.cos(RING_TILT);
  const sinT = Math.sin(RING_TILT);
  const cosR = Math.cos(RING_ROLL);
  const sinR = Math.sin(RING_ROLL);
  for (let k = 0; k < RING_PARTICLES; k++) {
    const angle = (k / RING_PARTICLES) * Math.PI * 2 + time * RING_ORBIT_SPEED;
    const radius = RING_RADIUS + RING_RADIAL_JITTER[k].dr;
    // Ring in the xz plane (normal = y)...
    const x0 = Math.cos(angle) * radius;
    const y0 = RING_RADIAL_JITTER[k].dy;
    const z0 = Math.sin(angle) * radius;
    // ...tilted about x so the camera sees it from above...
    const y1 = y0 * cosT - z0 * sinT;
    const z1 = y0 * sinT + z0 * cosT;
    // ...then rolled about z.
    const base = k * 3;
    RESOLUTION_FORMATION[base] = x0 * cosR - y1 * sinR;
    RESOLUTION_FORMATION[base + 1] = x0 * sinR + y1 * cosR;
    RESOLUTION_FORMATION[base + 2] = z1;
  }
  for (let c = 0; c < CORE_PARTICLES; c++) {
    const base = (RING_PARTICLES + c) * 3;
    RESOLUTION_FORMATION[base] = CORE_OFFSETS[c][0];
    RESOLUTION_FORMATION[base + 1] = CORE_OFFSETS[c][1];
    RESOLUTION_FORMATION[base + 2] = CORE_OFFSETS[c][2];
  }
}

updateResolutionFormation(0);

const FORMATIONS = [
  buildSparkFormation(),
  buildStructureFormation(),
  buildModulesFormation(),
  RESOLUTION_FORMATION,
];

// Edges for the "Structure" state: each node connected to its two nearest
// neighbors, computed once against the static Structure formation.
function buildEdges(formation) {
  const pairs = new Set();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const distances = [];
    for (let j = 0; j < PARTICLE_COUNT; j++) {
      if (i === j) continue;
      const dx = formation[i * 3] - formation[j * 3];
      const dy = formation[i * 3 + 1] - formation[j * 3 + 1];
      const dz = formation[i * 3 + 2] - formation[j * 3 + 2];
      distances.push([j, dx * dx + dy * dy + dz * dz]);
    }
    distances.sort((a, b) => a[1] - b[1]);
    for (let k = 0; k < 2; k++) {
      const j = distances[k][0];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      pairs.add(key);
    }
  }
  return Array.from(pairs).map((key) => key.split("-").map(Number));
}

const EDGES = buildEdges(FORMATIONS[1]);

function useCircleTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

// A very faint equirectangular surface map (soft latitude bands plus a few
// broad, low-contrast patches). The planet is otherwise a single flat color
// that would look identical at every rotation angle, so without this its
// continuous spin would be invisible. Deliberately low contrast: it must
// read as a smooth, round planet, not as a warped or organic surface.
function usePlanetMap() {
  return useMemo(() => {
    const w = 512;
    const h = 256;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    // Soft horizontal bands (values stay in the 0.86..1.0 range of white).
    const bands = [0.06, 0.2, 0.34, 0.5, 0.63, 0.78, 0.9];
    bands.forEach((y, i) => {
      const grad = ctx.createLinearGradient(0, (y - 0.06) * h, 0, (y + 0.06) * h);
      const shade = i % 2 === 0 ? "rgba(120,100,170,0.16)" : "rgba(120,100,170,0.08)";
      grad.addColorStop(0, "rgba(120,100,170,0)");
      grad.addColorStop(0.5, shade);
      grad.addColorStop(1, "rgba(120,100,170,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, (y - 0.06) * h, w, 0.12 * h);
    });
    // A few broad patches so longitude changes too (makes the spin visible).
    const rand = mulberry32(5);
    for (let i = 0; i < 6; i++) {
      const x = rand() * w;
      const y = (0.25 + rand() * 0.5) * h;
      const r = 28 + rand() * 40;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(110,90,170,0.2)");
      g.addColorStop(1, "rgba(110,90,170,0)");
      ctx.fillStyle = g;
      // Draw twice, offset by the map width, so patches wrap the seam.
      ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      ctx.fillRect(x - r - w, y - r, 2 * r, 2 * r);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);
}

// The solid planet and its glow. Lives inside the swarm group (which sits at
// the Contact zone, centered), grows in as the scroll approaches the
// Resolution state, and then keeps spinning regardless of scroll.
function Planet({ progressRef, circleTexture }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const haloRef = useRef();
  const planetMap = usePlanetMap();

  useFrame((_, delta) => {
    const s = clamp01((progressRef.current - 2.5) / 0.5);
    const grow = s * s * (3 - 2 * s); // smoothstep
    if (groupRef.current) {
      groupRef.current.visible = grow > 0.01;
      groupRef.current.scale.setScalar(Math.max(grow, 0.0001));
    }
    if (meshRef.current) meshRef.current.rotation.y += delta * PLANET_SPIN_SPEED;
    if (haloRef.current) haloRef.current.material.opacity = 0.1 * grow;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Glow: the soft circular sprite, scaled up, low opacity, behind the sphere. */}
      <sprite ref={haloRef} position={[0, 0, -PLANET_RADIUS * 0.6]} scale={[PLANET_RADIUS * 4.2, PLANET_RADIUS * 4.2, 1]}>
        <spriteMaterial
          map={circleTexture}
          color={SECONDARY_FG}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* Plain, smooth, round: no distortion, 96x96 segments. The sheen term
          gives the lavender rim light at grazing angles using the scene's
          own lights; no custom shader. */}
      <mesh ref={meshRef} rotation={[0.25, 0, 0.18]}>
        <sphereGeometry args={[PLANET_RADIUS, 96, 96]} />
        <meshPhysicalMaterial
          color={PLANET_CORE}
          map={planetMap}
          roughness={0.55}
          metalness={0.05}
          sheen={1}
          sheenColor={SECONDARY_FG}
          sheenRoughness={0.45}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ParticleSwarm({ progressRef }) {
  const circleTexture = useCircleTexture();
  const pointsRef = useRef();
  const linesRef = useRef();
  const groupRef = useRef();

  const positionsAttr = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const edgePositionsAttr = useMemo(() => new Float32Array(EDGES.length * 2 * 3), []);

  useEffect(() => {
    // These buffers are rewritten every frame — flag them as dynamic so
    // three.js doesn't assume static geometry.
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
    }
    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
    }
  }, []);

  useFrame(({ clock }) => {
    const idx = progressRef.current;
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, FORMATIONS.length - 1);
    const t = idx - i0;

    // The ring orbits continuously, independent of scroll.
    updateResolutionFormation(clock.elapsedTime);

    const fromFormation = FORMATIONS[i0];
    const toFormation = FORMATIONS[i1];

    for (let p = 0; p < PARTICLE_COUNT; p++) {
      const base = p * 3;
      // eslint-disable-next-line react-hooks/immutability -- positionsAttr is a persistent scratch buffer deliberately rewritten every frame (no allocation per frame).
      positionsAttr[base] = lerp(fromFormation[base], toFormation[base], t);
      positionsAttr[base + 1] = lerp(fromFormation[base + 1], toFormation[base + 1], t);
      positionsAttr[base + 2] = lerp(fromFormation[base + 2], toFormation[base + 2], t);
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.array.set(positionsAttr);
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // The Structure network's edges exist ONLY between the Hero->About and
    // About->Projects transitions (idx in (0, 2)). From idx 2 onward (Projects
    // and the whole Resolution state) the line mesh is hidden outright and its
    // opacity forced to exactly 0 — not left to a falloff formula.
    const showEdges = idx < 2;
    if (linesRef.current) {
      linesRef.current.visible = showEdges;
      if (showEdges) {
        const edgeOpacity = clamp01(1 - Math.abs(idx - 1));
        EDGES.forEach(([a, b], e) => {
          const o = e * 6;
          edgePositionsAttr[o] = positionsAttr[a * 3];
          edgePositionsAttr[o + 1] = positionsAttr[a * 3 + 1];
          edgePositionsAttr[o + 2] = positionsAttr[a * 3 + 2];
          edgePositionsAttr[o + 3] = positionsAttr[b * 3];
          edgePositionsAttr[o + 4] = positionsAttr[b * 3 + 1];
          edgePositionsAttr[o + 5] = positionsAttr[b * 3 + 2];
        });
        linesRef.current.geometry.attributes.position.array.set(edgePositionsAttr);
        linesRef.current.geometry.attributes.position.needsUpdate = true;
        linesRef.current.material.opacity = edgeOpacity * 0.35;
      } else {
        linesRef.current.material.opacity = 0;
      }
    }

    // The swarm travels the same path the camera does, so it's always
    // framed in front of it rather than left behind at a fixed point.
    const zoneX = lerp(ZONES[i0].x, ZONES[i1].x, t);
    const zoneY = lerp(ZONES[i0].y, ZONES[i1].y, t);
    const zoneZ = lerp(ZONES[i0].z, ZONES[i1].z, t);
    if (groupRef.current) {
      groupRef.current.position.set(zoneX, zoneY, zoneZ);
    }

    // Color follows the purple arc (violet -> deep violet -> vivid purple ->
    // lavender) — same zone-color data the camera rig's fog reads, so the
    // swarm and the fog stay visually in sync.
    const c0 = new THREE.Color(ZONES[i0].color);
    const c1 = new THREE.Color(ZONES[i1].color);
    const mixed = c0.clone().lerp(c1, t);
    // Ring dots soften as the swarm resolves, so they never compete with the
    // Contact text they drift behind.
    if (pointsRef.current) {
      pointsRef.current.material.opacity = lerp(0.85, 0.5, clamp01(idx - 2));
    }
    if (pointsRef.current) pointsRef.current.material.color.set(mixed);
    if (linesRef.current) linesRef.current.material.color.set(mixed);
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positionsAttr} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.14} sizeAttenuation transparent opacity={0.85} color={PRIMARY} map={circleTexture} alphaTest={0.05} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={EDGES.length * 2} array={edgePositionsAttr} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial transparent opacity={0} color={DEEP_VIOLET} />
      </lineSegments>
      <Planet progressRef={progressRef} circleTexture={circleTexture} />
    </group>
  );
}

function CameraRig({ progressRef }) {
  const { camera, scene, size } = useThree();
  const fog = useMemo(() => new THREE.Fog(BG, 8, 22), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- scene.fog has no setter method; this is the standard way to attach fog in three.js.
    scene.fog = fog;
  }, [scene, fog]);

  useFrame(() => {
    const idx = progressRef.current;
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, ZONES.length - 1);
    const t = idx - i0;
    const aspect = size.width / size.height;

    const zoneZ = lerp(ZONES[i0].z, ZONES[i1].z, t);
    const camOffset = lerp(
      zoneCamOffset(i0, camera.fov, aspect),
      zoneCamOffset(i1, camera.fov, aspect),
      t
    );
    const targetCamZ = zoneZ + camOffset;
    const newCamZ = camera.position.z + (targetCamZ - camera.position.z) * 0.06;
    camera.position.setZ(newCamZ);
    camera.lookAt(0, 0, zoneZ);

    const c0 = new THREE.Color(ZONES[i0].color);
    const c1 = new THREE.Color(ZONES[i1].color);
    const mixed = c0.clone().lerp(c1, t).lerp(new THREE.Color(BG), 0.8);
    fog.color.lerp(mixed, 0.1);
  });

  return null;
}

export default function Scene3D() {
  const progressRef = useScrollProgress(SECTION_IDS);

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Lights only affect the planet (every other object is unlit), so
            tinting them lavender gives the planet its lavender highlights
            over the deep-violet base. */}
        <ambientLight intensity={0.5} color="#a78bfa" />
        <directionalLight position={[3, 3, 3]} intensity={0.9} color={SECONDARY_FG} />
        <CameraRig progressRef={progressRef} />
        <ParticleSwarm progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
