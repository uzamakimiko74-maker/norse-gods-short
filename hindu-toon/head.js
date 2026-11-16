/* Top 5 Strongest Hindu Gods — globals the lifted engine expects: maths, a seeded rng, the three.js scene and camera.
   The page renders offscreen at 1080×1920; window.render(t) composites the 3D frame and the 2D HUD onto #cv. */
const W = 1080, H = 1920, SPR = 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x) };
const eout = x => 1 - Math.pow(1 - clamp(x), 3);
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
const R = rng(7);
const glc = document.createElement('canvas'); glc.width = W; glc.height = H;
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputEncoding = THREE.sRGBEncoding;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(55, W / H, .1, 300); scene.add(cam);
const hemi = new THREE.HemisphereLight(0xffffff, 0x555577, 1); scene.add(hemi);
const sunL = new THREE.DirectionalLight(0xffffff, .9); sunL.position.set(5, 10, 6); scene.add(sunL);
const rimL = new THREE.DirectionalLight(0xffe2b0, .45); rimL.position.set(-6, 5, -8); scene.add(rimL);   // warm back light: the sets read as lit volumes
