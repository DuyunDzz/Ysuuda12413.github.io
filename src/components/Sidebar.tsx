import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Facebook, Disc as Discord, Github } from 'lucide-react';

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
    <aside className="p-4 md:p-5 flex flex-col items-center w-full md:w-[240px] border-b md:border-b-0 md:border-r border-white/10 shrink-0">
      <m.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative group"
      >
        <img
          src="/img/avatar.jpg"
          alt="Avatar"
          className="size-20 rounded-full ring-4 ring-emerald-500/20 shadow-2xl transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-zinc-900 ${statusColors[status]}`} />
      </m.div>

      <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mt-3"
      >
        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Phạm Hữu Duy
        </h1>
        <p className="text-zinc-400 text-[10px] mt-0.5">@DuyunDz</p>
      </m.div>

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-3 w-full"
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

      <p className="mt-3 text-center text-[11px] text-zinc-300 max-w-[160px]">
        Minecraft client skidder & tool developer
      </p>

      <m.div 
        className="flex gap-x-3 mt-5"
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
          <m.a
            key={item.href}
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
            className={`text-zinc-400 transition-all duration-300 p-2.5 rounded-2xl bg-white/5 border border-white/5 ${item.color} ${item.shadow} hover:bg-white/10 hover:border-white/20 shadow-xl backdrop-blur-md`}
          >
            <item.icon size={20} />
          </m.a>
        ))}
      </m.div>
    </aside>
  );
};
