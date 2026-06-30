/* ============================================================
   THE VOICE LIBRARY — Reader JS
   Scope: books/the-voice-library/chapter-one/
   Responsibility: reading-progress bar only.
   No localStorage. No resume. No scroll effects.
   ============================================================ */
(() => {
  const fill = document.getElementById('tvl-progress-fill');
  if (!fill) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    fill.style.width = pct.toFixed(2) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();
