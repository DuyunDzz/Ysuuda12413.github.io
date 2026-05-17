import { useState, useCallback, useEffect, useRef } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { Background } from './components/Background';
import { Sidebar } from './components/Sidebar';
import { CodeBlock } from './components/CodeBlock';
import { Console } from './components/Console';
import { NotFound } from './components/NotFound';

const TAGS = [
  { name: 'Minecraft Client', color: 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200' },
  { name: 'Tools & Scripts', color: 'border-sky-400/60 bg-sky-500/10 text-sky-200' },
  { name: 'Reverse Engineering', color: 'border-violet-400/60 bg-violet-500/10 text-violet-200' },
  { name: 'Performance Tuning', color: 'border-zinc-400/60 bg-zinc-500/10 text-zinc-200' },
];

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Bangkok',
  dateStyle: 'full',
  timeStyle: 'long'
});

const FloatingShape = ({ className, delay = 0, duration = 20 }: { className?: string, delay?: number, duration?: number }) => (
  <m.div
    animate={{
      y: [0, -60, 0],
      x: [0, 40, 0],
      rotate: [0, 45, 0],
      scale: [1, 1.4, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={`fixed pointer-events-none blur-[120px] z-0 opacity-50 ${className}`}
  />
);

function App() {
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html') {
      setIsNotFound(true);
    }
  }, []);

  const runCode = useCallback(() => {
    setShowConsole(true);
    setConsoleLines([]);
    
    const now = new Date();
    const utc7Time = dateTimeFormatter.format(now);

    const lines = [
      `Current time (UTC+7): ${utc7Time}`,
      'Loading profile data...',
      'Name: DuyunDz',
      'Location: Vietnam',
      'Interests found: coding, modding, reverse engineering',
      'Profile loaded successfully!',
    ];

    lines.forEach((line, i) => {
      setTimeout(() => {
        setConsoleLines(prev => [...prev, line]);
      }, i * 300);
    });

    setTimeout(() => setShowConsole(false), 5000);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {isNotFound ? (
        <NotFound />
      ) : (
        <div className="min-h-screen relative overflow-hidden selection:bg-emerald-500/30">
          {/* Background Layering */}
          <div className="mesh-gradient" />
          <div className="noise" />
          <Background />
          
          {/* Decorative floating shapes with Gooey effect */}
          <div style={{ filter: 'url(#goo)' }} className="fixed inset-0 pointer-events-none z-0">
            <FloatingShape className="top-[-15%] left-[-15%] w-[50%] h-[50%] bg-emerald-500/30 rounded-full" duration={25} />
            <FloatingShape className="bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-sky-500/25 rounded-full" delay={2} duration={30} />
            <FloatingShape className="top-[20%] right-[10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full" delay={4} duration={20} />
            <FloatingShape className="bottom-[10%] left-[20%] w-[35%] h-[35%] bg-rose-500/15 rounded-full" delay={6} duration={28} />
          </div>

          <main className="container mx-auto px-4 py-6 md:py-12 flex items-center justify-center min-h-screen relative z-10">
            <m.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0, y: 100, scale: 0.95, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.8 }
              }}
              className="glass-card w-full max-w-5xl flex flex-col md:flex-row overflow-hidden perspective-1000"
            >
              <Sidebar />

              <div className="flex-1 p-5 md:p-10 relative z-10">
                <m.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                  <h2 className="text-xl md:text-3xl font-black mb-4 tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-white via-emerald-400 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                      Minecraft Client & Tool Developer · Phạm Hữu Duy
                    </span>
                  </h2>
                  
                  <m.div 
                    className="flex flex-wrap gap-1.5 mb-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.12, delayChildren: 0.8 }
                      }
                    }}
                  >
                    {TAGS.map((tag) => (
                      <m.span
                        key={tag.name}
                        variants={{
                          hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                          visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                        }}
                        whileHover={{ scale: 1.1, y: -4, transition: { duration: 0.2 } }}
                        className={`px-3 py-1 rounded-full border text-[9px] md:text-[11px] font-bold backdrop-blur-xl transition-all cursor-default ${tag.color} shadow-sm`}
                      >
                        {tag.name}
                      </m.span>
                    ))}
                  </m.div>

                  <p className="text-zinc-400 leading-relaxed max-w-xl text-sm md:text-base mb-6">
                    Mình tập trung xây các công cụ, script và client hỗ trợ trải nghiệm chơi Minecraft mượt, trực quan.
                  </p>

                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="max-w-2xl"
                  >
                    <CodeBlock onRun={runCode} />
                  </m.div>
                  <footer className="mt-5 pt-5 border-t border-white/5 text-zinc-500 text-[10px] flex items-center justify-between">
                    <p>© 2025 DuyunDz • Built with React & Vite</p>
                    <div className="flex items-center gap-x-2">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Available for work</span>
                    </div>
                  </footer>
                </m.div>
              </div>
            </m.div>
          </main>

          <Console show={showConsole} lines={consoleLines} />
        </div>
      )}
    </LazyMotion>
  );
}

export default App;
