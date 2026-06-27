# 🤝 Guide de collaboration Git — Baptiste & Matthieu

> Ce document centralise toutes les conventions et bonnes pratiques à suivre pour travailler ensemble sans se marcher dessus.

---

## 🌿 Stratégie de branches

```
main
└── development
    ├── baptiste/<subject>
    └── matthieu/<subject>
```

### Règles

- On ne commit **jamais** directement sur `development` ou `main`
- Chaque feature = une branche dédiée
- Chaque branche part toujours d'un `development` à jour

---

## 🚀 Workflow quotidien

### Démarrer une nouvelle feature

```bash
git switch development
git pull origin development          # Toujours partir d'un development à jour
git switch -c baptiste/login         # ou matthieu/dashboard
```

### Commits au fil de l'eau

Les messages de commit suivent le **manifeste Gitmoji** — on n'invente pas les emojis, on se réfère à [gitmoji.dev](https://gitmoji.dev).

```bash
git commit -m "✨ (auth) : add login form"
git commit -m "🐛 (auth) : fix empty password error"
git commit -m "♻️ (components) : split Header into subcomponents"
git commit -m "📦 (deps) : update typescript to 5.4"
git commit -m "📝 : update README"
```

**Format :** `<emoji> (<scope>) : <description courte>`
- Le `scope` est optionnel quand le contexte est global
- Description en minuscules, concise



### Rebase quotidien (chaque matin ☀️)

```bash
git fetch origin
git rebase origin/development
# En cas de conflit → résoudre → git add . → git rebase --continue
```

### Pousser et créer la PR

```bash
git push origin baptiste/login
# → Ouvrir une Pull Request : baptiste/login → development
```

> ⚠️ Après un rebase, forcer le push avec :
> ```bash
> git push --force-with-lease origin baptiste/login
> ```

---

## 🏷️ Nommage des branches

```
<auteur>/<subject>
```

```
baptiste/login
baptiste/dashboard-charts
matthieu/auth-token-refresh
matthieu/update-dependencies
```

---

## 📬 Pull Requests

### Taille recommandée

| Lignes modifiées | Statut |
|---|---|
| < 400 lignes | ✅ Idéal |
| 400 – 800 lignes | ⚠️ Acceptable |
| > 800 lignes | ❌ À découper |

### Checklist avant d'ouvrir une PR

- [ ] Rebase sur `development` effectué
- [ ] Pas d'erreur TypeScript (`tsc --noEmit`)
- [ ] Pas de `console.log` oubliés
- [ ] La description explique le **pourquoi**, pas juste le **quoi**

---

## ⚔️ Gestion des conflits

### Lors d'un rebase

```bash
# Git signale un conflit
CONFLICT (content): Merge conflict in src/components/Header.tsx

# 1. Ouvrir le fichier et résoudre
<<<<<<< HEAD (development)
  const title = "Titre de Matthieu"
=======
  const title = "Mon titre"
>>>>>>> feat/baptiste

# 2. Choisir / fusionner, puis :
git add src/components/Header.tsx
git rebase --continue
```

### Fichiers souvent en conflit — vigilance !

| Fichier | Stratégie |
|---|---|
| `package.json` | Se concerter avant d'ajouter des dépendances |
| `tsconfig.json` | Modifier ensemble ou en chore/ séparé |
| `types/index.ts` | Communiquer avant d'ajouter des types globaux |
| Fichiers de config (`.env.example`, etc.) | Idem |

---

## 📅 Rythme recommandé

| Moment | Action |
|---|---|
| ☀️ Chaque matin | `git fetch` + `git rebase origin/development` |
| 🔁 Feature longue | Rebase tous les 1-2 jours minimum |
| ✅ Feature terminée | Rebase final + PR |
| 🔀 Après un merge collègue | Rebase dès que possible |

---

## 🔧 Commitlint + Gitmoji

Commitlint vérifie automatiquement que chaque commit respecte la convention Gitmoji. Si le format est incorrect → le commit est **bloqué**.

### Installation

```bash
pnpm add -D @commitlint/cli commitlint-config-gitmoji husky
```

### Configuration — `commitlint.config.ts`

```ts
import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["gitmoji"],
  rules: {
    // Autorise les emojis unicode (✨) ET les codes (:sparkles:)
    "subject-empty": [2, "never"],
    "type-empty": [0],             // on n'utilise pas de "type" mot-clé
    "scope-case": [0],             // (Auth) ou (auth) — peu importe
  },
};

export default config;
```

### Activation via Husky

```bash
pnpm exec husky init
echo "pnpm exec commitlint --edit \$1" > .husky/commit-msg
```

### Ce que ça valide concrètement

| Commit | Résultat |
|---|---|
| `✨ (auth) : add login form` | ✅ Accepté |
| `🐛 (api) : fix token refresh` | ✅ Accepté |
| `ajout du login` | ❌ Bloqué — pas d'emoji gitmoji |
| `🤡 (auth) : add login` | ❌ Bloqué — emoji non référencé dans le manifeste |
| `✨ ` | ❌ Bloqué — message vide |

> 💡 **Référence officielle** des emojis autorisés : [gitmoji.dev](https://gitmoji.dev)
> Commitlint-config-gitmoji s'appuie directement sur ce manifeste — pas d'improvisation possible.

### ⚠️ Cas de fail potentiel — format `✨ (scope) : message`

Certaines versions de `commitlint-config-gitmoji` sont strictes sur l'espace entre l'emoji et la parenthèse. Le parser peut rejeter le format alors que le message semble correct.

**Symptôme :**
```bash
echo "✨ (auth) : add login form" | pnpm exec commitlint
# → subject may not be empty
# → type may not be empty
# ❌ alors que le message est visuellement correct
```

**Solution — règle custom dans `commitlint.config.ts` :**

```ts
import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["gitmoji"],
  rules: {
    "subject-empty": [0],   // désactivé, géré par notre pattern custom
    "type-empty": [0],      // idem
    "scope-case": [0],
    // Regex qui valide exactement notre format : ✨ (scope) : message
    "header-match-pattern": [
      2,
      "always",
      /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}) \([\w-]+\) : .+/u,
    ],
  },
};

export default config;
```

> 🔍 La regex Unicode `\p{Emoji_Presentation}` couvre tous les emojis du manifeste Gitmoji sans les lister un par un. Le flag `/u` est obligatoire pour que la classe Unicode soit reconnue par le moteur JS.

**Pour un commit sans scope** (contexte global) :

```ts
// Adapter la regex pour rendre le scope optionnel
/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})( \([\w-]+\))? : .+/u
```

| Commit | Résultat |
|---|---|
| `✨ (auth) : add login form` | ✅ Avec scope |
| `📝 : update README` | ✅ Sans scope |
| `✨ add login form` | ❌ Format incorrect |
| `🤡 (auth) : add login` | ❌ Emoji hors manifeste* |

> *⚠️ La vérification de l'emoji contre le manifeste Gitmoji dépend de `commitlint-config-gitmoji`. Avec la règle custom seule, n'importe quel emoji passerait. Si tu veux les deux — format **ET** manifeste — garde le `extends: ["gitmoji"]` et ajoute uniquement la règle `header-match-pattern` par dessus.

### Vérifier manuellement un message

```bash
echo "✨ (auth) : add login form" | pnpm exec commitlint
# → Aucune sortie = ✅ valide
# → Erreurs listées = ❌ invalide
```

---

## 🔒 Protection des branches — Ruleset GitHub

À configurer sur GitHub : `Settings → Rules → Rulesets → New branch ruleset`

### Paramètres généraux

| Champ | Valeur |
|---|---|
| Ruleset name | `protected-branches` |
| Enforcement status | `Active` |

### Bypass list

`Add bypass → @baptistelechat → Role: Repository admin`

> Baptiste peut merger sans PR si nécessaire. Matthieu reste bloqué par les règles.

### Target branches

`Add target → Include by pattern` → `main`
`Add target → Include by pattern` → `development`

### Branch rules à activer

| Règle | État | Pourquoi |
|---|---|---|
| Restrict deletions | ✅ activer | Personne ne supprime `main` ou `development` |
| Block force pushes | ✅ activer | Interdit le `git push --force` destructeur |
| Require a pull request before merging | ✅ activer | Cœur de la protection |
| → Required approvals | `1` | Baptiste review Matthieu et vice versa |
| → Dismiss stale PR approvals when new commits are pushed | ✅ activer | Une approval sur du vieux code n'est plus valide |
| → Require approval of the most recent reviewable push | ✅ activer | Double sécurité sur le dernier commit |
| → Require conversation resolution before merging | ✅ activer | Force à traiter tous les commentaires |

### Allowed merge methods

**Laisser les trois cochés : Merge + Squash + Rebase**

| Méthode | Quand l'utiliser |
|---|---|
| **Rebase** | Le cas normal — commits propres, historique linéaire |
| **Squash** | Branche expérimentale avec des commits `wip` à ne pas garder |
| **Merge** | Cas rare, mais pas de raison de l'interdire |

> 💡 La vraie cohérence de l'historique vient de votre convention Gitmoji + commitlint — pas de la restriction des méthodes de merge.

---

## 👤 Onboarding Matthieu

1. Matthieu crée son propre compte GitHub si ce n'est pas fait
2. Baptiste invite Matthieu : `Settings → Collaborators → Add people → @matthieu`
3. Matthieu accepte l'invitation reçue par email
4. Matthieu clone le repo et configure son identité Git localement :

```bash
git clone https://github.com/<org>/<repo>.git
git config user.name "Matthieu"
git config user.email "matthieu@email.com"
```

---

## 🧠 Rappels rapides

```bash
# Voir l'état de sa branche vs development
git log --oneline origin/development..HEAD

# Voir les fichiers modifiés localement
git status

# Annuler le dernier commit (sans perdre les modifs)
git reset --soft HEAD~1

# Voir le graph des branches
git log --oneline --graph --all
```

---

*Dernière mise à jour : juin 2026 — Baptiste & Matthieu*
