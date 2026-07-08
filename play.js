// Very light prototype for visual and simple tone feedback
(function(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const phin = document.getElementById('phin');
  const noteDisplay = document.getElementById('noteDisplay');

  // Ensure audio starts immediately on first user interaction (mobile Safari etc.)
  function ensureAudioContext() {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(()=>{});
    }
  }
  window.addEventListener('pointerdown', ensureAudioContext, { once: true });
  window.addEventListener('touchstart', ensureAudioContext, { once: true });

  function ping(freq=440, dur=0.15){
    // Simple tone for prototype 
    try{
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.start(); o.stop(ctx.currentTime + dur);
    }catch(e){ }
  }

  const base = { 'E': 329.63, 'A': 440.00, 'F': 349.23, 'G': 392.00 };

  function trigger(el){
    const note = el.dataset.note || '?';
    el.classList.add('active');
    setTimeout(()=>el.classList.remove('active'), 150);
    noteDisplay.textContent = 'Note: ' + note;
    ping(base[note] || 440);
  }

  // Click + drag
  let dragging = false;
  phin.addEventListener('mousedown', e => { dragging = true; });
  phin.addEventListener('mouseup', e => { dragging = false; });
  phin.addEventListener('mouseleave', e => { dragging = false; });
  phin.addEventListener('mousemove', e => {
    if(!dragging) return;
    const el = e.target.closest('.string');
    if(el) trigger(el);
  });
  phin.addEventListener('click', e => {
    const el = e.target.closest('.string');
    if(el) trigger(el);
  });

  // Keyboard function it trigger only the pressed string's note 
  const downKeys = new Set();
  document.addEventListener('keydown', e => {
    const k = e.key.toUpperCase();
    if(!['E','A','F','G'].includes(k)) return;
    if(downKeys.has(k)) return; 
    downKeys.add(k);
    const s = [...phin.querySelectorAll('.string')].find(el => el.dataset.note === k);
    if(s) trigger(s);
  });
  document.addEventListener('keyup', e => {
    const k = e.key.toUpperCase();
    if(downKeys.has(k)) downKeys.delete(k);
  });
})();
