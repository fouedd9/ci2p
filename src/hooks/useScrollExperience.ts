import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export interface ScrollState { progress: number; reducedMotion: boolean; assemblyProgress: number; logisticsProgress: number; assemblyActive: boolean; logisticsActive: boolean }
export function useScrollExperience() {
  const state = useRef<ScrollState>({progress: 0, reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches, assemblyProgress: 0, logisticsProgress: 0, assemblyActive: false, logisticsActive: false});
  const [chapter, setChapter] = useState(0);
  const chapterIndex = useRef(-1);
  useEffect(() => {
    const saveScroll=()=>{try{sessionStorage.setItem('ci2p-scroll',JSON.stringify({href:location.href,y:window.scrollY}));}catch{/* Storage can be disabled. */}};
    window.addEventListener('pagehide',saveScroll);
    let restoreFrame=0,restorationAttempted=false;
    const media = gsap.matchMedia();
    media.add({reduce: '(prefers-reduced-motion: reduce)', normal: '(prefers-reduced-motion: no-preference)'}, context => {
      const reduce = !!context.conditions?.reduce;
      state.current.reducedMotion = reduce;
      const assembly = ScrollTrigger.create({trigger:'#assembly',start:'top top',end:()=>`+=${window.innerHeight*2.4}`,pin:true,invalidateOnRefresh:true});
      const logistics = ScrollTrigger.create({trigger:'#logistics',start:'top top',end:()=>`+=${window.innerHeight*4}`,pin:true,invalidateOnRefresh:true});
      const copies=Array.from(document.querySelectorAll<HTMLElement>(".chapter-copy"));
      const sync = (self: ScrollTrigger) => {
        const y=self.scroll();
        copies.forEach(el=>{const top=el.closest("section")!.getBoundingClientRect().top; const reveal=reduce?1:Math.max(0,Math.min(1,(window.innerHeight*.88-top)/(window.innerHeight*.38))); el.style.setProperty("--reveal",String(reveal)); el.closest<HTMLElement>("section")!.style.setProperty("--caption",String(Math.max(0,1-Math.abs(top)/(window.innerHeight*.3))));});
        const assemblyLength=assembly.end-assembly.start;
        const consumed=Math.min(assemblyLength,Math.max(0,y-assembly.start));
        state.current.progress=Math.min(4,Math.max(0,(Math.min(y,logistics.start)-consumed)/(logistics.start-assemblyLength)*4));
        state.current.assemblyProgress=Math.max(0,Math.min(1,(y-assembly.start)/assemblyLength));
        state.current.logisticsProgress=Math.max(0,Math.min(1,(y-logistics.start)/(logistics.end-logistics.start)));
        state.current.assemblyActive=y>=assembly.start&&y<=assembly.end;
        state.current.logisticsActive=y>=logistics.start;
        document.getElementById('assembly')?.setAttribute('data-animation-progress',state.current.assemblyProgress.toFixed(4));
        document.getElementById('logistics')?.setAttribute('data-animation-progress',state.current.logisticsProgress.toFixed(4));
        const stage=document.getElementById('logistics-stage');
        const lp=state.current.logisticsProgress;
        const textPhase=(start:number,end:number)=>{const t=Math.max(0,Math.min(1,(lp-start)/(end-start)));return t*t*(3-2*t);};
        const copy=1-textPhase(.85,.9),closing=textPhase(.92,.97),quote=textPhase(.75,.88);
        const style=document.documentElement.style;
        style.setProperty("--logistics-copy",String(copy));
        style.setProperty("--logistics-copy-visibility",copy>0?"visible":"hidden");
        style.setProperty("--closing",String(closing));
        style.setProperty("--closing-visibility",closing>0?"visible":"hidden");
        style.setProperty("--quote",String(quote));
        style.setProperty("--quote-visibility",quote>0?"visible":"hidden");
        if(stage)stage.textContent=lp<.3?'01 / LOAD':lp<.45?'01 / TRANSPORT':lp<.76?'02 / DEPLOY':lp<.91?'03 / READY':'04 / TAKEOFF';
        const next = Math.min(4, Math.round(state.current.progress));
        if (next !== chapterIndex.current) {chapterIndex.current = next; setChapter(next);}
        document.documentElement.style.setProperty('--progress', `${self.progress * 100}%`);
      };
      const trigger = ScrollTrigger.create({trigger: 'main', start: 'top top', end: 'bottom bottom', onUpdate: sync, onRefresh: sync});
      sync(trigger);
      const navigation=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
      if(navigation?.type==='reload'&&!restorationAttempted){
        restorationAttempted=true;
        try{
          const saved=JSON.parse(sessionStorage.getItem('ci2p-scroll')??'null');
          if(saved?.href===location.href&&Number.isFinite(saved.y))restoreFrame=requestAnimationFrame(()=>{
            restoreFrame=requestAnimationFrame(()=>{window.scrollTo({top:saved.y,behavior:'instant'});ScrollTrigger.update();sync(trigger);});
          });
        }catch{/* A fresh page remains usable without saved state. */}
      }

    });
    return () => {cancelAnimationFrame(restoreFrame);window.removeEventListener('pagehide',saveScroll);media.revert();};
  }, []);
  return {state, chapter};
}








