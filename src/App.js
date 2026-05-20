import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #04060f;
      --bg2:      #070b16;
      --bg3:      #0a0f1e;
      --cyan:     #22d3ee;
      --cyan2:    #06b6d4;
      --cyan3:    #0891b2;
      --blue:     #3b82f6;
      --indigo:   #6366f1;
      --white:    #f8faff;
      --off:      #cbd5e1;
      --muted:    #64748b;
      --border:   rgba(34,211,238,0.10);
      --border2:  rgba(34,211,238,0.22);
      --glow-sm:  0 0 20px rgba(34,211,238,0.12);
      --glow-md:  0 0 40px rgba(34,211,238,0.20);
      --card:     rgba(7,11,22,0.82);
      --font-h:   'Outfit', sans-serif;
      --font-b:   'Space Grotesk', sans-serif;
      --font-m:   'JetBrains Mono', monospace;
      --r:        6px;
    }

    html { scroll-behavior: smooth; font-size: 16px; }
    body { background: var(--bg); color: var(--white); font-family: var(--font-b); overflow-x: hidden; cursor: none; }

    /* cursor */
    #c-dot, #c-ring { position: fixed; top: 0; left: 0; pointer-events: none; border-radius: 50%; z-index: 9999; will-change: transform; }
    #c-dot  { width: 6px; height: 6px; background: var(--cyan); margin: -3px 0 0 -3px; transition: transform .05s; }
    #c-ring { width: 32px; height: 32px; border: 1.5px solid rgba(34,211,238,0.50); margin: -16px 0 0 -16px; transition: width .25s, height .25s, border-color .25s; }
    body.ha #c-ring { width: 48px; height: 48px; border-color: var(--cyan); }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: var(--cyan3); border-radius: 2px; }
    ::selection { background: rgba(34,211,238,0.18); }

    /* NAV */
    nav {
      position: fixed; top: 0; inset-x: 0; z-index: 200;
      display: flex; align-items: center;
      gap: 0;
      padding: 0 48px;
      height: 64px;
      background: rgba(4,6,15,0.65);
      backdrop-filter: blur(24px) saturate(150%);
      border-bottom: 1px solid var(--border);
      transition: height .3s, background .3s;
    }
    nav.sc { height: 52px; background: rgba(4,6,15,0.85); }

    /* Logo zone — fixed width so links always start at same spot */
    .nav-logo {
      display: flex; align-items: center; gap: 10px; text-decoration: none;
      flex-shrink: 0;
      padding-right: 32px;
      margin-right: 8px;
      border-right: 1px solid var(--border);
    }
    .nav-logo-name {
      font-family: var(--font-h); font-weight: 900; font-size: 1.05rem;
      letter-spacing: -.5px; color: var(--white);
    }
    .nav-logo-name span { color: var(--cyan); }

    /* Links centered in the remaining space */
    .nav-links {
      display: flex; gap: 0; list-style: none;
      flex: 1;
      justify-content: center;
    }
    .nav-links a {
      font-family: var(--font-m); font-size: .63rem; letter-spacing: 1.4px; text-transform: uppercase;
      color: var(--muted); text-decoration: none; position: relative; transition: color .2s;
      padding: 0 14px; height: 64px; display: flex; align-items: center;
    }
    nav.sc .nav-links a { height: 52px; }
    .nav-links a::after {
      content: ''; position: absolute; bottom: 0; left: 14px; right: 14px;
      height: 2px; background: var(--cyan);
      transform: scaleX(0); transform-origin: center; transition: transform .28s;
    }
    .nav-links a:hover { color: var(--cyan); }
    .nav-links a:hover::after { transform: scaleX(1); }

    /* Resume button — same style as hero btn-s */
    .nav-cta-wrap {
      flex-shrink: 0;
      padding-left: 28px;
      margin-left: 8px;
      border-left: 1px solid var(--border);
      display: flex; align-items: center;
    }
    .nav-cta {
      padding: 9px 22px;
      background: transparent;
      color: var(--off);
      font-family: var(--font-m); font-size: .63rem; font-weight: 600;
      letter-spacing: 2px; text-transform: uppercase;
      border: 1px solid rgba(248,250,255,0.18);
      border-radius: var(--r);
      cursor: none; text-decoration: none;
      display: inline-flex; align-items: center; gap: 7px;
      transition: border-color .2s, color .2s, transform .2s;
      white-space: nowrap;
    }
    .nav-cta:hover { border-color: var(--cyan); color: var(--cyan); transform: translateY(-2px); }

    section { position: relative; overflow: hidden; z-index: 1; }

    /* HERO */
    #hero {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 55% 45%;
      grid-template-rows: 1fr;
      align-items: center;
      padding: 100px 64px 80px;
      position: relative;
    }
    .hero-left { position: relative; z-index: 2; padding-right: 24px; max-width: 100%; overflow: hidden; }
    .hero-right { position: relative; height: 100vh; min-height: 600px; overflow: hidden; }
    .hero-right canvas { display: block; }
    .hero-quote { font-family: var(--font-m); font-size: clamp(.72rem, 1.2vw, .88rem); letter-spacing: 2px; color: var(--muted); margin-bottom: 28px; display: flex; align-items: center; gap: 10px; animation: fu .7s .1s both; }
    .hero-quote-mark { font-family: var(--font-h); font-size: 1.8rem; color: var(--cyan); line-height: 1; opacity: .7; font-weight: 900; }
    .hero-name { font-family: var(--font-h); font-size: clamp(2.8rem, 5.8vw, 5.6rem); font-weight: 900; line-height: .92; letter-spacing: -3px; animation: fu .7s .25s both; }
    .hero-name .cyan { color: var(--cyan); display: block; }
    .hero-row { display: flex; align-items: center; gap: 18px; margin-top: 30px; animation: fu .7s .4s both; }
    .hero-line { width: 48px; height: 1px; background: var(--muted); flex-shrink: 0; }
    .hero-sub { font-family: var(--font-m); font-size: clamp(.78rem, 1.5vw, .98rem); color: var(--muted); letter-spacing: 1px; }
    .hero-sub .tc { color: var(--off); }
    .hero-cta { display: flex; gap: 14px; margin-top: 50px; flex-wrap: wrap; animation: fu .7s .55s both; }
    .btn-p { padding: 13px 32px; background: var(--cyan); color: #030810; font-family: var(--font-m); font-size: .7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; border: none; border-radius: var(--r); cursor: none; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background .2s, transform .2s, box-shadow .2s; }
    .btn-p:hover { background: var(--cyan2); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(34,211,238,0.28); }
    .btn-s { padding: 13px 32px; background: transparent; color: var(--off); font-family: var(--font-m); font-size: .7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(248,250,255,0.18); border-radius: var(--r); cursor: none; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: border-color .2s, color .2s, transform .2s; }
    .btn-s:hover { border-color: var(--cyan); color: var(--cyan); transform: translateY(-3px); }
    .scroll-hint { position: absolute; bottom: 36px; left: 64px; font-family: var(--font-m); font-size: .6rem; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 12px; animation: fu .7s .8s both; grid-column: 1 / -1; align-self: end; z-index: 3; }
    .scroll-line { width: 36px; height: 1px; background: var(--muted); animation: sp 2s ease-in-out infinite; }

    /* COMMON SECTION */
    .sw { max-width: 1100px; margin: 0 auto; }
    .sl { font-family: var(--font-m); font-size: .62rem; letter-spacing: 4px; text-transform: uppercase; color: var(--cyan); margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
    .sl::before { content: '//'; color: rgba(34,211,238,0.35); }
    .st { font-family: var(--font-h); font-size: clamp(2rem, 4.5vw, 3.5rem); font-weight: 800; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 56px; }

    /* ABOUT */
    #about { padding: 120px 64px; }
    .about-g { display: grid; grid-template-columns: 1fr 440px; gap: 72px; align-items: start; }
    .at { font-size: 1.02rem; color: var(--off); line-height: 1.85; font-weight: 300; }
    .at + .at { margin-top: 18px; }
    .at strong { color: var(--cyan); font-weight: 600; }
    .ab-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 38px; }
    .sc { border: 1px solid var(--border); border-radius: var(--r); padding: 20px; background: var(--card); backdrop-filter: blur(10px); transition: border-color .3s, transform .3s, box-shadow .3s; }
    .sc:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: var(--glow-sm); }
    .sn { font-family: var(--font-h); font-size: 2.4rem; font-weight: 900; color: var(--cyan); letter-spacing: -2px; line-height: 1; }
    .sl2 { font-family: var(--font-m); font-size: .58rem; letter-spacing: 2px; color: var(--muted); margin-top: 5px; text-transform: uppercase; }
    .right-col { display: flex; flex-direction: column; gap: 18px; }
    .photo-ph { width: 100%; aspect-ratio: 3/4; border: 1px dashed rgba(34,211,238,0.25); border-radius: var(--r); background: linear-gradient(135deg, rgba(10,15,30,0.9) 0%, rgba(34,211,238,0.03) 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; position: relative; overflow: hidden; transition: border-color .3s; }
    .photo-ph:hover { border-color: rgba(34,211,238,0.4); }
    .photo-ph::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent 0, transparent 12px, rgba(34,211,238,0.015) 12px, rgba(34,211,238,0.015) 13px); }
    .photo-ring { width: 80px; height: 80px; border-radius: 50%; border: 1px dashed rgba(34,211,238,0.3); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
    .photo-lbl { font-family: var(--font-m); font-size: .62rem; letter-spacing: 2px; color: var(--muted); text-align: center; position: relative; z-index: 1; line-height: 1.6; }
    .term-card { border: 1px solid var(--border); border-radius: var(--r); background: var(--card); backdrop-filter: blur(14px); padding: 22px; }
    .term-hdr { display: flex; align-items: center; gap: 7px; margin-bottom: 16px; }
    .td { width: 10px; height: 10px; border-radius: 50%; }
    .term-bd { font-family: var(--font-m); font-size: .73rem; line-height: 1.95; }
    .tc2 { color: var(--cyan); } .to { color: rgba(248,250,255,0.72); } .tm { color: var(--muted); }

    /* EDUCATION */
    #education { padding: 100px 64px; background: linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.018) 50%, transparent 100%); }
    .edu-g { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .edu-c { border: 1px solid var(--border); border-radius: var(--r); background: var(--card); backdrop-filter: blur(12px); padding: 30px; position: relative; overflow: hidden; transition: border-color .3s, transform .3s, box-shadow .3s; }
    .edu-c::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0; transition: opacity .3s; }
    .edu-c:hover { border-color: var(--border2); transform: translateY(-5px); box-shadow: var(--glow-sm); }
    .edu-c:hover::after { opacity: 1; }
    .edu-d { font-family: var(--font-h); font-size: 1.12rem; font-weight: 700; margin-bottom: 5px; }
    .edu-s { font-family: var(--font-m); font-size: .68rem; letter-spacing: 1.5px; color: var(--cyan); margin-bottom: 4px; text-transform: uppercase; }
    .edu-p { font-family: var(--font-m); font-size: .62rem; color: var(--muted); margin-bottom: 14px; }
    .edu-gpa { font-family: var(--font-h); font-size: 2.2rem; font-weight: 900; color: var(--cyan); letter-spacing: -1px; line-height: 1; }
    .edu-gl { font-family: var(--font-m); font-size: .58rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-top: 3px; }
    .edu-tags { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 6px; }
    .edu-tag { font-family: var(--font-m); font-size: .6rem; letter-spacing: .8px; padding: 4px 10px; border: 1px solid var(--border); border-radius: 2px; color: var(--muted); transition: border-color .2s, color .2s; }
    .edu-c:hover .edu-tag { border-color: rgba(34,211,238,0.2); color: rgba(248,250,255,0.6); }
    .edu-n { font-family: var(--font-h); font-size: 5.5rem; font-weight: 900; color: rgba(34,211,238,0.04); position: absolute; right: 14px; bottom: -10px; letter-spacing: -4px; line-height: 1; }

    /* EXPERIENCE */
    #experience { padding: 100px 64px; }
    .tl { position: relative; }
    .tl::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, var(--cyan3) 20%, var(--cyan3) 80%, transparent); }
    .ei { padding-left: 42px; margin-bottom: 54px; position: relative; }
    .edot { position: absolute; left: -6px; top: 7px; width: 13px; height: 13px; border-radius: 50%; background: var(--bg); border: 2px solid var(--cyan); box-shadow: 0 0 10px rgba(34,211,238,0.4); transition: box-shadow .3s; }
    .ei:hover .edot { box-shadow: 0 0 22px rgba(34,211,238,0.8); }
    .ei-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 4px; }
    .ei-role { font-family: var(--font-h); font-size: 1.28rem; font-weight: 700; letter-spacing: -.3px; }
    .ei-period { font-family: var(--font-m); font-size: .6rem; letter-spacing: 1.5px; color: var(--muted); white-space: nowrap; margin-top: 4px; }
    .ei-co { font-family: var(--font-m); font-size: .68rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
    .ei-pts { list-style: none; }
    .ei-pts li { font-size: .93rem; color: var(--off); line-height: 1.78; margin-bottom: 9px; padding-left: 18px; position: relative; font-weight: 300; }
    .ei-pts li::before { content: '▸'; position: absolute; left: 0; color: var(--cyan); font-size: .72rem; top: 3px; }
    .ei-pts strong { color: var(--white); font-weight: 500; }

    /* PROJECTS */
    #projects { padding: 100px 64px; background: linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.015) 50%, transparent 100%); }
    .pg { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .pc { border: 1px solid var(--border); border-radius: var(--r); background: var(--card); backdrop-filter: blur(12px); padding: 30px; position: relative; overflow: hidden; transition: border-color .3s, transform .35s, box-shadow .3s; cursor: none; }
    .pc:hover { border-color: rgba(34,211,238,0.35); transform: translateY(-7px); box-shadow: var(--glow-md); }
    .pn { font-family: var(--font-h); font-size: 4.5rem; font-weight: 900; color: rgba(34,211,238,0.045); position: absolute; top: 10px; right: 18px; letter-spacing: -3px; line-height: 1; }
    .pt { font-family: var(--font-m); font-size: .6rem; letter-spacing: 2px; text-transform: uppercase; color: var(--cyan); margin-bottom: 9px; }
    .ptitle { font-family: var(--font-h); font-size: 1.42rem; font-weight: 700; letter-spacing: -.4px; margin-bottom: 10px; }
    .pd { font-size: .88rem; color: var(--muted); line-height: 1.75; margin-bottom: 20px; font-weight: 300; }
    .pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .pill { font-family: var(--font-m); font-size: .58rem; letter-spacing: .8px; padding: 4px 10px; background: rgba(34,211,238,0.05); border: 1px solid rgba(34,211,238,0.14); border-radius: 2px; color: var(--cyan2); }
    .pl { display: flex; gap: 12px; margin-top: 18px; }
    .plk { font-family: var(--font-m); font-size: .6rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color .2s; display: flex; align-items: center; gap: 5px; }
    .plk:hover { color: var(--cyan); }

    /* SKILLS */
    #skills { padding: 100px 64px; }
    .skg { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 18px; }
    .skgr { border: 1px solid var(--border); border-radius: var(--r); background: var(--card); backdrop-filter: blur(12px); padding: 26px; transition: border-color .3s, transform .3s; }
    .skgr:hover { border-color: var(--border2); transform: translateY(-4px); }
    .skgt { font-family: var(--font-m); font-size: .62rem; letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
    .skt { display: flex; flex-wrap: wrap; gap: 7px; }
    .sktag { font-family: var(--font-m); font-size: .62rem; letter-spacing: .5px; padding: 5px 11px; border: 1px solid var(--border); border-radius: 3px; color: var(--off); transition: border-color .2s, color .2s, background .2s; }
    .sktag:hover { border-color: var(--cyan); color: var(--cyan); background: rgba(34,211,238,0.04); }

    /* CERTIFICATIONS */
    #certifications { padding: 100px 64px; background: linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.015) 50%, transparent 100%); }
    .certg { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .certc { border: 1px solid var(--border); border-radius: var(--r); background: var(--card); backdrop-filter: blur(12px); padding: 24px 26px; display: flex; align-items: flex-start; gap: 16px; transition: border-color .3s, transform .3s, box-shadow .3s; }
    .certc:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: var(--glow-sm); }
    .certi { width: 40px; height: 40px; border-radius: 8px; background: rgba(34,211,238,0.07); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.2rem; }
    .certn { font-family: var(--font-b); font-size: .93rem; font-weight: 600; margin-bottom: 4px; }
    .certb { font-family: var(--font-m); font-size: .62rem; letter-spacing: 1.5px; color: var(--cyan); margin-bottom: 3px; text-transform: uppercase; }
    .certy { font-family: var(--font-m); font-size: .58rem; color: var(--muted); }

    /* ACHIEVEMENTS */
    #achievements { padding: 100px 64px; }
    .achg { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
    .achi { border: 1px solid var(--border); border-radius: var(--r); background: var(--card); backdrop-filter: blur(10px); padding: 18px 22px; display: flex; align-items: flex-start; gap: 13px; transition: border-color .3s, transform .2s; }
    .achi:hover { border-color: var(--border2); transform: translateX(4px); }
    .achico { font-size: 1.15rem; flex-shrink: 0; margin-top: 1px; }
    .acht { font-size: .9rem; color: var(--off); line-height: 1.55; font-weight: 300; }
    .acht strong { color: var(--white); font-weight: 500; }

    /* CONTACT */
    #contact { padding: 120px 64px; text-align: center; }
    .cglow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 700px; height: 500px; background: radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%); pointer-events: none; }
    .ci { position: relative; z-index: 2; }
    .ctitle { font-family: var(--font-h); font-size: clamp(2.8rem, 6.5vw, 5.5rem); font-weight: 900; letter-spacing: -2.5px; margin-bottom: 18px; }
    .csub { font-size: 1rem; color: var(--muted); max-width: 480px; margin: 0 auto 44px; line-height: 1.75; }
    .cemail { font-family: var(--font-h); font-size: clamp(1.1rem, 2.5vw, 1.7rem); font-weight: 700; letter-spacing: -.5px; color: var(--white); text-decoration: none; border-bottom: 2px solid var(--cyan); padding-bottom: 3px; display: inline-block; margin-bottom: 48px; transition: color .2s; }
    .cemail:hover { color: var(--cyan); }
    .clinks { display: flex; gap: 13px; justify-content: center; flex-wrap: wrap; }
    .clk { font-family: var(--font-m); font-size: .65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); text-decoration: none; display: flex; align-items: center; gap: 8px; padding: 11px 20px; border: 1px solid var(--border); border-radius: var(--r); transition: color .2s, border-color .2s, transform .2s, box-shadow .2s; }
    .clk:hover { color: var(--cyan); border-color: var(--border2); transform: translateY(-3px); box-shadow: var(--glow-sm); }
    footer { text-align: center; font-family: var(--font-m); font-size: .6rem; letter-spacing: 2px; color: var(--muted); padding: 28px; border-top: 1px solid var(--border); }

    /* ANIMATIONS */
    @keyframes fu    { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes sp    { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 20px rgba(34,211,238,.35); } 50% { box-shadow: 0 0 40px rgba(34,211,238,.7); } }
    @keyframes gridS { from { transform: translateY(0); } to { transform: translateY(64px); } }

    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
    .reveal.in { opacity: 1; transform: none; }
    .d1 { transition-delay: .1s; } .d2 { transition-delay: .2s; } .d3 { transition-delay: .3s; } .d4 { transition-delay: .4s; }

    @media (max-width: 1024px) {
      nav, nav.sc { padding: 0 20px; height: 56px; }
      .nav-links, .nav-cta-wrap { display: none; }
      .nav-logo { padding-right: 0; margin-right: 0; border-right: none; }
      #hero { grid-template-columns: 1fr; padding: 100px 24px 80px; }
      .hero-right { display: none; }
      .hero-left { padding-right: 0; }
      #about, #education, #experience, #projects, #skills, #certifications, #achievements, #contact { padding-left: 24px; padding-right: 24px; }
      .about-g { grid-template-columns: 1fr; }
      .right-col, .edu-g { display: block; }
      .edu-g .edu-c { margin-bottom: 14px; }
      .achg { grid-template-columns: 1fr; }
      .scroll-hint { left: 24px; }
    }
  `}</style>
);

/* ── BACKGROUND ── */
function GridBg() {
  return <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(34,211,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.025) 1px,transparent 1px)`, backgroundSize: "64px 64px", animation: "gridS 10s linear infinite" }} />;
}

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext("2d"); let id;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 55;
    const pts = Array.from({ length: N }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22 }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2); ctx.fillStyle = "rgba(34,211,238,0.45)"; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(34,211,238,${.055 * (1 - d / 110)})`; ctx.lineWidth = .5; ctx.stroke(); }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: .55 }} />;
}

/* ── LOGO ── */
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" /><stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="g2" x1="60" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" stopOpacity=".25" /><stop offset="1" stopColor="#6366f1" stopOpacity=".12" />
        </linearGradient>
      </defs>
      {/* Hexagon shell */}
      <path d="M30 3L55 16.5V43.5L30 57L5 43.5V16.5L30 3Z" stroke="url(#g1)" strokeWidth="1.4" fill="url(#g2)" />
      {/* Inner hex ring */}
      <path d="M30 11L48 21V41L30 51L12 41V21L30 11Z" stroke="rgba(34,211,238,0.18)" strokeWidth=".8" fill="none" />
      {/* A letterform */}
      <path d="M21 43L30 17L39 43" stroke="url(#g1)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24.5 36H35.5" stroke="url(#g1)" strokeWidth="2.2" strokeLinecap="round" />
      {/* apex glow dot */}
      <circle cx="30" cy="17" r="2.8" fill="#22d3ee" />
      {/* vertex accents */}
      <circle cx="5"  cy="16.5" r="1.8" fill="#22d3ee" opacity=".55" />
      <circle cx="55" cy="16.5" r="1.8" fill="#22d3ee" opacity=".55" />
      <circle cx="30" cy="57"   r="1.8" fill="#22d3ee" opacity=".55" />
    </svg>
  );
}

/* ── THREE.JS HERO SCENE ── */
/* ── THREE.JS HERO SCENE — Solar System ── */
function HeroThreeScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let animId, cleanupFn;

    const init = (THREE) => {
      const W = el.clientWidth, H = el.clientHeight;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Narrow FOV + camera pulled back = less distortion, tighter scene
      const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 200);
      camera.position.set(0, 0, 11);

      // ── Planet group — offset right so it stays in right column ──
      const planet = new THREE.Group();
      planet.position.set(0.8, 0, 0); // slight right offset within its own canvas
      scene.add(planet);

      // 1. Dark planet body
      const bodyGeo = new THREE.SphereGeometry(0.80, 64, 64);
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0x071220 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      planet.add(body);

      // 2. Surface detail — very fine wireframe overlay gives texture
      const surfGeo = new THREE.IcosahedronGeometry(0.81, 5);
      const surfMat = new THREE.MeshBasicMaterial({
        color: 0x0e7a8f, wireframe: true, transparent: true, opacity: 0.12,
      });
      planet.add(new THREE.Mesh(surfGeo, surfMat));

      // 3. Thin bright rim / terminator line — sphere slightly larger, show only edge
      const rimGeo = new THREE.SphereGeometry(0.82, 64, 64);
      const rimMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee, transparent: true, opacity: 0.18, wireframe: false,
      });
      planet.add(new THREE.Mesh(rimGeo, rimMat));

      // 4. Inner atmosphere glow (thin shell)
      const atmo1Geo = new THREE.SphereGeometry(0.90, 32, 32);
      const atmo1Mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.06 });
      planet.add(new THREE.Mesh(atmo1Geo, atmo1Mat));

      // 5. Outer atmosphere haze
      const atmo2Geo = new THREE.SphereGeometry(1.05, 32, 32);
      const atmo2Mat = new THREE.MeshBasicMaterial({ color: 0x0891b2, transparent: true, opacity: 0.03 });
      planet.add(new THREE.Mesh(atmo2Geo, atmo2Mat));

      // ── Rings group shares the same centre as planet ──
      const rings = new THREE.Group();
      rings.position.copy(planet.position);
      scene.add(rings);

      // Ring definitions — tighter radii, varied tilts for 3D depth
      const ringDefs = [
        { rx: 1.55, ry: 0.50, tiltX: 1.25,  tiltY: 0.10,  tiltZ: 0.0,   color: 0x22d3ee, op: 0.55 },
        { rx: 2.00, ry: 0.65, tiltX: 1.05,  tiltY: 0.50,  tiltZ: 0.15,  color: 0x3b82f6, op: 0.40 },
        { rx: 2.55, ry: 0.85, tiltX: 1.60,  tiltY: -0.30, tiltZ: 0.30,  color: 0x22d3ee, op: 0.28 },
        { rx: 3.10, ry: 1.05, tiltX: 0.80,  tiltY: 0.70,  tiltZ: -0.20, color: 0x6366f1, op: 0.20 },
        { rx: 3.70, ry: 1.30, tiltX: 1.85,  tiltY: -0.50, tiltZ: 0.40,  color: 0x3b82f6, op: 0.14 },
      ];

      const ellipseMeshes = ringDefs.map(rd => {
        const pts = [];
        for (let i = 0; i <= 160; i++) {
          const θ = (i / 160) * Math.PI * 2;
          pts.push(new THREE.Vector3(rd.rx * Math.cos(θ), rd.ry * Math.sin(θ), 0));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: rd.color, transparent: true, opacity: rd.op });
        const ring = new THREE.LineLoop(geo, mat);
        ring.rotation.set(rd.tiltX, rd.tiltY, rd.tiltZ);
        rings.add(ring);
        return ring;
      });

      // ── Orbiting dots — one per ring ──
      const dotData = [
        { size: 0.072, color: 0x22d3ee, speed: 0.60, angle: 0.0 },
        { size: 0.058, color: 0x3b82f6, speed: 0.42, angle: 2.1 },
        { size: 0.050, color: 0x22d3ee, speed: 0.30, angle: 3.9 },
        { size: 0.042, color: 0x6366f1, speed: 0.22, angle: 1.3 },
        { size: 0.036, color: 0x3b82f6, speed: 0.16, angle: 4.7 },
      ];

      const orbitDots = ringDefs.map((rd, i) => {
        const d = dotData[i];
        const g = new THREE.SphereGeometry(d.size, 10, 10);
        const m = new THREE.MeshBasicMaterial({ color: d.color });
        const dot = new THREE.Mesh(g, m);
        // Dots added to scene (not rings group) so position is in world space
        scene.add(dot);
        return { dot, rd, angle: d.angle, speed: d.speed };
      });

      // ── Starfield ──
      const starCount = 300;
      const sp = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const θ = Math.random() * Math.PI * 2;
        const φ = Math.acos(2 * Math.random() - 1);
        const r = 8 + Math.random() * 7;
        sp[i*3]   = r * Math.sin(φ) * Math.cos(θ);
        sp[i*3+1] = r * Math.sin(φ) * Math.sin(θ);
        sp[i*3+2] = r * Math.cos(φ);
      }
      const sGeo = new THREE.BufferGeometry();
      sGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
      const sMat = new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.022, transparent: true, opacity: 0.50 });
      const stars = new THREE.Points(sGeo, sMat);
      scene.add(stars);

      // ── Mouse parallax ──
      let mx = 0, my = 0;
      const onMouse = e => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse);

      const onResize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Mouse tilt on entire scene
        scene.rotation.y += (mx * 0.14 - scene.rotation.y) * 0.032;
        scene.rotation.x += (-my * 0.08 - scene.rotation.x) * 0.032;

        // Planet slow self-rotation
        body.rotation.y += 0.003;
        surfGeo && (planet.children[1].rotation.y += 0.002);

        // Stars slow drift
        stars.rotation.y += 0.0004;

        // Orbit dots follow their ellipse
        orbitDots.forEach(od => {
          od.angle += od.speed * 0.008;
          const lx = od.rd.rx * Math.cos(od.angle);
          const ly = od.rd.ry * Math.sin(od.angle);
          const v = new THREE.Vector3(lx, ly, 0);
          v.applyEuler(new THREE.Euler(od.rd.tiltX, od.rd.tiltY, od.rd.tiltZ));
          // Offset by planet position + scene rotation handled by scene group
          od.dot.position.set(
            v.x + planet.position.x,
            v.y + planet.position.y,
            v.z + planet.position.z
          );
        });

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    if (window.THREE) {
      cleanupFn = init(window.THREE);
      return () => cleanupFn && cleanupFn();
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => { cleanupFn = init(window.THREE); };
    document.head.appendChild(script);
    return () => { cancelAnimationFrame(animId); cleanupFn && cleanupFn(); };
  }, []);

  return (
    <div ref={mountRef} style={{
      width: "100%", height: "100%",
      position: "absolute", inset: 0,
      zIndex: 1, pointerEvents: "none",
    }} />
  );
}

/* ── THREE.JS SKILLS BACKGROUND ── */
function SkillsThreeScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let animId;

    const init = (THREE) => {
      const W = el.clientWidth, H = el.clientHeight;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.set(0, 0, 5);

      // Torus knot
      const tkGeo = new THREE.TorusKnotGeometry(1.6, 0.35, 160, 12, 2, 3);
      const tkMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.13,
      });
      const tk = new THREE.Mesh(tkGeo, tkMat);
      scene.add(tk);

      // Second outer ring
      const rGeo = new THREE.TorusGeometry(2.8, 0.005, 2, 140);
      const rMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.18 });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI / 4;
      scene.add(ring);

      const onResize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        tk.rotation.x += 0.004;
        tk.rotation.y += 0.006;
        ring.rotation.z += 0.003;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    if (window.THREE) { const c = init(window.THREE); return c; }
    // Three.js already loaded by HeroThreeScene, wait briefly
    const t = setTimeout(() => { if (window.THREE) init(window.THREE); }, 1500);
    return () => { clearTimeout(t); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7,
    }} />
  );
}

/* ── THREE.JS CONTACT SCENE ── */
function ContactThreeScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let animId;

    const init = (THREE) => {
      const W = el.clientWidth, H = el.clientHeight;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.set(0, 0, 6);

      // Icosahedron with different detail
      const geo = new THREE.IcosahedronGeometry(2.2, 2);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.09,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const geo2 = new THREE.OctahedronGeometry(3, 0);
      const mat2 = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.07 });
      const mesh2 = new THREE.Mesh(geo2, mat2);
      scene.add(mesh2);

      const onResize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        mesh.rotation.x  += 0.003; mesh.rotation.y  += 0.005;
        mesh2.rotation.x -= 0.002; mesh2.rotation.y -= 0.004;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    const t = setTimeout(() => { if (window.THREE) init(window.THREE); }, 2000);
    return () => { clearTimeout(t); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.8,
    }} />
  );
}

/* ── CURSOR ── */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    let rx = 0, ry = 0, dx = 0, dy = 0, id;
    const move = e => { dx = e.clientX; dy = e.clientY; if (dot.current) dot.current.style.transform = `translate(${dx}px,${dy}px)`; };
    const lerp = () => { rx += (dx - rx) * .12; ry += (dy - ry) * .12; if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`; id = requestAnimationFrame(lerp); };
    lerp();
    const over = e => { if (e.target.closest("a,button")) document.body.classList.add("ha"); };
    const out  = () => document.body.classList.remove("ha");
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { cancelAnimationFrame(id); window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, []);
  return <><div id="c-dot" ref={dot} /><div id="c-ring" ref={ring} /></>;
}

/* ── TYPED ── */
function Typed({ strings, speed = 75, pause = 2200 }) {
  const [text, setText] = useState("");
  const [si, setSi] = useState(0); const [ci, setCi] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const s = strings[si]; let t;
    if (!del && ci < s.length)     t = setTimeout(() => setCi(c => c + 1), speed);
    else if (!del && ci === s.length) t = setTimeout(() => setDel(true), pause);
    else if (del && ci > 0)        t = setTimeout(() => setCi(c => c - 1), speed / 2);
    else { setDel(false); setSi(x => (x + 1) % strings.length); }
    setText(s.slice(0, ci)); return () => clearTimeout(t);
  }, [ci, del, si, strings, speed, pause]);
  return <span className="tc">{text}<span style={{ borderRight: "2px solid var(--cyan)", animation: "blink 1s step-end infinite", marginLeft: 1 }} /></span>;
}

/* ── REVEAL HOOK ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(e => e.forEach(x => x.isIntersecting && x.target.classList.add("in")), { threshold: .1 });
    els.forEach(el => obs.observe(el)); return () => obs.disconnect();
  }, []);
}

/* ── NAV SCROLL HOOK ── */
function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector("nav");
    const fn = () => nav?.classList.toggle("sc", window.scrollY > 60);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
}

/* ── DATA ── */
const EXP = [
  {
    role: "Software / Systems Engineer I", company: "Hewlett Packard Enterprise", period: "Feb 2024 – Jul 2025 · Bangalore", color: "#22d3ee",
    pts: ["Designed integration tests to validate <strong>Fibre Channel I/O</strong> for block sizes greater than 256 KB, improving reliability in enterprise storage arrays.", "Built a <strong>Python automation framework</strong> for hardware self-installation workflows, reducing replacement runtime by approximately <strong>50%</strong>.", "Developed backend APIs and monitoring dashboards to scale distributed storage clusters from <strong>8 to 16 nodes</strong>, enabling real-time visibility for 6 PB+ deployments.", "Proactively shipped a <strong>GPT-3.5 powered internal chatbot</strong> with contextual retrieval delivering sub-500 ms response latency."],
  },
  {
    role: "HubSpot Automations Engineer", company: "BluMountain (Remote)", period: "Feb 2023 – Aug 2023", color: "#3b82f6",
    pts: ["Automated backend workflows using <strong>REST APIs</strong> across HubSpot, Zapier, and Salesforce, eliminating manual CRM operations.", "Built analytics dashboards processing multi-touch engagement data, supporting scalable SaaS workflows and a RevOps attribution model."],
  },
  {
    role: "Full Stack Developer", company: "Ezyfyi.tech (Remote)", period: "Jul 2022 – Jan 2023", color: "#6366f1",
    pts: ["Integrated <strong>FedEx and DHL APIs</strong> using Node.js for an international logistics client with full Jest test coverage and production deployment.", "Built a <strong>PostgreSQL-backed word-frequency system</strong> for a Discord crypto client with CI/CD automation via Jenkins."],
  },
];

const PROJECTS = [
  { title: "Sahayata", type: "Full Stack / NLP", desc: "Emergency triage platform built during COVID-19. Uses NLP sentiment analysis to prioritize radio operator messages in real time. Supports 100+ concurrent users at sub-500 ms.", tech: ["React", "Flask", "Python", "MySQL", "NLP", "Node.js", "Express"], github: "https://github.com/Arya-Wadhwani07/dev-swe-emergencyresponse" },
  { title: "Life-E-Line", type: "Backend Engineering", desc: "Organ-donation coordination backend connecting hospitals nationally. Async request handling sustains 1,000+ RPS under load. Built for reliability and data consistency.", tech: ["Node.js", "Express", "MongoDB", "React", "Heroku"], github: "https://github.com/Arya-Wadhwani07" },
  { title: "LivStory", type: "Machine Learning", desc: "ML pipeline generating real-time contextual sound effects from narrative text using TextRank and NLP. Produced 550+ effects at 92% accuracy on labeled evaluation data.", tech: ["Python", "spaCy", "NLTK", "TensorFlow", "Flask", "Gensim"], github: "https://github.com/Arya-Wadhwani07/LivStory" },
  { title: "HPE Diagnostic Chatbot", type: "AI / LLM Engineering", desc: "LLM-powered diagnostics assistant for HPE storage engineers built during the HPE CTY program. Contextual retrieval, sub-500 ms latency, integrated into live production workflows.", tech: ["Python", "GPT-3.5", "spaCy", "NLTK", "Flask", "Django"], github: null },
  { title: "STC Recruitment Portal", type: "Full Stack", desc: "Online quiz-taking portal for students with an admin monitoring layer. Released to production with extensive edge-case testing at VIT Vellore.", tech: ["Node.js", "Azure", "NoSQL", "React", "Express"], github: null },
  { title: "EZBUY", type: "Web Scraping / Data", desc: "Price comparison aggregator that scrapes Flipkart and Amazon in real time to surface the best deals across platforms.", tech: ["Python", "BeautifulSoup", "Scrapy", "Flask", "JavaScript"], github: "https://github.com/Arya-Wadhwani07/EZBUY" },
];

const SKILLS_DATA = [
  { g: "Languages",         t: ["Python", "Go", "Java", "C++", "JavaScript", "TypeScript", "SQL", "PHP", "Solidity", "Assembly", "Shell"] },
  { g: "Backend & Systems", t: ["Node.js", "Express", "Flask", "Django", "REST APIs", "Microservices", "Multithreading", "GraphQL"] },
  { g: "Frontend",          t: ["React", "HTML5", "CSS3", "Bootstrap", "Vanilla JS"] },
  { g: "Databases",         t: ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Firebase", "Oracle SQL"] },
  { g: "Cloud & DevOps",    t: ["AWS (EC2, S3)", "Azure", "Docker", "Kubernetes", "Jenkins", "CI/CD", "Heroku"] },
  { g: "AI / ML",           t: ["TensorFlow", "PyTorch", "Scikit-learn", "NLP", "spaCy", "NLTK", "Gensim", "GPT APIs", "LangChain"] },
  { g: "Automation & CRM",  t: ["HubSpot", "Zapier", "Salesforce", "Zoho", "Selenium", "Scrapy"] },
  { g: "Core CS",           t: ["DSA", "OOP", "Distributed Systems", "Storage Area Networks", "IOT", "Blockchain"] },
];

const CERTS = [
  { name: "Introduction to Machine Learning", by: "Kaggle", year: "2023", icon: "🤖" },
  { name: "MERN Full Stack Development", by: "Udemy", year: "2022", icon: "⚡" },
  { name: "HPE Catch Them Young Program", by: "Hewlett Packard Enterprise", year: "2023", icon: "🏢" },
  { name: "Cloud Fundamentals", by: "Amazon Web Services", year: "2023", icon: "☁️" },
  { name: "Grade 5 Theory of Music", by: "Trinity College London", year: "2019", icon: "🎵" },
];

const ACHIEVEMENTS = [
  { icon: "🏆", t: "<strong>96+ percentile</strong> in JEE Mains entrance examination" },
  { icon: "🎯", t: "<strong>JEE Advanced</strong> qualified with national rank 24,000" },
  { icon: "🔬", t: "Qualified the <strong>Dr. Homi Bhabha Balvaidyanik</strong> science competition" },
  { icon: "🎓", t: "<strong>CGPA 9.58 / 10</strong> at Vellore Institute of Technology, B.Tech CS" },
  { icon: "📊", t: "<strong>96% in ICSE (10th)</strong> and <strong>96% in ISC (12th)</strong> board examinations" },
  { icon: "🏅", t: "<strong>Rank Holder</strong> in 11th and 12th Standard Term Examinations at Bishop's School" },
  { icon: "🏓", t: "<strong>Zonal Level Table Tennis</strong> player and Zila Parishad Lawn Tennis player" },
  { icon: "🎭", t: "<strong>Best Debater of School</strong> 2017-2018 and Inter School Debate Runner-Up" },
  { icon: "🤝", t: "<strong>Vice House Captain</strong> and Prefect (Green House), The Bishop's School, Pune" },
  { icon: "🎬", t: "<strong>Production Manager</strong>, VIT Film Society and Secretary, VIT Model UN Society" },
  { icon: "💻", t: "<strong>Machine Learning Tech Lead</strong>, Student Technical Community (STC), VIT" },
  { icon: "🏆", t: "<strong>College Hackathon Runner-Up</strong> and IEEE-SSIT Advisory Board Member" },
];

const GH_ICON = <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
const LI_ICON = <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const DOC_ICON = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>;

/* ── APP ── */
export default function App() {
  useReveal(); useNavScroll();
  return (
    <>
      <G />
      <Cursor />
      <GridBg />
      <ParticleCanvas />

      {/* NAV */}
      <nav>
        <a href="#hero" className="nav-logo">
          <Logo size={34} />
          <span className="nav-logo-name">Arya<span>.</span></span>
        </a>
        <ul className="nav-links">
          {["About","Education","Experience","Projects","Skills","Certifications","Achievements","Contact"].map(s=>(
            <li key={s}><a href={`#${s.toLowerCase()}`}>{s}</a></li>
          ))}
        </ul>
        <div className="nav-cta-wrap">
          <a href="https://drive.google.com/your-resume-link" target="_blank" rel="noopener noreferrer" className="nav-cta">
            {DOC_ICON} Resume
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        {/* LEFT — text content */}
        <div className="hero-left">
          <div className="hero-quote">
            <span className="hero-quote-mark">"</span>
            Code is the closest thing we have to a superpower.
            <span className="hero-quote-mark">"</span>
          </div>
          <h1 className="hero-name">Arya<span className="cyan">Wadhwani</span></h1>
          <div className="hero-row">
            <div className="hero-line" />
            <p className="hero-sub"><Typed strings={["Software Development Engineer","AI and Systems Builder","USC MS Computer Science","Building What Matters"]} /></p>
          </div>
          <div className="hero-cta">
            <a href="#projects" className="btn-p">View Projects ↗</a>
            <a href="#contact"  className="btn-s">Get In Touch</a>
            <a href="https://drive.google.com/your-resume-link" target="_blank" rel="noopener noreferrer" className="btn-s">{DOC_ICON} Resume</a>
          </div>
        </div>

        {/* RIGHT — Three.js canvas, fully isolated */}
        <div className="hero-right">
          <HeroThreeScene />
        </div>

        <div className="scroll-hint"><div className="scroll-line" />Scroll to explore</div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "120px 64px" }}>
        <div className="sw">
          <div className="about-g">
            <div>
              <div className="sl reveal">About Me</div>
              <h2 className="st reveal d1">Engineer.<br />Thinker.<br />Builder.</h2>
              <p className="at reveal d2">It started with a spark, watching Siri respond intelligently, then sitting in awe through <em>Her</em> and asking: <strong>what if machines could truly connect with humans?</strong> That question has never left me.</p>
              <p className="at reveal d3">From building <strong>emergency triage systems</strong> during COVID-19 to shipping automation frameworks at <strong>Hewlett Packard Enterprise</strong> that cut hardware replacement times in half, every line of code is in service of a bigger idea: technology that genuinely improves lives.</p>
              <p className="at reveal d4">Now pursuing my <strong>MS in Computer Science at USC</strong> (GPA 3.65), deepening expertise in AI, distributed systems, and software architecture, with the long game of building a company at the intersection of engineering excellence and human impact.</p>
              <div className="ab-stats">
                {[["9.58","CGPA at VIT"],["50%","Runtime Saved at HPE"],["6 PB+","Storage Scale"],["3+","Years Experience"]].map(([n,l],i)=>(
                  <div className={`sc reveal d${i+1}`} key={i}><div className="sn">{n}</div><div className="sl2">{l}</div></div>
                ))}
              </div>
            </div>
            <div className="right-col">
              {/* PHOTO PLACEHOLDER */}
              <div className="photo-ph reveal d1">
                <div className="photo-ring">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(34,211,238,0.45)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="photo-lbl">YOUR PROFESSIONAL PHOTO<br /><span style={{ opacity:.45, fontSize:".55rem" }}>Upload to replace this placeholder</span></div>
              </div>
              {/* TERMINAL */}
              <div className="term-card reveal d2">
                <div className="term-hdr">
                  <div className="td" style={{ background:"#ff5f57" }} />
                  <div className="td" style={{ background:"#ffbd2e" }} />
                  <div className="td" style={{ background:"#28ca41" }} />
                  <span style={{ fontFamily:"var(--font-m)", fontSize:".6rem", color:"var(--muted)", marginLeft:8 }}>arya@portfolio:~</span>
                </div>
                <div className="term-bd">
                  {[["$ whoami","arya_jay_wadhwani"],["$ location","Los Angeles, CA"],["$ degree","USC MS CS (Aug 2025)"],["$ prev_role","HPE Software Engineer I"],["$ open_to","SWE / ML / AI Roles"]].map(([cmd,out],i)=>(
                    <div key={i}><span className="tc2">{cmd}</span><br /><span className="to">  {out}</span><br /></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" style={{ padding:"100px 64px" }}>
        <div className="sw">
          <div className="sl reveal">Education</div>
          <h2 className="st reveal d1">Academic Journey</h2>
          <div className="edu-g">
            {[
              { deg:"Master of Science, Computer Science", school:"University of Southern California", loc:"Los Angeles, CA", period:"Aug 2025 – May 2027", gpa:"3.65", gu:"GPA / 4.0", courses:["Analysis of Algorithms","Database Systems","Software Engineering","AI Research"], n:"01" },
              { deg:"B.Tech, Computer Science and Engineering", school:"Vellore Institute of Technology", loc:"Tamil Nadu, India", period:"Sept 2020 – May 2024", gpa:"9.58", gu:"CGPA / 10", courses:["OS","Data Structures","Machine Learning","Networks","AI"], n:"02" },
              { deg:"ISC 12th Standard", school:"The Bishop's School Junior College", loc:"Camp, Pune", period:"June 2018 – June 2020", gpa:"96%", gu:"Percentage", courses:["Physics","Chemistry","Mathematics","Computer Science"], n:"03" },
              { deg:"ICSE 10th Standard", school:"The Bishop's School", loc:"Camp, Pune", period:"June 2017 – May 2018", gpa:"96%", gu:"Percentage", courses:["Mathematics","Science","Computer Applications","Literature"], n:"04" },
            ].map((e,i)=>(
              <div className={`edu-c reveal d${(i%2)+1}`} key={i}>
                <div className="edu-n">{e.n}</div>
                <div className="edu-s">{e.school}</div>
                <div className="edu-d">{e.deg}</div>
                <div className="edu-p">{e.period} · {e.loc}</div>
                <div className="edu-gpa">{e.gpa}</div>
                <div className="edu-gl">{e.gu}</div>
                <div className="edu-tags">{e.courses.map(c=><span key={c} className="edu-tag">{c}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding:"100px 64px" }}>
        <div className="sw">
          <div className="sl reveal">Experience</div>
          <h2 className="st reveal d1">Where I Have Built</h2>
          <div className="tl">
            {EXP.map((e,i)=>(
              <div className={`ei reveal d${(i%3)+1}`} key={i}>
                <div className="edot" style={{ borderColor:e.color, boxShadow:`0 0 10px ${e.color}55` }} />
                <div className="ei-top">
                  <div className="ei-role">{e.role}</div>
                  <div className="ei-period">{e.period}</div>
                </div>
                <div className="ei-co" style={{ color:e.color }}>{e.company}</div>
                <ul className="ei-pts">{e.pts.map((p,j)=><li key={j} dangerouslySetInnerHTML={{ __html:p }} />)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding:"100px 64px" }}>
        <div className="sw">
          <div className="sl reveal">Projects</div>
          <h2 className="st reveal d1">Things I Have Shipped</h2>
          <div className="pg">
            {PROJECTS.map((p,i)=>(
              <div className={`pc reveal d${(i%3)+1}`} key={i}>
                <div className="pn">0{i+1}</div>
                <div style={{ position:"relative", zIndex:1 }}>
                  <div className="pt">{p.type}</div>
                  <div className="ptitle">{p.title}</div>
                  <p className="pd">{p.desc}</p>
                  <div className="pills">{p.tech.map(t=><span key={t} className="pill">{t}</span>)}</div>
                  {p.github&&<div className="pl"><a href={p.github} target="_blank" rel="noopener noreferrer" className="plk">{GH_ICON} GitHub</a></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding:"100px 64px", position: "relative" }}>
        <SkillsThreeScene />
        <div className="sw">
          <div className="sl reveal">Skills</div>
          <h2 className="st reveal d1">Technical Arsenal</h2>
          <div className="skg">
            {SKILLS_DATA.map((g,i)=>(
              <div className={`skgr reveal d${(i%4)+1}`} key={i}>
                <div className="skgt">{g.g}</div>
                <div className="skt">{g.t.map(t=><span key={t} className="sktag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications" style={{ padding:"100px 64px" }}>
        <div className="sw">
          <div className="sl reveal">Certifications</div>
          <h2 className="st reveal d1">Credentials</h2>
          <div className="certg">
            {CERTS.map((c,i)=>(
              <div className={`certc reveal d${(i%3)+1}`} key={i}>
                <div className="certi">{c.icon}</div>
                <div>
                  <div className="certn">{c.name}</div>
                  <div className="certb">{c.by}</div>
                  <div className="certy">{c.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" style={{ padding:"100px 64px" }}>
        <div className="sw">
          <div className="sl reveal">Achievements</div>
          <h2 className="st reveal d1">Milestones</h2>
          <div className="achg">
            {ACHIEVEMENTS.map((a,i)=>(
              <div className={`achi reveal d${(i%2)+1}`} key={i}>
                <span className="achico">{a.icon}</span>
                <span className="acht" dangerouslySetInnerHTML={{ __html:a.t }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:"120px 64px" }}>
        <ContactThreeScene />
        <div className="cglow" />
        <div className="ci">
          <div className="sl reveal" style={{ justifyContent:"center" }}>Contact</div>
          <h2 className="ctitle reveal d1">Let's Build<br /><span style={{ color:"var(--cyan)" }}>Something.</span></h2>
          <p className="csub reveal d2">Whether you're a recruiter, founder, or fellow builder, I'm always open to conversations about ambitious ideas and great engineering.</p>
          <div className="reveal d3"><a href="mailto:arya.wadhwani@gmail.com" className="cemail">arya.wadhwani@gmail.com</a></div>
          <div className="clinks reveal d4">
            <a href="https://linkedin.com/in/arya-wadhwani" target="_blank" rel="noopener noreferrer" className="clk">{LI_ICON} LinkedIn</a>
            <a href="https://github.com/Arya-Wadhwani07" target="_blank" rel="noopener noreferrer" className="clk">{GH_ICON} GitHub</a>
            <a href="tel:+12132964961" className="clk">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.15 2.28 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              (213) 296-4961
            </a>
            <a href="https://drive.google.com/your-resume-link" target="_blank" rel="noopener noreferrer" className="clk">{DOC_ICON} Resume</a>
          </div>
        </div>
      </section>

      <footer>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 }}><Logo size={20} /><span style={{ color:"var(--cyan)", fontFamily:"var(--font-h)", fontWeight:800, fontSize:".9rem", letterSpacing:"-.3px" }}>Arya Jay Wadhwani</span></div>
        Built with React &nbsp;·&nbsp; {new Date().getFullYear()}
        <div style={{ opacity:.4, fontSize:".58rem", marginTop:6, letterSpacing:3 }}>// designed to ship. built to scale.</div>
      </footer>
    </>
  );
}