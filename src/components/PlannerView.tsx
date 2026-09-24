import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  Heart,
  Sparkles,
  MapPin,
  MessageSquareHeart,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCheck,
} from 'lucide-react';
import { DatePlan, PersonName } from '../types';
import { OFFICIAL_ACTIVITIES } from '../data/dateOptions';

interface PlannerViewProps {
  proposer: PersonName;
  respondent: PersonName;
  dodgeCount: number;
  onSavePlan: (plan: DatePlan) => void;
  onCancel: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  proposer,
  respondent,
  dodgeCount,
  onSavePlan,
  onCancel,
}) => {
  // Today's date calculations
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Default values
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Tomorrow by default or today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('20:30');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'plan kaly 🍜',
    'regarder un film',
    'dormir sans main',
  ]);
  const [place, setPlace] = useState<string>('À la maison, dans notre cocon douillet');
  const [specialNote, setSpecialNote] = useState<string>(
    'Prépare-toi pour un moment magique mon amour, j’ai tellement hâte de te retrouver ❤️ Muaaaah eb ! 😘💋✨'
  );

  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());

  // Toggle activity
  const toggleActivity = (activityName: string) => {
    if (selectedActivities.includes(activityName)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activityName));
    } else {
      setSelectedActivities([...selectedActivities, activityName]);
    }
  };

  // Quick selections
  const selectAll = () => {
    setSelectedActivities(OFFICIAL_ACTIVITIES.map((a) => a.name));
  };

  const selectCocooning = () => {
    setSelectedActivities(['plan kaly 🍜', 'regarder un film', 'dormir', 'Instagram Reels']);
  };

  const selectSensual = () => {
    setSelectedActivities([
      'béelly 👙',
      'suche 🤤 + couche',
      '🎵 écouter de la musique + jouer',
      'dormir sans main',
    ]);
  };

  // Fast dates
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Calendar generation logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // French calendar: Monday is 0 (firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1)
  const startingDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthNamesFr = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedActivities.length === 0) {
      alert('Veuillez sélectionner au moins une douce option pour votre rendez-vous ! ❤️');
      return;
    }

    const newPlan: DatePlan = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      proposer,
      respondent,
      date: selectedDate,
      time: selectedTime,
      activities: selectedActivities,
      specialNote: specialNote.trim(),
      dodgeCount,
      status: 'confirmé',
      place: place.trim(),
    };

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#10b981', '#fbbf24'],
    });

    onSavePlan(newPlan);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Le OUI a été prononcé ! Place aux préparatifs</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          Planification de notre Rendez-vous
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Pour <strong className="text-rose-700">{respondent}</strong>, avec tout l’amour de{' '}
          <strong className="text-rose-700">{proposer}</strong>. Personnalise chaque détail de nos retrouvailles complices.
        </p>
      </div>

      <form onSubmit={handleValidate} className="space-y-8">
        {/* Section 1: Date & Heure */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
          {/* Calendrier */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-950 font-display font-semibold text-lg">
                <CalendarIcon className="w-5 h-5 text-rose-500" />
                <span>Choisis la date de notre date</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-700 w-28 text-center">
                  {monthNamesFr[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick date shortcuts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors font-medium cursor-pointer"
              >
                Ce soir
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors font-medium cursor-pointer"
              >
                Demain soir
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(2)}
                className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors font-medium cursor-pointer"
              >
                Après-demain
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(5)}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium cursor-pointer"
              >
                Ce week-end
              </button>
            </div>

            {/* Calendar grid */}
            <div className="pt-2">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mer</span>
                <span>Jeu</span>
                <span>Ven</span>
                <span>Sam</span>
                <span>Dim</span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Empty slots before first day */}
                {Array.from({ length: startingDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9 sm:h-10" />
                ))}

                {/* Day numbers */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                    dayNum
                  ).padStart(2, '0')}`;
                  const isSelected = selectedDate === dayStr;
                  const isToday = todayStr === dayStr;

                  return (
                    <button
                      key={dayStr}
                      type="button"
                      onClick={() => setSelectedDate(dayStr)}
                      className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-200 scale-105'
                          : 'hover:bg-rose-50 text-slate-700'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isToday && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-500 pt-2">
              Date sélectionnée : <strong className="text-rose-700 font-semibold">{selectedDate}</strong>
            </p>
          </div>

          {/* Heure & Ambiance */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-5 md:pl-6 md:border-l md:border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-rose-950 font-display font-semibold text-lg pb-2 border-b border-slate-100 mb-3">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span>Heure du rendez-vous</span>
              </div>

              {/* Time slots */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { time: '19:00', label: 'Coucher de soleil' },
                  { time: '20:30', label: 'Dîner aux chandelles' },
                  { time: '21:30', label: 'Soirée cocooning' },
                  { time: '22:30', label: 'Late night secret' },
                ].map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTime === slot.time
                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-300/40 text-emerald-950 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-200'
                    }`}
                  >
                    <div className="font-semibold text-xs sm:text-sm">{slot.time}</div>
                    <div className="text-[10px] text-slate-500 truncate">{slot.label}</div>
                  </button>
                ))}
              </div>

              {/* Custom time picker */}
              <div className="flex items-center gap-2 pt-1">
                <label htmlFor="custom-time" className="text-xs text-slate-500">
                  Ou heure personnalisée :
                </label>
                <input
                  id="custom-time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50"
                />
              </div>
            </div>

            {/* Lieu / Décor */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Lieu ou ambiance souhaitée
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Ex: Notre nid douillet, sous la couette..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50/60"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Options de Rendez-vous Cumulables (Les 8 options exactes) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>Au programme de notre date</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold font-sans">
                  {selectedActivities.length} / {OFFICIAL_ACTIVITIES.length} sélectionnés
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Toutes les options sont cumulables à l’infini ! Coche tout ce qui te ferait plaisir.
              </p>
            </div>

            {/* Boutons de sélection rapide */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium transition-colors cursor-pointer"
              >
                Tout sélectionner (La Totale ❤️)
              </button>
              <button
                type="button"
                onClick={selectCocooning}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
              >
                Pack Cocooning
              </button>
              <button
                type="button"
                onClick={selectSensual}
                className="px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 font-medium transition-colors cursor-pointer"
              >
                Pack Sensuel 🔥
              </button>
            </div>
          </div>

          {/* Grille des 8 options exactes requises */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {OFFICIAL_ACTIVITIES.map((activity) => {
              const isSelected = selectedActivities.includes(activity.name);
              return (
                <div
                  key={activity.id}
                  onClick={() => toggleActivity(activity.name)}
                  className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group select-none ${
                    isSelected
                      ? 'bg-gradient-to-b from-rose-50/90 to-rose-100/50 border-rose-300 ring-2 ring-rose-400/40 shadow-sm shadow-rose-100'
                      : 'bg-white border-slate-200/90 hover:border-rose-200 hover:bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-2xl p-2 rounded-xl bg-white shadow-xs group-hover:scale-110 transition-transform">
                      {activity.emoji}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-rose-600 text-white'
                          : 'border border-slate-300 bg-white text-transparent group-hover:border-rose-400'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-900 mb-1">
                      {activity.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>Ajouté au programme</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Petit mot doux personnalisé */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-3">
          <label className="flex items-center gap-2 text-rose-950 font-display font-semibold text-lg">
            <MessageSquareHeart className="w-5 h-5 text-rose-500" />
            <span>Un petit mot doux pour sceller l'invitation</span>
          </label>
          <textarea
            rows={3}
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            placeholder="Écris ce que tu ressens, une promesse ou un souhait secret..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50/60 font-serif-soft text-base"
          />
        </div>

        {/* Actions de validation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
          >
            ← Revenir à l’accueil
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-display font-bold text-lg shadow-lg hover:shadow-rose-300/50 shadow-rose-200 flex items-center justify-center gap-3 transition-all cursor-pointer group active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-rose-200 group-hover:rotate-12 transition-transform" />
            <span>Valider notre rendez-vous & Ouvrir la Lettre</span>
            <CheckCheck className="w-5 h-5 text-emerald-300" />
          </button>
        </div>
      </form>
    </div>
  );
};
