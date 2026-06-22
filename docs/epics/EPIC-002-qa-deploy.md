# EPIC-002 — QA & Déploiement Vercel

> Priorité : 🔴 BLOQUANT V0
> Objectif : L'app build proprement et tourne en production sur Vercel avant la canicule.

---

## Contexte

Toutes les features V0 sont implémentées. Il reste à valider que le build TypeScript est propre,
à faire un smoke test mobile complet, et à confirmer le déploiement Vercel.

---

## Stories

### STORY-002-1 — Build propre (lint + tsc)

**Statut** : ⬜ À faire  
**Effort** : variable (dépend des erreurs trouvées)

**Description**  
Exécuter les deux checks obligatoires et corriger tous les blocages avant de déclarer la V0 prête.

**Critères d'acceptation**

- [ ] `pnpm lint` → 0 erreur ESLint
- [ ] `pnpm build` → 0 erreur TypeScript + bundle généré sans warning bloquant
- [ ] La taille du bundle JS est raisonnable (< 300 kB gzippé — framer-motion est le plus lourd)

**Notes**

- Vérifier que les 3 dérogations react-doctor intentionnelles (BDR-028) sont correctement ignorées
  et ne causent pas d'échec build
- `pnpm-workspace.yaml` doit avoir un champ `packages:` non vide (LRN-028)

---

### STORY-002-2 — Smoke test fonctionnel mobile

**Statut** : ⬜ À faire  
**Dépendance** : STORY-002-1

**Description**  
Tester le parcours utilisateur complet sur mobile (téléphone réel, pas simulateur).

**Parcours principal**

- [ ] L'app charge sans erreur JS (console propre)
- [ ] La géolocalisation GPS fonctionne (demande de permission, coordonnées récupérées)
- [ ] La recherche commune fonctionne (autocomplete API Adresse → sélection → météo chargée)
- [ ] La météo s'affiche (RecommendCard visible, VerdictBanner non vide)
- [ ] Le VerdictBanner affiche le bon état selon l'heure actuelle
- [ ] Les IdealSlots affichent les créneaux avec heure + icône période
- [ ] La VentilationTimeline affiche les barres colorées sur 24h
- [ ] Le slider température est utilisable au doigt (haptics fonctionnels)
- [ ] Les boutons ComfortLevel (hot/neutral/cool) changent le verdict
- [ ] Le CarouselTips swipe correctement (gauche/droite, auto-défilement)
- [ ] Le bouton "Ajouter au calendrier" télécharge un `.ics` valide
- [ ] Le `.ics` s'ouvre dans l'app Calendrier iOS ou Google Calendar Android

**Edge cases à vérifier**

- [ ] Refus de géolocalisation → recherche manuelle s'affiche correctement
- [ ] Pas de connexion → message d'erreur météo visible (pas de crash)
- [ ] Minuit traversé : les créneaux du lendemain affichent bien le label jour

---

### STORY-002-3 — Déploiement Vercel + smoke test prod

**Statut** : ⬜ À faire  
**Dépendance** : STORY-002-1, STORY-002-2

**Description**  
Pousser sur `main`, vérifier que le déploiement Vercel passe, et effectuer un smoke test rapide
sur l'URL de production.

**Critères d'acceptation**

- [ ] `git push origin main` → build Vercel vert (pas d'erreur tsc dans les logs)
- [ ] L'URL de production est accessible publiquement (pas de login Vercel requis)
- [ ] L'app charge sur l'URL prod depuis un mobile 4G (pas seulement WiFi dev)
- [ ] Lighthouse PWA sur l'URL prod → score ≥ 80
- [ ] Pas de requête bloquée par CORS (Open-Meteo et API Adresse en prod)

**Checklist Vercel**

- [ ] Framework preset : `Vite` (auto-détecté)
- [ ] Build command : `pnpm build`
- [ ] Output directory : `dist`
- [ ] Aucune variable d'environnement requise (app 100% client-side, 0 secret)

**Post-déploiement**

- [ ] Partager l'URL à quelqu'un pour test externe avant la canicule du 27 juin
- [ ] Vérifier que le README pointe sur la bonne URL prod
