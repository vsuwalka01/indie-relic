'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/lib/toastStore';
import { toastIn } from '@/lib/motion';
import { bagIcon } from './headerIconPaths';
import HeaderIconSvg from './HeaderIcon';

export default function ToastHost() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            variants={toastIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => dismiss(t.id)}
            className="pointer-events-auto flex items-center gap-3 bg-navy text-cream px-5 py-3 rounded-xl shadow-lg cursor-pointer"
          >
            <HeaderIconSvg icon={bagIcon} size={18} className="text-gold flex-shrink-0" />
            <span className="text-sm font-semibold whitespace-nowrap">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
