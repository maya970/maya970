:root {
  --void: #f7fbff;
  --void-mid: #e8f2fb;
  --void-deep: #d4e6f5;
  --cyan: #4ad0ff;
  --cyan-soft: rgba(74, 208, 255, 0.45);
  --silver: rgba(230, 236, 245, 0.92);
  --line-faint: rgba(140, 180, 210, 0.22);
  --line-mid: rgba(120, 175, 215, 0.35);
  --text: #152433;
  --text-soft: rgba(21, 36, 51, 0.62);
  --glass-bg: rgba(255, 255, 255, 0.12);
  --glass-border: rgba(255, 255, 255, 0.55);
  --radius-card: clamp(20px, 4.2vmin, 32px);
  --radius-inner: clamp(16px, 3.4vmin, 26px);
  --mono-filter: grayscale(1) contrast(1.12) brightness(1.06) sepia(0.22) hue-rotate(158deg) saturate(0.32);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-family: "Noto Sans SC", "JetBrains Mono", system-ui, sans-serif;
  color: var(--text);
  background: var(--void);
}

body {
  position: relative;
}

/* —— 虚空：无数横线与竖线（多层景深） —— */
.void-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 100% 70% at 50% 35%, #ffffff 0%, var(--void) 42%, var(--void-mid) 100%);
}

.line-field {
  position: absolute;
  inset: -30%;
  pointer-events: none;
}

.line-field--far {
  opacity: 0.35;
  background-image:
    repeating-linear-gradient(0deg, var(--line-faint) 0 1px, transparent 1px 17px),
    repeating-linear-gradient(90deg, var(--line-faint) 0 1px, transparent 1px 19px);
  transform: translateZ(0) scale(1.08);
  animation: drift-far 38s linear infinite;
}

.line-field--mid {
  opacity: 0.5;
  background-image:
    repeating-linear-gradient(0deg, transparent 0 11px, var(--line-mid) 11px 12px, transparent 12px 28px),
    repeating-linear-gradient(90deg, transparent 0 13px, var(--line-mid) 13px 14px, transparent 14px 30px);
  animation: drift-mid 52s linear infinite reverse;
}

.line-field--near {
  opacity: 0.28;
  background-image:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.5) 0 1px, transparent 1px 9px),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.45) 0 1px, transparent 1px 11px);
  mix-blend-mode: soft-light;
  animation: drift-near 28s linear infinite;
}

@keyframes drift-far {
  to {
    transform: translate(24px, 18px) scale(1.08);
  }
}

@keyframes drift-mid {
  to {
    transform: translate(-30px, -22px);
  }
}

@keyframes drift-near {
  to {
    transform: translate(14px, -26px);
  }
}

.void-bloom {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.92) 0%, transparent 52%);
  mix-blend-mode: screen;
}

.void-scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(210, 240, 255, 0.05) 47%,
    rgba(210, 240, 255, 0.11) 50%,
    rgba(210, 240, 255, 0.05) 53%,
    transparent 100%
  );
  background-size: 100% 240%;
  animation: scan 11s ease-in-out infinite;
  opacity: 0.55;
}

@keyframes scan {
  0%,
  100% {
    background-position: 0 -70%;
  }
  50% {
    background-position: 0 70%;
  }
}

.cursor-glow {
  position: fixed;
  width: 480px;
  height: 480px;
  margin: -240px 0 0 -240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(170, 220, 255, 0.12) 0%, transparent 68%);
  pointer-events: none;
  z-index: 1;
}

.hud-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 8;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.1rem 1.5rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.hud-brand {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.hud-mark {
  color: var(--cyan);
  font-size: 0.95rem;
  text-shadow: 0 0 14px var(--cyan-soft);
}

.hud-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
  letter-spacing: 0.22em;
}

.hud-sub {
  font-size: 0.62rem;
  opacity: 0.78;
}

.hud-meta {
  text-align: right;
}

.hud-meta .sep {
  margin: 0 0.45rem;
  opacity: 0.38;
}

.stage {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4.5rem 0 3.5rem;
  min-height: 0;
}

.intro-panel {
  text-align: center;
  padding: 0 1.25rem 0.75rem;
  max-width: 34rem;
  margin: 0 auto;
}

.intro-line {
  margin: 0 0 0.4rem;
  font-size: 0.88rem;
  font-weight: 400;
  color: var(--text-soft);
  line-height: 1.55;
}

.intro-hint {
  margin: 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  color: var(--cyan);
  opacity: 0.82;
}

/* —— 一体平面：背后多层网格 + 前景可滚动无限画布 —— */
.void-canvas {
  position: relative;
  flex: 1;
  min-height: 0;
  margin: 0 0.35rem 0.25rem;
  border-radius: calc(var(--radius-card) + 4px);
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(200, 230, 255, 0.45),
    0 18px 50px rgba(100, 150, 200, 0.12);
}

.echo-stack {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.echo-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.echo-layer-inner {
  position: absolute;
  left: 50%;
  top: 50%;
  will-change: transform;
}

.echo-mesh {
  position: absolute;
  inset: -80px;
  z-index: 0;
  --ls: var(--line-scale, 1);
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(150, 190, 220, 0.14) 0 1px,
      transparent 1px calc(7px * var(--ls))
    ),
    repeating-linear-gradient(
      90deg,
      rgba(150, 190, 220, 0.12) 0 1px,
      transparent 1px calc(9px * var(--ls))
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0 calc(5px * var(--ls)),
      rgba(255, 255, 255, 0.22) calc(5px * var(--ls)) calc(5px * var(--ls) + 1px),
      transparent calc(5px * var(--ls) + 1px) calc(22px * var(--ls))
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0 calc(6px * var(--ls)),
      rgba(255, 255, 255, 0.18) calc(6px * var(--ls)) calc(6px * var(--ls) + 1px),
      transparent calc(6px * var(--ls) + 1px) calc(26px * var(--ls))
    );
  opacity: 0.55;
  mix-blend-mode: multiply;
}

.echo-grid {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: start;
}

.echo-cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: calc(var(--radius-inner) * 0.55);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 0 0 1px rgba(180, 220, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.echo-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: var(--echo-opacity, 0.28);
  filter: var(--mono-filter) blur(var(--echo-blur, 1px));
}

.universe-window {
  position: relative;
  z-index: 4;
  height: 100%;
  min-height: min(48vh, 380px);
  margin: 1px;
  border-radius: calc(var(--radius-card) + 2px);
  overflow: hidden;
  mask-image: radial-gradient(ellipse 92% 88% at 50% 50%, #000 52%, transparent 100%);
}

.universe-scroll {
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 208, 255, 0.35) transparent;
  cursor: grab;
  -webkit-overflow-scrolling: touch;
}

.universe-scroll.is-grabbing {
  cursor: grabbing;
  user-select: none;
}

.universe-scroll::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.universe-scroll::-webkit-scrollbar-thumb {
  background: rgba(74, 208, 255, 0.38);
  border-radius: 5px;
}

.universe-plane {
  display: grid;
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  box-sizing: content-box;
  perspective: 1400px;
}

/* —— 卡片：强玻璃 + 大圆角 + 黑白青（主平面格子） —— */
.card {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  height: auto;
  border-radius: var(--radius-card);
  cursor: pointer;
  transform-style: preserve-3d;
  border: 1px solid rgba(255, 255, 255, 0.65);
  background: var(--glass-bg);
  backdrop-filter: blur(28px) saturate(1.65);
  -webkit-backdrop-filter: blur(28px) saturate(1.65);
  box-shadow:
    0 0 0 1px rgba(180, 220, 255, 0.25),
    0 4px 24px rgba(120, 170, 210, 0.12),
    0 24px 48px rgba(100, 150, 200, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    inset 0 -1px 0 rgba(180, 210, 230, 0.35);
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease,
    border-color 0.35s ease;
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(120, 200, 255, 0.25), rgba(255, 255, 255, 0.4));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.card:hover,
.card:focus-visible {
  transform: translateZ(28px) scale(1.04);
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow:
    0 0 0 1px rgba(120, 210, 255, 0.55),
    0 0 36px rgba(120, 210, 255, 0.28),
    0 28px 56px rgba(90, 140, 190, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  outline: none;
}

.card:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 5px;
}

.card-inner {
  position: absolute;
  inset: 9px;
  border-radius: var(--radius-inner);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.card-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: var(--mono-filter);
  transition: transform 0.55s ease, filter 0.35s ease;
}

.card:hover .card-inner img {
  transform: scale(1.05);
}

.card-label {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 9px;
  padding: 0.32rem 0.5rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.58rem;
  letter-spacing: 0.05em;
  color: var(--text);
  border-radius: calc(var(--radius-inner) * 0.35);
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.55);
  line-height: 1.3;
  box-shadow: 0 2px 12px rgba(100, 150, 190, 0.08);
}

.card-index {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 1;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.55rem;
  color: var(--text-soft);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}

.hud-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1.25rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  color: var(--text-soft);
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.72));
}

.footer-quote {
  flex: 1;
  text-align: center;
  font-family: "Noto Sans SC", sans-serif;
  font-size: 0.74rem;
  letter-spacing: 0.05em;
  color: var(--text);
  opacity: 0.86;
}

/* —— 灯箱：银线迸发 + 背后菱形 + 中央清晰 —— */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: radial-gradient(ellipse 85% 75% at 50% 48%, #ffffff 0%, rgba(247, 251, 255, 0.97) 55%, var(--void-mid) 100%);
  animation: lb-fade 0.4s ease forwards;
}

.lightbox[hidden] {
  display: none;
}

@keyframes lb-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.lb-grid-faint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.14;
  background-image:
    repeating-linear-gradient(0deg, rgba(150, 190, 220, 0.5) 0 1px, transparent 1px 22px),
    repeating-linear-gradient(90deg, rgba(150, 190, 220, 0.45) 0 1px, transparent 1px 24px);
}

.lb-ribbons {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 1;
}

.lb-ray {
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 120vmin;
  margin-left: -1px;
  margin-top: -120vmin;
  transform-origin: 50% 100%;
  background: linear-gradient(
    to top,
    transparent 0%,
    rgba(245, 248, 255, 0.15) 28%,
    rgba(230, 236, 248, 0.95) 46%,
    rgba(255, 255, 255, 0.75) 50%,
    rgba(210, 218, 232, 0.85) 54%,
    rgba(245, 248, 255, 0.12) 72%,
    transparent 100%
  );
  filter: blur(0.35px);
  opacity: 0;
  transform: rotate(var(--deg, 0deg)) scaleY(0.02);
  animation: ribbon-life 1.45s cubic-bezier(0.18, 0.82, 0.22, 1) forwards;
}

@keyframes ribbon-life {
  0% {
    opacity: 0;
    transform: rotate(var(--deg, 0deg)) scaleY(0.02);
  }
  14% {
    opacity: 1;
  }
  42% {
    transform: rotate(var(--deg, 0deg)) scaleY(1);
    opacity: 0.92;
  }
  68% {
    opacity: 0.55;
  }
  100% {
    opacity: 0;
    transform: rotate(var(--deg, 0deg)) scaleY(1.04);
  }
}

.lb-diamond-field {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-diamond {
  position: absolute;
  width: var(--dw, 120px);
  height: var(--dw, 120px);
  border-radius: var(--radius-card);
  overflow: hidden;
  opacity: var(--do, 0.2);
  transform: translate(var(--dx, 0), var(--dy, 0)) rotate(42deg) scale(var(--ds, 1));
  filter: var(--mono-filter) blur(var(--db, 2px));
  box-shadow: 0 8px 32px rgba(100, 140, 180, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: diamond-drift 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.lb-diamond img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: rotate(-42deg) scale(1.12);
}

@keyframes diamond-drift {
  from {
    opacity: 0;
    transform: translate(calc(var(--dx, 0) * 0.2), calc(var(--dy, 0) * 0.2)) rotate(42deg) scale(0.6);
  }
  to {
    opacity: var(--do, 0.2);
    transform: translate(var(--dx, 0), var(--dy, 0)) rotate(42deg) scale(var(--ds, 1));
  }
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  z-index: 20;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(200, 220, 240, 0.7);
  border-radius: calc(var(--radius-card) * 0.55);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text);
  font-size: 1.45rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 0 24px rgba(120, 200, 255, 0.25);
}

.lightbox-hero-wrap {
  position: relative;
  z-index: 10;
  max-width: min(94vw, 920px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-frame {
  width: 100%;
  max-width: min(92vw, 880px);
  padding: 1.1rem 1.1rem 1rem;
  border-radius: calc(var(--radius-card) + 6px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(32px) saturate(1.5);
  -webkit-backdrop-filter: blur(32px) saturate(1.5);
  box-shadow:
    0 0 0 1px rgba(200, 230, 255, 0.35),
    0 24px 80px rgba(80, 130, 180, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  animation: lb-pop 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes lb-pop {
  from {
    opacity: 0;
    transform: scale(0.82) translateY(24px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.lightbox-img-shell {
  border-radius: var(--radius-card);
  overflow: hidden;
  background: #fff;
  box-shadow:
    0 12px 48px rgba(60, 100, 140, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

.lightbox-img {
  display: block;
  width: 100%;
  max-height: min(64vh, 680px);
  height: auto;
  object-fit: contain;
  margin: 0 auto;
  border-radius: var(--radius-card);
  filter: contrast(1.04) saturate(1.06);
}

.lightbox-caption {
  margin-top: 0.85rem;
  padding: 0 0.25rem;
}

.lightbox-caption h2 {
  margin: 0 0 0.3rem;
  font-size: 1.05rem;
  font-weight: 500;
}

.lightbox-caption p {
  margin: 0;
  font-size: 0.84rem;
  color: var(--text-soft);
  line-height: 1.55;
}

@media (max-width: 640px) {
  .hud-top {
    flex-direction: column;
    gap: 0.6rem;
  }

  .hud-meta {
    text-align: left;
  }

  .void-canvas {
    margin: 0 0.15rem;
  }

  .universe-window {
    min-height: min(42vh, 320px);
  }

  .hud-bottom {
    flex-wrap: wrap;
    gap: 0.3rem;
    justify-content: center;
  }

  .footer-quote {
    order: 3;
    flex-basis: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .line-field--far,
  .line-field--mid,
  .line-field--near,
  .void-scan {
    animation: none;
  }

  .lb-ray {
    animation: ribbon-life 0.35s ease-out forwards;
  }

  .lb-diamond {
    animation: none;
    opacity: var(--do, 0.18);
  }

  .lightbox-frame {
    animation: none;
  }
}
