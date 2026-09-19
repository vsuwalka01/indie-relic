'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirdMark from '@/components/BirdMark';
import { pressable } from '@/lib/motion';
import { SectionLabel, DriftMotif, Chip, CropMarks } from '@/components/Ornaments';
import type { PublicCustomer } from '@/lib/cms/customers';
import ProfileForm from './ProfileForm';
import ProfileView from './ProfileView';

type Step = 'phone' | 'otp' | 'details' | 'profile';

export default function AccountClient({ initialCustomer }: { initialCustomer: PublicCustomer | null }) {
  const [customer, setCustomer] = useState(initialCustomer);
  const [step, setStep] = useState<Step>(
    initialCustomer ? (initialCustomer.profileComplete ? 'profile' : 'details') : 'phone',
  );

  const [phone, setPhone] = useState('');
  const [notify, setNotify] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');
  const [notice, setNotice] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'sms' | 'voice'>('sms');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const requestCode = useCallback(async () => {
    setBusy(true);
    setError('');
    setDevCode('');
    setNotice('');
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Could not send a code');
        if (json.retryAfterMs) setCooldown(Math.ceil(json.retryAfterMs / 1000));
        return false;
      }
      setCooldown(Math.ceil((json.cooldownMs ?? 30000) / 1000));
      if (json.devCode) setDevCode(json.devCode);
      if (json.notice) setNotice(json.notice);
      setDeliveryMode(json.deliveryMode === 'voice' ? 'voice' : 'sms');
      setStep('otp');
      setOtp(['', '', '', '', '', '']);
      return true;
    } catch {
      setError('Network error — please try again');
      return false;
    } finally {
      setBusy(false);
    }
  }, [phone]);

  const verifyCode = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp.join('') }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'That code did not work');
        return;
      }
      setCustomer(json.customer);
      setStep(json.isNew ? 'details' : 'profile');
    } catch {
      setError('Network error — please try again');
    } finally {
      setBusy(false);
    }
  }, [phone, otp]);

  const handleOtpChange = (idx: number, val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits && val) return;

    // Pasting the whole code should fill every box, not just the first.
    if (digits.length > 1) {
      const next = [...otp];
      digits.split('').slice(0, 6).forEach((d, i) => { if (idx + i < 6) next[idx + i] = d; });
      setOtp(next);
      inputsRef.current[Math.min(idx + digits.length, 5)]?.focus();
      return;
    }

    const next = [...otp];
    next[idx] = digits;
    setOtp(next);
    if (digits && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const signedOut = () => {
    setCustomer(null);
    setStep('phone');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="craft-account-panel w-full max-w-4xl bg-navy/5 rounded-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
      >
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

        <div className="bg-cream m-4 md:m-6 rounded-2xl p-8 md:p-10 flex flex-col justify-center">
          <AnimatePresence initial={false}>
            {step === 'phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex border-2 border-navy rounded-lg overflow-hidden mb-4">
                  <span className="flex items-center gap-2 px-4 bg-navy text-cream font-bold">🇮🇳 +91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && phone.length === 10) requestCode(); }}
                    placeholder="ENTER MOBILE NUMBER"
                    className="flex-1 px-4 py-3 bg-navy text-cream placeholder:text-cream/60 focus:outline-none tracking-wide"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-navy-dark/70 mb-6 cursor-pointer">
                  <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="accent-navy" />
                  Notify me with offers and updates
                </label>

                {error && <p className="text-maroon text-sm font-semibold mb-3">{error}</p>}

                <motion.button
                  {...pressable}
                  disabled={phone.length !== 10 || busy}
                  onClick={requestCode}
                  className="w-full py-4 bg-navy text-cream font-bold rounded-lg disabled:opacity-40 hover:bg-navy-dark transition-colors"
                >
                  {busy ? 'SENDING…' : 'SEND CODE'}
                </motion.button>

                <p className="text-center text-xs text-navy-dark/50 mt-6">
                  I accept that I have read &amp; understood your{' '}
                  <a href="/privacy" className="underline">Privacy Policy</a> and T&amp;Cs.
                </p>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <h2 className="font-display text-xl font-bold text-navy-dark mb-2">Verify your number</h2>
                <p className="text-navy-dark/60 text-sm">We sent a 6-digit code to</p>
                <p className="font-bold text-navy-dark mb-6">
                  +91 {phone}{' '}
                  <button onClick={() => { setStep('phone'); setError(''); }} className="text-xs underline font-normal ml-2">Edit</button>
                </p>

                <p className="text-sm font-semibold text-maroon mb-6">
                  {deliveryMode === 'voice'
                    ? 'Answer the automated call to hear your 6-digit code.'
                    : 'Check your SMS for the 6-digit code.'}
                </p>

                {devCode && (
                  <div className="otp-dev-note">
                    <strong>{devCode}</strong>
                    <span>{notice}</span>
                  </div>
                )}

                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputsRef.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={i === 0 ? 'one-time-code' : 'off'}
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) inputsRef.current[i - 1]?.focus();
                      }}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-navy rounded-lg focus:outline-none focus:border-maroon"
                    />
                  ))}
                </div>

                {error && <p className="text-maroon text-sm font-semibold mb-3">{error}</p>}

                <p className="text-navy-dark/50 text-sm mb-6">
                  {cooldown > 0 ? `Resend in ${cooldown}s` : (
                    <button onClick={requestCode} disabled={busy} className="underline font-semibold">Resend code</button>
                  )}
                </p>

                <motion.button
                  {...pressable}
                  disabled={otp.some((d) => !d) || busy}
                  onClick={verifyCode}
                  className="w-full py-4 bg-navy text-cream font-bold rounded-lg disabled:opacity-40 hover:bg-navy-dark transition-colors"
                >
                  {busy ? 'VERIFYING…' : 'VERIFY'}
                </motion.button>
              </motion.div>
            )}

            {step === 'details' && customer && (
              <ProfileForm
                customer={customer}
                heading={customer.profileComplete ? 'Update your details' : 'Welcome — tell us about you'}
                intro={
                  customer.profileComplete
                    ? undefined
                    : 'Just once. We’ll use this to fill in your checkout and to know where your pieces should go.'
                }
                submitLabel={customer.profileComplete ? 'Save changes' : 'Create my profile'}
                onSaved={(c) => { setCustomer(c); setStep('profile'); }}
                onCancel={customer.profileComplete ? () => setStep('profile') : undefined}
              />
            )}

            {step === 'profile' && customer && (
              <ProfileView
                customer={customer}
                onEdit={() => setStep('details')}
                onSignedOut={signedOut}
                onCustomerChange={setCustomer}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
