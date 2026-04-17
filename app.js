(function () {
  const posts = [
    {
      id: "01",
      title: "轨道上的余晖",
      time: "2026-04-12",
      excerpt: "在没有任何地标的空间里，时间只靠心跳与列表的刻度对齐。",
      image: "https://picsum.photos/seed/void-orbit/960/540",
      body: "把日常写成一行行条目，像遥测数据一样从眼前滑过。打开某一张图，就等于切入那条记忆的高分辨率分支。",
    },
    {
      id: "02",
      title: "静默频段",
      time: "2026-03-28",
      excerpt: "噪声被压到阈值以下，只剩下界面边缘的微光。",
      image: "https://picsum.photos/seed/silent-band/960/540",
      body: "适合整理碎片：链接、截图、半句话。它们悬浮在深色背景上，比文件夹更像「尚未坍缩的观测结果」。",
    },
    {
      id: "03",
      title: "折叠城市",
      time: "2026-02-14",
      excerpt: "列表是平面的，但滚动让纵深出现。",
      image: "https://picsum.photos/seed/fold-city/960/540",
      body: "每一次滑动都在重新分配注意力。点击打开大图，是把自己传送到那一格坐标——短暂、清晰、可关闭。",
    },
    {
      id: "04",
      title: "冷启动笔记",
      time: "2026-01-05",
      excerpt: "新一年的日志从空白网格开始。",
      image: "https://picsum.photos/seed/cold-boot/960/540",
      body: "静态页面意味着没有后台进程：只有你、列表、光。把这里当作个人博客的骨架，替换成你的文章与图片即可。",
    },
    {
      id: "05",
      title: "信号丢失之前",
      time: "2025-12-20",
      excerpt: "缓存里最后一张图，仍然完整。",
      image: "https://picsum.photos/seed/signal-lost/960/540",
      body: "若离线打开，请把图片放到同目录并在 posts 数组里改为相对路径，例如 images/orbit.jpg。",
    },
    {
      id: "06",
      title: "深空排版",
      time: "2025-11-02",
      excerpt: "字体与单色的对比度，比装饰更接近科幻。",
      image: "https://picsum.photos/seed/deep-type/960/540",
      body: "中文与等宽西文混排，适合技术写作与旅行记录并列存在的个人站点。",
    },
  ];

  const feed = document.getElementById("feed");
  const scene = document.getElementById("feed-scene");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbTitle = document.getElementById("lb-title");
  const lbTime = document.getElementById("lb-time");
  const lbBody = document.getElementById("lb-body");
  const lbClose = document.getElementById("lb-close");

  let offsetY = 0;
  let velY = 0;
  let minY = 0;
  let raf = 0;
  let dragging = false;
  let startY = 0;
  let startOffset = 0;
  let dragMoved = 0;
  let suppressClick = false;

  function layoutBounds() {
    const h = scene.clientHeight;
    const contentH = feed.scrollHeight;
    minY = Math.min(0, h - contentH - 32);
  }

  function clampOffset(y) {
    const maxY = 80;
    return Math.min(maxY, Math.max(minY, y));
  }

  function setTransform() {
    const items = feed.querySelectorAll(".feed__item");
    const mid = scene.getBoundingClientRect().top + scene.clientHeight / 2;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      const dist = (cy - mid) / (scene.clientHeight * 0.55);
      const rot = Math.max(-6, Math.min(6, dist * 5));
      const z = -Math.abs(dist) * 40;
      const op = 1 - Math.min(0.55, Math.abs(dist) * 0.35);
      el.style.transform = `translateZ(${z}px) rotateX(${rot}deg)`;
      el.style.opacity = String(op);
    });
    feed.style.transform = `translate3d(0, ${offsetY}px, 0)`;
  }

  function tick() {
    if (!dragging && Math.abs(velY) > 0.15) {
      offsetY += velY;
      offsetY = clampOffset(offsetY);
      velY *= 0.92;
    } else if (!dragging) {
      velY = 0;
    }
    setTransform();
    raf = requestAnimationFrame(tick);
  }

  function openLightbox(post) {
    lbImg.src = post.image;
    lbImg.alt = post.title;
    lbTitle.textContent = post.title;
    lbTime.textContent = post.time;
    lbBody.textContent = post.body;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    const done = () => {
      lightbox.hidden = true;
      lightbox.removeEventListener("transitionend", done);
    };
    lightbox.addEventListener("transitionend", done);
  }

  posts.forEach((post) => {
    const li = document.createElement("li");
    li.className = "feed__item";
    li.innerHTML = `
      <button type="button" class="feed__card" data-id="${post.id}">
        <div class="feed__thumb-wrap">
          <img class="feed__thumb" src="${post.image}" alt="" loading="lazy" width="280" height="210" />
          <div class="feed__thumb-glitch" aria-hidden="true"></div>
        </div>
        <div class="feed__info">
          <span class="feed__time">${post.time}</span>
          <h3 class="feed__title">${post.title}</h3>
          <p class="feed__excerpt">${post.excerpt}</p>
        </div>
      </button>
    `;
    feed.appendChild(li);
  });

  feed.addEventListener("click", (e) => {
    const btn = e.target.closest(".feed__card");
    if (!btn || suppressClick) {
      suppressClick = false;
      return;
    }
    const id = btn.getAttribute("data-id");
    const post = posts.find((p) => p.id === id);
    if (post) openLightbox(post);
  });

  scene.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      velY += e.deltaY * 0.45;
      offsetY = clampOffset(offsetY + e.deltaY * 0.55);
    },
    { passive: false }
  );

  scene.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragMoved = 0;
    suppressClick = false;
    scene.classList.add("is-dragging");
    startY = e.clientY;
    startOffset = offsetY;
    velY = 0;
    scene.setPointerCapture(e.pointerId);
  });

  scene.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dragMoved += Math.abs(e.movementY) + Math.abs(e.movementX);
    const dy = e.clientY - startY;
    offsetY = clampOffset(startOffset + dy);
    velY = e.movementY * 1.2;
  });

  scene.addEventListener("pointerup", () => {
    if (dragMoved > 14) suppressClick = true;
    dragging = false;
    scene.classList.remove("is-dragging");
  });

  scene.addEventListener("pointercancel", () => {
    suppressClick = true;
    dragging = false;
    scene.classList.remove("is-dragging");
  });

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });

  window.addEventListener("resize", () => {
    layoutBounds();
    offsetY = clampOffset(offsetY);
  });

  layoutBounds();
  offsetY = 20;
  requestAnimationFrame(() => {
    layoutBounds();
    setTransform();
  });
  raf = requestAnimationFrame(tick);

  /* starfield */
  const canvas = document.getElementById("void-canvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w = 0;
  let h = 0;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    const count = Math.floor((w * h) / 14000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random(),
      s: Math.random() * 1.2 + 0.2,
    }));
  }

  function drawStars(t) {
    ctx.fillStyle = "#030508";
    ctx.fillRect(0, 0, w, h);
    for (const st of stars) {
      const tw = 0.5 + Math.sin(t * 0.001 + st.z * 10) * 0.35;
      ctx.globalAlpha = 0.15 + st.z * 0.55 * tw;
      ctx.fillStyle = st.z > 0.65 ? "#9fdfff" : "#5a6a8a";
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.s * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(() => drawStars(performance.now()));
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawStars(0);
})();
