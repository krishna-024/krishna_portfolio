/* ===================================================================
   1. GLOBAL HIGH-DENSITY INTERACTIVE COSMIC WARP (Three.js)
=================================================================== */
(function global3DSpace(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 15;

  // Generate a high density cosmic system
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount); // Specific coordinate speed values for hyper warp-drive acceleration

  const colorA = new THREE.Color(0x3fece2); // Electric Cyan
  const colorB = new THREE.Color(0x8d7bff); // Deep Purple

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 60; // X
    positions[i+1] = (Math.random() - 0.5) * 60; // Y
    positions[i+2] = (Math.random() - 0.5) * 40 - 10; // Z

    const mixedColor = colorA.clone().lerp(colorB, Math.random());
    colors[i] = mixedColor.r;
    colors[i+1] = mixedColor.g;
    colors[i+2] = mixedColor.b;

    speeds[i/3] = Math.random() * 0.05 + 0.01; // individual warp vector
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const starField = new THREE.Points(geometry, material);
  scene.add(starField);

  // Dynamic coordinates
  let mouseX = 0, mouseY = 0;
  let scrollY = 0;
  let targetWarp = 1; // standard rotation speed
  let currentWarp = 1;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // Cosmic Warp Acceleration triggered during page scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    targetWarp = 8; // Accelerates when actively scrolling!
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      targetWarp = 1; // returns back to normal after scroll stops
    }, 150);
  });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smoothly transition between standard movement and extreme hyper-warp drive
    currentWarp += (targetWarp - currentWarp) * 0.1;

    // Apply interactive vector adjustments on stars positions
    const posArr = starField.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idxZ = i * 3 + 2;
      // Stars fly towards camera relative to scroll/motion speeds
      posArr[idxZ] += speeds[i] * currentWarp;
      
      // Reset cosmic particles if they fly past camera perspective
      if(posArr[idxZ] > 15) {
         posArr[idxZ] = -30;
      }
    }
    starField.geometry.attributes.position.needsUpdate = true;

    // Slow drift rotation logic
    starField.rotation.y = elapsedTime * 0.01;

    // Reactive camera responsive drag
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;

    renderer.render(scene, camera);
  }
  animate();
})();

/* ===================================================================
   2. CUSTOM CURSOR
=================================================================== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseXpx = window.innerWidth/2, mouseYpx = window.innerHeight/2;
let ringX = mouseXpx, ringY = mouseYpx;

window.addEventListener('mousemove', (e)=>{
  mouseXpx = e.clientX; mouseYpx = e.clientY;
  if(cursorDot) {
    cursorDot.style.left = mouseXpx + 'px';
    cursorDot.style.top = mouseYpx + 'px';
  }
});

function animateRing(){
  ringX += (mouseXpx - ringX) * 0.15;
  ringY += (mouseYpx - ringY) * 0.15;
  if(cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('[data-hover], .project-card, .ach-card, .rail-dot, .btn, a, button').forEach(el=>{
  el.addEventListener('mouseenter', ()=> cursorRing && cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', ()=> cursorRing && cursorRing.classList.remove('hover'));
});

/* ===================================================================
   3. RESUME INTERACTIVE MODAL ACTIONS
=================================================================== */
const modal = document.getElementById("resumeModal");
const openBtnHero = document.getElementById("viewResumeBtn");
const openBtnContact = document.getElementById("contactResumeTrigger");
const closeSpan = document.querySelector(".close-modal");

function openModal() {
  if(modal) modal.style.display = "block";
}

function closeModal() {
  if(modal) modal.style.display = "none";
}

if(openBtnHero) openBtnHero.onclick = openModal;
if(openBtnContact) openBtnContact.onclick = openModal;
if(closeSpan) closeSpan.onclick = closeModal;

window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

/* ===================================================================
   4. GSAP — HERO ENTRANCE + SCROLL REVEALS
=================================================================== */
window.addEventListener('load', ()=>{
  gsap.timeline()
    .to('.hero-tag', {opacity:1, duration:.5})
    .to('.hero h1', {opacity:1, duration:1, ease:'power2.out'}, '-=0.2')
    .to('.hero-roles', {opacity:1, duration:.6}, '-=0.4')
    .to('.hero-desc', {opacity:1, duration:.6}, '-=0.3')
    .to('.hero-cta', {opacity:1, duration:.6}, '-=0.3');
});

const roles = document.querySelectorAll('#roleTrack span');
let roleIdx = 0;
if(roles.length > 0) {
  setInterval(()=>{
    roleIdx = (roleIdx+1) % roles.length;
    const track = document.getElementById('roleTrack');
    if(track) {
      track.style.transform = `translateY(-${roleIdx*32}px)`;
    }
  }, 2600);
}

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.reveal').forEach((el)=>{
  gsap.to(el, {
    opacity:1, y:0, duration:0.9, ease:'power2.out',
    scrollTrigger:{ trigger: el, start:'top 88%' }
  });
});

document.querySelectorAll('.num[data-count]').forEach(el=>{
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter: ()=>{
      const obj = { v:0 };
      gsap.to(obj, {
        v: target, duration: 1.4, ease:'power2.out',
        onUpdate: ()=>{ el.textContent = Math.round(obj.v) + suffix; }
      });
    }
  });
});

/* ===================================================================
   5. NAV RAIL (SCROLL DOTS)
=================================================================== */
const dots = document.querySelectorAll('.rail-dot');
const sections = Array.from(dots).map(d => document.querySelector(d.dataset.target));
dots.forEach(dot=>{
  dot.addEventListener('click', ()=>{
    const targetEl = document.querySelector(dot.dataset.target);
    if(targetEl) {
      targetEl.scrollIntoView({behavior:'smooth'});
    }
  });
});

function updateRail(){
  let idx = 0;
  const scrollPos = window.scrollY + window.innerHeight*0.4;
  sections.forEach((sec, i)=>{ if(sec && sec.offsetTop <= scrollPos) idx = i; });
  dots.forEach((d, i)=> d.classList.toggle('active', i===idx));
}
window.addEventListener('scroll', updateRail);
updateRail();

/* ===================================================================
   6. TILT EFFECT FOR INTERACTIVE CARDS
=================================================================== */
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - 0.5;
    const py = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${px*8}deg) rotateX(${-py*8}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
});