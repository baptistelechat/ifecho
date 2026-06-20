---
register: journal
last_updated: 2026-06-21
---

## 2026-06-20

Session de lancement du projet ifecho. Brainstorm complet réalisé avec Rodin (avocat du diable) pour valider le scope et les décisions de conception. Projet né du contexte canicule historique prévue ~27 juin 2026 en France.

Scope V0 acté : ventilation (algo score), conseils vitrage (statique), rappel calendrier `.ics`. Tout le reste (humidité intérieure, capteurs IoT, notifs push, historique) reporté en V2.

Infrastructure mémoire agent initialisée via `/memory-setup`.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — Vite + React pour SPA statique V0
- [BDR-002](decisions/BDR-002.md) — Rappel `.ics` côté client
- [BDR-003](decisions/BDR-003.md) — Humidité intérieure hors scope V0
- [LRN-001](learnings/LRN-001.md) — Algo score ventilation
- [LRN-002](learnings/LRN-002.md) — Règle des 500 W/m²
- [BLK-001](blockers/BLK-001.md) — Deadline 36h

---

Deuxième session de brainstorm. Refonte complète de la section notifications V1 : abandon de l'approche VAPID individuelle, découverte que FCM Topics change le modèle de coût (O(topics) pas O(users)). Architecture finale : FCM Topics dept-XX + Raspberry Pi comme cron scheduler.

Plusieurs décisions affinées sur le scope V0 : autocomplete commune via API Adresse gouvernement, dual mode saisie température intérieure, sunrise/sunset dynamique depuis Open-Meteo. Correction importante : préfecture ≠ centroïde du département — utiliser `departements.ts` statique pour les coordonnées réelles.

Agent a oscillé 3+ fois sur l'infra notifications avant convergence. VS Code affichait contenu périmé après edits agent (hook formatter) — résolu via "Revert File".

**Entrées clés :**

- [BDR-004](decisions/BDR-004.md) — FCM Topics + RPi pour V1 (décision d'architecture majeure)
- [LRN-004](learnings/LRN-004.md) — FCM Topics : modèle de coût O(topics)
- [ZBLK-002](archive/blockers/ZBLK-002.md) — Oscillation agent notifications (résolu)
- [ZBLK-003](archive/blockers/ZBLK-003.md) — Formatter hook → VS Code stale content (résolu)

---

Troisième session : implémentation complète de l'app ifecho from scratch. `pnpm create vite` refusé (CWD non vide) → tous les fichiers créés manuellement : `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, composants, hooks, types, data. shadcn/ui a créé les composants dans `@\components\ui\` (Windows) au lieu de `src\components\ui\` → relus, recrées dans le bon dossier, `@\` supprimé. Deux erreurs build résolues : `vite-env.d.ts` manquant (CSS imports) et `@types/node` manquant (`path`/`__dirname`).

App entièrement fonctionnelle : flow complet testé via dev-browser avec données Open-Meteo réelles pour Nantes. Screenshot confirmé — RecommendCard affiche 00h00 (meilleur créneau), gain -7°C, humidité 78%, badge "Excellent". Build propre : 253kB JS / 24kB CSS, 0 erreur TS, 0 erreur lint.

**Entrées clés :**

- [ZBLK-004](archive/blockers/ZBLK-004.md) — `pnpm create vite` bloqué (résolu)
- [ZBLK-005](archive/blockers/ZBLK-005.md) — shadcn composants dans mauvais dossier Windows (résolu)
- [ZBLK-006](archive/blockers/ZBLK-006.md) — Build error CSS import (résolu)
- [ZBLK-007](archive/blockers/ZBLK-007.md) — Build error `path`/`__dirname` (résolu)

---

Quatrième session : palette warm orange, restauration TipsSection + VentilationTimeline, correction bug heure passée, nettoyage résidus bleus.

Baptiste avait rejeté la palette froide → refonte complète : background crème (#fff8f4), accent ember (#ea580c), CSS vars shadcn/ui entièrement remappées. Exception sémantique : Cloud/Droplets dans `ThermalComparison` gardent `text-sky` (contraste "air extérieur frais vs intérieur surchauffé").

Bug critique corrigé : `getBestVentilationHour` recommandait 5h à 20h (meilleure heure absolue, passée). Fix : filtre `s.hour >= currentHour` + `null` si aucune heure future favorable. `IdealSlots` filtré de même (`slot.end > currentHour`).

`TipsSection` et `VentilationTimeline` restaurés avec Lucide icons (pas d'emojis). Prop `bestHour` retirée de la chaîne `RecommendCard → IdealSlots`, récupérée directement par `VentilationTimeline` et `CalendarLink` depuis `App.tsx`.

Screenshot de Baptiste : résidus `text-sky`/`bg-sky` détectés sur `LocationSearch`, `VerdictBanner`, header Wind → nettoyés via grep + remplacement.

Session longue avec compaction automatique : Edit tool a refusé 2 fichiers post-compaction (tips.ts, VentilationTimeline) → re-Read requis avant Edit.

**Entrées clés :**

- [BDR-009](decisions/BDR-009.md) — Palette warm orange
- [BDR-010](decisions/BDR-010.md) — getBestVentilationHour : heures futures uniquement
- [ZBLK-008](archive/blockers/ZBLK-008.md) — Edit tool post-compaction (résolu)
- [ZBLK-009](archive/blockers/ZBLK-009.md) — Cascade TS6133 prop bestHour (résolu)

## 2026-06-21

Session de qualité code : scan `/react-doctor` sur ifecho. Score initial 53/100, 2 erreurs, 23 issues. Corrections appliquées sur les fichiers non-shadcn uniquement (shadcn/ui ignoré intentionnellement).

Fix principal : `no-adjust-state-on-prop-change` ×2 dans `useWeatherForecast` — `setIsLoading(true)` et `setError(null)` déplacés hors du `useEffect` vers un bloc `if (lat !== prevLat || lon !== prevLon)` inline pendant le render, avec `useState(prevLat/prevLon)`. L'effet ne contient plus que la logique async et la mise à jour du résultat.

Autres fixes rapides : `type="button"` sur 5 boutons (`CalendarLink`, `LocationSearch`, `TempSelector`), clé stable `${city}-${departmentCode}` à la place de l'index `i` dans `LocationSearch`, `aria-label="Rechercher une ville"` sur l'input texte, lazy initializer `useState(() => value.toString())` dans `TempSelector`.

Score final : 56/100, 0 erreur, 13 issues résiduels (shadcn/ui + `no-fetch-in-effect` false positive sur SPA sans Server Components). Lint propre.

**Entrées clés :**

- [LRN-005](learnings/LRN-005.md) — Pattern `prevProp` inline render
