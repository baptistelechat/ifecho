---
register: learnings
last_updated: 2026-06-22
---

## Index

| ID                              | Date       | Pattern observé                                                         | Tags                                                                                              |
| ------------------------------- | ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [LRN-001](learnings/LRN-001.md) | 2026-06-20 | Algo score ventilation : ΔT + malus_humidité + bonus_heure              | #ventilation #algorithm #open-meteo #scoring                                                      |
| [LRN-002](learnings/LRN-002.md) | 2026-06-20 | Règle des 500 W/m² — fenêtre standard = radiateur 500 W                 | #vitrage #solaire #facteur-g #physique-batiment                                                   |
| [LRN-003](learnings/LRN-003.md) | 2026-06-20 | Préfecture ≠ centroïde département                                      | #geolocation #departement #centroid #prefecture #france                                           |
| [LRN-004](learnings/LRN-004.md) | 2026-06-20 | FCM Topics : coût O(topics), pas O(users)                               | #fcm #push-notifications #topics #cost-model #scalability                                         |
| [LRN-005](learnings/LRN-005.md) | 2026-06-21 | `prevProp` inline render : fix no-adjust-state-on-prop                  | #react #useEffect #prevProp #no-adjust-state-on-prop-change #hooks #async #react-doctor           |
| [LRN-006](learnings/LRN-006.md) | 2026-06-21 | Variable API composite : ne pas doubler ses composantes                 | #open-meteo #apparent-temperature #composite #double-comptage #algo #weather-api                  |
| [LRN-007](learnings/LRN-007.md) | 2026-06-21 | `<input>` intrinsic height > `<button>` : fix `h-[1em]`                 | #react #input #button #intrinsic-height #layout-shift #inline-edit #tailwind #css                 |
| [LRN-008](learnings/LRN-008.md) | 2026-06-21 | Structural typing event handler : évite namespace React                 | #react #typescript #structural-typing #keyboard-event #namespace #biome #named-imports            |
| [LRN-009](learnings/LRN-009.md) | 2026-06-21 | État React `T \| null` avec défaut évident → non-nullable `T`           | #react #typescript #nullable #state #default #pattern #useState                                   |
| [LRN-010](learnings/LRN-010.md) | 2026-06-21 | PowerShell `@'...'@` perd accents/° → ASCII + Edit `replace_all`        | #powershell #windows #encoding #accents #biome #edit-tool #heredoc                                |
| [LRN-011](learnings/LRN-011.md) | 2026-06-21 | Affordance "thermostat" ≠ stepper : vrai argument = précision           | #ux #affordance #mobile #stepper #thermostat #ui-pattern #metaphor                                |
| [LRN-012](learnings/LRN-012.md) | 2026-06-21 | Biais additif intégré dans le delta sémantique, pas le score            | #algorithm #scoring #deltaT #semantic #comfortBias #refactoring #ventilation                      |
| [LRN-013](learnings/LRN-013.md) | 2026-06-21 | `bg-border` warm theme → teinte amber visible sur petites surfaces      | #tailwind #css-vars #theming #border #warm-theme #artifact                                        |
| [LRN-014](learnings/LRN-014.md) | 2026-06-21 | `scrollIntoView` > `offsetLeft` pour centrage dans scroll container     | #scroll #centering #dom #react #useEffect #offsetLeft #scrollIntoView                             |
| [LRN-015](learnings/LRN-015.md) | 2026-06-21 | React `rules-of-hooks` : hooks AVANT tout return conditionnel           | #react #hooks #rules-of-hooks #eslint #early-return #conditional-rendering                        |
| [LRN-016](learnings/LRN-016.md) | 2026-06-21 | `forecast_days: "2"` + filtre `[now, now+24h]` pour traverser minuit    | #open-meteo #forecast-days #sliding-window #midnight #filter #sunrise #sunset                     |
| [LRN-017](learnings/LRN-017.md) | 2026-06-21 | Continuité créneaux : diff timestamps (≤1h+1s) vs `hour === last+1`     | #algorithm #slot-continuity #timestamp #midnight #grouping #consecutive                           |
| [LRN-018](learnings/LRN-018.md) | 2026-06-21 | Chart bidirectionnel : `score === 0` → colonne invisible → MIN_BAR      | #chart #bidirectional #zero-score #min-bar #visibility #ux #react                                 |
| [LRN-019](learnings/LRN-019.md) | 2026-06-21 | Ligne verticale pointillée : `w-0 border-l-2 border-dashed`             | #tailwind #css #dashed #border #vertical-line #separator #ui                                      |
| [LRN-020](learnings/LRN-020.md) | 2026-06-21 | Date DD/MM depuis ISO : `.split("-").slice(1).reverse().join("/")`      | #javascript #date #iso #formatting #DD-MM #string                                                 |
| [LRN-021](learnings/LRN-021.md) | 2026-06-21 | Icônes SVG complexes Lucide illisibles < 12px → composite base + flèche | #lucide #icon #svg #readability #size #composite #Sun #ArrowUp #ArrowDown                         |
| [LRN-022](learnings/LRN-022.md) | 2026-06-21 | `"motion/react"` absent — importer depuis `"framer-motion"`             | #framer-motion #import #motion-react #package #react #v12                                         |
| [LRN-023](learnings/LRN-023.md) | 2026-06-21 | AnimatePresence mode="wait" : card initiale invisible                   | #framer-motion #animatepresence #mode-wait #variants #carousel #initial-card #flex-translate      |
| [LRN-024](learnings/LRN-024.md) | 2026-06-21 | `touch-action: pan-y` requis pour swipe horizontal mobile               | #mobile #touch-action #pan-y #swipe #pointer-events #tailwind #carousel #gesture                  |
| [LRN-025](learnings/LRN-025.md) | 2026-06-21 | `setPointerCapture` pour capturer drag events hors bounds               | #pointer-capture #drag #setPointerCapture #swipe #pointer-events #ux #mobile                      |
| [LRN-026](learnings/LRN-026.md) | 2026-06-21 | Path SVG Lucide : source fiable = raw GitHub                            | #lucide #svg #path #github #raw #favicon #icon                                                    |
| [LRN-027](learnings/LRN-027.md) | 2026-06-21 | Hook retournant objet instable → event-handler ref                      | #react #useEffect #exhaustive-deps #unstable-reference #event-handler-ref #hooks #react-doctor    |
| [LRN-028](learnings/LRN-028.md) | 2026-06-21 | `pnpm-workspace.yaml` hardening : champs racine                         | #pnpm #pnpm-workspace #security #hardening #react-doctor #yaml #supply-chain                      |
| [LRN-029](learnings/LRN-029.md) | 2026-06-21 | `.filter().map()` → `.flatMap()` single-pass                            | #javascript #array #flatMap #combine-iterations #react-doctor #performance #single-pass           |
| [LRN-030](learnings/LRN-030.md) | 2026-06-22 | Afficher la valeur de seuil, pas une valeur dérivée                     | #ux #consistency #color-system #threshold #delta-t #score #display #verdict                       |
| [LRN-031](learnings/LRN-031.md) | 2026-06-22 | `apparent_temperature` Open-Meteo exclut le rayonnement                 | #open-meteo #apparent-temperature #uv-index #solar-radiation #weather-api #algorithm #ventilation |
| [LRN-032](learnings/LRN-032.md) | 2026-06-22 | `staggerChildren` + delays explicites silencieux dans LazyMotion        | #framer-motion #stagger #staggerChildren #LazyMotion #domAnimation #delay #animation #react       |
| [LRN-033](learnings/LRN-033.md) | 2026-06-22 | `height: 0 → "auto"` + flat `AnimatePresence` = hauteur par item        | #framer-motion #AnimatePresence #height-auto #overflow-hidden #flat-structure #item-animation     |
| [LRN-034](learnings/LRN-034.md) | 2026-06-22 | `AnimatePresence mode="wait"` → flash transition état-vide↔contenu      | #framer-motion #AnimatePresence #mode-wait #flash #transition #empty-state #react #animation      |
| [LRN-035](learnings/LRN-035.md) | 2026-06-22 | Label contextuel : afficher seulement quand il lève une ambiguïté       | #ux #label #conditional #disambiguation #signal #information-density #ifecho                      |
| [LRN-036](learnings/LRN-036.md) | 2026-06-22 | `min-h` stabilise la hauteur au plancher du cas long                    | #css #min-h #layout-shift #ux #tailwind #variable-height #interactive                             |
| [LRN-037](learnings/LRN-037.md) | 2026-06-22 | `resizeOptions.background` contrôle couleur fond padding PWA icons      | #pwa #assets-generator #maskable #apple #resizeOptions #background                                |
| [LRN-038](learnings/LRN-038.md) | 2026-06-22 | Vite HMR ENOENT après rename → clear `node_modules/.vite` + restart     | #vite #hmr #cache #rename #enoent #node_modules                                                   |
| [LRN-039](learnings/LRN-039.md) | 2026-06-22 | `pnpm add` workspace root exige `-w` → `ERR_PNPM_ADDING_TO_ROOT`        | #pnpm #workspace #pnpm-workspace #install #root #flag                                             |
