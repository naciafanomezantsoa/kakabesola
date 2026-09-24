import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  LayoutDashboard,
  RotateCcw,
  Feather,
} from 'lucide-react';
import { DatePlan } from '../types';
import { formatDateFrench } from '../utils/storage';

interface LetterViewProps {
  plan: DatePlan;
  onGoToDashboard: () => void;
  onNewDate: () => void;
}

export const LetterView: React.FC<LetterViewProps> = ({ plan, onGoToDashboard, onNewDate }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSealed, setIsSealed] = useState<boolean>(false);

  useEffect(() => {
    // Burst of hearts and confetti on load
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#10b981'],
    });
  }, []);

  const handleCopyText = async () => {
    const textToCopy = `💌 Rendez-vous d'Amour — Charobidy & Nacia 💌
Pour : ${plan.respondent}
De la part de : ${plan.proposer}
📅 Date : ${formatDateFrench(plan.date)}
⏰ Heure : ${plan.time}
📍 Lieu : ${plan.place || 'Notre cocon'}
✨ Au programme :
${plan.activities.map((act) => `• ${act}`).join('\n')}

💬 Message d'amour :
"${plan.specialNote || 'Hâte de passer ce moment unique avec toi !'}"

❤️ C'est officiel, c'est un rendez-vous !`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Action bar on top */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          onClick={onGoToDashboard}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-rose-500" />
          <span>Voir le Tableau de Bord</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-sm transition-colors cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier la lettre</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Romantic Love Letter Container */}
      <div className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-12 shadow-xl border-2 border-[#F3E8DF] overflow-hidden">
        {/* Decorative corner flourishes */}
        <div className="absolute top-4 left-4 text-rose-300/40 select-none text-3xl font-serif">❦</div>
        <div className="absolute top-4 right-4 text-rose-300/40 select-none text-3xl font-serif">❦</div>
        <div className="absolute bottom-4 left-4 text-rose-300/40 select-none text-3xl font-serif">❦</div>
        <div className="absolute bottom-4 right-4 text-rose-300/40 select-none text-3xl font-serif">❦</div>

        {/* Delicate inner hairline frame */}
        <div className="border border-rose-200/50 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#FFFDF8] via-white to-[#FFFDF8]">
          
          {/* Header of the letter */}
          <div className="text-center pb-6 border-b border-rose-100">
            {/* Wax Seal Visual */}
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-md shadow-rose-300/60 border-2 border-rose-300/80 mb-4 transform hover:scale-105 transition-transform cursor-pointer"
              onClick={() => {
                confetti({
                  particleCount: 40,
                  spread: 60,
                  origin: { y: 0.3 },
                  colors: ['#f43f5e', '#fb7185'],
                });
              }}
              title="Sceau d'amour certifié"
            >
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-rose-200 text-rose-100" />
            </div>

            <div className="text-xs uppercase tracking-widest text-rose-800/80 font-bold mb-1">
              Charobidy &amp; Nacia · Pacte d'Amour
            </div>

            {/* Official Love Message */}
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-rose-950 tracking-tight mb-2">
              C'est officiel, c'est un rendez-vous !
            </h1>

            <p className="font-serif-soft italic text-base sm:text-lg text-rose-800">
              « Entre toi et moi, chaque instant partagé est un trésor. »
            </p>
          </div>

          {/* Letter Body */}
          <div className="py-6 sm:py-8 space-y-6 text-slate-800 leading-relaxed">
            
            {/* Salutation */}
            <div className="text-base sm:text-lg font-display">
              Mon très cher amour <strong className="text-rose-900 underline decoration-rose-300 underline-offset-4">{plan.respondent}</strong>,
            </div>

            <p className="font-serif-soft text-base sm:text-lg text-slate-700 leading-relaxed">
              J'ai l'immense bonheur de te confirmer notre prochain tête-à-tête. Tu as dit oui (après seulement{' '}
              <strong className="text-rose-700 font-sans">{plan.dodgeCount} esquive{plan.dodgeCount > 1 ? 's' : ''}</strong> !), et mon cœur ne pouvait espérer plus douce réponse. Voici tout ce qui nous attend :
            </p>

            {/* Date & Location Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-50/70 border border-rose-100/90 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Date prévue</div>
                  <div className="font-bold text-rose-950 capitalize">{formatDateFrench(plan.date)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Heure convenue</div>
                  <div className="font-bold text-slate-900">{plan.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Lieu / Cocon</div>
                  <div className="font-bold text-slate-900 truncate">{plan.place || 'Notre cocon douillet'}</div>
                </div>
              </div>
            </div>

            {/* Plans choisis ensemble */}
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-rose-900 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nos activités complices validées ensemble</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plan.activities.map((act) => (
                  <div
                    key={act}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-rose-100/80 shadow-xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
                    <span className="font-semibold text-sm text-slate-900">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note d'amour / Promesse */}
            {plan.specialNote && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-amber-600" />
                  <span>Le petit mot doux</span>
                </div>
                <p className="font-serif-soft italic text-base sm:text-lg text-amber-950 leading-snug">
                  « {plan.specialNote} »
                </p>
              </div>
            )}

            {/* Message final d'amour & bisous complices */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-100/90 via-pink-100/90 to-rose-100/90 border-2 border-rose-300/80 shadow-sm text-center space-y-1">
              <div className="font-handwriting text-3xl sm:text-4xl text-rose-700 font-bold tracking-wide flex items-center justify-center gap-2 flex-wrap">
                <span>Muaaaah eb !</span>
                <span className="text-2xl sm:text-3xl">😘💋❤️✨🥰</span>
              </div>
              <p className="font-serif-soft italic text-xs sm:text-sm text-rose-800 font-medium">
                Mandefa oroka mamy be ho an'i baeko malala indrindra ! 💕
              </p>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Avec tout mon amour et ma tendresse,</span>
                <span className="font-handwriting text-3xl sm:text-4xl text-rose-900 font-bold">
                  {plan.proposer}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Pour l'éternité avec mon baeko,</span>
                <span className="font-handwriting text-3xl sm:text-4xl text-rose-900 font-bold">
                  {plan.respondent}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
        <button
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-display font-semibold text-sm shadow-md hover:shadow-rose-200 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Accéder au Tableau de Bord</span>
        </button>

        <button
          onClick={onNewDate}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-display font-semibold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Planifier un autre rendez-vous</span>
        </button>
      </div>
    </div>
  );
};
