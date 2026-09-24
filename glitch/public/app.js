// --- ÉTAT GLOBAL DE L'APPLICATION ---
let currentUser = 'Nacia';      // Qui utilise l'app sur ce téléphone
let proposer = 'Charobidy';     // Auteur de la proposition
let respondent = 'Nacia';       // Destinataire
let dodgeCount = 0;
let selectedActivities = ['plan kaly 🍜', 'regarder un film'];
let activePlan = null;
let allPlans = [];

const REFUSAL_TEXTS = [
  'Pas question...',
  'Réfléchis bien !',
  'Trop timide...',
  'Tu hésites encore ?',
  'Regarde dans mes yeux...',
  'Impossible de refuser ❤️',
  'Essaie encore ! 😉',
  'Mon cœur t\'attend...'
];

// --- INITIALISATION AU CHARGEMENT DU DOM ---
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupIdentity();
  setupDodgeButton();
  setupPlannerForm();
  setupDashboard();

  // Définir la date par défaut de demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];
  const dateInput = document.getElementById('date-input');
  if (dateInput) dateInput.value = dateStr;

  // Charger les données en temps réel depuis le serveur
  fetchPlansFromServer();

  // Polling automatique toutes les 5 secondes (synchronisation entre les 2 téléphones)
  setInterval(() => {
    fetchPlansFromServer(true);
  }, 5000);
});

// --- NAVIGATION ENTRE VUES ---
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const targetView = document.getElementById(`view-${viewId}`);
  const targetBtn = document.getElementById(`nav-btn-${viewId}`);

  if (targetView) targetView.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  // Si on ouvre le dashboard, rafraîchir les données
  if (viewId === 'dashboard') {
    fetchPlansFromServer();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupNavigation() {
  document.getElementById('nav-btn-proposal').addEventListener('click', () => showView('proposal'));
  document.getElementById('nav-btn-planner').addEventListener('click', () => showView('planner'));
  document.getElementById('nav-btn-letter').addEventListener('click', () => showView('letter'));
  document.getElementById('nav-btn-dashboard').addEventListener('click', () => showView('dashboard'));

  document.getElementById('btn-go-dashboard').addEventListener('click', () => showView('dashboard'));
  document.getElementById('btn-replan').addEventListener('click', () => showView('planner'));
}

// --- IDENTIFICATION DU COUPLE ---
function setupIdentity() {
  const btnNacia = document.getElementById('btn-select-nacia');
  const btnCharobidy = document.getElementById('btn-select-charobidy');
  const userPill = document.getElementById('user-pill');
  const userLabel = document.getElementById('current-user-label');
  const identityHint = document.getElementById('identity-hint');
  const loveQuestion = document.getElementById('love-question');

  function updateRoles(selected) {
    currentUser = selected;
    if (selected === 'Nacia') {
      respondent = 'Nacia';
      proposer = 'Charobidy';
      btnNacia.classList.add('active');
      btnCharobidy.classList.remove('active');
      userLabel.textContent = 'Nacia 🌸';
      identityHint.textContent = 'Charobidy invite Nacia ❤️';
      loveQuestion.textContent = 'Veux-tu sortir avec moi, Nacia ?';
    } else {
      respondent = 'Charobidy';
      proposer = 'Nacia';
      btnCharobidy.classList.add('active');
      btnNacia.classList.remove('active');
      userLabel.textContent = 'Charobidy 👑';
      identityHint.textContent = 'Nacia invite Charobidy ❤️';
      loveQuestion.textContent = 'Veux-tu sortir avec moi, Charobidy ?';
    }
    showToast(`Tu es identifié(e) comme ${selected}`);
  }

  btnNacia.addEventListener('click', () => updateRoles('Nacia'));
  btnCharobidy.addEventListener('click', () => updateRoles('Charobidy'));

  userPill.addEventListener('click', () => {
    updateRoles(currentUser === 'Nacia' ? 'Charobidy' : 'Nacia');
  });
}

// --- BOUTON DE REFUS ESQUIVANT (DODGE) ---
function setupDodgeButton() {
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const playground = document.getElementById('actions-playground');
  const dodgeAlert = document.getElementById('dodge-alert');
  const dodgeCountDisplay = document.getElementById('dodge-count-display');

  function dodge(e) {
    if (e) e.preventDefault();

    dodgeCount++;
    dodgeAlert.style.display = 'inline-block';
    dodgeCountDisplay.textContent = dodgeCount;

    // Changer le texte
    const textIndex = (dodgeCount - 1) % REFUSAL_TEXTS.length;
    btnNo.textContent = REFUSAL_TEXTS[textIndex];

    // Calculer une position aléatoire autour de l'espace de jeu
    const rect = playground.getBoundingClientRect();
    const maxX = Math.min(130, (rect.width / 2) - 50);
    const maxY = 60;

    const randX = (Math.random() * (maxX * 2)) - maxX;
    const randY = (Math.random() * (maxY * 2)) - maxY;

    btnNo.style.transform = `translate(${randX}px, ${randY}px)`;
  }

  // Événements pour souris et pour écran tactile de smartphone
  btnNo.addEventListener('mouseenter', dodge);
  btnNo.addEventListener('touchstart', dodge, { passive: false });
  btnNo.addEventListener('click', dodge);

  // Le bouton OUI redirige vers la planification
  btnYes.addEventListener('click', () => {
    showToast('Félicitations pour le grand OUI ! ❤️');
    showView('planner');
  });
}

// --- GESTION DU PLANIFICATEUR ---
function setupPlannerForm() {
  const optionsGrid = document.getElementById('options-grid');
  const form = document.getElementById('date-form');

  // Multi-sélection des options
  optionsGrid.querySelectorAll('.opt-btn').forEach(btn => {
    const optName = btn.dataset.opt;
    if (selectedActivities.includes(optName)) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => {
      if (selectedActivities.includes(optName)) {
        selectedActivities = selectedActivities.filter(a => a !== optName);
        btn.classList.remove('selected');
      } else {
        selectedActivities.push(optName);
        btn.classList.add('selected');
      }
    });
  });

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dateVal = document.getElementById('date-input').value;
    const timeVal = document.getElementById('time-input').value;
    const noteVal = document.getElementById('special-note').value;

    if (!dateVal || !timeVal) {
      alert('Veuillez choisir une date et une heure.');
      return;
    }

    if (selectedActivities.length === 0) {
      alert('Sélectionnez au moins une activité pour votre date !');
      return;
    }

    const newPlan = {
      id: `date-${Date.now()}`,
      proposer: proposer,
      respondent: respondent,
      date: dateVal,
      time: timeVal,
      activities: selectedActivities,
      specialNote: noteVal,
      dodgeCount: dodgeCount
    };

    // Sauvegarde sur le serveur backend Express
    const saved = await savePlanToServer(newPlan);
    activePlan = saved || newPlan;

    // Rendre visible le bouton 'Lettre' et afficher la vue
    document.getElementById('nav-btn-letter').style.display = 'inline-block';
    renderLetter(activePlan);
    showView('letter');
    showToast('Rendez-vous scellé et enregistré sur le serveur ! 💌');
  });
}

// --- RENDU DE LA LETTRE D'AMOUR ---
function renderLetter(plan) {
  if (!plan) return;

  const datetimeDisplay = document.getElementById('letter-datetime-display');
  const introText = document.getElementById('letter-intro-text');
  const listEl = document.getElementById('letter-activities-list');
  const noteBox = document.getElementById('letter-note-box');
  const noteText = document.getElementById('letter-note-text');

  // Formatage de la date en français
  try {
    const parts = plan.date.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = d.toLocaleDateString('fr-FR', options);
    datetimeDisplay.textContent = `Le ${dateFormatted} à ${plan.time}`;
  } catch {
    datetimeDisplay.textContent = `Le ${plan.date} à ${plan.time}`;
  }

  introText.innerHTML = `Chère <strong>${plan.respondent}</strong>, ton amoureux(se) <strong>${plan.proposer}</strong> est comblé(e) de bonheur d'avoir partagé ce pacte d'amour.`;

  listEl.innerHTML = '';
  plan.activities.forEach(act => {
    const li = document.createElement('li');
    li.textContent = act;
    listEl.appendChild(li);
  });

  if (plan.specialNote && plan.specialNote.trim()) {
    noteBox.style.display = 'block';
    noteText.textContent = plan.specialNote.trim();
  } else {
    noteBox.style.display = 'none';
  }
}

// --- TABLEAU DE BORD SYNCHRONISÉ ---
function setupDashboard() {
  document.getElementById('btn-sync-now').addEventListener('click', () => {
    fetchPlansFromServer();
    showToast('Synchronisation effectuée 🔄');
  });

  document.getElementById('btn-clear-all').addEventListener('click', async () => {
    if (confirm('Voulez-vous vraiment effacer tous les rendez-vous ?')) {
      await fetch('/api/plans', { method: 'DELETE' });
      allPlans = [];
      renderDashboardPlans();
      showToast('Tous les rendez-vous ont été effacés.');
    }
  });

  // Filtres par personne
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDashboardPlans(btn.dataset.filter);
    });
  });
}

function renderDashboardPlans(filter = 'all') {
  const container = document.getElementById('plans-container');
  container.innerHTML = '';

  const filtered = allPlans.filter(p => {
    if (filter === 'all') return true;
    return p.respondent === filter || p.proposer === filter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 30px; text-align: center; color: #9ca3af;">
        Aucun rendez-vous trouvé. Planifiez-en un depuis l'onglet "Planifier" ! 💕
      </div>
    `;
    return;
  }

  filtered.forEach(plan => {
    const card = document.createElement('div');
    card.className = 'plan-item';

    const tagsHtml = plan.activities.map(a => `<span class="plan-tag">${a}</span>`).join('');
    const noteHtml = plan.specialNote ? `<div class="plan-note">« ${plan.specialNote} »</div>` : '';

    card.innerHTML = `
      <div class="plan-item-left">
        <span class="plan-badge">Pour ${plan.respondent} (par ${plan.proposer})</span>
        <div class="plan-date-title">📅 ${plan.date} à ${plan.time}</div>
        <div class="plan-meta">Validé avec ${plan.dodgeCount || 0} esquive(s)</div>
        <div class="plan-tags">${tagsHtml}</div>
        ${noteHtml}
      </div>
      <button class="btn-delete-plan" title="Supprimer ce rendez-vous" data-id="${plan.id}">
        🗑️
      </button>
    `;

    card.querySelector('.btn-delete-plan').addEventListener('click', async () => {
      if (confirm('Supprimer ce rendez-vous ?')) {
        await deletePlanFromServer(plan.id);
      }
    });

    container.appendChild(card);
  });
}

// --- APPELS API VERS LE SERVEUR EXPRESS ---
async function fetchPlansFromServer(silent = false) {
  try {
    const res = await fetch('/api/plans');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        allPlans = json.data;
        renderDashboardPlans();
      }
    }
  } catch (err) {
    if (!silent) console.warn('Erreur chargement API:', err);
  }
}

async function savePlanToServer(plan) {
  try {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.error('Erreur sauvegarde plan:', err);
  }
  return plan;
}

async function deletePlanFromServer(id) {
  try {
    const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
    if (res.ok) {
      allPlans = allPlans.filter(p => p.id !== id);
      renderDashboardPlans();
      showToast('Rendez-vous supprimé 🗑️');
    }
  } catch (err) {
    console.error('Erreur suppression:', err);
  }
}

// --- PETITE NOTIFICATION TOAST ---
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
