/**
 * 文章数据：修改 POSTS 即可。
 */
const POSTS = [
  { id: "01", title: "虚空界面 · 采样 A", excerpt: "高亮数据海中的第一层缓存。", image: "./1.png" },
  { id: "02", title: "虚空界面 · 采样 B", excerpt: "透视网格与青蓝描边。", image: "./2.png" },
  { id: "03", title: "虚空界面 · 采样 C", excerpt: "滑动轨道上的节点。", image: "./3.png" },
  { id: "04", title: "虚空界面 · 采样 D", excerpt: "玻璃方格与光晕。", image: "./4.png" },
  { id: "05", title: "虚空界面 · 采样 E", excerpt: "交叉路径上的缩略图。", image: "./5.png" },
  { id: "06", title: "虚空界面 · 采样 F", excerpt: "近景交互暗示。", image: "./6.png" },
  { id: "07", title: "虚空界面 · 采样 G", excerpt: "远景模糊与景深。", image: "./7.png" },
  { id: "08", title: "虚空界面 · 采样 H", excerpt: "列表延伸向消失点。", image: "./8.png" },
  { id: "09", title: "虚空界面 · 采样 I", excerpt: "可继续追加条目。", image: "./9.png" },
  { id: "10", title: "虚空界面 · 采样 J", excerpt: "点击展开中央大图。", image: "./10.png" },
];

/** 画布边距：尽量小，让左右两块版图更容易连成一片 */
const PLANE_PAD = 32;
/** 环状周期 ≈ 单块版图外框；取 0 使四块十字边贴边、接缝连续 */
const TILE_VOID = 0;

/**
 * 五层：大小/错位/旋转/视差/景深口字框 均拉开；背后更亮、略减模糊以便「口」与十字可读。
 * translateZ(px)：远为负，强化透视景深。
 */
const CROSS_LAYERS = [
  {
    arm: 6,
    cell: 60,
    gap: 8,
    scale: 0.56,
    offsetX: -58,
    offsetY: 44,
    rot: -3.4,
    z: -200,
    blur: 2.1,
    brightness: 0.76,
    opacity: 0.72,
    speed: 0.014,
    lineScale: 1.72,
    phase: [26, -20],
    meshOpacity: 0.62,
    portalOut: 78,
    portalBw: 5,
    portalAlpha: 0.62,
  },
  {
    arm: 5,
    cell: 68,
    gap: 9,
    scale: 0.68,
    offsetX: 52,
    offsetY: -48,
    rot: 2.85,
    z: -138,
    blur: 1.55,
    brightness: 0.8,
    opacity: 0.78,
    speed: 0.048,
    lineScale: 1.38,
    phase: [-32, 24],
    meshOpacity: 0.58,
    portalOut: 58,
    portalBw: 4,
    portalAlpha: 0.55,
  },
  {
    arm: 5,
    cell: 76,
    gap: 9,
    scale: 0.8,
    offsetX: -36,
    offsetY: -28,
    rot: -1.9,
    z: -88,
    blur: 1.05,
    brightness: 0.86,
    opacity: 0.84,
    speed: 0.095,
    lineScale: 1.08,
    phase: [22, -18],
    meshOpacity: 0.52,
    portalOut: 40,
    portalBw: 3,
    portalAlpha: 0.48,
  },
  {
    arm: 4,
    cell: 84,
    gap: 10,
    scale: 0.9,
    offsetX: 40,
    offsetY: 36,
    rot: 1.65,
    z: -42,
    blur: 0.42,
    brightness: 0.93,
    opacity: 0.92,
    speed: 0.152,
    lineScale: 0.86,
    phase: [-14, 28],
    meshOpacity: 0.46,
    portalOut: 24,
    portalBw: 2,
    portalAlpha: 0.4,
  },
  {
    arm: 4,
    cell: 90,
    gap: 10,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rot: 0,
    z: 0,
    blur: 0,
    brightness: 1,
    opacity: 1,
    speed: 0.235,
    lineScale: 0.64,
    phase: [0, 0],
    meshOpacity: 0.4,
    portalOut: 10,
    portalBw: 1.5,
    portalAlpha: 0.28,
    interactive: true,
  },
];

const scrollSurface = document.getElementById("scrollSurface");
const plane = document.getElementById("plane");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbExcerpt = document.getElementById("lbExcerpt");
const lbClose = document.getElementById("lbClose");
const lbRibbons = document.getElementById("lbRibbons");
const lbDiamond = document.getElementById("lbDiamond");
const cursorGlow = document.getElementById("cursorGlow");
const depthVal = document.getElementById("depthVal");
const clockEl = document.getElementById("clock");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let crossShifts = [];
let suppressCardClick = false;
let torusTile = 900;

function layerSpanPx(cfg) {
  const pitch = cfg.cell + cfg.gap;
  return (2 * cfg.arm + 1) * pitch;
}

function computeMaxOriginBox() {
  let m = 0;
  CROSS_LAYERS.forEach((cfg) => {
    const s = layerSpanPx(cfg);
    const ox = Math.abs(cfg.offsetX);
    const oy = Math.abs(cfg.offsetY);
    m = Math.max(m, s + 2 * ox, s + 2 * oy);
  });
  return Math.ceil(m + 8);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function tickClock() {
  const d = new Date();
  clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function openLightbox(post) {
  lbImg.src = post.image;
  lbImg.alt = post.title;
  lbTitle.textContent = post.title;
  lbExcerpt.textContent = post.excerpt;
  lightbox.hidden = false;
  spawnSilverRibbons();
  spawnDiamondEchoes(post.image);
  document.body.style.overflow = "hidden";
  lbClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lbImg.removeAttribute("src");
  lbRibbons.innerHTML = "";
  lbDiamond.innerHTML = "";
}

function spawnSilverRibbons() {
  lbRibbons.innerHTML = "";
  const count = prefersReducedMotion ? 10 : 72;
  for (let i = 0; i < count; i++) {
    const ray = document.createElement("div");
    ray.className = "lb-ray";
    const deg = (360 / count) * i + (i % 3) * 0.35;
    ray.style.setProperty("--deg", `${deg}deg`);
    ray.style.animationDelay = `${(i / count) * 0.12}s`;
    lbRibbons.appendChild(ray);
  }
}

function spawnDiamondEchoes(activeSrc) {
  lbDiamond.innerHTML = "";
  const others = POSTS.filter((p) => p.image !== activeSrc);
  const golden = 2.39996322972865332;
  others.forEach((p, i) => {
    const shell = document.createElement("div");
    shell.className = "lb-diamond";
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = "";
    img.loading = "eager";
    shell.appendChild(img);

    const ring = 1 + Math.floor(i / 6);
    const t = i * golden;
    const r = 22 + ring * 11 + (i % 4) * 2.5;
    const dx = Math.cos(t) * r;
    const dy = Math.sin(t) * r;
    const dw = 72 + (i % 5) * 10;
    const blurPx = 1.2 + ring * 0.85 + (i % 3) * 0.4;
    const opacity = Math.max(0.08, 0.34 - ring * 0.06 - (i % 4) * 0.02);
    const scale = 0.75 + (i % 4) * 0.07;

    shell.style.setProperty("--dx", `${dx.toFixed(2)}vmin`);
    shell.style.setProperty("--dy", `${dy.toFixed(2)}vmin`);
    shell.style.setProperty("--dw", `${dw}px`);
    shell.style.setProperty("--do", String(opacity));
    shell.style.setProperty("--ds", scale.toFixed(2));
    shell.style.setProperty("--db", `${blurPx}px`);
    shell.style.animationDelay = `${i * 0.04}s`;

    lbDiamond.appendChild(shell);
  });
}

function buildCard(post, opts) {
  const { compact, interactive, cell } = opts;
  const card = document.createElement("div");
  card.className = compact ? "card card--depth" : "card";
  card.style.width = `${cell}px`;
  card.style.height = `${cell}px`;
  card.style.position = "absolute";
  if (!interactive) {
    card.setAttribute("aria-hidden", "true");
    card.tabIndex = -1;
  } else {
    card.setAttribute("role", "button");
    card.tabIndex = 0;
    card.setAttribute("aria-label", `打开文章：${post.title}`);
  }

  if (compact) {
    card.innerHTML = `
      <div class="card-inner">
        <img src="${post.image}" alt="" loading="lazy" decoding="async" />
      </div>
    `;
  } else {
    card.innerHTML = `
      <span class="card-index">${post.id}</span>
      <div class="card-inner">
        <img src="${post.image}" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="card-label">${post.title}</div>
    `;
  }

  if (interactive) {
    const go = () => {
      if (suppressCardClick) return;
      openLightbox(post);
    };
    card.addEventListener("click", go);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
  }

  return card;
}

function postAt(layerIdx, hx, hy) {
  const k = layerIdx * 11 + hx * 3 + hy * 5 + 100;
  return POSTS[((k % POSTS.length) + POSTS.length) % POSTS.length];
}

function fillCrossArm(shift, cfg, layerIdx, interactive) {
  const armH = document.createElement("div");
  armH.className = "cross-arm cross-arm--h";
  const armV = document.createElement("div");
  armV.className = "cross-arm cross-arm--v";

  const pitch = cfg.cell + cfg.gap;
  const box = layerSpanPx(cfg);
  const cx = box / 2;
  const cy = box / 2;
  const half = cfg.cell / 2;

  for (let x = -cfg.arm; x <= cfg.arm; x++) {
    const p = postAt(layerIdx, x, 0);
    const c = buildCard(p, { compact: !interactive, interactive, cell: cfg.cell });
    c.style.left = `${cx + x * pitch - half}px`;
    c.style.top = `${cy - half}px`;
    armH.appendChild(c);
  }

  for (let y = -cfg.arm; y <= cfg.arm; y++) {
    if (y === 0) continue;
    const p = postAt(layerIdx, 0, y);
    const c = buildCard(p, { compact: !interactive, interactive, cell: cfg.cell });
    c.style.left = `${cx - half}px`;
    c.style.top = `${cy + y * pitch - half}px`;
    armV.appendChild(c);
  }

  shift.appendChild(armH);
  shift.appendChild(armV);
}

function buildOneOrigin(maxSpan) {
  const origin = document.createElement("div");
  origin.className = "cross-origin";
  origin.style.width = `${maxSpan}px`;
  origin.style.height = `${maxSpan}px`;
  const shifts = [];

  CROSS_LAYERS.forEach((cfg, layerIdx) => {
    const depth = document.createElement("div");
    depth.className = "cross-depth";
    depth.style.zIndex = String(layerIdx + 1);
    if (!cfg.interactive) depth.classList.add("cross-depth--back");

    const layerBox = layerSpanPx(cfg);
    const shift = document.createElement("div");
    shift.className = "cross-depth-shift";
    shift.style.setProperty("--arm", String(cfg.arm));
    shift.style.setProperty("--pitch", `${cfg.cell + cfg.gap}px`);
    shift.style.transformOrigin = "50% 50%";
    shift.style.opacity = "1";
    shift.style.width = `${layerBox}px`;
    shift.style.height = `${layerBox}px`;
    shift.style.left = `${(maxSpan - layerBox) / 2 + cfg.offsetX}px`;
    shift.style.top = `${(maxSpan - layerBox) / 2 + cfg.offsetY}px`;

    const body = document.createElement("div");
    body.className = "cross-depth-body";
    body.style.opacity = String(cfg.opacity);
    const filters = [];
    if (cfg.blur > 0) filters.push(`blur(${cfg.blur}px)`);
    if (cfg.brightness != null && cfg.brightness < 1) filters.push(`brightness(${cfg.brightness})`);
    if (cfg.contrast != null && cfg.contrast !== 1) filters.push(`contrast(${cfg.contrast})`);
    body.style.filter = filters.length ? filters.join(" ") : "none";

    const mesh = document.createElement("div");
    mesh.className = "cross-mesh";
    mesh.style.setProperty("--line-scale", String(cfg.lineScale));
    mesh.style.setProperty("--arm", String(cfg.arm));
    mesh.style.setProperty("--pitch", `${cfg.cell + cfg.gap}px`);
    if (cfg.meshOpacity != null) mesh.style.opacity = String(cfg.meshOpacity);

    const portal = document.createElement("div");
    portal.className = "depth-portal";
    portal.style.setProperty("--portal-out", `${cfg.portalOut ?? 32}px`);
    portal.style.setProperty("--portal-bw", `${cfg.portalBw ?? 2}px`);
    portal.style.setProperty("--portal-alpha", String(cfg.portalAlpha ?? 0.4));

    body.appendChild(mesh);
    fillCrossArm(body, cfg, layerIdx, !!cfg.interactive);
    shift.appendChild(body);
    shift.appendChild(portal);

    depth.appendChild(shift);
    origin.appendChild(depth);

    shifts.push({ el: shift, cfg });
  });

  return { origin, shifts };
}

function applyTorusWrap() {
  if (!lightbox.hidden) return;
  const TILE = torusTile;
  if (TILE <= 1) return;
  const sl = scrollSurface.scrollLeft;
  const st = scrollSurface.scrollTop;
  const nsl = ((sl % TILE) + TILE) % TILE;
  const nst = ((st % TILE) + TILE) % TILE;
  if (Math.abs(nsl - sl) > 0.5 || Math.abs(nst - st) > 0.5) {
    scrollSurface.scrollLeft = nsl;
    scrollSurface.scrollTop = nst;
  }
}

function renderPlane() {
  plane.innerHTML = "";
  crossShifts = [];

  const maxSpan = computeMaxOriginBox();
  torusTile = Math.max(1, maxSpan + TILE_VOID);

  const planeW = PLANE_PAD * 2 + torusTile * 2;
  const planeH = PLANE_PAD * 2 + torusTile * 2;
  plane.style.width = `${planeW}px`;
  plane.style.height = `${planeH}px`;
  plane.style.position = "relative";

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const { origin, shifts } = buildOneOrigin(maxSpan);
      origin.style.left = `${PLANE_PAD + i * torusTile}px`;
      origin.style.top = `${PLANE_PAD + j * torusTile}px`;
      plane.appendChild(origin);
      crossShifts.push(...shifts);
    }
  }
}

function syncCrossParallax() {
  const sl = scrollSurface.scrollLeft;
  const st = scrollSurface.scrollTop;
  const spd = prefersReducedMotion ? 0 : 1;
  crossShifts.forEach(({ el, cfg }) => {
    const tx = cfg.phase[0] - sl * cfg.speed * spd;
    const ty = cfg.phase[1] - st * cfg.speed * spd;
    const r = cfg.rot ?? 0;
    const s = cfg.scale ?? 1;
    const tz = prefersReducedMotion ? 0 : cfg.z ?? 0;
    el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotate(${r}deg) scale(${s})`;
  });
}

function centerScroll() {
  requestAnimationFrame(() => {
    const cw = scrollSurface.clientWidth;
    const ch = scrollSurface.clientHeight;
    scrollSurface.scrollLeft = Math.max(0, PLANE_PAD + torusTile / 2 - cw / 2);
    scrollSurface.scrollTop = Math.max(0, PLANE_PAD + torusTile / 2 - ch / 2);
    syncCrossParallax();
    updateDepth();
  });
}

function updateDepth() {
  const TILE = torusTile || 1;
  const nx = (scrollSurface.scrollLeft % TILE) / TILE;
  const ny = (scrollSurface.scrollTop % TILE) / TILE;
  depthVal.textContent = Math.hypot(nx, ny).toFixed(2);
}

function bindPan() {
  let down = false;
  let sx = 0;
  let sy = 0;
  let sl0 = 0;
  let st0 = 0;
  let moved = false;

  scrollSurface.addEventListener("mousedown", (e) => {
    if (e.button !== 0 || !lightbox.hidden) return;
    down = true;
    moved = false;
    sx = e.clientX;
    sy = e.clientY;
    sl0 = scrollSurface.scrollLeft;
    st0 = scrollSurface.scrollTop;
    scrollSurface.classList.add("is-grabbing");
  });

  window.addEventListener("mousemove", (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.hypot(dx, dy) > 4) moved = true;
    scrollSurface.scrollLeft = sl0 - dx;
    scrollSurface.scrollTop = st0 - dy;
  });

  window.addEventListener("mouseup", () => {
    if (!down) return;
    down = false;
    scrollSurface.classList.remove("is-grabbing");
    if (moved) {
      suppressCardClick = true;
      setTimeout(() => {
        suppressCardClick = false;
      }, 80);
    }
    applyTorusWrap();
  });

  scrollSurface.addEventListener(
    "wheel",
    (e) => {
      if (!lightbox.hidden) return;
      e.preventDefault();
      if (e.shiftKey) {
        scrollSurface.scrollLeft += e.deltaY;
      } else {
        scrollSurface.scrollLeft += e.deltaX;
        scrollSurface.scrollTop += e.deltaY;
      }
      applyTorusWrap();
    },
    { passive: false }
  );
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});

document.addEventListener("mousemove", (e) => {
  cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

scrollSurface.addEventListener("scroll", () => {
  syncCrossParallax();
  applyTorusWrap();
  updateDepth();
});

window.addEventListener("resize", () => {
  syncCrossParallax();
  updateDepth();
});

tickClock();
setInterval(tickClock, 1000);
renderPlane();
bindPan();
centerScroll();
