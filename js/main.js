const navToggle=document.getElementById('nav-toggle'),navWrap=document.querySelector('.nav-wrap'),navLinks=document.querySelectorAll('.nav a');
if(navToggle){navToggle.addEventListener('click',()=>{const open=navWrap.classList.toggle('open');navToggle.setAttribute('aria-expanded',open)})}
navLinks.forEach(link=>link.addEventListener('click',()=>navWrap.classList.remove('open')));
const progress=document.getElementById('scroll-progress');
window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-window.innerHeight;if(progress)progress.style.width=(h>0?(window.scrollY/h)*100:0)+'%'},{passive:true});

document.querySelectorAll('.cv-download,.cv-view').forEach(link=>{const href=link.getAttribute('href');if(href&&href.endsWith('.docx')){const pdfHref=href.replace(/\.docx$/i,'.pdf');link.setAttribute('href',pdfHref);if(link.hasAttribute('download')){const filename=pdfHref.split('/').pop();link.setAttribute('download',filename)}}});

(function(){
  const hoverStyles=document.createElement('link');
  hoverStyles.rel='stylesheet';
  hoverStyles.href='css/hover-fix.css';
  document.head.appendChild(hoverStyles);

  const STORAGE_KEY='rishiraj-portfolio-theme';
  let mode=localStorage.getItem(STORAGE_KEY)==='light'?'light':'dark';

  function applyTheme(){
    const theme=mode;
    document.documentElement.dataset.theme=theme;
    document.documentElement.dataset.themeMode=theme;
    const meta=document.querySelector('meta[name="theme-color"]')||document.head.appendChild(Object.assign(document.createElement('meta'),{name:'theme-color'}));
    meta.content=theme==='light'?'#f7f9fc':'#080a0f';
    const button=document.getElementById('theme-control');
    if(button){
      button.className='theme-control is-'+theme;
      button.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');
      button.title=theme==='dark'?'Switch to light theme':'Switch to dark theme';
      const icon=button.querySelector('.theme-icon');
      const label=button.querySelector('.theme-label');
      if(icon)icon.textContent=theme==='dark'?'☾':'☀';
      if(label)label.textContent=theme==='dark'?'Dark':'Light';
    }
  }

  function toggleTheme(){
    mode=mode==='dark'?'light':'dark';
    localStorage.setItem(STORAGE_KEY,mode);
    applyTheme();
  }

  function addThemeControl(){
    const nav=document.getElementById('site-nav');
    if(!nav||document.getElementById('theme-control'))return;
    const button=document.createElement('button');
    button.type='button';
    button.id='theme-control';
    button.className='theme-control';
    button.innerHTML='<span class="theme-icon" aria-hidden="true"></span><span class="theme-label"></span>';
    button.addEventListener('click',toggleTheme);
    const cta=nav.querySelector('.nav-cta');
    nav.insertBefore(button,cta||null);
    applyTheme();
  }

  function setupRevealAnimations(){
    const targets=[...document.querySelectorAll('.section-heading,.section-content,.expertise-grid article,.project,.achievement-card,.cv-card,.timeline-item,.credentials-grid,.contact-grid,.stat-row,.project-result')];
    targets.forEach((el,index)=>{el.classList.add('reveal-on-scroll');el.style.transitionDelay=Math.min(index%6,5)*55+'ms'});
    if(!('IntersectionObserver' in window)){targets.forEach(el=>el.classList.add('is-visible'));return}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -45px'});
    targets.forEach(el=>observer.observe(el));
  }

  function setupActiveNavigation(){
    const sections=[...document.querySelectorAll('main section[id]')];
    const links=[...document.querySelectorAll('.nav a[href^="#"]')];
    if(!sections.length||!links.length||!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')==='#'+entry.target.id))}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
    sections.forEach(section=>observer.observe(section));
  }

  function setupMicroInteractions(){
    document.querySelectorAll('.project,.expertise-grid article,.achievement-card,.cv-card').forEach(card=>{
      card.addEventListener('pointermove',event=>{
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
        const rect=card.getBoundingClientRect();
        const x=(event.clientX-rect.left)/rect.width-.5;
        const y=(event.clientY-rect.top)/rect.height-.5;
        const baseTransform='perspective(900px) rotateX('+(-y*1.8)+'deg) rotateY('+(x*1.8)+'deg) translateY(-3px)';
        card.style.transform=baseTransform;
      });
      card.addEventListener('pointerleave',()=>{card.style.transform=''});
    });
  }

  function init(){applyTheme();addThemeControl();setupRevealAnimations();setupActiveNavigation();setupMicroInteractions()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
