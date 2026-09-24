const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'dates.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Données par défaut si le fichier n'existe pas encore
const DEFAULT_PLANS = [
  {
    id: "plan-demo-1",
    proposer: "Charobidy",
    respondent: "Nacia",
    date: "2026-10-14",
    time: "20:00",
    activities: ["plan kaly 🍜", "regarder un film", "dormir", "dormir sans main"],
    specialNote: "Notre premier date complice et inoubliable ❤️",
    dodgeCount: 4,
    createdAt: new Date().toISOString()
  }
];

// Initialiser le dossier data et le fichier dates.json en toute sécurité
function initDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_PLANS, null, 2), 'utf-8');
  }
}

// Lecture sécurisée des rendez-vous
function readPlans() {
  initDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur lecture dates.json :", err);
    return DEFAULT_PLANS;
  }
}

// Écriture atomique sécurisée (évite toute corruption en cas de coupure)
function writePlans(plans) {
  initDataFile();
  const tempFile = `${DATA_FILE}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(plans, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (err) {
    console.error("Erreur écriture dates.json :", err);
    return false;
  }
}

// --- ROUTES API ---

// 1. Récupérer tous les rendez-vous synchronisés
app.get('/api/plans', (req, res) => {
  const plans = readPlans();
  res.json({ success: true, data: plans });
});

// 2. Enregistrer un nouveau rendez-vous
app.post('/api/plans', (req, res) => {
  const newPlan = req.body;
  if (!newPlan || !newPlan.date || !newPlan.time || !newPlan.respondent) {
    return res.status(400).json({ success: false, error: 'Données incomplètes' });
  }

  const plans = readPlans();
  const planToSave = {
    id: newPlan.id || `date-${Date.now()}`,
    proposer: newPlan.proposer || 'Charobidy',
    respondent: newPlan.respondent || 'Nacia',
    date: newPlan.date,
    time: newPlan.time,
    activities: Array.isArray(newPlan.activities) ? newPlan.activities : [],
    specialNote: newPlan.specialNote || '',
    dodgeCount: Number(newPlan.dodgeCount) || 0,
    createdAt: new Date().toISOString()
  };

  plans.unshift(planToSave);
  writePlans(plans);

  res.status(201).json({ success: true, data: planToSave });
});

// 3. Supprimer un rendez-vous par son ID
app.delete('/api/plans/:id', (req, res) => {
  const { id } = req.params;
  let plans = readPlans();
  const initialLength = plans.length;
  plans = plans.filter(p => p.id !== id);

  if (plans.length !== initialLength) {
    writePlans(plans);
    return res.json({ success: true, message: 'Rendez-vous supprimé' });
  }
  res.status(404).json({ success: false, error: 'Rendez-vous introuvable' });
});

// 4. Tout effacer
app.delete('/api/plans', (req, res) => {
  writePlans([]);
  res.json({ success: true, message: 'Tous les rendez-vous ont été effacés' });
});

// 5. Réinitialiser les exemples
app.post('/api/plans/reset', (req, res) => {
  writePlans(DEFAULT_PLANS);
  res.json({ success: true, data: DEFAULT_PLANS });
});

// Démarrage du serveur Express
app.listen(PORT, () => {
  console.log(`❤️ Charobidy baeko est en ligne sur http://localhost:${PORT}`);
});
