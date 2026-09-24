import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  BookOpen,
  PlusCircle,
  Trash2,
  Timer,
  Award,
  Flame,
  MessageSquareHeart,
  Send,
  AlertCircle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { DatePlan, PersonName } from '../types';
import { OFFICIAL_ACTIVITIES } from '../data/dateOptions';
import { formatDateFrench } from '../utils/storage';

interface DashboardViewProps {
  plans: DatePlan[];
  onSelectPlanForLetter: (plan: DatePlan) => void;
  onNewDate: () => void;
  onDeletePlan: (id: string) => void;
  onClearAllPlans?: () => void;
  onResetDefaultPlans?: () => void;
  onUpdateStatus: (id: string, status: DatePlan['status']) => void;
  onRefresh?: () => void;
  isSyncing?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  plans,
  onSelectPlanForLetter,
  onNewDate,
  onDeletePlan,
  onClearAllPlans,
  onResetDefaultPlans,
  onUpdateStatus,
  onRefresh,
  isSyncing = false,
}) => {
  const [personFilter, setPersonFilter] = useState<'all' | PersonName>('all');
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [coupleNotes, setCoupleNotes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('charobidy_couple_notes');
      return saved
        ? JSON.parse(saved)
        : [
            'Toujours avoir une glace au chocolat au congélateur pour nos soirées films ! 🍨',
            'Ne jamais oublier de se faire un bisou du matin, même quand on est pressés 💕',
          ];
    } catch {
      return [];
    }
  });
  const [newNote, setNewNote] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updated = [newNote.trim(), ...coupleNotes];
    setCoupleNotes(updated);
    setNewNote('');
    try {
      localStorage.setItem('charobidy_couple_notes', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('Petite promesse ajoutée avec amour !');
  };

  const handleDeleteNote = (index: number) => {
    const updated = coupleNotes.filter((_, i) => i !== index);
    setCoupleNotes(updated);
    try {
      localStorage.setItem('charobidy_couple_notes', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('Note retirée.');
  };

  const confirmDeletePlan = (id: string) => {
    onDeletePlan(id);
    setPlanToDelete(null);
    showToast('Rendez-vous supprimé du tableau de bord.');
  };

  const handleConfirmClearAll = () => {
    if (onClearAllPlans) {
      onClearAllPlans();
      setShowClearAllConfirm(false);
      showToast('Tous les rendez-vous ont été effacés.');
    }
  };

  // Filter plans according to person
  const filteredPlans = plans.filter((plan) => {
    if (personFilter === 'all') return true;
    return plan.respondent === personFilter || plan.proposer === personFilter;
  });

  // Calculate stats
  const totalPlans = plans.length;
  const totalDodges = plans.reduce((acc, p) => acc + (p.dodgeCount || 0), 0);

  // Activity frequency calculation
  const activityCounts: Record<string, number> = {};
  OFFICIAL_ACTIVITIES.forEach((act) => {
    activityCounts[act.name] = 0;
  });

  plans.forEach((plan) => {
    plan.activities.forEach((act) => {
      activityCounts[act] = (activityCounts[act] || 0) + 1;
    });
  });

  // Sort activities by popularity
  const sortedActivities = [...OFFICIAL_ACTIVITIES].sort((a, b) => {
    return (activityCounts[b.name] || 0) - (activityCounts[a.name] || 0);
  });

  // Upcoming plan
  const upcomingPlans = [...plans]
    .filter((p) => p.status === 'confirmé')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const nextDate = upcomingPlans[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 relative">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Charobidy &amp; Nacia · Base de données partagée en direct</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Tableau de Bord de Notre Couple
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Suivi synchronisé en temps réel entre les téléphones de Nacia et Charobidy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                isSyncing ? 'opacity-70 animate-pulse' : ''
              }`}
              title="Synchroniser avec la base de données"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-rose-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronisation...' : 'Actualiser'}</span>
            </button>
          )}

          {plans.length > 0 && onClearAllPlans && (
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-red-200 text-red-700 bg-red-50/60 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
              title="Supprimer tous les rendez-vous"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Tout effacer</span>
            </button>
          )}

          <button
            onClick={onNewDate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-display font-semibold text-sm shadow-md hover:shadow-rose-200 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Planifier un Date</span>
          </button>
        </div>
      </div>

      {/* Modal confirmation for Clear All */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Effacer tous les rendez-vous ?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Es-tu sûr(e) de vouloir vider l'historique complet du tableau de bord ? Cette action retirera tous les rendez-vous enregistrés.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Oui, tout effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total dates */}
        <div className="p-5 rounded-2xl bg-white border border-rose-100/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Rendez-vous
            </div>
            <div className="text-3xl font-display font-bold text-rose-950 mt-1 tabular-nums">
              {totalPlans}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">100% d'amour validé</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Prochain date */}
        <div className="p-5 rounded-2xl bg-white border border-rose-100/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Prochain Rendez-vous
            </div>
            <div className="text-lg font-display font-bold text-rose-900 mt-1">
              {nextDate ? formatDateFrench(nextDate.date) : 'Aucun en attente'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {nextDate ? `À ${nextDate.time} pour ${nextDate.respondent}` : 'Prêt pour une invitation !'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Timer className="w-6 h-6" />
          </div>
        </div>

        {/* Total dodges */}
        <div className="p-5 rounded-2xl bg-white border border-rose-100/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Esquives Vaincues
            </div>
            <div className="text-3xl font-display font-bold text-amber-700 mt-1 tabular-nums">
              {totalDodges}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">L'amour gagne toujours</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Activité favorite */}
        <div className="p-5 rounded-2xl bg-white border border-rose-100/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Activité N°1 du Couple
            </div>
            <div className="text-sm font-display font-bold text-slate-900 mt-1 truncate max-w-[140px]">
              {sortedActivities[0]?.name || 'plan kaly 🍜'}
            </div>
            <div className="text-[11px] text-rose-600 font-medium mt-1">
              {activityCounts[sortedActivities[0]?.name || ''] || 0} fois choisie
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-rose-500">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: History + Stats & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Filter & List of Dates */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>Historique des Rendez-vous</span>
            </h2>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setPersonFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  personFilter === 'all'
                    ? 'bg-white text-rose-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous ({plans.length})
              </button>
              <button
                onClick={() => setPersonFilter('Nacia')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  personFilter === 'Nacia'
                    ? 'bg-white text-rose-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nacia
              </button>
              <button
                onClick={() => setPersonFilter('Charobidy')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  personFilter === 'Charobidy'
                    ? 'bg-white text-rose-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Charobidy
              </button>
            </div>
          </div>

          {/* Empty state with reseed button */}
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-rose-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-slate-600 text-sm font-medium">
                Aucun rendez-vous dans le tableau de bord pour le moment.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onNewDate}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-rose-700 cursor-pointer transition-colors"
                >
                  Planifier un premier date ✨
                </button>
                {onResetDefaultPlans && (
                  <button
                    onClick={onResetDefaultPlans}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurer les exemples</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan) => {
                const isConfirmingThis = planToDelete === plan.id;

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100/90 shadow-xs hover:shadow-md transition-all space-y-4 relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-lg text-slate-900">
                            {formatDateFrench(plan.date)}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="font-semibold text-rose-700 text-sm">{plan.time}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          De : <strong className="text-slate-700">{plan.proposer}</strong> → Pour :{' '}
                          <strong className="text-rose-800">{plan.respondent}</strong>
                        </div>
                      </div>

                      {/* Card actions: status toggle, open letter, and direct deletion */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <select
                          value={plan.status}
                          onChange={(e) => onUpdateStatus(plan.id, e.target.value as DatePlan['status'])}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                            plan.status === 'confirmé'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : plan.status === 'terminé'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="confirmé">Confirmé 💕</option>
                          <option value="terminé">Terminé ✨</option>
                          <option value="en_attente">En attente ⏳</option>
                        </select>

                        <button
                          onClick={() => onSelectPlanForLetter(plan)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Relire la lettre d'amour"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>

                        {/* Direct delete button with inline confirmation */}
                        <button
                          onClick={() => setPlanToDelete(isConfirmingThis ? null : plan.id)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isConfirmingThis
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'hover:bg-red-50 text-slate-400 hover:text-red-600'
                          }`}
                          title="Supprimer ce rendez-vous"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inline deletion confirmation prompt */}
                    {isConfirmingThis && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                        <span className="text-red-800 font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Supprimer définitivement ce rendez-vous du tableau ?</span>
                        </span>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => setPlanToDelete(null)}
                            className="px-3 py-1 rounded-lg text-slate-600 hover:bg-white/80 transition-colors font-semibold"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={() => confirmDeletePlan(plan.id)}
                            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-xs"
                          >
                            Confirmer la suppression 🗑️
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Activities tags */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Activités prévues ({plan.activities.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.activities.map((act) => (
                          <span
                            key={act}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-800 text-xs font-medium border border-slate-200/70"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Special note */}
                    {plan.specialNote && (
                      <div className="text-xs text-slate-600 bg-rose-50/40 p-3 rounded-xl border border-rose-100/60 font-serif-soft italic text-sm">
                        « {plan.specialNote} »
                      </div>
                    )}

                    {/* Meta details */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>{plan.place || 'Lieu intime'}</span>
                      </div>

                      <div className="text-slate-400">
                        Esquives : <strong className="text-slate-600 tabular-nums">{plan.dodgeCount}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Top Activities & Secret Couple Notes */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Activities breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100/80 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Palmarès de nos Envies</span>
            </h3>

            <p className="text-xs text-slate-500">
              Fréquence de sélection pour chacune des options officielles :
            </p>

            <div className="space-y-3">
              {sortedActivities.map((act) => {
                const count = activityCounts[act.name] || 0;
                const percentage = totalPlans > 0 ? Math.round((count / totalPlans) * 100) : 0;

                return (
                  <div key={act.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate max-w-[190px]">
                        {act.name}
                      </span>
                      <span className="text-slate-500 tabular-nums font-semibold">
                        {count} fois ({percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, count > 0 ? 10 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes Secrètes du Couple avec suppression facile */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100/80 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquareHeart className="w-4 h-4 text-rose-500" />
              <span>Nos Petites Promesses</span>
            </h3>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Une promesse ou idée douce..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                title="Ajouter"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {coupleNotes.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  Aucune note pour le moment.
                </p>
              ) : (
                coupleNotes.map((note, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60 text-xs text-slate-700 group hover:bg-rose-50 transition-colors"
                  >
                    <p className="font-serif-soft text-sm leading-snug flex-1">« {note} »</p>
                    <button
                      onClick={() => handleDeleteNote(index)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md p-1 transition-colors cursor-pointer"
                      title="Supprimer cette promesse"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
