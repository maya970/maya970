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

/** 主平面：单一大网格（横竖一体），比视窗大，四面重复感 */
const MAIN_COLS = 14;
const MAIN_ROWS = 12;
const MAIN_CELL = 94;
const MAIN_GAP = 11;

/** 背后多层：越来越小 / 越来越密，带图 + 线网 */
const ECHO_LAYERS = [
  { cols: 10, rows: 7, cell: 56, gap: 8, blur: 2.8, opacity: 0.2, speed: 0.05, phase: [0, 0], lineScale: 1.4 },
  { cols: 14, rows: 10, cell: 46, gap: 6, blur: 2.1, opacity: 0.26, speed: 0.09, phase: [40, 22], lineScale: 1.1 },
  { cols: 19, rows: 14, cell: 36, gap: 5, blur: 1.4, opacity: 0.3, speed: 0.14, phase: [-28, 36], lineScale: 0.85 },
  { cols: 26, rows: 18, cell: 28, gap: 4, blur: 0.9, opacity: 0.34, speed: 0.19, phase: [18, -14], lineScale: 0.65 },
  { cols: 34, rows: 24, cell: 22, gap: 3, blur: 0.55, opacity: 0.38, speed: 0.24, phase: [-12, -30], lineScale: 0.5 },
];

const scrollSurface = document.getElementById("scrollSurface");
const plane = document.getElementById("plane");
const echoStack = document.getElementById("echoStack");
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

let echoInners = [];
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

function buildCard(post) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("role", "button");
  card.tabIndex = 0;
  card.setAttribute("aria-label", `打开文章：${post.title}`);
  card.innerHTML = `
      <span class="card-index">${post.id}</span>
      <div class="card-inner">
        <img src="${post.image}" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="card-label">${post.title}</div>
    `;
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
  return card;
}

function buildEchoCell(post) {
  const cell = document.createElement("div");
  cell.className = "echo-cell";
  const img = document.createElement("img");
  img.src = post.image;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  cell.appendChild(img);
  return cell;
}

function renderEchoLayers() {
  echoStack.innerHTML = "";
  echoInners = [];
  ECHO_LAYERS.forEach((cfg, layerIdx) => {
    const layer = document.createElement("div");
    layer.className = "echo-layer";
    layer.dataset.speed = String(cfg.speed);
    layer.style.zIndex = String(layerIdx + 1);

    const mesh = document.createElement("div");
    mesh.className = "echo-mesh";
    mesh.style.setProperty("--line-scale", String(cfg.lineScale));

    const inner = document.createElement("div");
    inner.className = "echo-layer-inner";
    const w = cfg.cols * cfg.cell + (cfg.cols - 1) * cfg.gap;
    const h = cfg.rows * cfg.cell + (cfg.rows - 1) * cfg.gap;
    inner.style.width = `${w}px`;
    inner.style.height = `${h}px`;

    const grid = document.createElement("div");
    grid.className = "echo-grid";
    grid.style.gridTemplateColumns = `repeat(${cfg.cols}, ${cfg.cell}px)`;
    grid.style.gap = `${cfg.gap}px`;
    grid.style.setProperty("--echo-blur", `${cfg.blur}px`);
    grid.style.setProperty("--echo-opacity", String(cfg.opacity));

    const offset = layerIdx * 3 + 1;
    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        const idx = (r * cfg.cols + c + offset) % POSTS.length;
        grid.appendChild(buildEchoCell(POSTS[idx]));
      }
    }

    inner.appendChild(mesh);
    inner.appendChild(grid);
    layer.appendChild(inner);
    echoStack.appendChild(layer);
    echoInners.push({ el: inner, cfg });
  });
}

function renderPlane() {
  plane.innerHTML = "";
  plane.style.gridTemplateColumns = `repeat(${MAIN_COLS}, ${MAIN_CELL}px)`;
  plane.style.gap = `${MAIN_GAP}px`;
  plane.style.padding = "56px";

  for (let r = 0; r < MAIN_ROWS; r++) {
    for (let c = 0; c < MAIN_COLS; c++) {
      const idx = (r * MAIN_COLS + c) % POSTS.length;
      plane.appendChild(buildCard(POSTS[idx]));
    }
  }
}

function centerScroll() {
  requestAnimationFrame(() => {
    const maxX = scrollSurface.scrollWidth - scrollSurface.clientWidth;
    const maxY = scrollSurface.scrollHeight - scrollSurface.clientHeight;
    scrollSurface.scrollLeft = maxX > 0 ? maxX / 2 : 0;
    scrollSurface.scrollTop = maxY > 0 ? maxY / 2 : 0;
    syncEchoParallax();
    updateDepth();
  });
}

function syncEchoParallax() {
  const sl = scrollSurface.scrollLeft;
  const st = scrollSurface.scrollTop;
  const spd = prefersReducedMotion ? 0 : 1;
  echoInners.forEach(({ el, cfg }) => {
    const tx = cfg.phase[0] - sl * cfg.speed * spd;
    const ty = cfg.phase[1] - st * cfg.speed * spd;
    el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
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
  syncEchoParallax();
  updateDepth();
});

window.addEventListener("resize", () => {
  syncEchoParallax();
  updateDepth();
});

tickClock();
setInterval(tickClock, 1000);
renderEchoLayers();
renderPlane();
bindPan();
centerScroll();
