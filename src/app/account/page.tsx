'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirdMark from '@/components/BirdMark';
import { pressable } from '@/lib/motion';
import { SectionLabel, DriftMotif, Chip, CropMarks } from '@/components/Ornaments';

type Step = 'phone' | 'otp' | 'success';

export default function AccountPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [notify, setNotify] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(29);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== 'otp') return;
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputsRef.current[idx + 1]?.focus();
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-navy/5 rounded-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
      >
        {/* Left brand panel */}
        <div className="flex flex-col items-center justify-center p-10 md:p-14 relative">
          <DriftMotif kind="flower" className="w-14 h-14 left-6 top-8 text-gold" />
          <DriftMotif kind="diamond" className="w-12 h-12 right-6 bottom-10 text-maroon" delay={1.3} />
          <SectionLabel index="01" className="text-maroon mb-6">Members&rsquo; entrance</SectionLabel>
          <div className="relative w-48 h-64">
            <CropMarks className="text-navy-dark -m-3" />
            <BirdMark className="w-full h-full" beat={0.9} />
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <Chip tone="navy">Order history</Chip>
            <Chip tone="gold">Early access</Chip>
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-cream m-4 md:m-6 rounded-2xl p-8 md:p-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex border-2 border-navy rounded-lg overflow-hidden mb-4">
                  <span className="flex items-center gap-2 px-4 bg-navy text-cream font-bold">🇮🇳 +91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="ENTER MOBILE NUMBER"
                    className="flex-1 px-4 py-3 bg-navy text-cream placeholder:text-cream/60 focus:outline-none tracking-wide"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-navy-dark/70 mb-6 cursor-pointer">
                  <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="accent-navy" />
                  Notify me with offers and updates
                </label>

                <motion.button
                  {...pressable}
                  disabled={phone.length !== 10}
                  onClick={() => setStep('otp')}
                  className="w-full py-4 bg-navy text-cream font-bold rounded-lg disabled:opacity-40 hover:bg-navy-dark transition-colors"
                >
                  SUBMIT
                </motion.button>

                <p className="text-center text-xs text-navy-dark/50 mt-6">
                  I accept that I have read & understood your{' '}
                  <a href="/privacy" className="underline">Privacy Policy</a> and T&amp;Cs.
                </p>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <h2 className="font-display text-xl font-bold text-navy-dark mb-2">OTP Verification</h2>
                <p className="text-navy-dark/60 text-sm">Verification code sent to</p>
                <p className="font-bold text-navy-dark mb-6">
                  +91 {phone}{' '}
                  <button onClick={() => setStep('phone')} className="text-xs underline font-normal ml-2">Edit</button>
                </p>

                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputsRef.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-14 h-14 text-center text-xl font-bold border-2 border-navy rounded-lg focus:outline-none focus:border-maroon"
                    />
                  ))}
                </div>

                <p className="text-navy-dark/50 text-sm mb-6">
                  {timer > 0 ? `Resend OTP in ${timer} Sec` : (
                    <button onClick={() => setTimer(29)} className="underline font-semibold">Resend OTP</button>
                  )}
                </p>

                <motion.button
                  {...pressable}
                  disabled={otp.some((d) => !d)}
                  onClick={() => setStep('success')}
                  className="w-full py-4 bg-navy text-cream font-bold rounded-lg disabled:opacity-40 hover:bg-navy-dark transition-colors"
                >
                  VERIFY
                </motion.button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="text-5xl mb-4"
                >
                  🎉
                </motion.div>
                <p className="font-display text-xl font-bold text-navy-dark">Congratulations!</p>
                <p className="font-display text-xl font-bold text-navy-dark">Login Successful</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
