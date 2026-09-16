import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, ArrowUpRight, Plus, Send, Check, Github, Linkedin, Mail } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'hero', label: 'Intro', num: '00' },
  { id: 'work', label: 'Work', num: '01' },
  { id: 'about', label: 'About', num: '02' },
  { id: 'contact', label: 'Contact', num: '03' },
];

const PROJECTS = [
  {
    id: 'northlight',
    title: 'Northlight',
    year: '2024',
    category: 'Product',
    summary: 'A dashboard for renewable energy co-ops',
    description:
      'Northlight helps small renewable co-ops track output, usage, and billing across hundreds of sites from one screen. I led the interface design and built the front end, including the live charting layer.',
    tags: ['React', 'D3', 'TypeScript'],
  },
  {
    id: 'fieldnote',
    title: 'Fieldnote',
    year: '2023',
    category: 'Product',
    summary: 'An offline-first journaling app',
    description:
      'Fieldnote is built around short daily entries and a calendar view that surfaces old ones at the right time. Every screen works fully offline, with sync happening quietly in the background.',
    tags: ['Swift', 'CoreData'],
  },
  {
    id: 'constellate',
    title: 'Constellate',
    year: '2023',
    category: 'Brand',
    summary: 'Identity and site for an astronomy nonprofit',
    description:
      'Constellate runs astronomy nights for kids in underfunded schools. I designed the mark, the printed materials, and the site, using a palette and type system that reads well projected in a dark gym.',
    tags: ['Figma', 'Webflow'],
  },
  {
    id: 'loom',
    title: 'Loom',
    year: '2022',
    category: 'Systems',
    summary: 'A design system for a fintech team',
    description:
      'Loom is the shared component library and documentation site a 40-person product team now ships from. Time from design to production release dropped by roughly half in the two quarters after launch.',
    tags: ['Figma', 'Storybook', 'React'],
  },
];

const FILTERS = ['All', 'Product', 'Brand', 'Systems'];

const SKILLS = [
  { name: 'Product Design', note: 'Shaping flows that get out of the way' },
  { name: 'Front-end Engineering', note: 'React and TypeScript, mostly' },
  { name: 'Design Systems', note: 'Tokens and docs people actually use' },
  { name: 'Data Visualization', note: 'Making spreadsheets legible' },
  { name: 'Prototyping', note: 'Fast, disposable, and honest' },
  { name: 'Brand Identity', note: 'Marks that hold up at any size' },
  { name: 'Typography', note: 'Setting type like it matters' },
  { name: 'Accessibility', note: 'Designing for the edges first' },
];

const EXPERIENCE = [
  { period: '2024 — Now', role: 'Design Engineer', place: 'Independent' },
  { period: '2021 — 2024', role: 'Senior Product Designer', place: 'Meridian Pay' },
  { period: '2019 — 2021', role: 'Product Designer', place: 'Loop Health' },
  { period: '2017 — 2019', role: 'UX/UI Designer', place: 'Studio Atlas' },
];

export default function Portfolio() {
  const [mode, setMode] = useState('day');
  const [activeSection, setActiveSection] = useState('hero');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedProject, setExpandedProject] = useState('northlight');
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [scrollProgress, setScrollProgress] = useState(0);

  const cursorRef = useRef(null);
  const cursorInnerRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const sectionRefs = useRef({});

  const registerSection = useCallback((id) => (el) => {
    sectionRefs.current[id] = el;
  }, []);

  // scroll progress + custom cursor
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setScrollProgress(Math.min(1, Math.max(0, scrolled)));
    };
    const onMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  // section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.dataset.section);
        });
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // magnetic dot-grid canvas in hero
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = heroRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const spacing = 32;
    const mouse = { x: -9999, y: -9999 };
    let raf;

    const resize = () => {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    const dotColor = mode === 'day' ? 'rgba(10,10,11,0.16)' : 'rgba(250,250,250,0.16)';
    const blueColor = '#1E3FFF';

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let x = 0; x <= w; x += spacing) {
        for (let y = 0; y <= h; y += spacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const max = 150;
          const force = Math.max(0, 1 - dist / max);
          const ox = force * dx * 0.18;
          const oy = force * dy * 0.18;
          const r = 1.4 + force * 2.2;
          ctx.beginPath();
          ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
          ctx.fillStyle = force > 0.06 ? blueColor : dotColor;
          ctx.globalAlpha = force > 0.06 ? 0.55 + force * 0.45 : 1;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [mode]);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredProjects =
    activeFilter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setFormStatus('sent');
    setTimeout(() => {
      setFormStatus('idle');
      setFormState({ name: '', email: '', message: '' });
    }, 3200);
  };

  return (
    <div className="pf-root" data-mode={mode}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .pf-root {
          --blue: #1E3FFF;
          --radius: 3px;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          position: relative;
          transition: background-color 0.4s ease, color 0.4s ease;
          overflow-x: hidden;
        }
        .pf-root[data-mode='day'] {
          --bg: #FAFAFA;
          --fg: #0A0A0B;
          --muted: #6B6F76;
          --border: rgba(10,10,11,0.14);
          --blue-tint: #E7EBFF;
          --surface: #FFFFFF;
          background: var(--bg);
          color: var(--fg);
        }
        .pf-root[data-mode='night'] {
          --bg: #0A0A0B;
          --fg: #FAFAFA;
          --muted: #9A9EA6;
          --border: rgba(250,250,250,0.16);
          --blue-tint: #131A3E;
          --surface: #131315;
          background: var(--bg);
          color: var(--fg);
        }
        .pf-root * { box-sizing: border-box; }
        .pf-root h1, .pf-root h2, .pf-root h3 {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .pf-root p { margin: 0; }
        .pf-mono { font-family: 'IBM Plex Mono', monospace; }

        .pf-progress {
          position: fixed; top: 0; left: 0; height: 2px; background: var(--blue);
          z-index: 60; transition: width 0.1s linear;
        }

        .pf-cursor {
          position: fixed; top: 0; left: 0; width: 14px; height: 14px;
          margin-left: -7px; margin-top: -7px; border-radius: 50%;
          background: var(--blue); pointer-events: none; z-index: 70;
          transition: transform 0.05s linear, opacity 0.2s ease;
          mix-blend-mode: difference;
        }
        @media (pointer: coarse) { .pf-cursor { display: none; } }

        .pf-shell { display: flex; min-height: 100vh; }
        .pf-rail {
          width: 84px; flex-shrink: 0; position: sticky; top: 0; height: 100vh;
          display: flex; flex-direction: column; align-items: center;
          justify-content: space-between; padding: 28px 0; border-right: 1px solid var(--border);
        }
        .pf-logo {
          font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
          writing-mode: vertical-rl; letter-spacing: 0.02em;
        }
        .pf-nav { display: flex; flex-direction: column; gap: 22px; align-items: center; }
        .pf-nav-item {
          background: none; border: none; cursor: pointer; padding: 6px; color: var(--muted);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .pf-nav-item span.pf-num { font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
        .pf-nav-item span.pf-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--border);
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .pf-nav-item[data-active='true'] { color: var(--fg); }
        .pf-nav-item[data-active='true'] span.pf-dot { background: var(--blue); transform: scale(1.5); }

        .pf-toggle {
          width: 44px; height: 24px; border-radius: 12px; border: 1px solid var(--border);
          background: var(--surface); position: relative; cursor: pointer; padding: 0;
        }
        .pf-toggle-thumb {
          position: absolute; top: 1px; left: 1px; width: 20px; height: 20px; border-radius: 50%;
          background: var(--fg); color: var(--bg); display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s ease; transform: translateX(0);
        }
        .pf-root[data-mode='night'] .pf-toggle-thumb { transform: translateX(20px); }

        .pf-main { flex: 1; min-width: 0; }
        .pf-section { padding: 96px 56px; border-bottom: 1px solid var(--border); position: relative; }
        .pf-section:last-child { border-bottom: none; }

        .pf-hero { padding: 0; min-height: 92vh; display: flex; align-items: center; position: relative; overflow: hidden; }
        .pf-hero-canvas { position: absolute; inset: 0; }
        .pf-hero-content { position: relative; padding: 96px 56px; max-width: 760px; }
        .pf-hero h1 { font-size: clamp(44px, 7vw, 92px); line-height: 0.98; font-weight: 700; }
        .pf-hero-role { font-size: 20px; color: var(--muted); margin-top: 18px; }
        .pf-hero-pitch { max-width: 480px; margin-top: 22px; font-size: 16px; line-height: 1.6; color: var(--muted); }
        .pf-hero-actions { display: flex; align-items: center; gap: 28px; margin-top: 40px; }

        .pf-btn {
          font-family: 'Inter', sans-serif; font-weight: 500; font-size: 14px;
          padding: 13px 22px; border-radius: var(--radius); border: 1px solid var(--fg);
          background: var(--fg); color: var(--bg); cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .pf-btn:hover { background: var(--blue); border-color: var(--blue); color: #fff; }
        .pf-link {
          font-size: 14px; color: var(--fg); text-decoration: none; border-bottom: 1px solid var(--border);
          padding-bottom: 2px; cursor: pointer; transition: border-color 0.2s ease, color 0.2s ease;
        }
        .pf-link:hover { border-color: var(--blue); color: var(--blue); }

        .pf-section-head { display: flex; align-items: baseline; gap: 16px; margin-bottom: 48px; }
        .pf-section-head .pf-num { font-family: 'IBM Plex Mono', monospace; color: var(--blue); font-size: 14px; }
        .pf-section-head h2 { font-size: 32px; }

        .pf-filters { display: flex; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; }
        .pf-filter-btn {
          font-family: 'Inter', sans-serif; font-size: 13px; padding: 8px 16px; border-radius: 999px;
          border: 1px solid var(--border); background: transparent; color: var(--muted); cursor: pointer;
          transition: all 0.2s ease;
        }
        .pf-filter-btn[data-active='true'] { background: var(--fg); border-color: var(--fg); color: var(--bg); }
        .pf-filter-btn:hover:not([data-active='true']) { border-color: var(--blue); color: var(--blue); }

        .pf-project { border-top: 1px solid var(--border); }
        .pf-project:last-child { border-bottom: 1px solid var(--border); }
        .pf-project-head {
          width: 100%; background: none; border: none; cursor: pointer; padding: 26px 4px;
          display: flex; align-items: center; justify-content: space-between; gap: 24px; text-align: left; color: var(--fg);
        }
        .pf-project-title { display: flex; align-items: baseline; gap: 18px; }
        .pf-project-title h3 { font-size: 22px; font-weight: 600; }
        .pf-project-year { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--muted); }
        .pf-project-summary { font-size: 14px; color: var(--muted); margin-top: 4px; }
        .pf-project-toggle {
          width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: transform 0.3s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .pf-project[data-open='true'] .pf-project-toggle { transform: rotate(45deg); background: var(--blue); border-color: var(--blue); color: #fff; }
        .pf-project-body { overflow: hidden; max-height: 0; transition: max-height 0.4s ease; }
        .pf-project[data-open='true'] .pf-project-body { max-height: 260px; }
        .pf-project-body-inner { padding: 0 4px 30px; display: flex; gap: 40px; flex-wrap: wrap; }
        .pf-project-desc { max-width: 520px; font-size: 15px; line-height: 1.65; color: var(--muted); }
        .pf-tags { display: flex; gap: 8px; flex-wrap: wrap; align-content: flex-start; }
        .pf-tag {
          font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding: 6px 10px;
          border-radius: 999px; background: var(--blue-tint); color: var(--blue); height: fit-content;
        }

        .pf-about-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 64px; }
        .pf-skills { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); }
        .pf-skill {
          background: var(--bg); padding: 20px 18px; cursor: default; position: relative; overflow: hidden; min-height: 84px;
        }
        .pf-skill-name, .pf-skill-note {
          position: absolute; inset: 20px 18px; transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .pf-skill-name { font-weight: 600; font-size: 15px; }
        .pf-skill-note { font-size: 13px; color: var(--blue); opacity: 0; transform: translateY(6px); }
        .pf-skill:hover .pf-skill-name { opacity: 0; transform: translateY(-6px); }
        .pf-skill:hover .pf-skill-note { opacity: 1; transform: translateY(0); }

        .pf-timeline { display: flex; flex-direction: column; }
        .pf-timeline-item { display: flex; gap: 18px; padding: 16px 0; border-top: 1px solid var(--border); }
        .pf-timeline-item:last-child { border-bottom: 1px solid var(--border); }
        .pf-timeline-period { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--muted); width: 96px; flex-shrink: 0; padding-top: 3px; }
        .pf-timeline-role { font-weight: 600; font-size: 15px; }
        .pf-timeline-place { font-size: 13px; color: var(--muted); margin-top: 2px; }

        .pf-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .pf-field { margin-bottom: 22px; }
        .pf-field label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 8px; }
        .pf-field input, .pf-field textarea {
          width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border);
          color: var(--fg); font-family: 'Inter', sans-serif; font-size: 15px; padding: 8px 2px;
          transition: border-color 0.2s ease; resize: none;
        }
        .pf-field input:focus, .pf-field textarea:focus { outline: none; border-color: var(--blue); }
        .pf-social { display: flex; gap: 16px; margin-top: 8px; }
        .pf-social a {
          width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); color: var(--fg);
          display: flex; align-items: center; justify-content: center; text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .pf-social a:hover { border-color: var(--blue); color: var(--blue); }

        .pf-footer { padding: 28px 56px; display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); }

        @media (max-width: 880px) {
          .pf-rail { display: none; }
          .pf-section { padding: 64px 24px; }
          .pf-hero-content { padding: 64px 24px; }
          .pf-about-grid, .pf-contact-grid { grid-template-columns: 1fr; gap: 40px; }
          .pf-skills { grid-template-columns: 1fr 1fr; }
          .pf-cursor { display: none; }
          .pf-footer { padding: 24px; flex-direction: column; gap: 6px; }
        }
      `}</style>

      <div className="pf-progress" style={{ width: `${scrollProgress * 100}%` }} />
      <div className="pf-cursor" ref={cursorRef} />

      <div className="pf-shell">
        <aside className="pf-rail">
          <div className="pf-logo">JORDAN REYES</div>
          <nav className="pf-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className="pf-nav-item"
                data-active={activeSection === item.id}
                onClick={() => scrollTo(item.id)}
                aria-label={item.label}
              >
                <span className="pf-dot" />
                <span className="pf-num">{item.num}</span>
              </button>
            ))}
          </nav>
          <button
            className="pf-toggle"
            onClick={() => setMode((m) => (m === 'day' ? 'night' : 'day'))}
            aria-label="Toggle day and night mode"
          >
            <span className="pf-toggle-thumb">
              {mode === 'day' ? <Sun size={12} /> : <Moon size={12} />}
            </span>
          </button>
        </aside>

        <main className="pf-main">
          <section
            className="pf-section pf-hero"
            ref={registerSection('hero')}
            data-section="hero"
            id="hero"
          >
            <div className="pf-hero-canvas" ref={heroRef}>
              <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="pf-hero-content">
              <h1>Jordan Reyes</h1>
              <p className="pf-hero-role">Design engineer</p>
              <p className="pf-hero-pitch">
                I design products end to end, then build the front end that ships them. Lately I've
                been helping small teams turn complicated systems into something people can actually use.
              </p>
              <div className="pf-hero-actions">
                <button className="pf-btn" onClick={() => scrollTo('work')}>
                  See the work <ArrowUpRight size={16} />
                </button>
                <a className="pf-link" onClick={() => scrollTo('contact')}>Get in touch</a>
              </div>
            </div>
          </section>

          <section className="pf-section" ref={registerSection('work')} data-section="work" id="work">
            <div className="pf-section-head">
              <span className="pf-num">01</span>
              <h2>Work</h2>
            </div>
            <div className="pf-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className="pf-filter-btn"
                  data-active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div>
              {filteredProjects.map((p) => {
                const open = expandedProject === p.id;
                return (
                  <div className="pf-project" data-open={open} key={p.id}>
                    <button
                      className="pf-project-head"
                      onClick={() => setExpandedProject(open ? null : p.id)}
                    >
                      <div>
                        <div className="pf-project-title">
                          <h3>{p.title}</h3>
                          <span className="pf-project-year pf-mono">{p.year}</span>
                        </div>
                        <p className="pf-project-summary">{p.summary}</p>
                      </div>
                      <span className="pf-project-toggle"><Plus size={14} /></span>
                    </button>
                    <div className="pf-project-body">
                      <div className="pf-project-body-inner">
                        <p className="pf-project-desc">{p.description}</p>
                        <div className="pf-tags">
                          {p.tags.map((t) => (
                            <span className="pf-tag" key={t}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="pf-section" ref={registerSection('about')} data-section="about" id="about">
            <div className="pf-section-head">
              <span className="pf-num">02</span>
              <h2>About</h2>
            </div>
            <div className="pf-about-grid">
              <div className="pf-skills">
                {SKILLS.map((s) => (
                  <div className="pf-skill" key={s.name}>
                    <span className="pf-skill-name">{s.name}</span>
                    <span className="pf-skill-note">{s.note}</span>
                  </div>
                ))}
              </div>
              <div className="pf-timeline">
                {EXPERIENCE.map((e) => (
                  <div className="pf-timeline-item" key={e.role + e.place}>
                    <div className="pf-timeline-period">{e.period}</div>
                    <div>
                      <div className="pf-timeline-role">{e.role}</div>
                      <div className="pf-timeline-place">{e.place}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="pf-section" ref={registerSection('contact')} data-section="contact" id="contact">
            <div className="pf-section-head">
              <span className="pf-num">03</span>
              <h2>Contact</h2>
            </div>
            <div className="pf-contact-grid">
              <div>
                <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 420 }}>
                  I'm open to new projects and short collaborations. Send a note and I'll reply within a couple of days.
                </p>
                <div className="pf-social">
                  <a href="mailto:jordan@example.com" aria-label="Email"><Mail size={17} /></a>
                  <a href="#" aria-label="GitHub"><Github size={17} /></a>
                  <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="pf-field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="pf-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="you@email.com"
                  />
                </div>
                <div className="pf-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="What are you working on?"
                  />
                </div>
                <button className="pf-btn" type="submit">
                  {formStatus === 'sent' ? (
                    <>Sent <Check size={16} /></>
                  ) : (
                    <>Send message <Send size={15} /></>
                  )}
                </button>
              </form>
            </div>
          </section>

          <footer className="pf-footer">
            <span>© 2026 Jordan Reyes</span>
            <span className="pf-mono">Based in the internet</span>
          </footer>
        </main>
      </div>
    </div>
  );


    <App />
  </StrictMode>,
)
