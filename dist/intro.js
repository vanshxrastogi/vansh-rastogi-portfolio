// Repeat the short studio opening on each page load; keep the page usable on failure.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || document.visibilityState === 'hidden') return;
  const overlay = document.createElement('div');
  overlay.className = 'studio-intro';
  overlay.tabIndex = -1;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Vansh Rastogi portfolio introduction');
  overlay.innerHTML = `<div class="intro-shutter" aria-hidden="true"></div><div class="intro-content"><div class="intro-topline"><span>VANSH RASTOGI / FILM &amp; IMAGINATION</span><span class="intro-step">01 + 02</span></div><div class="intro-title"><span class="intro-name"><span>VANSH</span></span><span class="intro-name"><span>RASTOGI<span class="intro-dot">.</span></span></span></div><div class="intro-bottomline"><span>IDEAS INTO FRAMES.<br>IMAGINATION INTO REALITY.</span><span class="intro-status" aria-hidden="true">01 / IMAGINE</span></div><div class="intro-track" aria-hidden="true"><span></span></div></div>`;
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
    document.documentElement.classList.add('intro-revealed');
    dispatchEvent(new Event('vr-intro-finished'));
    if (originalFocus instanceof HTMLElement && originalFocus !== document.body) originalFocus.focus({ preventScroll: true });
  }
  function onKey(event) {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab') { event.preventDefault(); overlay.focus(); }
  }
  // Arm the cleanup before applying any page lock.
  timers.push(setTimeout(finish, 4500));
  document.body.append(overlay);
  sections.forEach(node => { node.inert = true; });
  document.documentElement.classList.add('intro-active');
  document.addEventListener('keydown', onKey);
  reduced.addEventListener('change', finish);
  overlay.focus({ preventScroll: true });
  timers.push(setTimeout(() => { overlay.querySelector('.intro-status').textContent = '02 / CREATE'; }, 1900));
  timers.push(setTimeout(() => { overlay.classList.add('intro-opening'); }, 3000));
  timers.push(setTimeout(finish, 3850));
})();
