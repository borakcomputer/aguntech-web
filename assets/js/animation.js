/* animations.js - main.js er por load korun. Existing code touch kore na. */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Scroll progress bar
  const bar = document.createElement("div"); bar.id = "scrollBar"; document.body.appendChild(bar);
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (reduce) return;

  // 2. Price count-up (e.g. "1250 BDT") when card enters screen
  const prices = [...document.querySelectorAll("article .text-fire")]
    .filter(el => /^\d+\s*BDT$/.test(el.textContent.trim()));
  const countIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseInt(el.textContent, 10), t0 = performance.now(), dur = 1100;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + " BDT"; if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); countIO.unobserve(el);
  }), { threshold: .6 });
  prices.forEach(p => countIO.observe(p));

  // 3. Card cursor glow + 3D tilt
  document.querySelectorAll("article.glass.card-hover").forEach(c => {
    c.addEventListener("pointermove", e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
      const rx = ((y / r.height) - .5) * -10, ry = ((x / r.width) - .5) * 10;
      c.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    c.addEventListener("pointerleave", () => { c.style.transform = ""; });
  });

  // 4. Corporate: rotating border + list stagger
  const corp = [...document.querySelectorAll("section .glass")].find(g => g.querySelector("ul"));
  if (corp) corp.classList.add("corp-glow");
  const list = document.querySelector("section ul");
  if (list) {
    list.classList.add("a-list");
    list.querySelectorAll("li").forEach((li, i) => li.style.transitionDelay = (i * 120) + "ms");
    new IntersectionObserver((es, io) => es.forEach(e => {
      if (e.isIntersecting) { list.classList.add("a-in"); io.disconnect(); }
    }), { threshold: .4 }).observe(list);
  }
})();