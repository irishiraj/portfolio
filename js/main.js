const navToggle=document.getElementById('nav-toggle'),navWrap=document.querySelector('.nav-wrap'),navLinks=document.querySelectorAll('.nav a');
if(navToggle){navToggle.addEventListener('click',()=>{const open=navWrap.classList.toggle('open');navToggle.setAttribute('aria-expanded',open)})}
navLinks.forEach(link=>link.addEventListener('click',()=>navWrap.classList.remove('open')));
const progress=document.getElementById('scroll-progress');
window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-window.innerHeight;if(progress)progress.style.width=(h>0?(window.scrollY/h)*100:0)+'%'},{passive:true});

document.querySelectorAll('.cv-download,.cv-view').forEach(link=>{const href=link.getAttribute('href');if(href&&href.endsWith('.docx')){const pdfHref=href.replace(/\.docx$/i,'.pdf');link.setAttribute('href',pdfHref);if(link.hasAttribute('download')){const filename=pdfHref.split('/').pop();link.setAttribute('download',filename)}}});

/* Theme + animation layer: keeps the existing portfolio markup/content intact. */
(function(){
  const head=document.head;
  if(!document.querySelector('link[data-portfolio-theme]')){
    const styleLink=document.createElement('link');
    styleLink.rel='stylesheet';
    styleLink.href='css/theme.css';
    styleLink.dataset.portfolioTheme='true';
    head.appendChild(styleLink);
  }

  const media=window.matchMedia('(prefers-color-scheme: light)');
  const STORAGE_KEY='rishiraj-portfolio-theme';
  const saved=localStorage.getItem(STORAGE_KEY);
  let mode=(saved==='light'||saved==='dark'||saved==='auto')?saved:'auto';

  function resolvedTheme(){return mode==='auto'?(media.matches?'light':'dark'):mode}
  function applyTheme(){
    const theme=resolvedTheme();
    document.documentElement.dataset.theme=theme;
    document.documentElement.dataset.themeMode=mode;
    const meta=document.querySelector('meta[name="theme-color"]')||document.head.appendChild(Object.assign(document.createElement('meta'),{name:'theme-color'}));
    meta.content=theme==='light'?'#f7f9fc':'#080a0f';
    const button=document.getElementById('theme-control');
    if(button){
      button.className='theme-control is-'+mode;
      button.setAttribute('aria-label','Theme: '+mode+'. Click to change theme.');
      button.title='Theme: '+mode+' (click to switch)';
      const icon=button.querySelector('.theme-icon');
      if(icon)icon.textContent=mode==='auto'?'◐':mode==='light'?'☀':'☾';
    }
  }
  function cycleTheme(){
    mode=mode==='auto'?'light':mode==='light'?'dark':'auto';
    if(mode==='auto')localStorage.removeItem(STORAGE_KEY);else localStorage.setItem(STORAGE_KEY,mode);
    applyTheme();
  }

  function addThemeControl(){
    const nav=document.getElementById('site-nav');
    if(!nav||document.getElementById('theme-control'))return;
    const button=document.createElement('button');
    button.type='button';
    button.id='theme-control';
    button.className='theme-control';
    button.innerHTML='<span class="theme-icon" aria-hidden="true">◐</span><span class="theme-label"></span>';
    button.addEventListener('click',cycleTheme);
    const cta=nav.querySelector('.nav-cta');
    nav.insertBefore(button,cta||null);
    applyTheme();
  }

  function setupSystemTheme(){
    applyTheme();
    if(media.addEventListener)media.addEventListener('change',()=>{if(mode==='auto')applyTheme()});
    else if(media.addListener)media.addListener(()=>{if(mode==='auto')applyTheme()});
  }

  function setupRevealAnimations(){
    const targets=[
      ...document.querySelectorAll('.section-heading,.section-content,.expertise-grid article,.project,.achievement-card,.cv-card,.timeline-item,.credentials-grid,.contact-grid,.stat-row,.project-result')
    ];
    targets.forEach((el,index)=>{el.classList.add('reveal-on-scroll');el.style.transitionDelay=Math.min(index%6,5)*55+'ms'});
    if(!('IntersectionObserver' in window)){targets.forEach(el=>el.classList.add('is-visible'));return}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -45px'});
    targets.forEach(el=>observer.observe(el));
  }

  function setupActiveNavigation(){
    const sections=[...document.querySelectorAll('main section[id]')];
    const links=[...document.querySelectorAll('.nav a[href^="#"]')];
    if(!sections.length||!links.length||!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      links.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')==='#'+entry.target.id));
    }),{rootMargin:'-35% 0px -55% 0px',threshold:0});
    sections.forEach(section=>observer.observe(section));
  }

  function setupMicroInteractions(){
    document.querySelectorAll('.project,.expertise-grid article,.achievement-card,.cv-card').forEach(card=>{
      card.addEventListener('pointermove',event=>{
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
        const rect=card.getBoundingClientRect();
        const x=(event.clientX-rect.left)/rect.width-.5;
        const y=(event.clientY-rect.top)/rect.height-.5;
        card.style.transform='perspective(900px) rotateX('+(-y*1.8)+'deg) rotateY('+(x*1.8)+'deg) translateY(-3px)';
      });
      card.addEventListener('pointerleave',()=>{card.style.transform=''});
    });
  }

  function init(){
    setupSystemTheme();
    addThemeControl();
    setupRevealAnimations();
    setupActiveNavigation();
    setupMicroInteractions();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
