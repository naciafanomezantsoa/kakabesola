# Guide de Déploiement sur Onrender (Render.com)

Ce guide détaille pas à pas la procédure pour mettre en ligne l'application full-stack **Charobidy & Nacia** avec son serveur Express et sa base de données synchronisée.

---

## 📋 Prérequis

1. Un compte gratuit sur [GitHub](https://github.com).
2. Un compte gratuit sur [Render.com](https://render.com).

---

## 🚀 Étape 1 : Mettre le code sur GitHub

1. Créez un nouveau dépôt sur GitHub nommé `charobidy-nacia`.
2. Poussez votre code local vers GitHub :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Charobidy & Nacia Full-Stack"
   git branch -M main
   git remote add origin https://github.com/VOTRE_PSEUDO/charobidy-nacia.git
   git push -u origin main
   ```

---

## 🌐 Étape 2 : Créer le Web Service sur Render

1. Rendez-vous sur votre tableau de bord [Render Dashboard](https://dashboard.render.com).
2. Cliquez sur le bouton **« New + »** en haut à droite, puis sélectionnez **« Web Service »**.
3. Choisissez **« Build and deploy from a Git repository »** et connectez votre dépôt GitHub `charobidy-nacia`.
4. Remplissez les paramètres suivants :
   - **Name** : `charobidy-nacia` (ou le nom de votre choix)
   - **Region** : Frankfurt (EU) ou Oregon (US)
   - **Branch** : `main`
   - **Root Directory** : *(laisser vide)*
   - **Runtime** : `Node`
   - **Build Command** :
     ```bash
     npm install && npm run build
     ```
   - **Start Command** :
     ```bash
     npm run start
     ```
   - **Instance Type** : `Free` (0 $/mois)

---

## ⚙️ Étape 3 : Variables d'environnement

Dans la section **« Environment Variables »**, ajoutez les clés suivantes :
- `NODE_ENV` = `production`
- `PORT` = `3000`

*(Render injecte automatiquement la variable `PORT`, notre serveur Express l'écoute nativement).*

---

## 💾 Étape 4 (Optionnelle) : Disque persistant pour les données

Par défaut, la base de données légère est stockée dans le dossier local `./data/couples_db.json`. 
Sur l'offre gratuite de Render, le système de fichiers est éphémère (les données sont conservées tant que l'instance tourne).
Si vous souhaitez conserver les rendez-vous de manière permanente même lors des redémarrages serveur :
1. Dans les paramètres de votre service Render, allez dans **« Disks »**.
2. Cliquez sur **« Add Disk »**.
3. Nom : `data-disk`
4. Mount Path : `/data`
5. Size : `1 GB` (offre Starter).

---

## 🎉 Étape 5 : Déploiement et Vérification

1. Cliquez sur **« Create Web Service »**.
2. Render va exécuter :
   - L'installation des dépendances (`npm install`)
   - La compilation de l'application frontend PWA (`vite build`)
   - Le démarrage du serveur Express (`npm run start`)
3. Dès que les logs affichent :
   ```
   ❤️ Charobidy & Nacia server running on http://0.0.0.0:3000 [production]
   ==> Your service is live 🎉
   ```
4. Cliquez sur votre URL publique fournie par Render (ex: `https://charobidy-nacia.onrender.com`).
5. **Nacia** et **Charobidy** peuvent désormais ouvrir le lien sur leurs smartphones respectifs :
   - Vos rendez-vous et promesses se synchronisent en temps réel via le serveur !
   - Cliquez sur **« Installer sur Android »** pour l'ajouter directement à votre écran d'accueil comme une vraie application mobile.
