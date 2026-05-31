import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      /* ── NEW PALETTE: Deep void + violet/magenta/electric neon ── */
      --bg:        #02020a;
      --bg2:       #05050f;
      --bg3:       #080818;
      --void:      #0a0a1a;

      /* Neon accent system */
      --neon-v:    #a855f7;   /* violet  */
      --neon-m:    #e879f9;   /* magenta */
      --neon-b:    #3b82f6;   /* blue    */
      --neon-c:    #22d3ee;   /* cyan    */
      --neon-g:    #34d399;   /* green   */

      /* Primary = violet/magenta gradient */
      --primary:   #a855f7;
      --primary2:  #c026d3;
      --accent:    #e879f9;

      /* Text */
      --white:     #f0f0ff;
      --off:       #c4b5fd;
      --muted:     #6d6a8a;

      /* Glass */
      --glass:     rgba(10,10,26,0.65);
      --glass2:    rgba(168,85,247,0.06);
      --border:    rgba(168,85,247,0.15);
      --border2:   rgba(168,85,247,0.35);
      --border-h:  rgba(232,121,249,0.5);

      /* Glows */
      --glow-sm:   0 0 20px rgba(168,85,247,0.20);
      --glow-md:   0 0 40px rgba(168,85,247,0.30), 0 0 80px rgba(168,85,247,0.10);
      --glow-lg:   0 0 80px rgba(168,85,247,0.25), 0 0 160px rgba(168,85,247,0.08);
      --glow-c:    0 0 30px rgba(34,211,238,0.25);
      --glow-m:    0 0 30px rgba(232,121,249,0.30);

      /* Fonts */
      --font-h:    'Outfit', sans-serif;
      --font-b:    'Space Grotesk', sans-serif;
      --font-m:    'JetBrains Mono', monospace;
      --r:         8px;
    }

    html { scroll-behavior: smooth; font-size: 16px; }
    body {
      background: var(--bg);
      color: var(--white);
      font-family: var(--font-b);
      overflow-x: hidden;
      cursor: none;
    }

    /* ── CUSTOM CURSOR ── */
    #c-dot {
      position: fixed; top: 0; left: 0; width: 8px; height: 8px;
      background: var(--neon-m); border-radius: 50%;
      margin: -4px 0 0 -4px; pointer-events: none; z-index: 9999;
      box-shadow: 0 0 12px var(--neon-m), 0 0 4px var(--neon-m);
    }
    #c-ring {
      position: fixed; top: 0; left: 0; width: 36px; height: 36px;
      border: 1.5px solid rgba(168,85,247,0.55); border-radius: 50%;
      margin: -18px 0 0 -18px; pointer-events: none; z-index: 9998;
      transition: width .3s, height .3s, border-color .3s;
    }
    body.ha #c-ring { width: 54px; height: 54px; border-color: var(--neon-m); box-shadow: 0 0 20px rgba(232,121,249,0.3); }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, var(--neon-v), var(--neon-m)); border-radius: 2px; }
    ::selection { background: rgba(168,85,247,0.25); color: var(--white); }

    /* ── NAV ── */
    nav {
      position: fixed; top: 0; inset-x: 0; z-index: 200;
      display: flex; align-items: center;
      padding: 0 48px; height: 64px;
      background: rgba(2,2,10,0.55);
      backdrop-filter: blur(32px) saturate(180%);
      border-bottom: 1px solid var(--border);
      transition: height .4s cubic-bezier(.4,0,.2,1), background .4s;
    }
    nav.sc { height: 52px; background: rgba(2,2,10,0.82); }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; padding-right: 32px; margin-right: 8px; border-right: 1px solid var(--border); }
    .nav-logo-name { font-family: var(--font-h); font-weight: 900; font-size: 1.05rem; letter-spacing: -.5px; color: var(--white); }
    .nav-logo-name span { background: linear-gradient(135deg, var(--neon-v), var(--neon-m)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links { display: flex; gap: 0; list-style: none; flex: 1; justify-content: center; }
    .nav-links a {
      font-family: var(--font-m); font-size: .62rem; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--muted); text-decoration: none; position: relative;
      padding: 0 13px; height: 64px; display: flex; align-items: center;
      transition: color .25s;
    }
    nav.sc .nav-links a { height: 52px; }
    .nav-links a::after {
      content: ''; position: absolute; bottom: 0; left: 13px; right: 13px; height: 2px;
      background: linear-gradient(90deg, var(--neon-v), var(--neon-m));
      transform: scaleX(0); transform-origin: center; transition: transform .3s cubic-bezier(.4,0,.2,1);
    }
    .nav-links a:hover { color: var(--off); }
    .nav-links a:hover::after { transform: scaleX(1); }
    .nav-cta-wrap { flex-shrink: 0; padding-left: 28px; margin-left: 8px; border-left: 1px solid var(--border); display: flex; align-items: center; }
    .nav-cta {
      padding: 9px 22px; background: transparent; color: var(--off);
      font-family: var(--font-m); font-size: .62rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      border: 1px solid rgba(168,85,247,0.3); border-radius: var(--r);
      cursor: none; text-decoration: none; display: inline-flex; align-items: center; gap: 7px;
      transition: border-color .25s, color .25s, transform .25s, box-shadow .25s;
    }
    .nav-cta:hover { border-color: var(--neon-m); color: var(--neon-m); transform: translateY(-2px); box-shadow: var(--glow-m); }

    section { position: relative; overflow: hidden; z-index: 1; }

    /* ── HERO ── */
    #hero {
      min-height: 100vh; display: grid;
      grid-template-columns: 55% 45%;
      align-items: center;
      padding: 100px 64px 80px;
      overflow: hidden;
    }
    .hero-left { position: relative; z-index: 2; padding-right: 24px; }
    .hero-right { position: relative; height: 100vh; min-height: 600px; overflow: hidden; clip-path: inset(0); }
    .hero-right canvas { display: block; width: 100% !important; height: 100% !important; }

    .hero-quote {
      font-family: var(--font-m); font-size: clamp(.68rem, 1.1vw, .84rem);
      letter-spacing: 2px; color: var(--muted); margin-bottom: 28px;
      display: flex; align-items: center; gap: 10px;
      animation: fu .8s .1s both;
    }
    .hero-quote-mark { font-family: var(--font-h); font-size: 1.8rem; line-height: 1; font-weight: 900; background: linear-gradient(135deg, var(--neon-v), var(--neon-m)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .hero-name {
      font-family: var(--font-h); font-size: clamp(2.8rem, 5.8vw, 5.8rem);
      font-weight: 900; line-height: .92; letter-spacing: -3px;
      animation: fu .8s .25s both;
    }
    .hero-name .grad {
      display: block;
      background: linear-gradient(135deg, var(--neon-v) 0%, var(--neon-m) 50%, var(--neon-c) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-size: 200% 200%; animation: gradShift 4s ease infinite;
    }
    @keyframes gradShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

    .hero-row { display: flex; align-items: center; gap: 18px; margin-top: 30px; animation: fu .8s .4s both; }
    .hero-line { width: 48px; height: 1px; background: linear-gradient(90deg, var(--neon-v), transparent); flex-shrink: 0; }
    .hero-sub { font-family: var(--font-m); font-size: clamp(.76rem, 1.4vw, .95rem); color: var(--muted); letter-spacing: 1px; }
    .hero-sub .tc { color: var(--off); }

    .hero-cta { display: flex; gap: 14px; margin-top: 50px; flex-wrap: wrap; animation: fu .8s .55s both; }

    /* Primary button — neon gradient fill */
    .btn-p {
      padding: 13px 32px;
      background: linear-gradient(135deg, var(--neon-v), var(--neon-m));
      color: #fff; font-family: var(--font-m); font-size: .7rem; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      border: none; border-radius: var(--r); cursor: none; text-decoration: none;
      display: inline-flex; align-items: center; gap: 8px; position: relative; overflow: hidden;
      transition: transform .25s, box-shadow .25s;
    }
    .btn-p::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--neon-m), var(--neon-v));
      opacity: 0; transition: opacity .3s;
    }
    .btn-p:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(168,85,247,0.45); }
    .btn-p:hover::before { opacity: 1; }
    .btn-p span, .btn-p svg { position: relative; z-index: 1; }

    /* Secondary button — glass border */
    .btn-s {
      padding: 13px 32px; background: rgba(168,85,247,0.05);
      color: var(--off); font-family: var(--font-m); font-size: .7rem; font-weight: 600;
      letter-spacing: 2px; text-transform: uppercase;
      border: 1px solid rgba(168,85,247,0.28); border-radius: var(--r);
      cursor: none; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
      backdrop-filter: blur(8px);
      transition: border-color .25s, color .25s, transform .25s, box-shadow .25s, background .25s;
    }
    .btn-s:hover { border-color: var(--neon-m); color: var(--neon-m); transform: translateY(-3px); box-shadow: var(--glow-m); background: rgba(232,121,249,0.08); }

    .scroll-hint {
      position: absolute; bottom: 36px; left: 64px;
      font-family: var(--font-m); font-size: .58rem; letter-spacing: 3px; text-transform: uppercase;
      color: var(--muted); display: flex; align-items: center; gap: 12px;
      animation: fu .8s .9s both; grid-column: 1/-1; align-self: end; z-index: 3;
    }
    .scroll-line { width: 36px; height: 1px; background: linear-gradient(90deg, var(--neon-v), transparent); animation: sp 2s ease-in-out infinite; }

    /* ── COMMON ── */
    .sw { max-width: 1100px; margin: 0 auto; }
    .sl {
      font-family: var(--font-m); font-size: .62rem; letter-spacing: 4px; text-transform: uppercase;
      color: var(--neon-v); margin-bottom: 10px; display: flex; align-items: center; gap: 10px;
    }
    .sl::before { content: '//'; color: rgba(168,85,247,0.4); }
    .st { font-family: var(--font-h); font-size: clamp(2rem, 4.5vw, 3.5rem); font-weight: 800; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 56px; }

    /* ── HOLOGRAPHIC GLASS CARD (universal) ── */
    .holo-card {
      position: relative; overflow: hidden;
      border: 1px solid rgba(168,85,247,0.18);
      border-radius: 12px;
      background: linear-gradient(
        135deg,
        rgba(15,10,30,0.72) 0%,
        rgba(20,12,40,0.68) 50%,
        rgba(12,8,28,0.75) 100%
      );
      backdrop-filter: blur(28px) saturate(160%) brightness(1.05);
      -webkit-backdrop-filter: blur(28px) saturate(160%) brightness(1.05);
      box-shadow:
        0 0 0 1px rgba(168,85,247,0.10) inset,
        0 1px 0 rgba(255,255,255,0.06) inset,
        0 8px 32px rgba(0,0,0,0.45);
      transition:
        border-color .35s cubic-bezier(.4,0,.2,1),
        transform    .35s cubic-bezier(.4,0,.2,1),
        box-shadow   .35s cubic-bezier(.4,0,.2,1);
    }

    /* Top edge highlight — crisp 1px line, not a gradient blur */
    .holo-card::before {
      content: '';
      position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(200,120,255,0.55), rgba(232,121,249,0.4), transparent);
      border-radius: 1px;
      opacity: 0;
      transition: opacity .35s;
      pointer-events: none;
    }

    /* Sweep shimmer on hover — contained, no bleed */
    .holo-card::after {
      content: '';
      position: absolute; inset: 0; border-radius: 12px;
      background: linear-gradient(
        105deg,
        transparent 35%,
        rgba(168,85,247,0.07) 50%,
        rgba(232,121,249,0.05) 55%,
        transparent 65%
      );
      opacity: 0;
      transition: opacity .35s;
      pointer-events: none;
    }

    .holo-card:hover {
      border-color: rgba(168,85,247,0.38);
      transform: translateY(-6px);
      box-shadow:
        0 0 0 1px rgba(168,85,247,0.22) inset,
        0 1px 0 rgba(255,255,255,0.10) inset,
        0 20px 60px rgba(0,0,0,0.55),
        0 0 40px rgba(168,85,247,0.14),
        0 0 80px rgba(168,85,247,0.06);
    }
    .holo-card:hover::before { opacity: 1; }
    .holo-card:hover::after  { opacity: 1; }

    /* ── ABOUT ── */
    #about { padding: 120px 64px; }
    .about-g { display: grid; grid-template-columns: 1fr 440px; gap: 72px; align-items: start; }
    .at { font-size: 1.02rem; color: var(--off); line-height: 1.85; font-weight: 300; }
    .at + .at { margin-top: 18px; }
    .at strong { color: var(--neon-m); font-weight: 600; }
    .ab-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 38px; }
    .sc {
      border: 1px solid var(--border); border-radius: var(--r); padding: 22px;
      background: var(--glass); backdrop-filter: blur(16px);
      position: relative; overflow: hidden;
      transition: border-color .3s, transform .3s, box-shadow .3s;
    }
    .sc::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--neon-v), transparent); opacity: 0; transition: opacity .3s; }
    .sc:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: var(--glow-sm); }
    .sc:hover::before { opacity: 1; }
    .sn { font-family: var(--font-h); font-size: 2.4rem; font-weight: 900; letter-spacing: -2px; line-height: 1; background: linear-gradient(135deg, var(--neon-v), var(--neon-m)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .sl2 { font-family: var(--font-m); font-size: .58rem; letter-spacing: 2px; color: var(--muted); margin-top: 5px; text-transform: uppercase; }
    .right-col { display: flex; flex-direction: column; gap: 18px; }
    .photo-ph { width: 100%; aspect-ratio: 3/4; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
    .term-card { border: 1px solid var(--border); border-radius: var(--r); background: var(--glass); backdrop-filter: blur(20px); padding: 22px; }
    .term-hdr { display: flex; align-items: center; gap: 7px; margin-bottom: 16px; }
    .td { width: 10px; height: 10px; border-radius: 50%; }
    .term-bd { font-family: var(--font-m); font-size: .73rem; line-height: 1.95; }
    .tc2 { color: var(--neon-v); } .to { color: rgba(240,240,255,0.72); } .tm { color: var(--muted); }

    /* ── EDUCATION ── */
    #education { padding: 100px 64px; }
    .edu-g { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .edu-c { padding: 30px; }
    .edu-d { font-family: var(--font-h); font-size: 1.12rem; font-weight: 700; margin-bottom: 5px; }
    .edu-s { font-family: var(--font-m); font-size: .68rem; letter-spacing: 1.5px; color: var(--neon-v); margin-bottom: 4px; text-transform: uppercase; }
    .edu-p { font-family: var(--font-m); font-size: .62rem; color: var(--muted); margin-bottom: 14px; }
    .edu-gpa { font-family: var(--font-h); font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; line-height: 1; background: linear-gradient(135deg, var(--neon-v), var(--neon-m)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .edu-gl { font-family: var(--font-m); font-size: .58rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-top: 3px; }
    .edu-tags { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 6px; }
    .edu-tag { font-family: var(--font-m); font-size: .6rem; letter-spacing: .8px; padding: 4px 10px; border: 1px solid var(--border); border-radius: 2px; color: var(--muted); transition: border-color .2s, color .2s; }
    .edu-c:hover .edu-tag { border-color: rgba(168,85,247,0.25); color: var(--off); }
    .edu-n { font-family: var(--font-h); font-size: 5.5rem; font-weight: 900; color: rgba(168,85,247,0.05); position: absolute; right: 14px; bottom: -10px; letter-spacing: -4px; line-height: 1; }

    /* ── EXPERIENCE ── */
    #experience { padding: 100px 64px; }
    .tl { position: relative; }
    .tl::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, var(--neon-v) 20%, var(--neon-m) 80%, transparent); }
    .ei { padding-left: 42px; margin-bottom: 54px; position: relative; }
    .edot { position: absolute; left: -6px; top: 7px; width: 13px; height: 13px; border-radius: 50%; background: var(--bg); border: 2px solid var(--neon-v); box-shadow: 0 0 10px rgba(168,85,247,0.5); transition: box-shadow .3s, border-color .3s; }
    .ei:hover .edot { box-shadow: 0 0 24px rgba(232,121,249,0.9); border-color: var(--neon-m); }
    .ei-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 4px; }
    .ei-role { font-family: var(--font-h); font-size: 1.28rem; font-weight: 700; letter-spacing: -.3px; }
    .ei-period { font-family: var(--font-m); font-size: .6rem; letter-spacing: 1.5px; color: var(--muted); white-space: nowrap; margin-top: 4px; }
    .ei-co { font-family: var(--font-m); font-size: .68rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
    .ei-pts { list-style: none; }
    .ei-pts li { font-size: .93rem; color: var(--off); line-height: 1.78; margin-bottom: 9px; padding-left: 18px; position: relative; font-weight: 300; }
    .ei-pts li::before { content: '▸'; position: absolute; left: 0; color: var(--neon-v); font-size: .72rem; top: 3px; }
    .ei-pts strong { color: var(--white); font-weight: 500; }

    /* ── PROJECTS ── */
    #projects { padding: 100px 64px; }
    .pg { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .pc { padding: 30px; cursor: none; }
    .pn { font-family: var(--font-h); font-size: 4.5rem; font-weight: 900; color: rgba(168,85,247,0.06); position: absolute; top: 10px; right: 18px; letter-spacing: -3px; line-height: 1; }
    .pt { font-family: var(--font-m); font-size: .6rem; letter-spacing: 2px; text-transform: uppercase; color: var(--neon-v); margin-bottom: 9px; }
    .ptitle { font-family: var(--font-h); font-size: 1.42rem; font-weight: 700; letter-spacing: -.4px; margin-bottom: 10px; }
    .pd { font-size: .88rem; color: var(--muted); line-height: 1.75; margin-bottom: 20px; font-weight: 300; }
    .pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .pill { font-family: var(--font-m); font-size: .58rem; letter-spacing: .8px; padding: 4px 10px; background: rgba(168,85,247,0.07); border: 1px solid rgba(168,85,247,0.20); border-radius: 2px; color: var(--off); }
    .pl { display: flex; gap: 12px; margin-top: 18px; }
    .plk { font-family: var(--font-m); font-size: .6rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color .2s; display: flex; align-items: center; gap: 5px; }
    .plk:hover { color: var(--neon-m); }

    /* ── SKILLS ── */
    #skills { padding: 100px 64px; }
    .skg { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 18px; }
    .skgr { padding: 26px; }
    .skgt { font-family: var(--font-m); font-size: .62rem; letter-spacing: 3px; text-transform: uppercase; color: var(--neon-v); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
    .skt { display: flex; flex-wrap: wrap; gap: 7px; }
    .sktag { font-family: var(--font-m); font-size: .62rem; letter-spacing: .5px; padding: 5px 11px; border: 1px solid var(--border); border-radius: 3px; color: var(--off); transition: border-color .2s, color .2s, background .2s, box-shadow .2s; }
    .sktag:hover { border-color: var(--neon-v); color: var(--neon-m); background: rgba(168,85,247,0.08); box-shadow: 0 0 12px rgba(168,85,247,0.2); }

    /* ── CERTIFICATIONS ── */
    #certifications { padding: 100px 64px; }
    .certg { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .certc { padding: 24px 26px; display: flex; align-items: flex-start; gap: 16px; }
    .certi { width: 40px; height: 40px; border-radius: 8px; background: rgba(168,85,247,0.10); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.2rem; }
    .certn { font-family: var(--font-b); font-size: .93rem; font-weight: 600; margin-bottom: 4px; }
    .certb { font-family: var(--font-m); font-size: .62rem; letter-spacing: 1.5px; color: var(--neon-v); margin-bottom: 3px; text-transform: uppercase; }
    .certy { font-family: var(--font-m); font-size: .58rem; color: var(--muted); }

    /* ── ACHIEVEMENTS ── */
    #achievements { padding: 100px 64px; }
    .achg { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
    .achi { padding: 18px 22px; display: flex; align-items: flex-start; gap: 13px; }
    .achi:hover { transform: translateX(6px); }
    .achico { font-size: 1.15rem; flex-shrink: 0; margin-top: 1px; }
    .acht { font-size: .9rem; color: var(--off); line-height: 1.55; font-weight: 300; }
    .acht strong { color: var(--white); font-weight: 500; }

    /* ── CONTACT ── */
    #contact { padding: 120px 64px; text-align: center; }
    .cglow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 800px; height: 600px; background: radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, rgba(232,121,249,0.04) 40%, transparent 70%); pointer-events: none; }
    .ci { position: relative; z-index: 2; }
    .ctitle { font-family: var(--font-h); font-size: clamp(2.8rem, 6.5vw, 5.5rem); font-weight: 900; letter-spacing: -2.5px; margin-bottom: 18px; }
    .ctitle .grad2 { background: linear-gradient(135deg, var(--neon-v), var(--neon-m), var(--neon-c)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .csub { font-size: 1rem; color: var(--muted); max-width: 480px; margin: 0 auto 44px; line-height: 1.75; }
    .cemail { font-family: var(--font-h); font-size: clamp(1.1rem, 2.5vw, 1.7rem); font-weight: 700; letter-spacing: -.5px; text-decoration: none; display: inline-block; margin-bottom: 48px; transition: transform .25s; background: linear-gradient(135deg, var(--neon-v), var(--neon-m)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; border-bottom: 1px solid rgba(168,85,247,0.4); padding-bottom: 3px; }
    .cemail:hover { transform: scale(1.02); }
    .clinks { display: flex; gap: 13px; justify-content: center; flex-wrap: wrap; }
    .clk { font-family: var(--font-m); font-size: .65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); text-decoration: none; display: flex; align-items: center; gap: 8px; padding: 11px 20px; border: 1px solid var(--border); border-radius: var(--r); background: var(--glass); backdrop-filter: blur(12px); transition: color .25s, border-color .25s, transform .25s, box-shadow .25s; }
    .clk:hover { color: var(--neon-m); border-color: var(--border-h); transform: translateY(-3px); box-shadow: var(--glow-m); }
    footer { text-align: center; font-family: var(--font-m); font-size: .6rem; letter-spacing: 2px; color: var(--muted); padding: 28px; border-top: 1px solid var(--border); }

    /* ── ANIMATIONS ── */
    @keyframes fu    { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes sp    { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
    @keyframes gridS { from { transform: translateY(0); } to { transform: translateY(60px); } }
    @keyframes floatA { 0%,100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-18px) translateX(8px); } 66% { transform: translateY(-8px) translateX(-6px); } }
    @keyframes floatB { 0%,100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-22px) translateX(12px); } }
    @keyframes scanline { 0% { top: -4px; } 100% { top: 100%; } }
    @keyframes neonPulse { 0%,100% { text-shadow: 0 0 8px rgba(168,85,247,.5); } 50% { text-shadow: 0 0 24px rgba(232,121,249,.9), 0 0 48px rgba(168,85,247,.4); } }

    /* Reveal */
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity .8s cubic-bezier(.4,0,.2,1), transform .8s cubic-bezier(.4,0,.2,1); }
    .reveal.in { opacity: 1; transform: none; }
    .d1 { transition-delay: .1s; } .d2 { transition-delay: .2s; } .d3 { transition-delay: .3s; } .d4 { transition-delay: .4s; }

    /* Scanline overlay on section headers */
    .scan-wrap { position: relative; display: inline-block; }
    .scan-wrap::after { content: ''; position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(232,121,249,0.6), transparent); animation: scanline 3s linear infinite; pointer-events: none; }

    /* Holographic noise texture on glass cards */
    @keyframes holoShift {
      0%   { background-position: 0% 0%;   }
      50%  { background-position: 100% 100%; }
      100% { background-position: 0% 0%;   }
    }

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

/* ── NEON PARTICLE FIELD — crisp, uniform, violet/magenta only ── */
function NeonParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let id;
    let mx = -999, my = -999;

    const resize = () => {
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
      // Re-fill with solid bg after resize to prevent any leftover color
      ctx.fillStyle = "#02020a";
      ctx.fillRect(0, 0, c.width, c.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const onMouse = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMouse);

    // ── Particles — violet/magenta ONLY, no cyan, no teal ──
    const N = 70;
    const HUES = [272, 280, 290, 300, 308]; // pure violet-to-magenta range only
    const pts = Array.from({ length: N }, () => ({
      x:   Math.random() * c.width,
      y:   Math.random() * c.height,
      vx:  (Math.random() - .5) * .28,
      vy:  (Math.random() - .5) * .28,
      r:   Math.random() * 1.2 + .5,
      hue: HUES[Math.floor(Math.random() * HUES.length)],
      alpha: .55 + Math.random() * .35,
    }));

    // ── Soft ambient glows — fixed positions, violet only ──
    // These are CSS-rendered, not canvas, so they're perfectly smooth
    // (Canvas version deliberately kept minimal)
    const GLOWS = [
      { cx: .15, cy: .35, r: 320, hue: 272, a: 0.022 },
      { cx: .82, cy: .20, r: 280, hue: 290, a: 0.018 },
      { cx: .50, cy: .75, r: 350, hue: 280, a: 0.016 },
      { cx: .92, cy: .80, r: 260, hue: 300, a: 0.014 },
    ];

    const draw = () => {
      // Full opaque clear every frame — NO trails, NO color buildup
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "rgba(2,2,10,1)";
      ctx.fillRect(0, 0, c.width, c.height);

      // Render fixed soft glows first (no movement = no discoloration)
      GLOWS.forEach(g => {
        const gx = g.cx * c.width;
        const gy = g.cy * c.height;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.r);
        grad.addColorStop(0,   `hsla(${g.hue},85%,55%,${g.a})`);
        grad.addColorStop(0.5, `hsla(${g.hue},80%,50%,${g.a * .4})`);
        grad.addColorStop(1,   "hsla(0,0%,0%,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, g.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Mouse proximity glow — violet only, very subtle
      if (mx > 0) {
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 160);
        mg.addColorStop(0,   "hsla(280,90%,60%,0.055)");
        mg.addColorStop(0.6, "hsla(280,80%,50%,0.018)");
        mg.addColorStop(1,   "hsla(0,0%,0%,0)");
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particles — crisp dots, no glow spread
      pts.forEach(p => {
        // Mouse attraction (gentle)
        if (mx > 0) {
          const dx = mx - p.x, dy = my - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180 && d > 0) {
            p.vx += (dx / d) * .006;
            p.vy += (dy / d) * .006;
          }
        }
        // Dampen & move
        p.vx *= .992; p.vy *= .992;
        p.x  += p.vx;  p.y  += p.vy;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width)  p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;

        // Crisp dot — just a small sharp circle, no radial gradient haze
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,72%,${p.alpha})`;
        ctx.fill();
      });

      // Connection lines — only violet/magenta hues, thin and sharp
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            const a = (1 - d / 100) * 0.28;
            const h = (pts[i].hue + pts[j].hue) / 2; // stays in violet-magenta range
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `hsla(${h},85%,68%,${a})`;
            ctx.lineWidth = .55;
            ctx.stroke();
          }
        }
      }

      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    }} />
  );
}

/* ── STATIC AMBIENT GRADIENT LAYER — CSS, perfectly smooth, no canvas artifacts ── */
function AmbientLayer() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: `
        radial-gradient(ellipse 60% 50% at 12% 30%, rgba(120,40,220,0.10) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 88% 15%, rgba(160,60,240,0.08) 0%, transparent 65%),
        radial-gradient(ellipse 70% 55% at 50% 80%, rgba(140,50,230,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 45% 35% at 95% 85%, rgba(200,80,255,0.06) 0%, transparent 60%)
      `,
      // No animation — static = no discoloration flicker
    }} />
  );
}

/* ── LOGO ── */
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" /><stop offset="1" stopColor="#e879f9" />
        </linearGradient>
        <linearGradient id="g2" x1="60" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" stopOpacity=".2" /><stop offset="1" stopColor="#e879f9" stopOpacity=".08" />
        </linearGradient>
      </defs>
      <path d="M30 3L55 16.5V43.5L30 57L5 43.5V16.5L30 3Z" stroke="url(#g1)" strokeWidth="1.4" fill="url(#g2)" />
      <path d="M30 11L48 21V41L30 51L12 41V21L30 11Z" stroke="rgba(168,85,247,0.2)" strokeWidth=".8" fill="none" />
      <path d="M21 43L30 17L39 43" stroke="url(#g1)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24.5 36H35.5" stroke="url(#g1)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="30" cy="17" r="2.8" fill="#e879f9" />
      <circle cx="5"  cy="16.5" r="1.8" fill="#a855f7" opacity=".6" />
      <circle cx="55" cy="16.5" r="1.8" fill="#a855f7" opacity=".6" />
      <circle cx="30" cy="57"   r="1.8" fill="#a855f7" opacity=".6" />
    </svg>
  );
}

/* ── CINEMATIC INTRO OVERLAY ── */
function IntroOverlay() {
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1200);
    const t2 = setTimeout(() => setGone(true), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (gone) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "#02020a",
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: fading ? 0 : 1,
      transition: "opacity .7s cubic-bezier(.4,0,.2,1)",
      pointerEvents: fading ? "none" : "all",
    }}>
      <div style={{ textAlign: "center" }}>
        <Logo size={56} />
        <div style={{
          fontFamily: "var(--font-m)", fontSize: ".7rem", letterSpacing: "4px",
          textTransform: "uppercase", color: "rgba(168,85,247,0.6)", marginTop: 20,
          animation: "fu .5s .1s both",
        }}>
          Initializing...
        </div>
        {/* Scanning bar */}
        <div style={{ width: 180, height: 1, background: "rgba(168,85,247,0.2)", margin: "16px auto 0", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, height: "100%", width: "40%",
            background: "linear-gradient(90deg, transparent, #a855f7, #e879f9, transparent)",
            animation: "scanBar 1s ease-in-out infinite",
          }} />
        </div>
      </div>
      <style>{`@keyframes scanBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }`}</style>
    </div>
  );
}
function HeroThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let animId, cleanupFn;

    const init = (THREE) => {
      // Always read size fresh after mount
      const W = el.offsetWidth || el.clientWidth || 600;
      const H = el.offsetHeight || el.clientHeight || 800;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      // Camera: fixed square-ish FOV, position based on scene units
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
      camera.position.set(0, 2, 10);
      camera.lookAt(0, 0, 0);

      // ── Master group: everything lives here ──
      const master = new THREE.Group();
      scene.add(master);

      // ─────────────────────────────────────────
      // PLANET — layered realistic sphere
      // ─────────────────────────────────────────
      // 1. Solid dark core
      const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x0a0318 });
      master.add(new THREE.Mesh(coreGeo, coreMat));

      // 2. Latitude/longitude grid lines for texture
      const gridGeo = new THREE.SphereGeometry(1.22, 18, 12);
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x6b21a8, wireframe: true, transparent: true, opacity: 0.10,
      });
      master.add(new THREE.Mesh(gridGeo, gridMat));

      // 3. Cyan rim glow — thin shell rendered with backside only for edge effect
      const rimGeo = new THREE.SphereGeometry(1.28, 64, 64);
      const rimMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7, transparent: true, opacity: 0.18, side: THREE.BackSide,
      });
      master.add(new THREE.Mesh(rimGeo, rimMat));

      // 4. Inner atmosphere
      const atmoGeo = new THREE.SphereGeometry(1.38, 32, 32);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: 0xe879f9, transparent: true, opacity: 0.06,
      });
      master.add(new THREE.Mesh(atmoGeo, atmoMat));

      // 5. Outer haze
      const hazeGeo = new THREE.SphereGeometry(1.55, 32, 32);
      const hazeMat = new THREE.MeshBasicMaterial({
        color: 0x7c3aed, transparent: true, opacity: 0.03,
      });
      master.add(new THREE.Mesh(hazeGeo, hazeMat));

      // ─────────────────────────────────────────
      // ORBIT RINGS — true circles (r, r), tilted via euler
      // Each ring tilted so they fan out as a beautiful orrery
      // ─────────────────────────────────────────
      const makeCircle = (r, color, opacity) => {
        const pts = [];
        const SEG = 200;
        for (let i = 0; i <= SEG; i++) {
          const a = (i / SEG) * Math.PI * 2;
          pts.push(new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        return new THREE.LineLoop(geo, mat);
      };

      // Orbit definitions: [radius, tiltX (pitch), tiltZ (roll), color, opacity]
      const orbitDefs = [
        { r: 2.0,  tiltX:  0.25, tiltZ:  0.0,  color: 0xa855f7, op: 0.72 },
        { r: 2.8,  tiltX: -0.55, tiltZ:  0.3,  color: 0xe879f9, op: 0.55 },
        { r: 3.6,  tiltX:  0.80, tiltZ: -0.4,  color: 0xa855f7, op: 0.40 },
        { r: 4.5,  tiltX: -0.30, tiltZ:  0.6,  color: 0x22d3ee, op: 0.28 },
        { r: 5.4,  tiltX:  1.10, tiltZ: -0.2,  color: 0xe879f9, op: 0.18 },
      ];

      const orbitRings = orbitDefs.map(od => {
        const ring = makeCircle(od.r, od.color, od.op);
        ring.rotation.x = od.tiltX;
        ring.rotation.z = od.tiltZ;
        master.add(ring);
        return ring;
      });

      // ─────────────────────────────────────────
      // ORBITING DOTS — travel in local ring space → world space
      // ─────────────────────────────────────────
      const dotDefs = [
        { size: 0.10, color: 0xa855f7, speed: 0.55, phase: 0.0   },
        { size: 0.08, color: 0xe879f9, speed: 0.38, phase: 2.0   },
        { size: 0.07, color: 0xa855f7, speed: 0.27, phase: 4.0   },
        { size: 0.06, color: 0x22d3ee, speed: 0.19, phase: 1.2   },
        { size: 0.05, color: 0xe879f9, speed: 0.13, phase: 3.5   },
      ];

      const orbitDots = orbitDefs.map((od, i) => {
        const dd = dotDefs[i];
        const geo = new THREE.SphereGeometry(dd.size, 12, 12);
        const mat = new THREE.MeshBasicMaterial({ color: dd.color });
        const dot = new THREE.Mesh(geo, mat);
        scene.add(dot); // world-space so we manually compute position
        return {
          dot,
          r: od.r,
          tiltX: od.tiltX,
          tiltZ: od.tiltZ,
          speed: dd.speed,
          angle: dd.phase,
        };
      });

      // ─────────────────────────────────────────
      // STARFIELD
      // ─────────────────────────────────────────
      const STARS = 320;
      const starPos = new Float32Array(STARS * 3);
      for (let i = 0; i < STARS; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 12 + Math.random() * 10;
        starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i*3+2] = r * Math.cos(phi);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xa855f7, size: 0.03, transparent: true, opacity: 0.50,
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      // ─────────────────────────────────────────
      // MOUSE PARALLAX
      // ─────────────────────────────────────────
      let targetRY = 0, targetRX = 0;
      const onMouse = e => {
        targetRY = ((e.clientX / window.innerWidth)  - 0.5) * 0.5;
        targetRX = ((e.clientY / window.innerHeight) - 0.5) * 0.3;
      };
      window.addEventListener("mousemove", onMouse);

      // ─────────────────────────────────────────
      // RESIZE
      // ─────────────────────────────────────────
      const onResize = () => {
        const w = el.offsetWidth, h = el.offsetHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // ─────────────────────────────────────────
      // ANIMATE
      // ─────────────────────────────────────────
      const _euler = new THREE.Euler();
      const _vec   = new THREE.Vector3();

      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Smooth mouse parallax on master group
        master.rotation.y += (targetRY - master.rotation.y) * 0.04;
        master.rotation.x += (-targetRX - master.rotation.x) * 0.04;

        // Slow planet self-spin (child index 0 = core)
        master.children[0].rotation.y += 0.0025;
        master.children[1].rotation.y += 0.0015; // grid slightly different speed

        // Stars drift
        stars.rotation.y += 0.0003;

        // Orbit dots — compute world-space position from ring's local circle
        orbitDots.forEach(od => {
          od.angle += od.speed * 0.009;
          // Local position on the circle (in the ring's XZ plane before tilt)
          const lx = od.r * Math.cos(od.angle);
          const lz = od.r * Math.sin(od.angle);

          // Apply the same tilt as the ring (tiltX, tiltZ) via euler
          _euler.set(od.tiltX, 0, od.tiltZ);
          _vec.set(lx, 0, lz).applyEuler(_euler);

          // Then apply master group rotation to dot so it tracks correctly
          _vec.applyEuler(master.rotation);

          od.dot.position.copy(_vec);
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
      // Defer one frame so hero-right is fully laid out before reading dimensions
      const raf = requestAnimationFrame(() => { cleanupFn = init(window.THREE); });
      return () => { cancelAnimationFrame(raf); cleanupFn && cleanupFn(); };
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      requestAnimationFrame(() => { cleanupFn = init(window.THREE); });
    };
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
        color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.13,
      });
      const tk = new THREE.Mesh(tkGeo, tkMat);
      scene.add(tk);

      // Second outer ring
      const rGeo = new THREE.TorusGeometry(2.8, 0.005, 2, 140);
      const rMat = new THREE.MeshBasicMaterial({ color: 0xe879f9, transparent: true, opacity: 0.18 });
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
        color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.09,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const geo2 = new THREE.OctahedronGeometry(3, 0);
      const mat2 = new THREE.MeshBasicMaterial({ color: 0xe879f9, wireframe: true, transparent: true, opacity: 0.07 });
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
  return <span className="tc">{text}<span style={{ borderRight: "2px solid var(--neon-m)", animation: "blink 1s step-end infinite", marginLeft: 1 }} /></span>;
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
    role: "Software Engineer 1", company: "Hewlett Packard Enterprise", period: "Feb 2024 – Jul 2025 · Bangalore, India", color: "#a855f7",
    pts: [
      "Built a <strong>Python automation framework</strong> for hardware self-installation workflows, cutting component replacement runtime by <strong>50%</strong> and removing manual intervention across 3 node types in enterprise storage systems.",
      "Designed and shipped <strong>RESTful backend APIs</strong> and real-time monitoring dashboards to scale distributed storage clusters from <strong>8 to 16 nodes</strong>, supporting 6 PB+ deployments with live visibility into cluster health metrics.",
      "Built a <strong>GPT-3.5 internal diagnostic chatbot</strong> with RAG-based contextual retrieval, achieving sub-500 ms response latency and reducing engineer triage time on storage incidents.",
      "Wrote integration tests using Python unittest to validate <strong>Fibre Channel I/O</strong> operations on block sizes above 256 KB, lifting reliability metrics across 2 enterprise storage product lines.",
    ],
  },
  {
    role: "HubSpot Automations Engineer", company: "BluMountain (Remote)", period: "Feb 2023 – Aug 2023", color: "#e879f9",
    pts: [
      "Designed and automated backend CRM workflows via <strong>REST API integrations</strong> across 3 platforms (HubSpot, Zapier, Salesforce), improving data consistency and eliminating repetitive manual pipeline operations.",
      "Built analytics dashboards to process <strong>multi-touch engagement data</strong> for a growing SaaS customer base, enabling scalable reporting without manual data pulls.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Baseline",
    type: "Full Stack / AI / DevOps",
    desc: "Led backend and DevOps for a 10-person team building an AI-powered iOS habit tracker. Designed a 5-layer microservices architecture with API Gateway, Business Logic, and AI Orchestration. Deployed on Kubernetes with horizontal scaling and a dual data layer (PostgreSQL + Redis).",
    tech: ["React Native", "TypeScript", "Node.js", "Flask", "PostgreSQL", "Redis", "Firebase", "Docker", "Kubernetes"],
    github: null,
  },
  {
    title: "BERT Shortcut Learning",
    type: "NLP / Deep Learning Research",
    desc: "Fine-tuned BERT-base-uncased across 4 fact-verification datasets, reaching 79.5% accuracy with macro F1 of 0.80. Implemented L-BFGS temperature calibration reducing ECE by up to 0.066, and built a NEI hard negative mining pipeline lifting PubHealth NEI recall from 0.37 to 0.88.",
    tech: ["Python", "PyTorch", "HuggingFace", "Scikit-learn", "BERT", "NLP"],
    github: null,
  },
  {
    title: "Sahayata",
    type: "Full Stack / NLP",
    desc: "Designed RESTful APIs and a full-stack emergency triage app with NLP-based prioritization in Flask and React. Handles 100+ concurrent users and 500+ requests per hour at sub-500 ms response time.",
    tech: ["React", "Flask", "Python", "MySQL", "Node.js", "Express"],
    github: "https://github.com/Arya-Wadhwani07/dev-swe-emergencyresponse",
  },
  {
    title: "Life-E-Line",
    type: "Backend / Microservices",
    desc: "Backend microservice for inter-hospital organ donation coordination using async request handling in Node.js, sustaining 1,000+ RPS during load tests with MongoDB-backed data consistency.",
    tech: ["Node.js", "Express", "MongoDB", "React"],
    github: "https://github.com/Arya-Wadhwani07",
  },
  {
    title: "HPE Diagnostic Chatbot",
    type: "AI / LLM Engineering",
    desc: "GPT-3.5 powered internal chatbot with RAG-based contextual retrieval for HPE storage engineers. Sub-500 ms latency, integrated into live production incident triage workflows.",
    tech: ["Python", "GPT-3.5", "RAG", "LangChain", "Flask"],
    github: null,
  },
  {
    title: "EZBUY",
    type: "Web Scraping / Data",
    desc: "Price comparison aggregator that scrapes Flipkart and Amazon in real time to surface the best deals across platforms instantly.",
    tech: ["Python", "BeautifulSoup", "Scrapy", "Flask", "JavaScript"],
    github: "https://github.com/Arya-Wadhwani07/EZBUY",
  },
];

const SKILLS_DATA = [
  { g: "Languages",            t: ["Python", "Java", "C++", "Go", "JavaScript", "TypeScript", "SQL"] },
  { g: "Backend & Systems",    t: ["RESTful API Design", "Microservices", "Multithreading", "Async I/O", "Distributed Systems", "System Design"] },
  { g: "Frameworks & Libraries", t: ["Flask", "Node.js", "Express", "Django", "React", "TensorFlow", "PyTorch", "Scikit-learn"] },
  { g: "Databases",            t: ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis"] },
  { g: "Cloud, DevOps & Testing", t: ["AWS (EC2, S3)", "Docker", "Kubernetes", "Git", "CI/CD Pipelines", "PyTest", "Jest"] },
  { g: "AI / ML",              t: ["BERT", "HuggingFace", "RAG", "LangChain", "GPT APIs", "NLP", "Fine-tuning", "Scikit-learn"] },
  { g: "Core CS",              t: ["Data Structures & Algorithms", "OOP", "Agile", "Kanban", "System Design"] },
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

  // Browser tab title
  useEffect(() => {
    document.title = "Arya Wadhwani | Portfolio";
  }, []);
  return (
    <>
      <G />
      <IntroOverlay />
      <Cursor />
      <NeonParticleField />
      <AmbientLayer />

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
          <a href="https://drive.google.com/file/d/13IXOtp5tG8QycAtTt_JwhG3y6i0XgZ9c/view?usp=share_link" target="_blank" rel="noopener noreferrer" className="nav-cta">
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
          <h1 className="hero-name">Arya<span className="grad">Wadhwani</span></h1>
          <div className="hero-row">
            <div className="hero-line" />
            <p className="hero-sub"><Typed strings={["Software Development Engineer","AI and Systems Builder","USC MS Computer Science","Building What Matters"]} /></p>
          </div>
          <div className="hero-cta">
            <a href="#projects" className="btn-p">View Projects ↗</a>
            <a href="#contact"  className="btn-s">Get In Touch</a>
            <a href="https://drive.google.com/file/d/13IXOtp5tG8QycAtTt_JwhG3y6i0XgZ9c/view?usp=share_link" target="_blank" rel="noopener noreferrer" className="btn-s">{DOC_ICON} Resume</a>
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
                  <div className={`sc holo-card reveal d${i+1}`} key={i}><div className="sn">{n}</div><div className="sl2">{l}</div></div>
                ))}
              </div>
            </div>
            <div className="right-col">
              {/* PHOTO */}
              <div className="photo-ph reveal d1" style={{ padding: 0, border: "none", background: "none" }}>
                <img
                  src="/arya_portrait.png"
                  alt="Arya Wadhwani at Hewlett Packard Enterprise"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    borderRadius: "var(--r)",
                    border: "2px solid rgba(168,85,247,0.35)",
                    boxShadow: "0 0 40px rgba(168,85,247,0.15), 0 0 80px rgba(168,85,247,0.06)",
                    display: "block",
                  }}
                />
              </div>
              {/* TERMINAL */}
              <div className="term-card holo-card reveal d2">
                <div className="term-hdr">
                  <div className="td" style={{ background:"#ff5f57" }} />
                  <div className="td" style={{ background:"#ffbd2e" }} />
                  <div className="td" style={{ background:"#28ca41" }} />
                  <span style={{ fontFamily:"var(--font-m)", fontSize:".6rem", color:"var(--muted)", marginLeft:8 }}>arya@portfolio:~</span>
                </div>
                <div className="term-bd">
                  {[["$ whoami","arya_jay_wadhwani"],["$ location","Los Angeles, CA"],["$ education","USC MS CS · GPA 3.65"],["$ prev_role","HPE Software Engineer 1"],["$ focus","SWE · AI/ML · Systems"],["$ open_to","Full-time SWE / ML Roles"]].map(([cmd,out],i)=>(
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
              { deg:"Master of Science, Computer Science", school:"University of Southern California", loc:"Los Angeles, CA", period:"Aug 2025 – May 2027", gpa:"3.65", gu:"GPA / 4.0", courses:["Analysis of Algorithms","Database Systems","Software Engineering","Machine Learning"], n:"01" },
              { deg:"B.Tech, Computer Science and Engineering", school:"Vellore Institute of Technology", loc:"Tamil Nadu, India", period:"Sept 2020 – May 2024", gpa:"9.58", gu:"CGPA / 10", courses:["Operating Systems","Data Structures & Algorithms","Networks and Communication"], n:"02" },
              { deg:"ISC 12th Standard", school:"The Bishop's School Junior College", loc:"Camp, Pune", period:"June 2018 – June 2020", gpa:"96%", gu:"Percentage", courses:["Physics","Chemistry","Mathematics","Computer Science"], n:"03" },
              { deg:"ICSE 10th Standard", school:"The Bishop's School", loc:"Camp, Pune", period:"June 2017 – May 2018", gpa:"96%", gu:"Percentage", courses:["Mathematics","Science","Computer Applications","Literature"], n:"04" },
            ].map((e,i)=>(
              <div className={`edu-c holo-card reveal d${(i%2)+1}`} key={i}>
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
              <div className={`ei reveal d${(i%3)+1}`} key={i} style={{ transition: "transform .3s cubic-bezier(.4,0,.2,1)" }}>
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
              <div className={`pc holo-card reveal d${(i%3)+1}`} key={i}>
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
        <div className="sw" style={{ position:"relative", zIndex:1 }}>
          <div className="sl reveal">Skills</div>
          <h2 className="st reveal d1">Technical Arsenal</h2>
          <div className="skg">
            {SKILLS_DATA.map((g,i)=>(
              <div className={`skgr holo-card reveal d${(i%4)+1}`} key={i}>
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
              <div className={`certc holo-card reveal d${(i%3)+1}`} key={i}>
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
              <div className={`achi holo-card reveal d${(i%2)+1}`} key={i}>
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
        <div className="cglow" style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.10) 0%, rgba(232,121,249,0.05) 40%, transparent 70%)" }} />
        <div className="ci">
          <div className="sl reveal" style={{ justifyContent:"center" }}>Contact</div>
          <h2 className="ctitle reveal d1">Let's Build<br /><span className="grad2">Something.</span></h2>
          <p className="csub reveal d2">Whether you're a recruiter, founder, or fellow builder, I'm always open to conversations about ambitious ideas and great engineering.</p>
          <div className="reveal d3"><a href="mailto:arya.wadhwani@gmail.com" className="cemail">arya.wadhwani@gmail.com</a></div>
          <div className="clinks reveal d4">
            <a href="https://linkedin.com/in/arya-wadhwani" target="_blank" rel="noopener noreferrer" className="clk">{LI_ICON} LinkedIn</a>
            <a href="https://github.com/Arya-Wadhwani07" target="_blank" rel="noopener noreferrer" className="clk">{GH_ICON} GitHub</a>
            <a href="tel:+12132964961" className="clk">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.15 2.28 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              (213) 296-4961
            </a>
            <a href="https://drive.google.com/file/d/13IXOtp5tG8QycAtTt_JwhG3y6i0XgZ9c/view?usp=share_link" target="_blank" rel="noopener noreferrer" className="clk">{DOC_ICON} Resume</a>
          </div>
        </div>
      </section>

      <footer>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 }}><Logo size={20} /><span style={{ background:"linear-gradient(135deg,#a855f7,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontFamily:"var(--font-h)", fontWeight:800, fontSize:".9rem", letterSpacing:"-.3px" }}>Arya Jay Wadhwani</span></div>
        Built with React &nbsp;·&nbsp; {new Date().getFullYear()}
        <div style={{ opacity:.4, fontSize:".58rem", marginTop:6, letterSpacing:3 }}>// designed to ship. built to scale.</div>
      </footer>
    </>
  );
}