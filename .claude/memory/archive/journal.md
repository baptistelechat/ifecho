---
register: archive-journal
---

## Index

| Date       | Fusions | Archivages | Évènement          |
| ---------- | ------- | ---------- | ------------------ |
| 2026-06-20 | 0       | 7          | memory-close       |
| 2026-06-21 | 0       | 11         | memory-close       |
| 2026-06-21 | 0       | 0          | memory-consolidate |

---

## 2026-06-21 — Reconstitution historique (session lancement + implémentation)

Archivages effectués via `/memory-close` étape 1bis sur la session du 2026-06-20. Blockers résolus lors de l'implémentation initiale de l'app ifecho (scaffolding Vite, shadcn/ui, build errors).

### ARCHIVER (7 entrées — date originale 2026-06-20)

- [ZBLK-003](blockers/ZBLK-003.md) — Formatter hook → VS Code contenu périmé après Edit
- [ZBLK-004](blockers/ZBLK-004.md) — `pnpm create vite` bloqué sur prompt interactif
- [ZBLK-005](blockers/ZBLK-005.md) — shadcn composants dans mauvais dossier sur Windows
- [ZBLK-006](blockers/ZBLK-006.md) — Build error `Cannot find module './index.css'`
- [ZBLK-007](blockers/ZBLK-007.md) — Build error `path` + `__dirname` inconnus
- [ZBLK-008](blockers/ZBLK-008.md) — Edit "File has not been read yet" post-compaction
- [ZBLK-009](blockers/ZBLK-009.md) — Cascade TS6133 après retrait de `bestHour`

### Observations

- Entrées actives avant / après : 9 → 2
- Ces archivages ont été effectués lors de sessions /memory-close successives

---

## 2026-06-21 — Archivages sessions polish UX + timeline

Archivages effectués via `/memory-close` étape 1bis sur plusieurs sessions du 2026-06-21. Couvrent : bug reverse geocoding, refonte shadcn/ui, édition inline température, polish ThermalComparison, VentilationTimeline bidirectionnelle.

### ARCHIVER (11 entrées)

- [ZBLK-002](blockers/ZBLK-002.md) — "Votre position" sans ville — cause type=municipality
- [ZBLK-010](blockers/ZBLK-010.md) — Compound variant CVA pour merger couleur + size
- [ZBLK-011](blockers/ZBLK-011.md) — `React.KeyboardEvent<T>` sans namespace → Biome revert
- [ZBLK-012](blockers/ZBLK-012.md) — Layout shift `<input>` vs `<button>` malgré reset CSS
- [ZBLK-013](blockers/ZBLK-013.md) — RTK stale cache → fausses erreurs lint
- [ZBLK-014](blockers/ZBLK-014.md) — Écriture fichier accentué multi-tentatives
- [ZBLK-015](blockers/ZBLK-015.md) — `useRef`/`useEffect` après return conditionnel
- [ZBLK-016](blockers/ZBLK-016.md) — Timeline centrée à gauche : offsetLeft vs scroll
- [ZBLK-017](blockers/ZBLK-017.md) — Ligne jaune bg-border dans thème warm-orange
- [ZBLK-018](blockers/ZBLK-018.md) — Seuil rouge `score ≤ 0` trop strict
- [ZBLK-019](blockers/ZBLK-019.md) — Deux verts différents dans la timeline

### Observations

- Entrées actives avant / après : 13 → 1 (BLK-001 deadline encore ouverte)
- Prochaine consolidation sur demande : `/memory-consolidate`

---

## 2026-06-21 — Consolidation mémoire

### FUSIONNER (0 fusions)

Aucune — 2 candidats détectés en phase A, infirmés en phase B :

- LRN-001 + LRN-012 (3 tags communs: #ventilation #algorithm #scoring) → complémentaires, niveaux distincts (algo global vs pattern architecture)
- BDR-007 + BDR-019 (2 tags communs: #ux #temperature) → philosophie dual-mode vs implémentation concrète mobile

### ARCHIVER (0 entrées)

Aucune

### Observations

- Entrées actives avant / après : 54 → 54 (inchangé)
- Prochaine consolidation : sur demande
