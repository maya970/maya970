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

/** 十字：中心左右各 ARM 格；竖条不含中心格（避免与横条重复） */
const ARM = 4;
const CELL = 90;
const GAP = 10;
const PLANE_PAD = 420;

/** 五层十字由后往前：缩放、模糊、透明度、视差系数、线网疏密 */
const CROSS_LAYERS = [
  { scale: 0.74, blur: 3.2, opacity: 0.4, speed: 0.055, lineScale: 1.55, phase: [18, -12] },
  { scale: 0.82, blur: 2.4, opacity: 0.5, speed: 0.09, lineScale: 1.25, phase: [-22, 16] },
  { scale: 0.9, blur: 1.7, opacity: 0.62, speed: 0.13, lineScale: 1, phase: [10, 24] },
  { scale: 0.96, blur: 1, opacity: 0.78, speed: 0.17, lineScale: 0.82, phase: [-14, -20] },
  { scale: 1, blur: 0, opacity: 1, speed: 0.21, lineScale: 0.68, phase: [0, 0], interactive: true },
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

const pitch = CELL + GAP;
const crossSpan = (2 * ARM + 1) * pitch;
let crossShifts = [];
let suppressCardClick = false;

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
  const { compact, interactive } = opts;
  const card = document.createElement("div");
  card.className = compact ? "card card--depth" : "card";
  card.style.width = `${CELL}px`;
  card.style.height = `${CELL}px`;
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

function fillCrossArm(shift, layerIdx, interactive) {
  const armH = document.createElement("div");
  armH.className = "cross-arm cross-arm--h";
  const armV = document.createElement("div");
  armV.className = "cross-arm cross-arm--v";

  const cx = crossSpan / 2;
  const cy = crossSpan / 2;

  const half = CELL / 2;

  for (let x = -ARM; x <= ARM; x++) {
    const p = postAt(layerIdx, x, 0);
    const c = buildCard(p, { compact: !interactive, interactive });
    c.style.left = `${cx + x * pitch - half}px`;
    c.style.top = `${cy - half}px`;
    armH.appendChild(c);
  }

  for (let y = -ARM; y <= ARM; y++) {
    if (y === 0) continue;
    const p = postAt(layerIdx, 0, y);
    const c = buildCard(p, { compact: !interactive, interactive });
    c.style.left = `${cx - half}px`;
    c.style.top = `${cy + y * pitch - half}px`;
    armV.appendChild(c);
  }

  shift.appendChild(armH);
  shift.appendChild(armV);
}

function renderPlane() {
  plane.innerHTML = "";
  crossShifts = [];

  const W = PLANE_PAD * 2 + crossSpan;
  const H = PLANE_PAD * 2 + crossSpan;
  plane.style.width = `${W}px`;
  plane.style.height = `${H}px`;
  plane.style.position = "relative";

  const origin = document.createElement("div");
  origin.className = "cross-origin";
  origin.style.left = `${PLANE_PAD}px`;
  origin.style.top = `${PLANE_PAD}px`;
  origin.style.width = `${crossSpan}px`;
  origin.style.height = `${crossSpan}px`;

  CROSS_LAYERS.forEach((cfg, layerIdx) => {
    const depth = document.createElement("div");
    depth.className = "cross-depth";
    depth.style.zIndex = String(layerIdx + 1);
    if (!cfg.interactive) depth.classList.add("cross-depth--back");

    const mesh = document.createElement("div");
    mesh.className = "cross-mesh";
    mesh.style.setProperty("--line-scale", String(cfg.lineScale));
    mesh.style.setProperty("--arm", String(ARM));
    mesh.style.setProperty("--pitch", `${pitch}px`);

    const shift = document.createElement("div");
    shift.className = "cross-depth-shift";
    shift.style.setProperty("--arm", String(ARM));
    shift.style.setProperty("--pitch", `${pitch}px`);
    shift.style.transformOrigin = "50% 50%";
    shift.style.filter = cfg.blur > 0 ? `blur(${cfg.blur}px)` : "none";
    shift.style.opacity = String(cfg.opacity);

    shift.appendChild(mesh);
    fillCrossArm(shift, layerIdx, !!cfg.interactive);

    depth.appendChild(shift);
    origin.appendChild(depth);

    crossShifts.push({ el: shift, cfg });
  });

  plane.appendChild(origin);
}

function syncCrossParallax() {
  const sl = scrollSurface.scrollLeft;
  const st = scrollSurface.scrollTop;
  const spd = prefersReducedMotion ? 0 : 1;
  crossShifts.forEach(({ el, cfg }) => {
    const tx = cfg.phase[0] - sl * cfg.speed * spd;
    const ty = cfg.phase[1] - st * cfg.speed * spd;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${cfg.scale})`;
  });
}

function centerScroll() {
  requestAnimationFrame(() => {
    const maxX = scrollSurface.scrollWidth - scrollSurface.clientWidth;
    const maxY = scrollSurface.scrollHeight - scrollSurface.clientHeight;
    scrollSurface.scrollLeft = maxX > 0 ? maxX / 2 : 0;
    scrollSurface.scrollTop = maxY > 0 ? maxY / 2 : 0;
    syncCrossParallax();
    updateDepth();
  });
}

function updateDepth() {
  const maxX = scrollSurface.scrollWidth - scrollSurface.clientWidth || 1;
  const maxY = scrollSurface.scrollHeight - scrollSurface.clientHeight || 1;
  const nx = scrollSurface.scrollLeft / maxX;
  const ny = scrollSurface.scrollTop / maxY;
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
  });

  scrollSurface.addEventListener(
    "wheel",
    (e) => {
      if (!lightbox.hidden) return;
      if (e.shiftKey) {
        e.preventDefault();
        scrollSurface.scrollLeft += e.deltaY;
      }
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
