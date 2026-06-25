---
register: journal
last_updated: 2026-06-25
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
- [ZBLK-001](archive/blockers/ZBLK-001.md) — Deadline 36h

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

---

Session courte de polish UI. Restructuration du layout `App.tsx` en 3 zones sémantiques : `<header>` toujours en haut, `<main flex-1>` pour le contenu, `<footer>` collé en bas de page. Le champ de recherche est désormais centré verticalement à l'état vide grâce à `my-auto` conditionnel sur le conteneur interne — quand les données météo arrivent, `my-auto` disparaît et le contenu s'aligne naturellement en haut. Ajout d'une signature "Made by @baptistelechat with Heart Lucide" dans le footer avec lien vers le portfolio (baptistelechat.vercel.app).

**Entrées clés :**

- [BDR-011](decisions/BDR-011.md) — Layout flex-col sémantique + footer collé en bas

---

Session de polish UX sur la localisation GPS. Ajout du bouton "Me localiser" (variant link) à côté du label "Entrez votre ville" pour relancer la géoloc à tout moment. Ajout du champ `source: 'gps' | 'search'` sur `GeoLocation` pour distinguer l'origine et adapter le label — GPS résolu affiche "Votre position (Paris)", bouton masqué quand source GPS déjà active.

Bug découvert via screenshot Baptiste : label affichait systématiquement "Votre position" sans nom de commune. Cause racine : `&type=municipality` dans l'URL `/reverse/` API Adresse est trop restrictif — retourne `features: []` sauf si les coordonnées tombent exactement sur un centroïde de commune (jamais en pratique). Fix : supprimer le paramètre `type` de l'appel reverse. Corrigé en 1 ligne.

**Entrées clés :**

- [BDR-012](decisions/BDR-012.md) — GeoLocation.source : discriminant GPS/recherche
- [ZBLK-002](archive/blockers/ZBLK-002.md) — "Votre position" sans ville (résolu)

---

Session de polish composants shadcn/ui. Remplacement systématique des éléments HTML natifs (`<button>`, `<input>`, `<input type="range">`) par leurs équivalents shadcn. Variants créés dans `button.tsx` : `surface` (bouton carte), `cta` (plein-largeur), size `icon` (rounded-full). Styles absorbés dans `input.tsx` : `border-border` au lieu de `border-input` (invisible car `--input: #ffffff` dans ce thème), `bg-input`, `rounded-xl`, focus ring subtil. Slider radix installé pour `ThermalComparison`. `TempSelector` supprimé (inutilisé).

Moment clé : question sur le bouton GPS qui utilisait `variant="ember" size="icon"`. Tentative de créer un `compoundVariants` CVA pour merger les deux dimensions → trop complexe. Baptiste a clarifié : `ember` = couleur primary = `variant="default"`. Variant `ember` supprimé, compound variant retiré. Usage final : `<Button size="icon">` seulement.

**Entrées clés :**

- [BDR-013](decisions/BDR-013.md) — Centralisation styles shadcn, variants dédiés
- [ZBLK-010](archive/blockers/ZBLK-010.md) — Compound variant CVA inutile (résolu)

---

Session enrichissement données météo + refonte algo ventilation. Trois nouvelles variables ajoutées à l'appel Open-Meteo : `apparent_temperature`, `windspeed_10m`, `uv_index`. Propagées du type `WeatherHour` → `HourlyScore` via `useWeatherForecast` et `useVentilationScore`. Affichage dans `ThermalComparison` : ressenti (Thermometer ember), humidité + vent en ligne horizontale, UV (Sun amber).

Décision structurante : l'algo de ventilation utilise désormais `apparentTemperature` dans `deltaT` au lieu de la température sèche. `malusHumidity` supprimé — redondant car `apparent_temperature` intègre déjà vent + humidité + rayonnement. `bonusNight` réduit de +2 à +1 (signal UX léger, pas physique). Seuil `isFavorable` passé de `> 0` à `> 2°C` après analyse d'exemples concrets : un gain de <2°C de ressenti ne justifie pas d'ouvrir les fenêtres.

**Entrées clés :**

- [BDR-014](decisions/BDR-014.md) — `apparentTemperature` comme base du score ventilation
- [BDR-015](decisions/BDR-015.md) — Seuil `isFavorable > 2°C`
- [LRN-006](learnings/LRN-006.md) — Variable API composite : ne pas doubler ses composantes

---

Session de polish UX : édition inline de la température intérieure. Clic direct sur le chiffre `26°` bascule en `<input>` avec auto-focus et auto-sélection — Enter/blur valide, Escape annule. Le slider reste fonctionnel en parallèle.

Deux blockers résolus : `React.KeyboardEvent<HTMLInputElement>` ne compilait pas car le namespace `React` n'est pas importé dans ce projet (named imports uniquement) — fix via structural typing `(e: { key: string })`. Puis un layout shift résiduel malgré `p-0 border-0` sur l'input : cause = intrinsic height du navigateur, pas le padding. Fix final : conteneur `div.flex.h-[1em]` + `h-full` sur l'input, vérifié par screenshots dev-browser avant/après.

Correction de rangement mémoire : BLK-003 à BLK-009 étaient des fichiers orphelins non référencés dans l'index (créés lors de sessions précédentes mais jamais archivés). Archivés en ZBLK-003 à ZBLK-009, index mis à jour, fichiers actifs supprimés.

**Entrées clés :**

- [BDR-016](decisions/BDR-016.md) — Édition inline température : isEditing toggle + h-[1em]
- [LRN-007](learnings/LRN-007.md) — intrinsic height input vs button : fix h-[1em]
- [ZBLK-011](archive/blockers/ZBLK-011.md) — React.KeyboardEvent sans namespace (résolu)
- [ZBLK-012](archive/blockers/ZBLK-012.md) — Layout shift input vs button (résolu)

---

Session de polish UX sur `ThermalComparison` : 3 demandes successives.

(1) `ComfortLevel` migré de `T | null` vers `T` non-nullable — `"neutral"` devient le défaut permanent, sans toggle de déselection. Simplifie toute la chaîne de types et supprime les ternaires défensifs dans `App.tsx`, `RecommendCard` et `ThermalComparison`.

(2) Ligne `Ressenti ~{X}°` ajoutée dans le panneau intérieur, affichant `feltIndoorTemp = indoorTemp + comfortBias`. L'utilisateur voit immédiatement l'impact de son choix de confort ressenti.

(3) Icônes Lucide `Flame` / `Minus` / `Snowflake` remplacent les emojis. Layout panneau intérieur réorganisé par usage : saisie (big temp + slider) en haut, perception (`Ressenti ~X°` + boutons) en bas. `COMFORT_ICONS: Record<ComfortLevel, LucideIcon>` défini hors composant.

Deux blockers résolus : RTK stale cache causait de fausses erreurs lint (`startEditing`, `handleKeyDown` marqués TS6133 — disparus via `pnpm lint` direct). PowerShell `@'...'@` perdait silencieusement les accents et le symbole ° — résolu via Write ASCII + Edit `replace_all: true` séquentiels.

**Entrées clés :**

- [BDR-017](decisions/BDR-017.md) — ComfortLevel non-nullable
- [BDR-018](decisions/BDR-018.md) — Lucide + layout panneau intérieur
- [ZBLK-013](archive/blockers/ZBLK-013.md) — RTK stale cache (résolu)
- [ZBLK-014](archive/blockers/ZBLK-014.md) — Écriture accentuée multi-tentatives (résolu)

---

Session courte de débat UX + ajout composant. Débat Rodin sur slider vs stepper (boutons +/-) pour la saisie de température. L'argument "affordance thermostat" a été invalidé : les thermostats physiques sont des cadrans rotatifs, pas des boutons up/down. L'argument correct pour le stepper : précision sans ciblage de précision sur mobile (1 tap = 1°C). Rodin a suggéré de combiner les deux — ce qui a été implémenté.

Modification de `ThermalComparison.tsx` : ajout de deux boutons ChevronUp/ChevronDown à droite du chiffre de température, en `flex-col gap-0.5`, avec `disabled` aux bornes 14° et 35°. Le slider existant est conservé. Pas de composant `button-group` shadcn installé — deux `Button` natifs suffisent.

**Entrées clés :**

- [BDR-019](decisions/BDR-019.md) — Dual control température : stepper + slider
- [LRN-011](learnings/LRN-011.md) — Affordance thermostat ≠ stepper +/-

---

Session courte de refonte sémantique du delta thermique. L'utilisateur a demandé que l'écart thermique (`deltaT`) soit calculé à partir des températures ressenties des deux côtés : ressenti intérieur (`indoorTemp + comfortBias`) et ressenti extérieur (`apparentTemperature`). Avant, `comfortBias` était ajouté séparément dans le score final — résultat mathématiquement identique, mais `deltaT` ne représentait pas l'écart réel perçu.

Fix en cascade propre : `useVentilationScore` (intégration de `comfortBias` dans `deltaT`, retrait du terme dans le score), `ThermalDelta` et `VerdictBanner` (suppression du recalcul local `indoorTemp - temperature`, lecture directe de `currentScore.deltaT`), `RecommendCard/index.tsx` (prop `indoorTemp` retirée des deux consommateurs). Lint propre au premier essai, 0 erreur.

**Entrées clés :**

- [BDR-020](decisions/BDR-020.md) — `deltaT` = ressenti intérieur − ressenti extérieur

---

Session de refonte de la VentilationTimeline : visualisation bidirectionnelle du score et alignement du système couleur entre Timeline et ThermalDelta.

Principales évolutions : timeline bidirectionnelle avec zone positive (44px vers le haut) et zone négative (28px vers le bas), flèches ArrowDown/ArrowUp animées (`animate-bounce`) en `position: absolute` sur l'heure courante, centrage automatique via `scrollIntoView({ inline: 'center' })`. Correction du seuil de couleur : amber désormais pour la zone ±2 (au lieu de rouge dès `score ≤ 0`). ThermalDelta migré de 2 niveaux (basés sur `deltaT`) à 3 niveaux (basés sur `score`), aligné sur le même système de seuils que la timeline.

Cinq blockers résolus : hooks React après return conditionnel (`rules-of-hooks`), centrage `offsetLeft` incorrect (remplacé par `scrollIntoView`), ligne jaune `bg-border` (CSS var amber dans ce thème warm), seuil rouge trop strict, deux verts différents unifiés.

**Entrées clés :**

- [BDR-021](decisions/BDR-021.md) — VentilationTimeline bidirectionnelle
- [BDR-022](decisions/BDR-022.md) — Seuil couleur 3 niveaux unifié

---

Session courte de polish timeline : fenêtre temporelle et UI.

Sujet principal : les créneaux idéaux et la VentilationTimeline s'arrêtaient à minuit (00h), tronquant les créneaux traversant la nuit (ex. "22h–06h" devenait "22h–00h"). Décision d'adopter une fenêtre glissante `[now, now+24h]` à la place de la journée calendaire 00h–23h. Nécessite `forecast_days: "2"` côté Open-Meteo, `sunrise2`/`sunset2` pour J+1, et un filtre asymétrique selon la date (J ou J+1).

Bug découvert au passage : heures avec `score === 0` (ΔT nul, pas de bonus nuit) n'affichaient aucune barre dans la timeline — `0 * ZONE_HEIGHT = 0px`. Fix : `MIN_BAR` ambre pour les valeurs nulles.

Côté timezone : `new Date(isoStr).getHours()` retourne l'heure UTC sur strings sans offset (Open-Meteo). En CEST le décalage est de +2h. Bug latent corrigé proactivement en parsant l'heure directement depuis le texte ISO.

Trois retouches UI : séparateur J/J+1 en ligne pointillée `border-l-2 border-dashed border-primary` avec date DD/MM en dessous ; remplacement du badge "+1j" par une icône `Moon` sur les créneaux "Nuit" dans IdealSlots ; continuité des créneaux par diff de timestamps (≤1h+1s) pour gérer le passage 23h→0h.

**Entrées clés :**

- [BDR-023](decisions/BDR-023.md) — Fenêtre glissante [now, now+24h]

---

Session de redesign du composant `IdealSlots`. Le composant affichait les créneaux favorables avec un layout basique (deux lignes, petites icônes) — Baptiste a demandé de l'aligner sur le style des widgets de température (`ThermalComparison`) avec de gros chiffres.

Redesign complet : l'heure (`05h – 08h`) passe en `text-4xl font-black leading-none`, le label période migre en bas à droite avec son icône. Création du pattern `TIME_OF_DAY_META` (Record) associant chaque période à une icône Lucide, une couleur et un chevron optionnel (`"up" | "down"`). Layout `flex items-end justify-between` par créneau — réduit la hauteur de carte de ~124px à ~105px.

Itération sur les icônes : `Sunrise`/`Sunset` initialement choisis pour "Matin frais" et "Soirée" se sont révélés illisibles à `size-3` (12px) — plusieurs paths SVG se fondent en blob. Signalé via screenshot Baptiste. Remplacement par `Sun` + `ArrowUp`/`ArrowDown` côte à côte — rendu immédiatement lisible. Biome a ensuite reformaté `ChevronUp`/`ChevronDown` en `ArrowUp`/`ArrowDown` (noms réels des icônes Lucide utilisées).

Couleurs par période appliquées à l'icône ET au label (`meta.color`). État `isNow` : tout passe en `text-ember` + fond `bg-ember/5`.

**Entrées clés :**

- [BDR-024](decisions/BDR-024.md) — IdealSlots redesign
- [LRN-021](learnings/LRN-021.md) — Icônes SVG complexes illisibles < 12px

---

Session de refonte `TipsSection` en carousel infini. Passage d'une liste statique (5 tips, booléen `urgent`) à un carousel framer-motion avec auto-scroll 4s, swipe pointer events, boutons ChevronLeft/Right, dots de navigation, bouton Play/Pause. Icônes Play/Pause affichent l'état courant (pas l'action future), contrôles centrés, toutes les cards en blanc (suppression du boolean `urgent`).

Deux blockers techniques majeurs résolus : `import from "motion/react"` absent du projet — fix immédiat en `"framer-motion"` ; AnimatePresence mode="wait" + variants custom laissait la card d'index 0 à `opacity: 0, translateX(100%)` — résolu en abandonnant AnimatePresence pour le pattern CSS flex-translate (`motion.div animate={{ x: '-{N*100}%' }}`).

Swipe mobile non fonctionnel malgré pointer events corrects — fix appliqué via `[touch-action:pan-y]` + `setPointerCapture`, confirmé fonctionnel sur device réel ([ZBLK-022](archive/blockers/ZBLK-022.md) résolu).

5 nouveaux tips ajoutés (ventilateur+eau, appareils électriques, côté nord, sol carrelé, draps humides) — total porté à 10. Interface `Tip` nettoyée (suppression `urgent?: boolean`).

**Entrées clés :**

- [ZBLK-020](archive/blockers/ZBLK-020.md) — `import from "motion/react"` (résolu)
- [ZBLK-021](archive/blockers/ZBLK-021.md) — AnimatePresence card initiale invisible (résolu)
- [ZBLK-022](archive/blockers/ZBLK-022.md) — Swipe mobile non fonctionnel (résolu)
- [BDR-025](decisions/BDR-025.md) — Carousel CSS flex-translate

---

Session courte de branding. Remplacement du favicon emoji 🌡️ par une icône vectorielle Lucide `ThermometerSun` — SVG inline sur fond orange `#f97316` avec `rx="8"` pour arrondis, paths récupérés depuis raw GitHub (site officiel et npm n'exposent pas les paths en texte brut). Débat Rodin préalable sur le choix d'icône : `Snowflake` écarté (humour contre-intuitif), `Wind` écarté (trop spécifique ventilation), `ThermometerSun` retenu car il couvre chaleur + mesure, scalable vers une future "suite canicule" sans se limiter à la ventilation.

Ajout du branding dans l'interface : nom "ifecho" + icône `ThermometerSun` dans le `<header>` (label au-dessus du h1, couleur ember), icône ajoutée également dans le footer à côté du nom. Le nom "ifecho" n'était visible que dans le footer avant cette session.

**Entrées clés :**

- [BDR-026](decisions/BDR-026.md) — `ThermometerSun` comme icône de l'app ifecho
- [LRN-026](learnings/LRN-026.md) — Path SVG Lucide : source fiable = raw GitHub

---

Session courte d'intégration haptic feedback via le package `web-haptics` (v0.0.6, Lochie Axon). Objectif : enrichir l'expérience mobile sans code natif ni API complexe.

Installation de `web-haptics`, création du hook `useHaptics` (wrapper thin exposant `success`, `nudge`, `error`). Intégré en 4 composants : `LocationSearch` (GPS→nudge, sélection commune→success, erreur via `useRef` prevError transition), `ThermalComparison` (steppers +/-→nudge, comfort buttons→success, inline edit commit→success, slider→nudge par step), `CalendarLink` (download→success), `TipsSection` (prev/next/dots→nudge).

Point de correction notable : premier jet du slider utilisait `onValueCommit` (fire une fois au relâchement) — Baptiste a demandé un retour à chaque cran comme une molette → corrigé en `onValueChange` (fire à chaque step). La distinction `onValueChange` vs `onValueCommit` est maintenant documentée globalement.

Lint propre (0 erreur) à l'issue. Le no-op silencieux de `web-haptics` sur desktop et iOS Safari garantit zéro garde défensive dans le code appelant.

**Entrées clés :**

- [BDR-027](decisions/BDR-027.md) — `web-haptics` + `useHaptics` wrapper + mapping UX

---

Session ultra-courte de bug fix. Bug rapporté par Baptiste : lors d'une recherche de commune, la page "se centrait" plutôt que de rester en haut. Cause identifiée dans `VentilationTimeline/index.tsx` : `scrollIntoView({ inline: "center", block: "nearest" })` appelé au mount traversait tous les ancêtres scrollables y compris la page — si la timeline était hors viewport vertical au premier chargement, la page scrollait vers elle même avec `block: "nearest"`. Fix en une ligne : remplacement par `container.scrollLeft = el.offsetLeft - container.clientWidth / 2 + el.offsetWidth / 2` — scroll horizontal isolé sans propager à la page.

---

Rituel `/memory-consolidate` (scope local). 2 candidats FUSIONNER détectés en phase A (LRN-001+LRN-012 via #ventilation #algorithm #scoring ; BDR-007+BDR-019 via #ux #temperature), infirmés en phase B — entrées complémentaires de niveaux distincts. Aucun candidat ARCHIVER. Registres propres.

---

Session de qualité code : scan `/react-doctor` complet sur ifecho. Score initial 50/100 "Critical", 1 erreur + 25 warnings sur 14 fichiers. Score final 75/100 "Needs work" après correction de 21 diagnostics, 4 déférés intentionnellement.

Fixes principaux : `require-reduced-motion` + `LazyMotion` dans `App.tsx`, migration `forwardRef` → `ref` prop dans 4 composants shadcn (`button`, `card`, `input`, `slider`), pattern event-handler ref pour `useHaptics()` dans `LocationSearch` (hook retournant objet instable à chaque render), `.flatMap()` dans `IdealSlots` et `useVentilationScore`, `type="button"` sur boutons natifs, `animate-bounce` → `animate-nudge` custom (`@keyframes` dans `index.css`), migration `motion` → `m` dans `TipsSection`.

Deux blockers techniques : `pnpm-workspace.yaml` créé avec `settings:` clé non reconnue par react-doctor (fix : champs racine) ; JSON react-doctor non parsable via RTK piping sur Windows (fix : `--json > ./rd_final.json` dans le CWD).

4 warnings déférés : `exhaustive-deps` FP sur `resumeRef.current` en cleanup, `only-export-components` ×2 pattern shadcn, `no-fetch-in-effect` exception V0 SPA.

**Entrées clés :**

- [BDR-028](decisions/BDR-028.md) — Défers react-doctor intentionnels
- [LRN-027](learnings/LRN-027.md) — Hook instable → event-handler ref
- [ZBLK-024](archive/blockers/ZBLK-024.md) — `settings:` ignoré par react-doctor
- [ZBLK-025](archive/blockers/ZBLK-025.md) — JSON react-doctor non parsable Windows

---

## 2026-06-22

Session de bug fix et refonte algorithmique. Bug signalé par Baptiste : incohérence de couleur entre VerdictBanner (jaune, basé sur `deltaT`=1.1°C) et ThermalDelta + VentilationTimeline (verts, basés sur `score`=2.1 avec `bonusNight`=1). Cause : `getVerdict()` utilisait `score.deltaT` brut pendant que les autres composants utilisaient `score.score` composite. Fix : migration de `getVerdict()` vers `score.score` avec seuils unifiés (≥4 "Aérez maintenant", >2 "Bon moment", >0 "Légèrement bénéfique", ≤0 "Patientez", <-2 "Ne pas aérer").

Débat connexe : message affichait "1.1°C" (deltaT) pendant que la décision reposait sur score=2.1 (deltaT + bonusNight) — asymétrie valeur affichée vs valeur seuil, confusion garantie. Cela a déclenché une remise en question du bonusNight lui-même.

Refonte algo : `bonusNight` (+1 point fixe la nuit) remplacé par `uvPenalty` basé sur `uvIndex`. Raison : `apparent_temperature` Open-Meteo intègre vent + humidité mais PAS le rayonnement solaire — `uvIndex` (déjà dans le payload, inutilisé jusque-là) permet un malus physiquement justifié : fort UV = gain solaire réel par les vitres pendant l'aération. Seuils : uvIndex≥6→1.5, ≥3→1, ≥1→0.5, 0→0. Formule finale : `score = deltaT - uvPenalty`.

Maintenance mémoire (argument `/memory-close`) : références GLRN-132/133/134/135 incorrectes dans ZBLK-020/021/022 remplacées par liens LRN-022/023/024/025 locaux corrects. Lien cassé journal.md (`[BLK-022](blockers/BLK-022.md) ouvert`) → `[ZBLK-022](archive/blockers/ZBLK-022.md) résolu`.

**Entrées clés :**

- [BDR-029](decisions/BDR-029.md) — `uvPenalty` remplace `bonusNight`
- [BDR-030](decisions/BDR-030.md) — VerdictBanner unifié sur `score.score`
- [LRN-031](learnings/LRN-031.md) — `apparent_temperature` Open-Meteo sans rayonnement solaire

---

Session animation pass `/emil-design-eng`. Objectif initial : stagger per-card sur le contenu principal d'`App.tsx` — chaque card devait apparaître individuellement avec un délai échelonné.

Trois approches tentées successivement, toutes silencieuses : (1) `staggerChildren: 0.18` + `delayChildren: 0.05` dans `variants`, (2) delays explicites via constante partagée, (3) delays inline sur chaque `m.div` (0, 0.14, 0.28, 0.42). Dans les trois cas, toutes les cards apparaissaient simultanément. Cause non identifiée — interaction probable avec `LazyMotion features={domAnimation}`. Après 3 échecs, décision pragmatique : abandon du stagger, remplacement par un slide global (`m.div key="content"` unique avec `y: 24→0` + exit `y: -8, opacity: 0`).

Travail parallèle sur `IdealSlots.tsx` : animation des créneaux lors de leur apparition/disparition. Premier jet avec `AnimatePresence mode="wait"` + wrapper externe → deux problèmes : (1) flash d'une card vide (header visible sans contenu) pendant la transition, (2) snap brutal à la taille finale. Solution : structure plate `AnimatePresence initial={false}` sans `mode="wait"`, chaque élément animant `height: 0 → "auto"` + `opacity` avec `overflow-hidden`. La card s'étire naturellement.

Troisième changement : suppression du spinner "Récupération de la météo" (`Loader2` pendant `isLoadingWeather`). Baptiste a signalé un décalage visuel — le spinner s'affichait brièvement avant la card principale. Fix : `hasContent = weather && !isLoadingWeather && location` — rien affiché tant que les données ne sont pas prêtes.

**Entrées clés :**

- [BDR-031](decisions/BDR-031.md) — slide global `m.div` comme pattern d'entrée du contenu principal
- [LRN-032](learnings/LRN-032.md) — stagger invisible dans LazyMotion + domAnimation
- [LRN-033](learnings/LRN-033.md) — `height: 0 → "auto"` + flat AnimatePresence pour hauteur par item
- [LRN-034](learnings/LRN-034.md) — `AnimatePresence mode="wait"` → flash entre états vide/contenu

---

Session ultra-courte. Tentative de relancer le projet (`pnpm i`) bloquée par `ERROR packages field missing or empty`. Cause : `pnpm-workspace.yaml` présent (créé lors du react-doctor pass) mais sans champ `packages:` — pnpm interprète la présence du fichier comme une déclaration workspace et exige le champ même sur un projet single-package. Fix en une ligne : ajout de `packages: ["."]` en tête du fichier. Échange court sur le sens des champs de hardening (`minimumReleaseAge: 10080` = quarantaine 7 jours anti-typosquatting, `trustPolicy: no-downgrade` = protection rollback vers version vulnérable).

---

Session ultra-courte de polish UX sur `IdealSlots`. Observation de Baptiste : quand un créneau de nuit (`04h–06h`) apparaît sous un créneau du jour (`06h–09h`), l'utilisateur peut croire que les deux sont aujourd'hui. Fix en 2 itérations : (1) ajout de `• Demain` sur les slots du lendemain ; (2) upgrade vers symétrie conditionnelle — le label jour n'apparaît que si la liste contient des créneaux de 2 jours distincts (`slots.some(s => s.startDate !== todayStr)`). Si tout est aujourd'hui, aucun label. Si mix J/J+1 → `• Aujourd'hui` et `• Demain` sur chaque slot respectif.

**Entrées clés :**

- [BDR-033](decisions/BDR-033.md) — Label jour conditionnel dans IdealSlots
- [LRN-035](learnings/LRN-035.md) — Label contextuel : afficher seulement quand il lève une ambiguïté

---

Session ultra-courte de stabilisation UX. Bug signalé : `VerdictBanner` changeait de hauteur selon le verdict (message 1 ligne "Bon moment pour aérer" vs 2 lignes "Ne pas aérer"), décalant les boutons ChevronUp/Down du stepper lors de clics rapides — le mauvais bouton passait sous le curseur sans que l'utilisateur bouge la souris.

Tentative debounce rejetée par Baptiste : retarde le changement mais ne le supprime pas — il y a toujours un frame où la card change de hauteur. Solution retenue : `min-h-[6.5rem]` sur le `m.div` de `VerdictBanner`. La valeur correspond à la hauteur du cas le plus long, si bien que le message court est "tiré vers le haut" et ne rétrécit plus la card.

Correction notable : le `min-h` est le plancher de la hauteur courte (valeur = cas long), pas le plafond de la hauteur longue.

**Entrées clés :**

- [LRN-036](learnings/LRN-036.md) — `min-h` plancher du cas long pour stabiliser hauteur variable

---

Session EPIC-001 PWA installability. Implémentation complète : icônes + Service Worker depuis zéro.

**Icônes** — `@vite-pwa/assets-generator` installé avec `pnpm add -D -w` (présence de `pnpm-workspace.yaml` → flag `-w` obligatoire, premier blocage). `pwa-assets.config.ts` créé avec override du preset `minimal2023Preset` pour fond `#f97316` orange sur les icônes maskable et apple-touch-icon (fond blanc par défaut). Toutes les icônes générées depuis `public/logo.svg` (renommé depuis `favicon.svg`) : pwa-64, pwa-192, pwa-512, maskable-512, apple-touch-180, favicon.ico. Règle W3C confirmée : padding 0.1 pour maskable (zone de sécurité spec), 0.3 pour apple (convention preset — pas arbitraire).

**Service Worker** — `vite-plugin-pwa` ajouté avec `registerType: "autoUpdate"`, `manifest: false` (manifest.json dans public/ géré manuellement). Build propre : `dist/sw.js` + `dist/workbox-9c191d2f.js`, 5 precached entries, PWA v1.3.0. Manifest mis à jour : icônes `"purpose"` splittées en `"any"` et `"maskable"` séparés.

**Rename favicon.svg → logo.svg** — séparation des rôles : `logo.svg` = source de génération uniquement, `favicon.ico` généré = vrai favicon navigateur. Crash Vite HMR suite au rename pendant session active : ENOENT sur l'ancien chemin depuis `vite:css-analysis`, aucune référence orpheline dans le code source. Fix : `Remove-Item -Recurse -Force node_modules/.vite` + redémarrage. Lint + build propres confirmés.

**Entrées clés :**

- [BDR-034](decisions/BDR-034.md) — `@vite-pwa/assets-generator` source unique icônes PWA
- [BDR-036](decisions/BDR-036.md) — `logo.svg` vs `favicon.ico` : séparation des rôles
- [LRN-038](learnings/LRN-038.md) — Vite HMR ENOENT après rename
- [ZBLK-028](archive/blockers/ZBLK-028.md) — ENOENT crash HMR (résolu)

---

Session de finalisation PWA + rebranding sous-titre.

**Bouton d'installation in-app (STORY-001-4)** — Audit EPIC-001 : STORY-001-1 (icônes) et STORY-001-2 (SW) étaient déjà complets depuis la session précédente. Ajout STORY-001-4 : bouton de rattrapage pour les utilisateurs ayant ignoré le prompt système natif. Hook `useInstallPrompt` : capture `beforeinstallprompt` (Android), détecte iOS (pas d'API prompt → tooltip instructions Share + "Sur l'écran d'accueil"), guard standalone (`display-mode: standalone`). `InstallButton` en `absolute top-4 right-4` dans le header (`relative`). L'`appinstalled` event supprime le bouton automatiquement.

**Rebranding sous-titre** — Débat Rodin : "il fait chaud" dans le sous-titre explique le jeu de mots phonétique (le tue) et ne décrit pas la valeur produit. Décision : "Bien vivre la chaleur" — scope couvrant V0 (ventilation) + V1 (alertes canicule, conseils survie) sans s'enfermer sur une feature. Mis à jour dans `manifest.json`, `index.html`, `CLAUDE.md`.

**BLK-001 archivé** — Deadline 36h "avant lundi 22 juin" atteinte : app fonctionnelle avec PWA installable, bouton installation, scope V0 complet.

**Entrées clés :**

- [BDR-037](decisions/BDR-037.md) — Bouton d'installation PWA in-app
- [BDR-038](decisions/BDR-038.md) — Sous-titre "Bien vivre la chaleur"
- GLRN-136 — `beforeinstallprompt` pattern complet (global)
- [ZBLK-001](archive/blockers/ZBLK-001.md) — Deadline 36h (résolu)

---

Session courte de validation PWA. STORY-001-2 (Service Worker) validée à 100% : `pnpm preview` expose `dist/` avec le SW actif — DevTools Application > Service Workers confirmait `#7427 activated and running`, Chrome affichait le bouton "Ouvrir dans l'appli" (PWA installable détectée). Découverte notable : `vite-plugin-pwa` sans `devOptions.enabled` ne génère pas de SW en mode `pnpm dev` — c'est un no-op silencieux côté DevTools.

Discussion stratégie test Android : `beforeinstallprompt` exige HTTPS sauf `localhost` — réseau local HTTP (`192.168.x.x`) bloque l'event. URL Vercel HTTPS = solution directe sans config supplémentaire. Prochaine étape : commit + push → test device Android réel (STORY-001-3).

STORY-001-3 (tests devices réels iOS + Android) reste ouverte.

---

Test STORY-001-3 (Android) via URL Vercel preview : bouton d'installation absent sur Android Chrome + PC malgré SW visible dans DevTools. Erreur découverte dans la console : `manifest.json:1 Failed to load resource: the server responded with a status of 401`. Cause : Vercel Deployment Protection (Vercel Auth) protège tous les fichiers statiques des previews, y compris `manifest.json` — Chrome abandonne silencieusement la validation PWA sans lever d'erreur JS, `beforeinstallprompt` ne fire jamais.

Fix : Baptiste désactive Vercel Authentication dans Settings → Deployment Protection (option préférée à un merge vers `main` juste pour le test). Android Chrome install ✅ confirmé : banner natif affiché, icône ember, mode standalone. EPIC-001 mis à jour : STORY-001-2 ✅ complet, STORY-001-3 Android ✅, avertissement Vercel Auth ajouté dans la checklist. iOS reste à tester quand device disponible.

**Entrées clés :**

- [ZBLK-029](archive/blockers/ZBLK-029.md) — Vercel Auth 401, manifest.json bloqué sur preview (résolu)
- GLRN-138 — Vercel Auth preview → manifest.json 401 (pattern global)

---

Session d'optimisation Lighthouse (STORY-001-5). Audit complet via `pnpm lighthouse` (script Node API `scripts/lighthouse-audit.mjs` — chrome-launcher + lighthouse module pour éviter EPERM Windows). Scores initiaux problématiques : Accessibility < 100, SEO < 100, Agentic-Browsing 0/100.

Corrections appliquées : `label-content-name-mismatch` (WCAG 2.5.3) dans `LocationSearch` — suppression de l'`aria-label` "Utiliser ma position GPS" redondant sur le bouton "Me localiser" (texte visible suffit) ; `color-contrast` (WCAG AA) — `text-ember` (#ea580c, 3.42:1 ❌) → `text-heat-700` (#c2410c, 5.17:1 ✅), `text-muted-foreground` (4.0:1 ❌) → `text-stone-600` (5.5:1 ✅) ; `public/llms.txt` reformaté selon le standard llmstxt.org (H1 + blockquote + sections H2 avec liens markdown) pour passer l'audit `agentic-browsing` ; `preconnect` Open-Meteo complétés avec attribut `crossorigin` (obligatoire pour ressources CORS fetch).

Scores finaux : Accessibility 100/100, SEO 100/100, Agentic-Browsing 100/100 (desktop + mobile). Quatre échecs résiduels acceptés comme by-design : `geolocation-on-start`, `errors-in-console` (web-haptics interne), `render-blocking` (vite-plugin-pwa 0.13 kB), `unused-javascript` (framer-motion + shadcn, hors scope V0). STORY-001-5 ajoutée à EPIC-001-pwa.md avec tableau de scores et liste des acceptations.

**Entrées clés :**

- [BDR-039](decisions/BDR-039.md) — `pnpm lighthouse` comme commande d'audit standard

---

Session EPIC-002 — QA & Déploiement Vercel, complétée à 100 %.

STORY-002-1 (Build propre) : `pnpm lint` → 0 erreur (2 warnings BDR-028 intentionnels), `pnpm build` → 0 erreur TypeScript, bundle 123 kB gzippé (< 300 kB). Clean au premier run, aucune correction nécessaire.

STORY-002-2 (Smoke test mobile) : testé sur device réel via URL Vercel preview branch `development` (Vercel Auth désactivée temporairement). Parcours principal complet : géoloc GPS ✅, recherche commune ✅, météo affichée ✅, VerdictBanner ✅, IdealSlots ✅, VentilationTimeline ✅, slider + haptics ✅, swipe carousel ✅, bouton `.ics` ✅. Edge cases : refus géoloc ✅, hors connexion ✅, minuit traversé ✅.

STORY-002-3 (Déploiement Vercel) : prod déjà déployée sur `main` → https://ifecho.vercel.app. Lighthouse ≥ 80 sur tous les axes (Perf 85/99 · A11y 100 · BP 92 · SEO 100 · Agentic-Browsing 100). Test externe : frère Android ✅. iOS prévu ce soir (EPIC-001 STORY-001-3, pas EPIC-002).

Mises à jour cross-session : badge prod ajouté dans `README.md`, URL prod référencée dans `.claude/memory/project.md`, `docs/epics/EPIC-002-qa-deploy.md` marqué ✅ TERMINÉ le 2026-06-22.

---

Session EPIC-003 PostHog Analytics — STORY-003-1 à STORY-003-3 complétées.

Installation de `posthog-js` (flag `-w` pour le workspace), initialisation dans `main.tsx` avec `persistence: 'memory'` (pas de cookies → pas de bannière RGPD), `autocapture: false`, EU host `eu.i.posthog.com`.

Hook `useAnalytics` créé : wrapper typé exposant 7 méthodes nommées par événement (`locationDetected`, `weatherLoaded`, `indoorTempChanged`, `comfortChanged`, `calendarDownloaded`, `tipNavigated`, `pwaInstallBannerShown`). Chaque méthode encapsule `posthog.capture()` avec un type strict.

Instrumentation complète des 7 events : `locationDetected` dans `useLocation.ts` (GPS + search) ; `weatherLoaded` dans `App.tsx` via `useEffect([weather])` — données composées depuis 2 hooks (`useWeatherForecast` + `useVentilationScore`), event placé au consumer pas dans le hook fetch ; `indoorTempChanged` + `comfortChanged` dans les handlers `App.tsx` ; `calendarDownloaded` dans `CalendarLink` ; `tipNavigated` dans `TipsSection` (prev/next/dot/auto dans le setInterval) ; `pwaInstallBannerShown` dans `useInstallPrompt`.

Validation via PostHog Live Events : tous les events reçus correctement. Doublons observés (`tip_navigated` ×2, `location_detected` ×2) — comportement normal React StrictMode en dev (state updaters + effects appelés 2× intentionnellement), absent en production.

Décision dev/prod : analytics désactivées par défaut en dev (`import.meta.env.PROD`). Escape hatch : `VITE_POSTHOG_DEBUG=true` dans `.env.local` (non commité) pour activer ponctuellement. Documenté dans `.env.example` (commenté par défaut).

STORY-003-4 (dashboard PostHog MCP) et STORY-003-5 (page `/confidentialite`) restent à faire.

**Entrées clés :**

- [BDR-041](decisions/BDR-041.md) — PostHog Cloud EU choisi pour ifecho
- [LRN-045](learnings/LRN-045.md) — Event analytics composé → consumer multi-hooks
- GBDR-003 — `persistence: 'memory'` → pas de bannière RGPD (global)
- GLRN-139 — `import.meta.env.PROD || DEBUG_FLAG` pour dev/prod (global)
- GLRN-140 — React StrictMode 2× → doublons analytics en dev (global)

---

Session de finalisation EPIC-003 — STORY-003-5 complétée.

Création de `PrivacyPage.tsx` : 4 sections RGPD typées avec icônes Lucide (`BarChart2`/Données collectées, `Eye`/Sessions anonymes, `Shield`/Cookies et stockage local, `Server`/Hébergement). Style "Conseils canicule" (`text-[10px] font-semibold uppercase tracking-widest text-muted-foreground`) pour les titres de section, même charte warm orange que le reste de l'app.

Extraction du footer en composant partagé `AppFooter` (`src/components/AppFooter/index.tsx`) : icône `Database` devant "Données", icône `Lock` devant "Confidentialité", séparateur horizontal `w-16 border-t` entre la ligne branding et les liens utilitaires, séparateur vertical `h-3 w-px bg-border` entre les deux liens côte à côte. Composant réutilisé dans `App.tsx` et `PrivacyPage.tsx`.

Routing hash natif dans `App.tsx` sans react-router-dom : `useState(() => hash === '#confidentialite')` pour l'état initial, listener `hashchange` dans un `useEffect`, `history.replaceState(null, '', pathname)` pour nettoyer le hash au retour.

EPIC-003 : toutes les tâches réalisables sans projet PostHog actif cochées. 2 checkboxes restent ouvertes (smoke test Live Events). STORY-003-4 (dashboard) à faire post-déploiement via MCP PostHog.

**Entrées clés :**

- [BDR-042](decisions/BDR-042.md) — Routing hash natif sans react-router
- [BDR-043](decisions/BDR-043.md) — AppFooter composant partagé
- [LRN-046](learnings/LRN-046.md) — Pattern hash routing SPA

---

Session de finalisation EPIC-003 — STORY-003-4 (dashboard PostHog) complétée.

229 events de dev (localhost:5173) polluaient le dashboard "ifecho V0". Suppression impossible : `persistence: 'memory'` crée des events orphelins sans person records, `persons-bulk-delete` ne les atteint pas. Solution retenue : filtre projet `test_account_filters` avec `$host != localhost:5173` + `test_account_filters_default_checked: true`, puis `filterTestAccounts: true` propagé sur les 17 insights du dashboard en 3 batches parallèles (fetch → patch en mémoire → update).

Dashboard "ifecho V0" (ID 765141, https://eu.posthog.com/project/207198/dashboard/765141) : 17 insights couvrant engagement (DAU/WAU), rétention, stickiness, météo (score, température), géographie (top villes/départements), UX (ressenti, tips, heure recommandée, PWA), et 2 funnels. Tous filtrent les données dev.

`docs/epics/EPIC-003-analytics.md` mis à jour : tableau des 17 insights réels (vs 4 documentés initialement), filtre test_account_filters documenté, STORY-003-4 marquée ✅.

**Entrées clés :**

- [BDR-044](decisions/BDR-044.md) — `test_account_filters` PostHog pour exclure localhost
- [LRN-047](learnings/LRN-047.md) — `persistence: 'memory'` → events orphelins, bulk-delete inefficace
- [LRN-048](learnings/LRN-048.md) — `insight-update` PostHog exige la query complète

## 2026-06-23

Session de finalisation analytics — continuation de l'EPIC-003 après compaction de contexte.

**Audit analytics complet (session compactée)** : `useAnalytics.ts` enrichi de 7 à 17 méthodes nommées. Nouveaux events : `appOpened` (is_pwa, is_first_visit via flag localStorage `ifecho_visited`), `locationGpsDenied`, `locationGpsNotSupported`, `weatherError`, `verdictSeen`, `tipsCarouselToggled`, `iosInstallHintShown`, `pwaInstallClicked`, `pwaInstalled`, `privacyPageViewed`. Instrumentation complète : App.tsx (app_opened + weather_error), useLocation.ts (GPS denied/not supported), VerdictBanner.tsx (verdict_seen via `useEffect([verdict.key])`), InstallButton (ios_install_hint_shown via setState fonctionnel), TipsSection (tips_carousel_toggled via `setIsPaused(prev => {...})`).

Dashboard "ifecho V0" renommé "ifecho V1" avec description et tags mis à jour. 4 nouveaux insights créés via MCP PostHog : refus GPS, verdicts vus, premières visites, Mix OS.

**Simplification OS** : `device_type: getDeviceType()` retiré de `analytics.appOpened()` — PostHog capture nativement `$os` sur `$pageview`, la propriété custom était redondante. Helper `getDeviceType()` supprimé d'App.tsx. Insight "Mix device (app_opened)" migré vers "Mix OS (pageview)" : source `$pageview` + breakdown `$os` + math `dau`. `pnpm lint` : 0 erreur, 8 warnings BDR-028 pre-existing.

**Entrées clés :**

- [BDR-045](decisions/BDR-045.md) — `device_type` custom retiré, `$os` natif PostHog
- voir aussi GBDR-004 — règle générale propriétés natives PostHog
- voir aussi GLRN-141 — liste propriétés auto-capturées `$pageview`

---

Deuxième session du 23 juin — Build in Public et bouton de partage.

Ajout du bouton "Partager" dans le header (`src/components/ShareButton/index.tsx`) : Web Share API si disponible, sinon fallback `navigator.clipboard` avec feedback "Copié !" 2s. Texte dynamique selon ville et bestHour. InstallButton refactorisé : son `absolute top-4 right-4` déplacé dans App.tsx au profit d'un wrapper `div.absolute.right-4.top-4.flex.items-center.gap-2` contenant les deux boutons côte à côte.

2 insights PostHog créés via MCP sur le dashboard "ifecho V1" (ID 765141) pour analyser les sources d'acquisition du lancement : "Source d'acquisition (référents)" (breakdown `$referring_domain`) et "Canaux UTM (source)" (breakdown `$initial_utm_source` — person property).

Discussion Build in Public X/Twitter : 3 formats de thread (data-driven, problème/solution, behind-the-scenes) avec conseil Rodin sur le biais d'audience technique. L'audience dev Twitter n'est pas l'utilisateur cible — les premières métriques seront biaisées.

**Entrées clés :**

- [BDR-046](decisions/BDR-046.md) — ShareButton : Web Share API + clipboard fallback
- [BDR-047](decisions/BDR-047.md) — Wrapper absolu header ShareButton + InstallButton
- voir aussi GLRN-143 — état app dans event partage → segmentation viral
- voir aussi GLRN-144 — PostHog $referring_domain vs $initial_utm_source

---

Troisième session du 23 juin — OpenGraph et image OG.

Ajout complet des meta tags OpenGraph (10 balises) et Twitter Card dans `index.html` : `og:type`, `og:url`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:image` (+width/height/type), `twitter:card`, `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`. URL de production : `https://ifecho.vercel.app/og-image.png`.

Image OG 1200×630 générée via script Node.js `scripts/generate-og.mjs` (Satori v0.26 + @resvg/resvg-js v2.6.2) et commitée dans `public/og-image.png` (66 Ko). Police Inter chargée localement depuis `@fontsource/inter` devDependency en `.woff` — Satori refuse woff2 avec "Unsupported OpenType signature wOF2" (ZBLK-030 résolu). Commande `pnpm generate-og` ajoutée dans `package.json`.

4 variantes de design générées depuis un script temporaire, V2 "Centré + pill badge" sélectionnée par Baptiste puis raffinée : URL plus visible (26px, #c2410c), logo 140px, titre "Ifecho" 140px bold, pill badge "Bien vivre la chaleur" réduit (20px). Fichiers temporaires (variants + script de variantes) purgés après sélection.

**Entrées clés :**

- [BDR-048](decisions/BDR-048.md) — OG image ifecho : generate-og.mjs + PNG dans /public
- [ZBLK-030](archive/blockers/ZBLK-030.md) — Satori refus woff2 lors génération OG

---

Quatrième session du 23 juin — ShareButton UTM, dashboard acquisition, Q&A PostHog.

Session démarrée après compaction de contexte. Trois axes :

**ShareButton refactorisé (suite sessions 2-3)** : layout header réorganisé en `flex-col items-end / sm:flex-row sm:items-center` pour mettre le bouton "Partager" _sous_ le bouton "Installer" sur mobile. Texte simplifié : logique conditionnelle 3 branches (ville+heure / ville / générique) remplacée par une constante universelle. Fonction `buildShareUrl(method)` ajoutée : injecte `utm_source=share`, `utm_medium=native|clipboard`, `utm_campaign=viral` — sans UTM dans l'URL, le trafic viral est indiscernable du trafic direct dans PostHog.

**Dashboard "Acquisition — Liens UTM"** (PostHog ID 769548) créé via MCP PostHog avec 5 insights : total partages (BoldNumber), canaux d'acquisition par `$initial_utm_source` (pie), méthode partage native/clipboard (pie), tendance hebdo partages, funnel viral (partagé → première visite → retour).

**Q&A PostHog UTM** : (1) Dashboard UTM dédié vs "ifecho V1" → dédié est la bonne architecture (product analytics ≠ marketing/acquisition) ; (2) PostHog capte-t-il tous les UTM y compris manuels (ex: `?utm_source=twitter`) → oui, générique, tout `utm_*` capté automatiquement. Clarification importante : une URL nue partagée sans params UTM ne crée **aucun** `$initial_utm_source` — seul le bouton "Partager" (qui forge l'URL avec UTM) garantit le tracking.

**Entrées clés :**

- [BDR-049](decisions/BDR-049.md) — ShareButton texte universel constant
- [BDR-050](decisions/BDR-050.md) — UTM params injectés dans l'URL de partage
- [BDR-051](decisions/BDR-051.md) — Dashboard UTM dédié séparé du dashboard produit

---

Cinquième session du 23 juin — rituel `/memory-close` + analytics enrichis + cleanup dashboard PostHog.

**Enrichissement events analytics** : `app_opened` reçoit désormais `local_hour` (0–23) et `local_day_of_week` (0–6) depuis `new Date()` côté client, pour comprendre les patterns horaires d'usage. `weather_loaded` reçoit `outdoor_temp_current`, `outdoor_temp_max_24h` et `is_heatwave` (seuil > 33°C) pour corréler canicule ↔ utilisation — raison d'être d'ifecho. Deux nouveaux events instrumentés : `location_search_abandoned` (click-outside avec `query.length ≥ 2`, via pattern `queryRef.current` dans `LocationSearch`) et `section_viewed` (première vue via hook `useOnceVisible` — IntersectionObserver one-shot avec `firedRef` guard — sur `TipsSection`).

**Cleanup dashboard PostHog** : situation à 3 dashboards (V1 + 2×V2) résolue. V1 (ID 765141) et V2-temp (ID 769675) supprimés. V2-master (ID 769673) renommé "ifecho V2 — Comportement utilisateur", pinned. Architecture finale : ~30 tiles organisés en 6 sections séparateurs texte (📊 Vue d'ensemble · 🔗 Acquisition · 📍 Localisation · 🌡️ Météo & Verdicts · 💡 Engagement · 📤 Partage). Découverte : `dashboard-tile-copy` MCP générait "result exceeds maximum tokens" à chaque copie — les opérations réussissaient quand même (LRN-049).

Toutes les entrées mémoire de cette session en local (directive : "full local").

**Entrées clés :**

- [BDR-052](decisions/BDR-052.md) — Dashboard V2 : 6 sections, ~30 tiles
- [BDR-053](decisions/BDR-053.md) — `local_hour` + `is_heatwave` sur events clés
- [LRN-049](learnings/LRN-049.md) — PostHog MCP tile-copy : oversized ≠ échec
- [LRN-050](learnings/LRN-050.md) — `valueRef.current` : state courant dans handler stable
- [LRN-051](learnings/LRN-051.md) — `useOnceVisible` IntersectionObserver one-shot

---

## 2026-06-24

Session analytics enrichissement + correction dashboard "Acquisition — Liens UTM" + layout dashboard V2.

**Correction dashboard UTM (ID 769548)** : 5 insights utilisaient `$utm_source` (event property inexistante dans PostHog — les UTM sont stockés comme person properties) au lieu de `utm_source` (event property correcte). Correction des breakdowns dans les 5 insights via MCP.

**Dashboard "ifecho V2 — Comportement utilisateur" (ID 769673)** :

- Diagnostic initial : 30 tiles créées sans positions explicites → `layouts: {}` vide → toutes en (0,0) sans grille. Fix : `dashboard-reorder-tiles` avec `two_column` pour initialiser les positions. Découverte au passage : 3 insights vides car les events (`section_viewed`, etc.) n'ont pas encore été déclenchés suffisamment — normal en phase lancement.
- Layout headers : après `two_column`, les 6 tiles texte de section (w=6) partageaient leur ligne avec le premier insight de leur section. Fix : `dashboard-update-text-tile` × 6 en parallèle pour passer les headers en `w=12, h=2`, puis `dashboard-reorder-tiles` avec `preserve`. PostHog recalcule les positions Y en respectant les nouvelles largeurs. Layout final vérifié via fork agent (résultat MCP de 259 k chars non chargeables en contexte principal).

Découverte notable : `read-data-schema` ne listait pas `is_heatwave` comme propriété de `weather_loaded`, alors qu'elle existait bien (44 occurrences via SQL). Le schema tool PostHog a une couverture partielle — vérification SQL nécessaire avant de conclure à l'absence d'une propriété.

**Entrées clés :**

- [BDR-054](decisions/BDR-054.md) — Headers PostHog en pleine largeur (w=12, h=2)
- [ZBLK-031](archive/blockers/ZBLK-031.md) — Dashboard V2 tiles sans layouts (résolu)
- [ZBLK-032](archive/blockers/ZBLK-032.md) — Headers w=6 partagent une ligne avec insights (résolu)
- voir aussi GLRN-148 — `dashboard-update-text-tile` + `reorder preserve` = layout mixte
- voir aussi GLRN-149 — PostHog schema tool incomplet → vérifier via SQL

---

Session MAJ PWA — notification Sonner abandonnée au profit d'un rechargement silencieux.

Objectif initial : ajouter un toast Sonner "Nouvelle version disponible, cliquez pour recharger" déclenché quand le Service Worker est mis à jour. Sonner installé via shadcn, composant `ui/sonner.tsx` créé, `<Toaster>` ajouté dans `App.tsx`.

Première implémentation avec `useRegisterSW` (workbox-window) + état `needRefresh`. Toast fonctionnel au 1er cycle — puis invisible aux suivants. Cause : `registerType: "autoUpdate"` court-circuite workbox-window ; `onNeedRefresh` ne fire jamais après le 1er cycle car le SW passe directement à `activated` sans repasser par `waiting`. Plusieurs tentatives : état, callbacks, `reg.update()` périodique — aucune n'a résolu la non-détection multi-cycle.

Deuxième blocage : StrictMode React appelait le `useEffect` deux fois → double toast. Résolu via `useRef(false)` guard. Mais rendu inutile par la suite.

Revirement UX initié par Baptiste : "pourquoi rajouter un toast alors que la mise à jour se fait tout seul actuellement ?". L'app en prod avec `autoUpdate` se met déjà à jour silencieusement au rechargement — ajouter un toast nécessite un clic supplémentaire sans aucun bénéfice sur une SPA stateless (aucun état à préserver, données fraîches à chaque load).

Solution finale : événement natif `controllerchange` + `window.location.reload()` silencieux, avec `hadController` guard pour éviter le reload au 1er install. `useRegisterSW` entièrement retiré, `vite.config.ts` conserve `registerType: "autoUpdate"`. Lint propre. `<Toaster>` reste importé dans `App.tsx` mais inutilisé pour l'instant.

**Entrées clés :**

- [BDR-055](decisions/BDR-055.md) — `controllerchange` + auto-reload silencieux pour MAJ PWA
- [ZBLK-033](archive/blockers/ZBLK-033.md) — `useRegisterSW`/`onNeedRefresh` ne fire pas au 2e cycle SW
- voir aussi GLRN-150 — `useRegisterSW` non fiable après 2e cycle
- voir aussi GLRN-151 — `controllerchange` + `hadController` guard
- voir aussi GLRN-152 — notification MAJ SW = friction inutile sur SPA stateless

---

Session investigation suppression données PostHog générées par `pnpm preview` (07h–08h20 CEST, ~350 events, 44 IDs distincts). Toutes les voies de suppression épuisées : `persons-bulk-delete` retourne 0 résultats (`persistence: 'memory'` → events orphelins sans person records), `execute-sql` MCP PostHog en lecture seule uniquement, Data Management EU sans UI delete-events, Danger Zone EU propose uniquement "Delete project" (rejeté — perdrait tous les insights/dashboards). Suppression abandonnée.

Cause racine identifiée : `pnpm preview` sert le build prod Vite → `import.meta.env.PROD = true` sur localhost, indiscernable de Vercel par env vars seuls. Fix appliqué dans `main.tsx` : guard `isLocalhost` (`window.location.hostname === 'localhost' || '127.0.0.1'`) ajouté à `posthogEnabled`. Comportement après fix : `pnpm dev` ❌, `pnpm preview` ❌, Vercel ✅.

**Entrées clés :**

- [BDR-056](decisions/BDR-056.md) — Guard `isLocalhost` dans `main.tsx` pour PostHog
- voir aussi GLRN-153 — `pnpm preview` → `PROD=true` sur localhost (global)

---

Session courte de diagnostic OG image et nettoyage git.

**Twitter Card X (résolu)** : L'OG image n'apparaissait pas dans les tweets malgré des balises méta correctes. Cause = cache stale X/Twitter. Solution = Twitter Card Validator (`cards-dev.twitter.com/validator`) qui force le re-scraping. Résolu.

**Mauvais diagnostic sur `/og-image.png`** : L'URL retournait l'app au lieu de l'image dans le navigateur normal. Diagnostic initial erroné → Vercel SPA rewriting → création inutile d'un `vercel.json`. Réalité : le Service Worker PWA interceptait la requête dans le navigateur (avec SW installé). Test en navigation privée (pas de SW) = image affichée correctement. Le `vercel.json` était inutile et potentiellement dangereux.

**Nettoyage** : `git reset --hard 668d9d1` + `git push --force origin main` pour supprimer les 2 commits inutiles. Découverte : Vercel ne redéploie pas automatiquement sur force push — il faut promouvoir manuellement le bon commit depuis le dashboard ("Promote to Production").

**Entrées clés :**

- [ZBLK-034](archive/blockers/ZBLK-034.md) — Mauvais diagnostic : SW PWA masquait le comportement serveur

## 2026-06-25

Session de nettoyage post-audit ponytail. Audit `/ponytail-audit` lancé en début de session — 7 findings identifiés, tous corrigés via sous-agents parallèles avec partitionnement strict des fichiers.

Trois utilitaires sans état dupliqués dans 3–4 fichiers chacun centralisés dans `src/lib/utils.ts` : `parseDateHour` (×3 noms identiques), `todayDateString` (×3 sous noms différents : `localDateString`, `getTodayStr`, `todayDateString`), `SPRING_EASING [0.23, 1, 0.32, 1]` (×4 inline). Alias `goTo` (pure wrapper de `setIndex`) supprimé dans `TipsSection`. Deux dépendances mortes supprimées : `next-themes` et `workbox-window`. `useAnalytics` converti de factory hook en module singleton exporté (`export default analytics` — objet, pas function).

Point de coordination : App.tsx, VentilationTimeline et TipsSection étaient touchés par 2 axes de refacto simultanément (utils + analytics singleton) — réservés au coordonnateur après retour des agents. 4 directives `// eslint-disable-next-line react-hooks/exhaustive-deps` devenues orphelines après la conversion analytics singleton, détectées via `pnpm lint` et supprimées. Lint propre (0 erreur), build propre.

**Entrées clés :**

- [BDR-057](decisions/BDR-057.md) — Centralisation utils.ts : parseDateHour + todayDateString + SPRING_EASING
- [LRN-052](learnings/LRN-052.md) — Fichiers d'overlap refacto parallèle → réserver au coordonnateur
- voir aussi GBDR-006 — Analytics singleton vs factory hook (global)
- voir aussi GLRN-157 — eslint-disable exhaustive-deps orphelins après singleton (global)

---

Session de correction de troncature des créneaux idéaux. Symptôme : le créneau "21h–11h" (nuit fraîche traversant le lendemain matin) s'affichait tronqué en "21h–9h" car la fenêtre de données 24h (`forecast_days: "2"`) se terminait à now+24h — le créneau continuait au-delà mais les données s'arrêtaient.

Solution en 3 couches : (1) `useWeatherForecast` déjà à `forecast_days: "3"` — aucun changement ; (2) `useVentilationScore` étendu de 24h à 48h en assouplissant le filtre de fin sur J+2 (de `hourNum < nowHour` on filtre désormais les heures déjà passées de J+2) ; (3) `getIdealSlots` dans `IdealSlots.tsx` — guard ajouté pour exclure les créneaux dont le **début** dépasse now+24h (`startMs >= now + WINDOW_MS`), pour ne pas afficher des slots du lendemain soir dans la section "créneaux idéaux" ; (4) `App.tsx` passe `scores.slice(0, 25)` à `VentilationTimeline` (25 au lieu de 24 — Baptiste a ajusté manuellement pour inclure 1 heure extra dans la timeline sans l'étendre à 48h).

Le principe retenu : fetcher + scorer sur 48h pour avoir les fins de créneaux complètes, mais n'afficher que ~24h dans la timeline et exclure les créneaux démarrant hors fenêtre d'affichage.

Toutes les entrées mémoire de cette session en local (directive : "full local").

**Entrées clés :**

- [BDR-058](decisions/BDR-058.md) — Fenêtre données 48h / affichage ~24h pour fins de créneaux
- [LRN-053](learnings/LRN-053.md) — Guard `startMs >= now + WINDOW_MS` dans `getIdealSlots`

---

Session courte de vérification + reorganisation du module analytics. Confirmation que PostHog fonctionne toujours après la conversion `useAnalytics` → singleton de la session précédente : `main.tsx` initialise PostHog, `src/lib/analytics.ts` appelle `posthog.capture()` via `isEnabled()` — la chaîne est intacte.

Déplacement du fichier `src/hooks/useAnalytics.ts` → `src/lib/analytics.ts` : le module n'utilise aucun hook React, la convention `hooks/` = vrais hooks (`useState`/`useEffect`/etc.) doit être respectée. 10 imports mis à jour (`@/hooks/useAnalytics` → `@/lib/analytics`).

**Entrées clés :**

- [BDR-059](decisions/BDR-059.md) — `analytics.ts` dans `src/lib/` (pas `src/hooks/`)
- voir aussi GLRN-160 — Convention `hooks/` vs `lib/` (global)

---

Session d'intégration des vigilances météo Météo-France dans ifecho.

Objectif : afficher les alertes canicule, orages, pluie-inondation, crues, vent violent et vagues-submersion en bannière conditionnelle en haut de page. Deux tentatives de sourcer les données côté MF : (1) portail API MF — bloqué, email Gmail rejeté à l'authentification ("invalid tenant domain") ; (2) flux Atom proposé par l'agent (`feeds.vigilance.meteofrance.fr/...`) — URL inventée, inexistante. Research fork lancé → OpenDataSoft identifié comme miroir officiel des données MF, CORS activé, aucune clé API requise.

5 fichiers créés ou modifiés : `src/types/index.ts` (interface `VigilanceItem` + champ `departmentCode?: string` dans `GeoLocation`), `src/hooks/useVigilanceData.ts` (fetch ODS + cache module-level 30 min par code département), `src/components/VigilanceBanner.tsx` (banner conditionnelle, couleur fond = criticité max, badges groupés J/J1), `src/hooks/useLocation.ts` (propagation `departmentCode` dans les deux flux GPS et search), `src/App.tsx` (appel `useVigilanceData` + rendu `AnimatePresence` conditionnel).

Bug découvert en cours d'intégration : `departmentCode` correctement extrait dans `parseContext()` mais absent de l'interface `GeoLocation` — champ non stocké, non propagé → `useVigilanceData` recevait `undefined`, aucune requête ODS n'était émise. Fix : ajout `departmentCode?: string` dans l'interface + propagation explicite dans `detectLocation` (GPS) et `setFromCommune` (search).

Vérification end-to-end via dev-browser : pour Lyon (dept 69), requête ODS bien déclenchée sur `weatherref-france-vigilance-meteo-departement`, banner "Vigilances météo — Aujourd'hui : Canicule / Demain : Canicule" affichée correctement. Météo 36.4°C ressenti 37°C, verdict "Ne pas aérer".

Décision explicite de reporter l'app state vigilance (fond + couleurs globales de page selon criticité max) à V1 — trop large pour le scope V0, mérite un cycle de design dédié.

**Entrées clés :**

- [BDR-061](decisions/BDR-061.md) — Source vigilance → OpenDataSoft
- [BDR-062](decisions/BDR-062.md) — Scope vigilance V0 (filtres + J+J1)
- [ZBLK-035](archive/blockers/ZBLK-035.md) — Portail MF bloqué (Gmail)
- [ZBLK-037](archive/blockers/ZBLK-037.md) — URL Atom inventée
