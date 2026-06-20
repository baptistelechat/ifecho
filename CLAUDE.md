## 🧊 ifecho

App de conseils canicule — "il fait chaud" (jeu de mots phonétique). Aide l'utilisateur à savoir à quelle heure ouvrir ses fenêtres pour refroidir son logement, basée sur la température extérieure horaire et la température intérieure estimée. Mobile-first, 100% client-side, déployée sur Vercel.

### Stack technique

- **Langage** : TypeScript
- **Framework** : Vite + React
- **Runtime / Package manager** : Node.js + pnpm
- **Styling** : Tailwind CSS v4 + shadcn/ui (icônes Lucide)
- **API météo** : Open-Meteo (gratuit, sans clé API)
- **State** : `useState` local + `localStorage` pour les préférences
- **Déploiement** : Vercel (SPA statique)

### Architecture

SPA 100% client-side. Hooks personnalisés pour l'appel Open-Meteo (`useWeatherForecast`) et le calcul du score de ventilation (`useVentilationScore`). Composants découpés par feature : `TempSelector`, `VentilationTimeline`, `RecommendCard`, `CalendarLink`, `TipsSection`.

### Conventions importantes

- Mobile-first obligatoire (usage = téléphone en main dans le salon)
- Rappel calendrier via fichier `.ics` généré côté client (zero serveur)
- Composants > 200 lignes → dossier avec `index.tsx` + `components/`
- Pas de clé API, pas de base de données en V0
