(() => {
  /* Plays the sunrise animation in the browser tab once on page load, then settles on the normal favicon. */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const RU = new Path2D("M3.7 0.0V-36.800000000000004H13.0V0.0ZM25.700000000000003 0.0 15.450000000000001 -15.5H25.55L36.4 0.0ZM10.65 -11.200000000000001V-18.35H19.400000000000002Q21.05 -18.35 22.25 -19.0Q23.450000000000003 -19.650000000000002 24.125 -20.85Q24.8 -22.05 24.8 -23.650000000000002Q24.8 -25.3 24.125 -26.5Q23.450000000000003 -27.700000000000003 22.25 -28.35Q21.05 -29.0 19.400000000000002 -29.0H10.65V-36.800000000000004H18.85Q23.6 -36.800000000000004 27.05 -35.375Q30.5 -33.95 32.35 -31.175000000000004Q34.2 -28.400000000000002 34.2 -24.3V-23.5Q34.2 -19.400000000000002 32.325 -16.675Q30.450000000000003 -13.950000000000001 27.025000000000002 -12.575000000000001Q23.6 -11.200000000000001 18.85 -11.200000000000001ZM56.3 1.0Q51.05 1.0 47.425 -0.9500000000000002Q43.8 -2.9000000000000004 41.9 -6.4750000000000005Q40.0 -10.05 40.0 -14.950000000000001V-36.5H49.3V-14.75Q49.3 -12.600000000000001 50.125 -11.0Q50.95 -9.4 52.5 -8.55Q54.05 -7.7 56.3 -7.7Q58.55 -7.7 60.1 -8.55Q61.650000000000006 -9.4 62.45 -10.975000000000001Q63.25 -12.55 63.25 -14.75V-36.5H72.55000000000001V-14.950000000000001Q72.55000000000001 -10.05 70.67500000000001 -6.4750000000000005Q68.8 -2.9000000000000004 65.175 -0.9500000000000002Q61.55 1.0 56.3 1.0Z"), RUW = 75.55;
  const icon = document.getElementById('site-favicon');
  if (!icon) return;
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const g = cv.getContext('2d'); if (!g) return;
  const SUN = '#FF9A3C';
  const colors = () => document.documentElement.dataset.theme === 'light'
    ? { DISC: '#1B1F4B', LETTERS: '#FAF7F2' }
    : { DISC: '#FAF7F2', LETTERS: '#1B1F4B' };
  const clamp = v => Math.max(0, Math.min(1, v));
  const outQuart = t => 1 - Math.pow(1 - t, 4);
  const outBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function draw(t) {
    const { DISC, LETTERS } = colors();
    g.clearRect(0, 0, 64, 64); g.save(); g.scale(64 / 120, 64 / 120);
    const pd = clamp(t / .7);
    g.save(); g.globalAlpha = pd; g.translate(60, 60); g.scale(.5 + .5 * outBack(pd), .5 + .5 * outBack(pd)); g.translate(-60, -60);
    g.fillStyle = DISC; g.beginPath(); g.arc(60, 60, 58, 0, Math.PI * 2); g.fill(); g.restore();
    const ps = clamp((t - .5) / 1);
    g.save(); g.beginPath(); g.rect(0, 0, 120, 47); g.clip(); g.globalAlpha = ps; g.translate(0, 34 * (1 - outQuart(ps)));
    g.fillStyle = SUN; g.fill(new Path2D("M38 46 A22 22 0 0 1 82 46 Z")); g.restore();
    const pr = clamp((t - 1) / 1);
    g.save(); g.globalAlpha = pr; g.translate(60 - RUW / 2, 88 + 34 * (1 - outQuart(pr))); g.fillStyle = LETTERS; g.fill(RU); g.restore();
    g.restore();
  }
  const t0 = performance.now(), END = 2.1;
  const timer = setInterval(() => {
    const t = Math.min((performance.now() - t0) / 1000, END);
    draw(t); icon.href = cv.toDataURL('image/png');
    if (t >= END) {
      clearInterval(timer);
      icon.href = document.documentElement.dataset.theme === 'light' ? 'images/favicon-light.svg' : 'images/favicon.svg';
    }
  }, 70);
})();