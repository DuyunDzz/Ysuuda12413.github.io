import { m } from 'framer-motion';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <m.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-8xl font-bold bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent"
      >
        404
      </m.h1>
      <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-zinc-400 mt-4"
      >
        Oops! Trang này không tồn tại.
      </m.p>
      <m.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = '/'}
        className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-xl transition-colors"
      >
        Quay lại trang chủ
      </m.button>
    </div>
  );
};
