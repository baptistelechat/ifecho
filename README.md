<h1 align="center">🌡️ Ifecho</h1>

<p align="center">
    <i>Il fait chaud — Ifecho analyse les températures de la journée pour déterminer le meilleur moment pour aérer un logement. Mobile-first, sans compte, sans serveur. 🪟</i><br>
</p>

---

![React 19](https://img.shields.io/badge/React-19-blue)
![Vite 6](https://img.shields.io/badge/Vite-6-purple)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)

## 📸 Screenshots

> _Ajouter les screenshots ici_

## ✨ Fonctionnalités

- **🌡️ Température intérieure personnalisable** : Stepper + slider pour saisir la température réelle, sauvegardée en `localStorage`.
- **🤔 Profil de confort** : Mode frileux / neutre / très chaud pour affiner le calcul.
- **📍 Géolocalisation automatique** : Détection GPS ou recherche par commune via l'API Adresse officielle.
- **📊 Score de ventilation horaire** : Algorithme basé sur la température ressentie (ΔT intérieur/extérieur) + index UV, sur une fenêtre glissante de 24 h.
- **⏱️ Timeline bidirectionnelle** : Visualisation heure par heure des créneaux favorables et défavorables.
- **🎯 Créneau idéal mis en avant** : Meilleur moment pour aérer, parmi les heures à venir uniquement.
- **📅 Ajout au calendrier** : Génère un fichier `.ics` côté client pour intégrer le rappel dans l'agenda.
- **💡 Conseils canicule** : Carousel de conseils pratiques pour mieux gérer la chaleur.
- **📱 Mobile-first** : Interface conçue pour une utilisation sur téléphone. Retour haptique sur mobile.

## 🛠️ Stack technique

| Catégorie       | Technologies                                                                                                                                                                  |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**        | ![React 19](https://img.shields.io/badge/React-19-blue) ![Vite 6](https://img.shields.io/badge/Vite-6-purple) ![TypeScript 5](https://img.shields.io/badge/TypeScript-5-blue) |
| **Styles**      | ![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-cyan) ![Shadcn/UI](https://img.shields.io/badge/Shadcn_UI-Latest-black)                                         |
| **Animation**   | Framer Motion 12                                                                                                                                                              |
| **API météo**   | [Open-Meteo](https://open-meteo.com) (gratuit, sans clé API)                                                                                                                  |
| **API commune** | [API Adresse](https://adresse.data.gouv.fr) (gouvernement français)                                                                                                           |
| **Haptics**     | web-haptics                                                                                                                                                                   |
| **Icônes**      | Lucide React                                                                                                                                                                  |

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- pnpm (recommandé)

### Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/baptistelechat/ifecho.git
   cd ifecho
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Lancer le serveur de développement**

   ```bash
   pnpm dev
   ```

   L'application est accessible sur `http://localhost:5173` ou sur ton mobile en scannant le QR code affiché dans le terminal.

4. **Build de production**

   ```bash
   pnpm build
   ```

## 📐 Architecture

SPA 100% client-side, zéro base de données, zéro compte.

```
src/
├── components/
│   ├── CalendarLink/          # Génération du fichier .ics pour le rappel agenda
│   ├── LocationSearch/        # Champ de recherche commune + géolocalisation GPS
│   ├── RecommendCard/         # Panneau principal de recommandation
│   │   └── components/
│   │       ├── IdealSlots.tsx      # Créneaux idéaux (matin / après-midi / soir / nuit)
│   │       ├── ThermalComparison.tsx  # Comparaison temp intérieure / extérieure
│   │       ├── ThermalDelta.tsx    # Delta ressenti + badge verdict
│   │       └── VerdictBanner.tsx   # Bannière OK / défavorable / critique
│   ├── TipsSection/           # Carousel de conseils canicule
│   ├── VentilationTimeline/   # Chart horaire bidirectionnel (±score)
│   └── ui/                    # Composants shadcn/ui (Button, Input, Slider…)
├── hooks/
│   ├── useHaptics.ts          # Retour haptique mobile (wrapper web-haptics)
│   ├── useLocation.ts         # Géolocalisation GPS + recherche commune
│   ├── useVentilationScore.ts # Score horaire de ventilation (algorithme ΔT + UV)
│   └── useWeatherForecast.ts  # Appel Open-Meteo (température ressentie, UV, lever/coucher)
└── types/                     # Types TypeScript partagés (ComfortLevel, GeoLocation…)
```

## 🧮 Algorithme de ventilation

Le score horaire est calculé à partir de :

- **ΔT ressenti** = température ressentie intérieure − température ressentie extérieure  
  _(`apparent_temperature` d'Open-Meteo, qui intègre déjà vent, humidité et ombre)_
- **Biais de confort** : +/- selon le profil frileux/neutre/très chaud
- **Malus UV** : pénalité si l'index UV est élevé (rayonnement solaire intense)
- **Fenêtre glissante `[maintenant, maintenant+24h]`** pour ne jamais afficher d'heures passées

Un score > 2°C indique qu'il fait plus frais dehors que dedans : c'est le moment d'aérer.

## 📊 Sources de données

| Source          | Usage                                                | Lien                                                 |
| :-------------- | :--------------------------------------------------- | :--------------------------------------------------- |
| **Open-Meteo**  | Prévisions horaires (température, UV, lever/coucher) | [open-meteo.com](https://open-meteo.com)             |
| **API Adresse** | Autocomplete commune, conversion commune → coords    | [adresse.data.gouv.fr](https://adresse.data.gouv.fr) |

Aucune clé API requise. Aucun compte. Aucun serveur.

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Crée ta branche (`git checkout -b feature/MaSuperFeature`)
3. Commit tes changements (`git commit -m 'feat: ajout de MaSuperFeature'`)
4. Push la branche (`git push origin feature/MaSuperFeature`)
5. Ouvre une Pull Request

## 😸 Mainteneur

Made with ❤️ by [Baptiste LECHAT](https://github.com/baptistelechat)

## 📄 Licence

Ce projet est open source sous licence [MIT](LICENSE).
