import { useState, useEffect, useRef } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Facebook, Disc as Discord, Github } from 'lucide-react';

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    x.set(distanceX * 0.4);
    y.set(distanceY * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </m.div>
  );
};

interface LanyardData {
  data: {
    discord_status: string;
    activities: Array<{
      name: string;
      details?: string;
      state?: string;
      type: number;
    }>;
  };
}

export const Sidebar = () => {
  const [status, setStatus] = useState<'online' | 'idle' | 'dnd' | 'offline'>('offline');
  const userId = "1101376716670259210";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json: LanyardData = await res.json();
        setStatus(json.data.discord_status as any);
      } catch (err) {
        console.error('Lanyard error:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-rose-500',
    offline: 'bg-zinc-500',
  };

  return (
    <aside className="p-5 md:p-8 flex flex-col items-center w-full md:w-[280px] border-b md:border-b-0 md:border-r border-white/10 shrink-0">
      <m.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative group"
      >
        <img
          src="/img/avatar.jpg"
          alt="Avatar"
          className="size-24 rounded-full ring-4 ring-emerald-500/20 shadow-2xl transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute bottom-1 right-1 size-4.5 rounded-full border-2 border-zinc-900 ${statusColors[status]}`} />
      </m.div>

      <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mt-5"
      >
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Phạm Hữu Duy
        </h1>
        <p className="text-zinc-400 text-[11px] mt-1">@DuyunDz</p>
      </m.div>

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-5 w-full"
      >
        <a 
          href={`https://discord.com/users/${userId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <img 
            src={`https://lanyard.cnrad.dev/api/${userId}?theme=dark&showDisplayName=true`}
            alt="Discord Status"
            className="w-full rounded-md shadow-lg"
          />
        </a>
      </m.div>

      <p className="mt-5 text-center text-[13px] text-zinc-300 max-w-[200px] leading-relaxed">
        Minecraft client skidder & tool developer
      </p>

      <m.div 
        className="flex gap-x-4 mt-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 1 }
          }
        }}
      >
        {[
          { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61556575490667', color: 'hover:text-blue-500', shadow: 'hover:shadow-blue-500/50' },
          { icon: Discord, href: `https://discord.com/users/${userId}`, color: 'hover:text-indigo-500', shadow: 'hover:shadow-indigo-500/50' },
          { icon: Github, href: 'https://github.com/DuyunDzz', color: 'hover:text-white', shadow: 'hover:shadow-white/50' },
        ].map((item) => (
          <Magnetic key={item.href}>
            <m.a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 10 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ 
                y: -8,
                scale: 1.15,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className={`text-zinc-400 transition-all duration-300 p-3 rounded-2xl bg-white/5 border border-white/5 ${item.color} ${item.shadow} hover:bg-white/10 hover:border-white/20 shadow-xl backdrop-blur-md block`}
            >
              <item.icon size={22} />
            </m.a>
          </Magnetic>
        ))}
      </m.div>
    </aside>
  );
};
