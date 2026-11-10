// Aguntech shared JavaScript
// Preloader
window.addEventListener('load',()=>{const p=document.getElementById('preloader');if(p){p.style.opacity=0;setTimeout(()=>p.remove(),500)}});
// Scroll progress
const progress=document.createElement('div');
progress.className='scroll-progress';
progress.setAttribute('aria-hidden','true');
document.body.appendChild(progress);
let progressFrame=0;
function updateProgress(){progressFrame=0;const max=document.documentElement.scrollHeight-window.innerHeight;const value=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;progress.style.transform=`scaleX(${value})`}
window.addEventListener('scroll',()=>{if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress)},{passive:true});
window.addEventListener('resize',()=>{if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress)},{passive:true});
updateProgress();
// Mobile menu
const mb=document.getElementById('menuBtn'),mm=document.getElementById('mobileMenu');
if(mb&&mm){
 mb.setAttribute('aria-controls',mm.id);
 mb.setAttribute('aria-expanded',String(!mm.classList.contains('hidden')));
 mb.addEventListener('click',()=>{
  const isOpen=mm.classList.toggle('hidden')===false;
  mb.setAttribute('aria-expanded',String(isOpen));
 });
 mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mm.classList.add('hidden');
  mb.setAttribute('aria-expanded','false');
 }));
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!mm.classList.contains('hidden')){
   mm.classList.add('hidden');
   mb.setAttribute('aria-expanded','false');
   mb.focus();
  }
 });
}
// Active nav link
const page=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('[data-nav]').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active')});
// Sticky header shadow
const hd=document.getElementById('header');
window.addEventListener('scroll',()=>{if(hd)hd.classList.toggle('shadow-2xl',scrollY>30)});
// Scroll reveal
const revealElements=document.querySelectorAll('.reveal');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduceMotion||!('IntersectionObserver' in window)){revealElements.forEach(el=>el.classList.add('show'))}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.15});revealElements.forEach(el=>{el.style.transitionDelay=(el.dataset.delay||0)+'ms';io.observe(el)})}
// Counters
const counters=document.querySelectorAll('[data-count]');
function setCounter(el){const t=Number(el.dataset.count),s=el.dataset.suffix||'';if(!Number.isFinite(t))return;let n=0;const st=Math.max(t/60,.1);const tk=setInterval(()=>{n+=st;if(n>=t){n=t;clearInterval(tk)}el.textContent=(t%1?n.toFixed(1):Math.floor(n))+s},25)}
if(reduceMotion||!('IntersectionObserver' in window)){counters.forEach(el=>{const t=Number(el.dataset.count);if(Number.isFinite(t))el.textContent=(t%1?t.toFixed(1):Math.floor(t))+(el.dataset.suffix||'')})}
else{const co=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){setCounter(e.target);co.unobserve(e.target)}}));counters.forEach(el=>co.observe(el))}
// Typing effect
const ty=document.getElementById('typing');
if(ty){const w=JSON.parse(ty.dataset.words);if(reduceMotion){ty.textContent=w[0]||''}else if(w.length){let wi=0,ci=0,del=false;(function loop(){const word=w[wi];ty.textContent=word.slice(0,ci);if(!del&&ci<word.length)ci++;else if(del&&ci>0)ci--;else{del=!del;if(!del)wi=(wi+1)%w.length}setTimeout(loop,del?50:ci===word.length?1500:100)})()}}
// Testimonial slider
const slides=document.querySelectorAll('.t-slide');let si=0;
function showSlide(i){slides.forEach((s,k)=>{s.classList.toggle('hidden',k!==i)})}
if(slides.length){showSlide(0);document.getElementById('tPrev')?.addEventListener('click',()=>{si=(si-1+slides.length)%slides.length;showSlide(si)});document.getElementById('tNext')?.addEventListener('click',()=>{si=(si+1)%slides.length;showSlide(si)});if(!reduceMotion)setInterval(()=>{si=(si+1)%slides.length;showSlide(si)},6000)}
// Gallery filter
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('btn-fire'));b.classList.add('btn-fire');const f=b.dataset.filter;document.querySelectorAll('.gallery-item').forEach(g=>{g.style.display=(f==='all'||g.dataset.cat===f)?'':'none'})}));
// Lightbox
const lb=document.getElementById('lightbox');
document.querySelectorAll('.gallery-item img').forEach(img=>img.addEventListener('click',()=>{if(!lb)return;lb.querySelector('img').src=img.src;lb.classList.remove('hidden');lb.classList.add('flex')}));
lb?.addEventListener('click',()=>{lb.classList.add('hidden');lb.classList.remove('flex')});
// Contact form email delivery
document.querySelectorAll('form[data-contact-form]').forEach(form=>form.addEventListener('submit',async e=>{
 e.preventDefault();
 const message=form.querySelector('.form-msg');
 const button=form.querySelector('button[type="submit"]');
 if(!message||!button)return;
 message.textContent='';
 message.classList.add('hidden');
 message.classList.remove('text-green-400','text-red-400');
 button.disabled=true;
 button.textContent='Sending...';
 try{
  const response=await fetch('https://api.web3forms.com/submit',{
   method:'POST',
   headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify(Object.fromEntries(new FormData(form)))
  });
  const result=await response.json();
  if(!response.ok||!result.success)throw new Error(result.message||'Unable to send your message.');
  message.textContent='আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!';
  message.classList.add('text-green-400');
  form.reset();
 }catch(error){
  console.error('Contact form submission failed:',error);
  message.textContent='বার্তা পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
  message.classList.add('text-red-400');
 }finally{
  message.classList.remove('hidden');
  button.disabled=false;
  button.textContent='Send Message';
 }
}));
// Demo forms
document.querySelectorAll('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const m=f.querySelector('.form-msg');if(m){m.textContent='এই ফর্মটি এখনো ইমেইল সার্ভারের সাথে সংযুক্ত নয়; তথ্য পাঠানো হয়নি।';m.classList.remove('hidden')}}));
// Year
document.querySelectorAll('.year').forEach(y=>y.textContent=new Date().getFullYear());