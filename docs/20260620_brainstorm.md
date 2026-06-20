# ifecho — Brainstorm & Concept

> Session Rodin — 2026-06-20
> Contexte : canicule historique prévue en France (~27 juin 2026)
> Contrainte : livraison sur Vercel avant lundi (~36h de dev réelles)

---

## 🎯 Vision

**ifecho** = jeu de mot phonétique : _"il fait chaud"_

App de **conseils canicule** — ventiler au bon moment est la feature #1, mais l'app a vocation à
devenir un guide complet des bonnes pratiques en période de chaleur extrême. Chaque été qui
revient, ifecho est là.

> Positionnement core : "À quelle heure ouvrir ce soir pour avoir 2°C de moins dans ta chambre à
> 22h ?"

---

## 🔴 Critique Rodin — post-brainstorm

### Ce qui ne marchait pas dans l'idée initiale

- Température seule = recommandations parfois mauvaises (humidité, pollution, pollen ignorés)
- Saisie manuelle de temp intérieure = abandon en 3 jours → 3 boutons frictionless à la place
- Valeur différenciante floue vs app météo → le croisement int/ext est le seul vrai insight

### Humidité intérieure

Trop complexe à connaître sans capteur → **ignorée en v1**. À intégrer en v2 avec les intégrations
domotique (Home Assistant, SwitchBot).

### Scope caution (critique live)

En 36h, on ne peut pas livrer : ventilation + vitrage + design Storyset + PWA complète + notifs
push. **Couper maintenant** plutôt que de livrer quelque chose de bancal.

---

## ✅ Features V0 — ce qu'on livre lundi

### Feature 1 — Ventilation (core)

Algo de recommandation basé sur :

- Temp extérieure heure par heure (Open-Meteo)
- Humidité relative extérieure (Open-Meteo, même appel)
- Temp intérieure : saisie libre OU estimation via 3 boutons
- Géolocalisation automatique (ou saisie commune)

#### Saisie de la température intérieure

Deux modes, même résultat :

| Mode                             | UX                             | Valeur utilisée    |
| -------------------------------- | ------------------------------ | ------------------ |
| **Boutons** (pas de thermomètre) | 🥵 Chaud / 😐 Tiède / 🌬️ Frais | 30°C / 26°C / 22°C |
| **Saisie libre** (thermomètre)   | Champ numérique "\_\_ °C"      | Valeur exacte      |

**Résultat** : timeline 24h avec plage verte + heure cible + lien "Ajouter au calendrier"

#### Algo de score

```
score(heure) = ΔT + malus_humidité + bonus_heure
```

| Variable         | Définition                         | Valeur                                           |
| ---------------- | ---------------------------------- | ------------------------------------------------ |
| `ΔT`             | `temp_int - temp_ext(heure)` en °C | continu — plus c'est élevé, mieux c'est d'ouvrir |
| `malus_humidité` | si `humidité_ext(heure) > 80%`     | `-3` (ouvrir humidifie le logement) sinon `0`    |
| `bonus_heure`    | si `heure ∈ [sunset, sunrise]`     | `+2` (créneau nocturne réel) sinon `0`           |

**Seuil minimal** : `score > 0` pour qu'une heure soit considérée comme favorable.
Le pic de score sur 24h = l'heure cible recommandée.

### Feature 2 — Conseils vitrage (contenu statique)

2-3 cartes informatives basées sur le fichier `vitrage-apports-solaires-canicule.md` :

- La règle des 500 W/m² (une fenêtre standard = un radiateur de 500W en plein été)
- Fermer volets/stores **avant** 10h (pas après)
- Store intérieur = quasi inutile (rayonnement déjà entré)

Pas d'API, contenu statique, rapide à implémenter.

### Feature "Rappel" — lien calendrier

Générer un fichier `.ics` côté client avec l'heure recommandée → s'ouvre dans Calendrier iOS /
Google Calendar nativement. **Zero serveur, zero compte, marche partout.**

```ts
const icsContent = [
  "BEGIN:VCALENDAR",
  "BEGIN:VEVENT",
  `SUMMARY:🪟 Ouvrir les fenêtres — ifecho`,
  `DTSTART:${heureIso}`,
  "DURATION:PT1H",
  `DESCRIPTION:ifecho recommande d'ouvrir maintenant pour refroidir votre logement.`,
  "END:VEVENT",
  "END:VCALENDAR",
].join("\n");
```

---

## ❌ Hors scope V0 (décisions actées)

| Feature             | Raison                                       | Version cible |
| ------------------- | -------------------------------------------- | ------------- |
| Humidité intérieure | Inconnue sans capteur                        | V2 domotique  |
| Capteurs IoT        | Home Assistant, SwitchBot — trop complexe V0 | V2            |
| Qualité de l'air    | AQI, pollen — données dispo en V2            | V2            |
| Illustrations       | Storyset — trop de temps en 36h              | V2 design     |
| Notifs push VAPID   | Nécessite Edge Function + infra VAPID        | V2            |
| Historique          | Pas de DB en V0                              | V2            |

---

## 🛠️ Stack V0

| Couche      | Technologie                                                   |
| ----------- | ------------------------------------------------------------- |
| Framework   | Vite + React + TypeScript                                     |
| Style       | Tailwind CSS v4 + shadcn/ui                                   |
| API météo   | [Open-Meteo](https://open-meteo.com/) — gratuit, sans clé API |
| State       | `useState` local + `localStorage` pour préférences            |
| Déploiement | Vercel                                                        |
| PWA         | Manifest basique → "Add to homescreen" uniquement en V0       |

### Appel API Open-Meteo

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &hourly=temperature_2m,relativehumidity_2m
  &daily=sunrise,sunset
  &forecast_days=1
  &timezone=Europe/Paris
```

Réponse : 24 températures + 24 humidités + heure de lever/coucher du soleil du jour. Aucune clé API requise.

---

## 🔔 Notifications — décision finale

### V0 — `.ics` uniquement ✅

**Le rappel calendrier n'est pas "moins bien" qu'une notif push — c'est juste différent.**
100% des utilisateurs ont un calendrier. "Je tape sur le bouton → mon téléphone me rappelle à 23h"
marche parfaitement, zero infra, zero risque.

```ts
const icsContent = [
  "BEGIN:VCALENDAR",
  "BEGIN:VEVENT",
  `SUMMARY:🪟 Ouvrir les fenêtres — ifecho`,
  `DTSTART:${heureIso}`,
  "DURATION:PT1H",
  `DESCRIPTION:ifecho recommande d'ouvrir maintenant pour refroidir votre logement.`,
  "END:VEVENT",
  "END:VCALENDAR",
].join("\n");
```

### V1 — FCM Topics + RPi = **full free** ✅

> FCM Topics : coût **O(départements)**, pas O(users).
> 1 appel FCM = N users notifiés. ≤ 101 fetches/heure quelle que soit l'audience.

#### Flux complet

```
1. User ouvre l'app (une seule fois)
     → permission notifications
     → Firebase JS SDK génère un FCM token
     → User saisit sa commune (autocomplete API Adresse gouvernement, type=municipality)
     → App extrait le département (ex: "Treize-Septiers" → dept 85)
     → POST /api/subscribe { token, dept: '85' }
     → Vercel function → Firebase Admin SDK
         .subscribeToTopic(token, 'dept-85')
     ✅ Done — FCM stocke l'abonnement, zéro DB

2. RPi cron (toutes les heures)
     → lit la liste des départements actifs
     → 1 fetch Open-Meteo par département (coordonnées centroïde)
     → calcule le score de ventilation
     → score OK → 1 appel FCM : { topic: 'dept-85', notification: {...} }
     → FCM livre à tous les abonnés dept-85 simultanément

3. User reçoit la notif
     → Android : FCM → Service Worker → notification
     → iOS 16.4+ PWA : FCM → APNS → notification
     → "🪟 19°C dans le 85 — c'est le moment d'ouvrir !"
```

#### Coût fixe à n'importe quelle échelle

| Composant               | Limite free       | Consommation                | Résultat |
| ----------------------- | ----------------- | --------------------------- | -------- |
| Open-Meteo fetches      | illimité          | ≤ 101/heure (101 depts max) | ✅       |
| FCM messages            | illimité          | ≤ 101/heure                 | ✅       |
| FCM delivery (1M users) | illimité          | $0                          | ✅       |
| Vercel `/api/subscribe` | illimité hobby    | 1 call/user à l'inscription | ✅       |
| RPi cron                | matériel existant | 1 script/heure              | ✅       |
| **Total**               |                   |                             | **$0**   |

#### Topics FCM — convention de nommage

```
dept-{numéro}   ex: dept-85, dept-75, dept-69
```

Double usage du même topic :

- Notif ventilation : _"19°C dans le 85 — ouvre tes fenêtres"_
- Alerte canicule régionale : _"Canicule rouge sur le 85 demain — ferme tes volets avant 10h"_

#### Recherche de commune — API Adresse gouvernement

```
GET https://api-adresse.data.gouv.fr/search/?q={query}&type=municipality&limit=5
```

- Gratuit, sans clé API
- Retourne lat/lon de la commune → utilisé pour le fetch météo dans l'UI

#### Deux niveaux de précision selon l'usage

| Usage                       | Coordonnées                                           | Précision | Pourquoi                         |
| --------------------------- | ----------------------------------------------------- | --------- | -------------------------------- |
| **Affichage UI**            | lat/lon de la commune (API Adresse)                   | Exacte    | L'user voit SA vraie température |
| **Système de notifs (RPi)** | centroïde du département (`src/data/departements.ts`) | Régionale | O(101 depts) fixe, scalable      |

- L'app affiche : _"Treize-Septiers, 85 — Vendée"_ avec la météo réelle de la commune
- La notif arrive depuis le centroïde du 85 — acceptable car même canicule, même fenêtre de ventilation
- Jamais de nom de préfecture : Tours est au nord du 37, La Roche-sur-Yon n'est pas au centre du 85

#### Limites connues

- **iOS** : PWA installée obligatoire + iOS 16.4+ — sinon fallback `.ics`
- **Token rotation** : rare (navigateur effacé) → user réactive les notifs
- **RPi offline** : pas de notif cette heure-là — acceptable pour app fun
- **Précision météo** : température du département, pas de la commune exacte (affiché clairement)

---

## 🎨 Design

- **Mobile-first** obligatoire (usage = t'es dans ton salon, t'as chaud, téléphone en main)
- **Desktop responsive** : la timeline 24h respire sur grand écran
- Style : app mobile native, pro, fun, coloré — inspiration **Storyset** pour les illustrations
  (Freepik) → **V2 seulement faute de temps**
- V0 design : Tailwind pur, 1-2 couleurs chaudes (orange/rouge), typographie grande, cards avec
  icônes Lucide

---

## 📐 Structure app proposée

```
src/
├── components/
│   ├── TempSelector/         ← 3 boutons 🥵😐🌬️
│   ├── VentilationTimeline/  ← courbe 24h avec plage verte
│   ├── RecommendCard/        ← résultat principal + heure cible
│   ├── CalendarLink/         ← génère et télécharge le .ics
│   └── TipsSection/          ← cartes conseils vitrage (statique)
├── hooks/
│   ├── useWeatherForecast.ts       ← appel Open-Meteo
│   └── useVentilationScore.ts      ← algo de calcul
├── data/
│   └── tips.ts               ← contenu statique conseils canicule
└── App.tsx
```

---

## 🗓️ Plan 36h

| Bloc        | Durée | Contenu                                              |
| ----------- | ----- | ---------------------------------------------------- |
| Setup       | 30min | Vite + TS + Tailwind + Vercel init                   |
| API + algo  | 2h    | Open-Meteo hook + score ventilation                  |
| UX core     | 3h    | TempSelector + RecommendCard + Timeline              |
| Conseils    | 1h    | TipsSection (vitrage) — contenu statique             |
| .ics rappel | 1h    | CalendarLink — génération côté client                |
| PWA         | 30min | Manifest + icônes → "Add to homescreen"              |
| Polish      | 1h    | Responsive desktop, dark mode optionnel, déploiement |
| **Total**   | ~9h   |                                                      |

---

## 📚 Sources intégrées

- `vitrage-apports-solaires-canicule.md` — apports solaires, facteur g, conseils volets
- Open-Meteo documentation — API météo gratuite
