import { m, AnimatePresence } from 'framer-motion';

export const Console = ({ show, lines }: { show: boolean; lines: string[] }) => {
  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 h-48 bg-zinc-900/90 backdrop-blur-2xl border-t border-white/10 z-[100] p-6 font-mono text-sm overflow-y-auto shadow-2xl"
        >
          <div className="max-w-5xl mx-auto">
            {lines.map((line, i) => (
              <m.div
                key={`${i}-${line.substring(0, 10)}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-emerald-500 mb-1"
              >
                <span className="text-zinc-500 mr-2">$</span>
                {line}
              </m.div>
            ))}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};
