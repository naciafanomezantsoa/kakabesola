import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PersonName } from '../types';
import { REFUSAL_MESSAGES } from '../data/dateOptions';

interface ProposalViewProps {
  proposer: PersonName;
  respondent: PersonName;
  onSetCouple: (proposer: PersonName, respondent: PersonName) => void;
  onAccept: (dodgeCount: number) => void;
}

export const ProposalView: React.FC<ProposalViewProps> = ({
  proposer,
  respondent,
  onSetCouple,
  onAccept,
}) => {
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [refusalText, setRefusalText] = useState<string>('Non...');
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger heart and star confettis
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#10b981'],
    });

    const scalar = 2;
    const heart = confetti.shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    });

    confetti({
      shapes: [heart],
      scalar,
      particleCount: 30,
      spread: 100,
      origin: { y: 0.65 },
      colors: ['#e11d48', '#fb7185'],
    });
  };

  const handleDodge = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
    }

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    // Pick a witty random refusal text different from the current one
    const available = REFUSAL_MESSAGES.filter((m) => m !== refusalText);
    const randomMsg = available[Math.floor(Math.random() * available.length)];
    setRefusalText(randomMsg);

    // Calculate bounds inside container or viewport
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = Math.max(60, rect.width / 2 - 90);
      const maxY = 130;

      // Random offset within boundary
      const signX = Math.random() > 0.5 ? 1 : -1;
      const signY = Math.random() > 0.5 ? 1 : -1;
      const newX = (Math.random() * maxX * 0.8 + 30) * signX;
      const newY = (Math.random() * maxY * 0.8 + 20) * signY;

      setButtonPos({ x: newX, y: newY });
      setHasMoved(true);
    } else {
      // Fallback
      setButtonPos({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 160,
      });
      setHasMoved(true);
    }
  };

  const handleYes = () => {
    triggerConfetti();
    setTimeout(() => {
      onAccept(dodgeCount);
    }, 600);
  };

  // Swap couple roles
  const handleSwap = () => {
    onSetCouple(respondent, proposer);
  };

  // Choose explicitly who responds
  const handleSelectRespondent = (target: PersonName) => {
    if (target === 'Nacia') {
      onSetCouple('Charobidy', 'Nacia');
    } else {
      onSetCouple('Nacia', 'Charobidy');
    }
  };

  // Scaling factor for YES button to celebrate persistence
  const yesScale = Math.min(1 + dodgeCount * 0.05, 1.35);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-gradient-to-b from-rose-50/50 via-white to-emerald-50/30">
      <div className="w-full max-w-2xl mx-auto text-center">
        
        {/* Subtle decorative badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold tracking-wide mb-6 border border-rose-200 shadow-sm animate-pulse">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Une question très importante pour mon amour</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>

        {/* Titre principal requis : Charobidy & Nacia */}
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-rose-950 mb-3 drop-shadow-sm">
          Charobidy &amp; Nacia
        </h1>
        <p className="font-serif-soft italic text-lg sm:text-xl text-rose-800/80 max-w-md mx-auto mb-8">
          « Parce qu’aucun instant n'est plus doux que celui passé dans tes bras. »
        </p>

        {/* Étape d'identification du couple : Nacia vs Charobidy */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 mb-8 border border-rose-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Identification du couple complice
            </span>
            <button
              onClick={handleSwap}
              className="text-xs text-rose-600 hover:text-rose-800 underline underline-offset-2 cursor-pointer font-medium"
            >
              Inverser les rôles ⇄
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left">
            <button
              onClick={() => handleSelectRespondent('Nacia')}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                respondent === 'Nacia'
                  ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/30 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-rose-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-semibold text-rose-950 text-base sm:text-lg">
                  Nacia 🌸
                </span>
                {respondent === 'Nacia' && (
                  <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Répond
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {respondent === 'Nacia' ? 'Invitée par Charobidy' : 'Auteur de l\'invitation'}
              </p>
            </button>

            <button
              onClick={() => handleSelectRespondent('Charobidy')}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                respondent === 'Charobidy'
                  ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400/30 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-emerald-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-semibold text-slate-900 text-base sm:text-lg">
                  Charobidy 👑
                </span>
                {respondent === 'Charobidy' && (
                  <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium">
                    Répond
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {respondent === 'Charobidy' ? 'Invité par Nacia' : 'Auteur de l\'invitation'}
              </p>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-rose-100/60 text-xs text-slate-600 flex items-center justify-center gap-1.5">
            <span className="text-slate-400">De :</span>
            <strong className="text-rose-900">{proposer}</strong>
            <ArrowRight className="w-3 h-3 text-rose-400" />
            <span className="text-slate-400">Pour :</span>
            <strong className="text-rose-900">{respondent}</strong>
          </div>
        </div>

        {/* Question requise : 'Veux-tu sortir avec moi ?' */}
        <div className="relative py-4 sm:py-6 mb-4">
          <div className="text-rose-300/40 select-none text-6xl sm:text-7xl font-serif-soft absolute -top-4 left-1/2 -translate-x-1/2 -z-10">
            ❦
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-rose-950 tracking-tight leading-tight">
            Veux-tu sortir avec moi ?
          </h2>
          <p className="text-sm sm:text-base text-rose-800/80 mt-2 font-medium">
            Dis-moi oui, mon cœur... Je te prépare le plus doux des moments ✨
          </p>
        </div>

        {/* Compteur d'esquives ludique */}
        {dodgeCount > 0 && (
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium animate-bounce">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>
              Tentatives d’esquive : <strong className="tabular-nums font-bold text-amber-700">{dodgeCount}</strong>
            </span>
            <span className="text-amber-500">·</span>
            <span>
              {dodgeCount >= 8
                ? 'Tu ne peux plus m’échapper, dis OUI ! 💕'
                : dodgeCount >= 4
                ? 'Tu hésites encore ? Regarde comme le OUI est beau !'
                : 'Même pas en rêve hihi !'}
            </span>
          </div>
        )}

        {/* Zone des boutons d'interaction OUI / NON esquive */}
        <div
          ref={containerRef}
          className="relative min-h-[170px] sm:min-h-[190px] flex items-center justify-center gap-4 sm:gap-6 pt-4"
        >
          {/* GRAND BOUTON OUI */}
          <button
            onClick={handleYes}
            style={{
              transform: `scale(${yesScale})`,
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="z-10 group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white rounded-2xl font-display font-bold text-xl sm:text-2xl shadow-lg hover:shadow-rose-400/50 hover:shadow-2xl cursor-pointer flex items-center gap-3 active:scale-95 transition-all"
          >
            <Heart className="w-6 h-6 fill-white text-white group-hover:scale-125 transition-transform animate-pulse" />
            <span>OUI ! 💕</span>
            <Sparkles className="w-5 h-5 text-rose-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-2.5 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              Le bon choix !
            </span>
          </button>

          {/* BOUTON DE REFUS ESQUIVANT */}
          <div
            style={{
              transform: hasMoved
                ? `translate(${buttonPos.x}px, ${buttonPos.y}px)`
                : 'translate(0px, 0px)',
              transition: 'transform 0.18s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
            }}
            className="relative z-20"
          >
            <button
              onMouseEnter={handleDodge}
              onTouchStart={handleDodge}
              onClick={handleDodge}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-sm font-semibold shadow-sm transition-colors cursor-pointer select-none whitespace-nowrap active:scale-95"
            >
              {refusalText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
