# EPIC-002 — QA & Déploiement Vercel

> Priorité : 🔴 BLOQUANT V0 — ✅ **TERMINÉ le 2026-06-22**
> Objectif : L'app build proprement et tourne en production sur Vercel avant la canicule.

---

## Contexte

Toutes les features V0 sont implémentées. Il reste à valider que le build TypeScript est propre,
à faire un smoke test mobile complet, et à confirmer le déploiement Vercel.

---

## Stories

### STORY-002-1 — Build propre (lint + tsc)

**Statut** : ✅ Terminé  
**Effort** : variable (dépend des erreurs trouvées)

**Description**  
Exécuter les deux checks obligatoires et corriger tous les blocages avant de déclarer la V0 prête.

**Critères d'acceptation**

- [x] `pnpm lint` → 0 erreur ESLint (2 warnings intentionnels BDR-028)
- [x] `pnpm build` → 0 erreur TypeScript + bundle généré sans warning bloquant
- [x] La taille du bundle JS est raisonnable : **123 kB gzippé** (limite : 300 kB)

**Notes**

- Vérifier que les 3 dérogations react-doctor intentionnelles (BDR-028) sont correctement ignorées
  et ne causent pas d'échec build
- `pnpm-workspace.yaml` doit avoir un champ `packages:` non vide (LRN-028)

---

### STORY-002-2 — Smoke test fonctionnel mobile

**Statut** : ✅ Terminé — testé via déploiement Vercel `development` (auth désactivée temporairement)  
**Dépendance** : STORY-002-1

**Description**  
Tester le parcours utilisateur complet sur mobile (téléphone réel, pas simulateur).

**Parcours principal**

- [x] L'app charge sans erreur JS (console propre)
- [x] La géolocalisation GPS fonctionne (demande de permission, coordonnées récupérées)
- [x] La recherche commune fonctionne (autocomplete API Adresse → sélection → météo chargée)
- [x] La météo s'affiche (RecommendCard visible, VerdictBanner non vide)
- [x] Le VerdictBanner affiche le bon état selon l'heure actuelle
- [x] Les IdealSlots affichent les créneaux avec heure + icône période
- [x] La VentilationTimeline affiche les barres colorées sur 24h
- [x] Le slider température est utilisable au doigt (haptics fonctionnels)
- [x] Les boutons ComfortLevel (hot/neutral/cool) changent le verdict
- [x] Le CarouselTips swipe correctement (gauche/droite, auto-défilement)
- [x] Le bouton "Ajouter au calendrier" télécharge un `.ics` valide
- [x] Le `.ics` s'ouvre dans l'app Calendrier iOS ou Google Calendar Android

**Edge cases à vérifier**

- [x] Refus de géolocalisation → recherche manuelle s'affiche correctement
- [x] Pas de connexion → message d'erreur météo visible (pas de crash)
- [x] Minuit traversé : les créneaux du lendemain affichent bien le label jour

---

### STORY-002-3 — Déploiement Vercel + smoke test prod

**Statut** : ✅ Terminé  
**Dépendance** : STORY-002-1, STORY-002-2

**Description**  
Pousser sur `main`, vérifier que le déploiement Vercel passe, et effectuer un smoke test rapide
sur l'URL de production.

**Critères d'acceptation**

- [x] `git push origin main` → build Vercel vert (pas d'erreur tsc dans les logs)
- [x] L'URL de production est accessible publiquement : **https://ifecho.vercel.app**
- [x] L'app charge sur l'URL prod depuis un mobile 4G (pas seulement WiFi dev)
- [x] Lighthouse PWA sur l'URL prod → scores ≥ 80 (Perf 85/99 · A11y 100 · BP 92 · SEO 100)
- [x] Pas de requête bloquée par CORS (Open-Meteo et API Adresse en prod)

**Checklist Vercel**

- [x] Framework preset : `Vite` (auto-détecté)
- [x] Build command : `pnpm build`
- [x] Output directory : `dist`
- [x] Aucune variable d'environnement requise (app 100% client-side, 0 secret)

**Post-déploiement**

- [x] Partager l'URL à quelqu'un pour test externe avant la canicule du 27 juin (frère Android ✅ — iOS ce soir)
- [x] Vérifier que le README pointe sur la bonne URL prod (badge ajouté : https://ifecho.vercel.app)
