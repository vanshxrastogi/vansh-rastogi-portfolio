// A short, optional title sequence. Normal content stays usable if this file fails.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || location.hash || document.visibilityState === 'hidden') return;
  try { if (sessionStorage.getItem('vr-intro-seen')) return; } catch {}
  const overlay = document.createElement('div');
  overlay.className = 'studio-intro';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Vansh Rastogi portfolio introduction');
  overlay.innerHTML = `<div class="intro-shutter" aria-hidden="true"></div><div class="intro-content"><div class="intro-topline"><span>VANSH RASTOGI / FILM &amp; IMAGINATION</span><span class="intro-step">01 + 02</span></div><div class="intro-title"><span class="intro-name"><span>VANSH</span></span><span class="intro-name"><span>RASTOGI<span class="intro-dot">.</span></span></span></div><div class="intro-bottomline"><span>IDEAS INTO FRAMES.<br>IMAGINATION INTO REALITY.</span><span class="intro-status" aria-hidden="true">01 / IMAGINE</span></div><div class="intro-track" aria-hidden="true"><span></span></div></div><button type="button" class="intro-skip">SKIP INTRO <span aria-hidden="true">↗</span></button>`;
  const originalFocus = document.activeElement;
  const sections = [...document.querySelectorAll('body > header, body > main, body > footer')];
  const previousInert = sections.map(node => node.inert);
  const timers = [];
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    overlay.remove();
    document.documentElement.classList.remove('intro-active');
    sections.forEach((node, i) => { node.inert = previousInert[i]; });
    document.removeEventListener('keydown', onKey);
    reduced.removeEventListener('change', finish);
    try { sessionStorage.setItem('vr-intro-seen', '1'); } catch {}
    if (originalFocus instanceof HTMLElement && originalFocus !== document.body) originalFocus.focus({ preventScroll: true });
  }
  function onKey(event) {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab') { event.preventDefault(); overlay.querySelector('button').focus(); }
  }
  // Arm the cleanup before applying any page lock.
  timers.push(setTimeout(finish, 3000));
  document.body.append(overlay);
  sections.forEach(node => { node.inert = true; });
  document.documentElement.classList.add('intro-active');
  overlay.querySelector('button').addEventListener('click', finish);
  document.addEventListener('keydown', onKey);
  reduced.addEventListener('change', finish);
  overlay.querySelector('button').focus({ preventScroll: true });
  timers.push(setTimeout(() => { overlay.querySelector('.intro-status').textContent = '02 / CREATE'; }, 1000));
  timers.push(setTimeout(() => { overlay.classList.add('intro-opening'); }, 1750));
  timers.push(setTimeout(finish, 2550));
})();
