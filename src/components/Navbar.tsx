import React from 'react';
import { Heart, Sparkles, Calendar, BookOpen, LayoutDashboard, UserCheck } from 'lucide-react';
import { AppView, PersonName } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeRespondent: PersonName;
  onTogglePerson: () => void;
  hasConfirmedPlan: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeRespondent,
  onTogglePerson,
  hasConfirmedPlan,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFB]/90 backdrop-blur-md border-b border-rose-100/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('proposal')}
          className="flex items-center gap-2 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-rose-950 group-hover:text-rose-700 transition-colors">
            Charobidy baeko
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('proposal')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentView === 'proposal'
                ? 'border-rose-400 text-rose-800 font-semibold'
                : 'border-transparent hover:text-rose-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            L'Invitation
          </button>

          <button
            onClick={() => onNavigate('planner')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentView === 'planner'
                ? 'border-rose-400 text-rose-800 font-semibold'
                : 'border-transparent hover:text-rose-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            Planifier un Rendez-vous
          </button>

          {hasConfirmedPlan && (
            <button
              onClick={() => onNavigate('letter')}
              className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
                currentView === 'letter'
                  ? 'border-rose-400 text-rose-800 font-semibold'
                  : 'border-transparent hover:text-rose-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              La Lettre d'Amour
            </button>
          )}

          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentView === 'dashboard'
                ? 'border-rose-400 text-rose-800 font-semibold'
                : 'border-transparent hover:text-rose-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-rose-500" />
            Tableau de Bord
          </button>
        </nav>

        {/* Zone 3: Couple persona switcher, Code download & quick action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onTogglePerson}
            title="Cliquer pour changer qui répond"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline text-rose-600">Pour :</span>
            <span className="font-semibold text-rose-900">{activeRespondent}</span>
          </button>

          {currentView !== 'planner' && (
            <button
              onClick={() => onNavigate('planner')}
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-full shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
            >
              Nouveau Date ✨
            </button>
          )}
        </div>
      </div>

      {/* Mobile native Android bottom navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2.5 px-2 bg-white/95 backdrop-blur-md border-t border-rose-100/90 shadow-lg text-[11px] font-medium text-slate-500">
        <button
          onClick={() => onNavigate('proposal')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'proposal' ? 'text-rose-600 font-bold scale-105' : 'hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Invitation</span>
        </button>
        <button
          onClick={() => onNavigate('planner')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'planner' ? 'text-rose-600 font-bold scale-105' : 'hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planifier</span>
        </button>
        {hasConfirmedPlan && (
          <button
            onClick={() => onNavigate('letter')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all cursor-pointer ${
              currentView === 'letter' ? 'text-rose-600 font-bold scale-105' : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lettre</span>
          </button>
        )}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'dashboard' ? 'text-rose-600 font-bold scale-105' : 'hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Tableau</span>
        </button>
      </div>
    </header>
  );
};
