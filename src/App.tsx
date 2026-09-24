/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppView, PersonName, DatePlan } from './types';
import { Navbar } from './components/Navbar';
import { ProposalView } from './components/ProposalView';
import { PlannerView } from './components/PlannerView';
import { LetterView } from './components/LetterView';
import { DashboardView } from './components/DashboardView';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  fetchPlansFromServer,
  createPlanOnServer,
  deletePlanOnServer,
  clearAllPlansOnServer,
  resetDefaultPlansOnServer,
  updatePlanStatusOnServer,
} from './utils/api';
import {
  getStoredPlans,
  getStoredRespondent,
  setStoredRespondent,
} from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('proposal');
  const [plans, setPlans] = useState<DatePlan[]>(() => getStoredPlans());
  const [activePlan, setActivePlan] = useState<DatePlan | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Couple roles state (Nacia & Charobidy)
  const [respondent, setRespondent] = useState<PersonName>('Nacia');
  const [proposer, setProposer] = useState<PersonName>('Charobidy');
  const [lastDodgeCount, setLastDodgeCount] = useState<number>(0);

  // Sync plans from server database
  const refreshPlans = useCallback(async (silent = true) => {
    if (!silent) setIsSyncing(true);
    try {
      const serverPlans = await fetchPlansFromServer();
      setPlans(serverPlans);
      if (serverPlans.length > 0) {
        setActivePlan((prev) => {
          if (!prev) return serverPlans[0];
          const found = serverPlans.find((p) => p.id === prev.id);
          return found || serverPlans[0];
        });
      }
    } finally {
      if (!silent) setIsSyncing(false);
    }
  }, []);

  // Initialize data on mount + periodic background real-time sync
  useEffect(() => {
    // Initial respondent setting
    const savedRespondent = getStoredRespondent();
    if (savedRespondent === 'Charobidy') {
      setRespondent('Charobidy');
      setProposer('Nacia');
    } else {
      setRespondent('Nacia');
      setProposer('Charobidy');
    }

    // Initial server fetch
    refreshPlans(false);

    // Periodic synchronization across devices (every 6 seconds)
    const interval = setInterval(() => {
      refreshPlans(true);
    }, 6000);

    // Also sync whenever the window regains focus (e.g. unlocking phone or switching tabs)
    const handleFocus = () => refreshPlans(true);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refreshPlans(true);
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshPlans]);

  const handleSetCouple = (newProposer: PersonName, newRespondent: PersonName) => {
    setProposer(newProposer);
    setRespondent(newRespondent);
    setStoredRespondent(newRespondent);
  };

  const handleTogglePerson = () => {
    if (respondent === 'Nacia') {
      handleSetCouple('Nacia', 'Charobidy');
    } else {
      handleSetCouple('Charobidy', 'Nacia');
    }
  };

  // Called when user clicks OUI on proposal
  const handleAcceptProposal = (dodges: number) => {
    setLastDodgeCount(dodges);
    setCurrentView('planner');
  };

  // Called when user validates the planner - saves to backend database
  const handleSavePlan = async (newPlan: DatePlan) => {
    const saved = await createPlanOnServer(newPlan);
    setPlans((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
    setActivePlan(saved);
    setCurrentView('letter');
    // background refresh
    refreshPlans(true);
  };

  // Delete plan from server database
  const handleDeletePlan = async (id: string) => {
    const updated = await deletePlanOnServer(id);
    setPlans(updated);
    if (activePlan?.id === id) {
      setActivePlan(updated[0] || null);
    }
  };

  // Clear all plans from server database
  const handleClearAllPlans = async () => {
    const updated = await clearAllPlansOnServer();
    setPlans(updated);
    setActivePlan(null);
  };

  // Reset default example plans
  const handleResetDefaultPlans = async () => {
    const updated = await resetDefaultPlansOnServer();
    setPlans(updated);
    if (updated.length > 0) {
      setActivePlan(updated[0]);
    }
  };

  // Update status on server database
  const handleUpdateStatus = async (id: string, status: DatePlan['status']) => {
    const updated = await updatePlanStatusOnServer(id, status);
    setPlans(updated);
    if (activePlan?.id === id) {
      setActivePlan((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleSelectPlanForLetter = (plan: DatePlan) => {
    setActivePlan(plan);
    setCurrentView('letter');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-slate-800 selection:bg-rose-200 selection:text-rose-900 relative">
      {/* Top Bar with 'Charobidy & Nacia' wordmark and clean navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeRespondent={respondent}
        onTogglePerson={handleTogglePerson}
        hasConfirmedPlan={Boolean(activePlan || plans.length > 0)}
      />

      <OfflineIndicator />

      {/* Main View Router */}
      <main className="flex-1 pb-20 md:pb-0">
        {currentView === 'proposal' && (
          <ProposalView
            proposer={proposer}
            respondent={respondent}
            onSetCouple={handleSetCouple}
            onAccept={handleAcceptProposal}
          />
        )}

        {currentView === 'planner' && (
          <PlannerView
            proposer={proposer}
            respondent={respondent}
            dodgeCount={lastDodgeCount}
            onSavePlan={handleSavePlan}
            onCancel={() => setCurrentView('proposal')}
          />
        )}

        {currentView === 'letter' && (
          activePlan ? (
            <LetterView
              plan={activePlan}
              onGoToDashboard={() => setCurrentView('dashboard')}
              onNewDate={() => setCurrentView('planner')}
            />
          ) : (
            <div className="text-center py-20 px-4">
              <p className="text-slate-500 mb-4">Aucun rendez-vous n'est encore sélectionné.</p>
              <button
                onClick={() => setCurrentView('proposal')}
                className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold cursor-pointer"
              >
                Faire une invitation d'abord
              </button>
            </div>
          )
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            plans={plans}
            onSelectPlanForLetter={handleSelectPlanForLetter}
            onNewDate={() => setCurrentView('planner')}
            onDeletePlan={handleDeletePlan}
            onClearAllPlans={handleClearAllPlans}
            onResetDefaultPlans={handleResetDefaultPlans}
            onUpdateStatus={handleUpdateStatus}
            onRefresh={() => refreshPlans(false)}
            isSyncing={isSyncing}
          />
        )}
      </main>
    </div>
  );
}
