import { lazy, Suspense } from 'react';
import { useScrollExperience } from './hooks/useScrollExperience';
const Experience=lazy(()=>import('./components/Experience/Experience'));
const chapters=['INTRODUCTION','PRODUCTION','ASSEMBLY','READY','LOGISTICS'];
const ids=['introduction','production','assembly-entry','ready','logistics-entry'];
export default function App(){
  const {state,chapter}=useScrollExperience();
  return <><a className="skip-link" href="#production">Passer à la présentation</a><Suspense fallback={<div className="loading-scene" aria-label="Chargement de la présentation"/>}><Experience state={state}/></Suspense>
    <header><a href="#introduction" className="wordmark" aria-label="CI2P — Introduction">CI2P<span/></a><div className="header-description">CAPACITÉ INDUSTRIELLE<br/>PROJETABLE DE PRODUCTION</div><a className="header-link" href="#production">EXPLORER LE PROJET <span>↗</span></a></header>
    <nav className="chapter-nav" aria-label="Chapitres">{chapters.map((label,i)=><a key={label} href={`#${ids[i]}`} aria-label={`${i.toString().padStart(2,'0')} ${label}`} aria-current={chapter===i?'location':undefined}><span>{label}</span><i/></a>)}</nav>
    <main>
      <section id="introduction" className="hero"><div className="hero-heading hero-reveal"><p className="eyebrow"><span className="status-dot"/> UNE CAPACITÉ. UN NOUVEAU PARADIGME.</p><h1>CI2P<span className="title-dot">.</span></h1></div><div className="hero-bottom"><div className="hero-reveal"><p className="hero-purpose">CAPACITÉ INDUSTRIELLE<br/>PROJETABLE DE PRODUCTION</p><p className="hero-verbs">Produire. Assembler. <em>Régénérer.</em></p></div><a href="#production" className="scroll-cue hero-reveal"><span>DÉFILER POUR EXPLORER</span><b>↓</b></a><p className="hero-caption hero-reveal">DÉMONSTRATEUR FPV<br/><span>ARCHITECTURE MODULAIRE</span></p></div></section>
      <section id="production"><div className="chapter-copy"><p className="eyebrow"><span>01</span> / PRODUCTION</p><h2>FROM RAW MATERIAL<br/><em>TO OPERATIONAL<br/>CAPABILITY.</em></h2><p className="description">Une capacité industrielle mobile fondée sur l’injection plastique pour produire localement des pièces robustes, répétables et adaptées à la production en volume.</p><p className="detail-label">INJECTION PLASTIQUE <span>—</span> PRODUCTION LOCALE</p></div><div className="scene-caption">01—A <span>UNITÉ DE PRODUCTION MOBILE</span></div></section>
      <span id="assembly-entry" className="chapter-entry" aria-hidden="true"/><section id="assembly"><div className="chapter-copy"><p className="eyebrow"><span>02</span> / ASSEMBLY</p><h2>ASSEMBLED<br/><em>IN &lt; 10 MIN</em></h2><p className="description">Une architecture simple et robuste pensée pour un assemblage rapide au plus près du terrain.</p><p className="detail-label">OBJECTIF D’ASSEMBLAGE <span>—</span> MOINS DE DIX MINUTES</p></div><div className="scene-caption">02—A <span>ATELIER MOBILE EXTENSIBLE</span></div></section>
      <section id="ready"><div className="chapter-copy"><p className="eyebrow"><span>03</span> / READY</p><h2>READY<br/><em>FOR DEPLOYMENT</em></h2><p className="detail-label">DÉMONSTRATEUR FPV <span>—</span> CI2P</p></div><div className="scene-caption">03—A <span>DE LA PIÈCE AU SYSTÈME</span></div></section>
      <span id="logistics-entry" className="chapter-entry" aria-hidden="true"/><section id="logistics"><div className="chapter-copy"><p className="eyebrow"><span>04</span> / LOGISTICS</p><h2>FROM PRODUCTION<br/><em>TO DEPLOYMENT.</em></h2><p className="description">Une capacité mobile, projetable et conçue pour accompagner la régénération locale.</p><p id="logistics-stage" className="detail-label">01 / LOAD</p></div><div className="closing-signature"><a href="#introduction" className="closing-mark" aria-label="CI2P — Revenir au début">CI2P<span>.</span></a><p>CAPACITÉ INDUSTRIELLE<br/>PROJETABLE DE PRODUCTION</p><span className="closing-verbs">PRODUIRE. ASSEMBLER. RÉGÉNÉRER.</span></div><blockquote className="closing-quote"><span>« Faire</span>{" "}<span>au lieu de faire faire. »</span></blockquote></section>
    </main><div className="progress-track"><div/></div><div className="chapter-counter"><span>{String(chapter).padStart(2,'0')}</span><i/>04</div>
  </>;
}




