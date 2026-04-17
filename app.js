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

const trackH = document.getElementById("trackH");
const trackV = document.getElementById("trackV");
const railH = document.getElementById("railH");
const railV = document.getElementById("railV");
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
  const go = () => openLightbox(post);
  card.addEventListener("click", go);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  });
  return card;
}

function renderTracks() {
  trackH.innerHTML = "";
  trackV.innerHTML = "";
  POSTS.forEach((p) => trackH.appendChild(buildCard(p)));
  [...POSTS].reverse().forEach((p) => trackV.appendChild(buildCard(p)));
  centerTracks();
}

function centerTracks() {
  requestAnimationFrame(() => {
    const maxH = trackH.scrollWidth - trackH.clientWidth;
    const maxV = trackV.scrollHeight - trackV.clientHeight;
    trackH.scrollLeft = maxH > 0 ? maxH / 2 : 0;
    trackV.scrollTop = maxV > 0 ? maxV / 2 : 0;
    updateDepth();
  });
}

function pickScrollTarget(clientX, clientY) {
  const v = railV.getBoundingClientRect();
  const inV = clientX >= v.left && clientX <= v.right && clientY >= v.top && clientY <= v.bottom;
  return inV ? trackV : trackH;
}

function updateDepth() {
  const maxH = trackH.scrollWidth - trackH.clientWidth || 1;
  const maxV = trackV.scrollHeight - trackV.clientHeight || 1;
  const h = trackH.scrollLeft / maxH;
  const v = trackV.scrollTop / maxV;
  depthVal.textContent = ((h + v) / 2).toFixed(2);
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

document.addEventListener(
  "wheel",
  (e) => {
    if (!lightbox.hidden) return;
    const target = pickScrollTarget(e.clientX, e.clientY);
    e.preventDefault();
    if (target === trackV) {
      trackV.scrollTop += e.deltaY + e.deltaX;
    } else {
      trackH.scrollLeft += e.deltaY + e.deltaX;
    }
  },
  { passive: false }
);

trackH.addEventListener("scroll", updateDepth, { passive: true });
trackV.addEventListener("scroll", updateDepth, { passive: true });

tickClock();
setInterval(tickClock, 1000);
renderTracks();
