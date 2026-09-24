import express from 'express';
import cors from 'cors';
import path from 'path';
import { db } from './server/db.ts';

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  // Standard middleware
  app.use(cors());
  app.use(express.json());

  // API Endpoints for Couple Synchronization
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Charobidy & Nacia API',
      timestamp: new Date().toISOString(),
    });
  });

  // Download complete project ZIP
  app.get('/charobidy-baeko.zip', (req, res) => {
    const zipPath = path.resolve(process.cwd(), 'public', 'charobidy-baeko.zip');
    res.download(zipPath, 'charobidy-baeko.zip');
  });

  // GET all plans
  app.get('/api/plans', (req, res) => {
    try {
      const plans = db.getPlans();
      res.json({ success: true, data: plans });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des rendez-vous' });
    }
  });

  // POST create / save a plan
  app.post('/api/plans', (req, res) => {
    try {
      const plan = req.body;
      if (!plan || !plan.date || !plan.time || !plan.respondent) {
        res.status(400).json({ success: false, error: 'Données de rendez-vous incomplètes' });
        return;
      }
      const saved = db.savePlan(plan);
      res.status(201).json({ success: true, data: saved });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement' });
    }
  });

  // PUT update plan status
  app.put('/api/plans/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = db.updatePlanStatus(id, status);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Rendez-vous non trouvé' });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' });
    }
  });

  // DELETE single plan
  app.delete('/api/plans/:id', (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deletePlan(id);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression' });
    }
  });

  // DELETE clear all plans
  app.delete('/api/plans', (req, res) => {
    try {
      db.clearAllPlans();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors du nettoyage' });
    }
  });

  // POST reset defaults
  app.post('/api/plans/reset', (req, res) => {
    try {
      const defaults = db.resetDefaults();
      res.json({ success: true, data: defaults });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de la réinitialisation' });
    }
  });

  // GET couple notes / promises
  app.get('/api/notes', (req, res) => {
    try {
      const notes = db.getNotes();
      res.json({ success: true, data: notes });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des notes' });
    }
  });

  // POST add couple note
  app.post('/api/notes', (req, res) => {
    try {
      const { author, content } = req.body;
      if (!content || !content.trim()) {
        res.status(400).json({ success: false, error: 'Contenu vide' });
        return;
      }
      const newNote = db.addNote(author, content);
      res.status(201).json({ success: true, data: newNote });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la note' });
    }
  });

  // DELETE couple note
  app.delete('/api/notes/:id', (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteNote(id);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la note' });
    }
  });

  // Vite integration: Dev middleware or Static production serving
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`❤️ Charobidy & Nacia server running on http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
