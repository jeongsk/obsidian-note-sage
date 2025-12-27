# Note Sage

[한국어](README.md) | [English](README_EN.md) | [简体中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | [Español](README_ES.md) | [Português](README_PT.md) | [Русский](README_RU.md) | [हिन्दी](README_HI.md) | [العربية](README_AR.md)

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

Intégrez des agents IA directement dans votre coffre Obsidian. Ce plugin intègre Claude Code CLI de manière transparente avec Obsidian - vous permettant de discuter avec l'IA, d'éditer des fichiers et de gérer votre base de connaissances sans quitter votre espace de travail.

## Pourquoi ?

Travailler avec l'IA ne devrait pas interrompre votre flux de travail ni perdre le contexte de votre coffre.

Ce plugin garde Claude conscient de votre environnement Obsidian tout en vous permettant de rester dans votre espace de travail au lieu de basculer vers le terminal. Il fournit également des fonctionnalités pour vous aider à gérer le contexte plus efficacement.

## Fonctionnalités

- **Intégration IA directe** : Discutez avec Claude Code directement dans l'interface d'Obsidian
- **Approche fichier d'abord** : Les agents IA peuvent lire, éditer et créer des fichiers dans votre coffre
- **Conscience du contexte** : Inclut automatiquement le contexte pertinent du coffre dans les conversations
- **Collaboration en temps réel** : Voyez les modifications de l'IA en direct dans votre interface Obsidian
- **Actions rapides** : Exécutez rapidement des tâches courantes avec des prompts prédéfinis (Résumer, Améliorer, Analyser, Traduire)
- **Intégration serveur MCP** : Connectez des outils et ressources externes à l'agent IA
- **Interface multilingue** : Support de 11 langues (français, anglais, coréen, japonais, chinois, allemand, espagnol, portugais, russe, hindi, arabe)
- **Gestion des sessions** : Maintenez la continuité des conversations et sauvegardez-les

## Installation

### Prérequis

- **Compte Anthropic** - Requis pour l'accès à l'API Claude ([console.anthropic.com](https://console.anthropic.com))
- **Node.js** - Requis pour l'exécution du plugin
- **Claude Code CLI** - Obtenez-le depuis [Anthropic's Claude Code](https://www.anthropic.com/claude-code)

### Configuration

*Bientôt disponible dans le store des plugins communautaires Obsidian*

1. **Vérifier l'accès CLI** : Assurez-vous de pouvoir exécuter `claude` dans votre terminal
2. **Télécharger** : Obtenez la dernière version (`obsidian-note-sage.zip`) depuis la [page des releases](../../releases)
3. **Installer** : Extrayez et placez le dossier dans `[votre_coffre]/.obsidian/plugins/obsidian-note-sage`
4. **Activer** : Activez le plugin dans les paramètres des plugins communautaires d'Obsidian
5. **Commencer à discuter** : Utilisez le panneau Note Sage dans la barre latérale droite de votre espace de travail

> [!WARNING]
> **Avis de version préliminaire**
>
> Ce plugin est en développement actif et modifiera les fichiers de votre coffre. Il utilise actuellement des permissions élevées (`--permission-mode bypassPermissions` et `dangerously-skip-permissions`) pour une fonctionnalité complète.
>
> **Recommandé** : Sauvegardez votre coffre avant utilisation. Des contrôles de permissions granulaires sont prévus pour les versions futures.

## Utilisation

### Utilisation de base

1. Cliquez sur l'icône Note Sage dans la barre latérale droite
2. Tapez votre message dans le champ de saisie du chat
3. Appuyez sur Entrée pour envoyer (Shift+Entrée pour nouvelle ligne)
4. Utilisez le bouton "Page actuelle" pour inclure/exclure le contexte de la note actuelle

### Actions rapides

Utilisez les boutons d'action rapide au-dessus du champ de saisie du chat pour exécuter rapidement des tâches courantes :

- **Résumer** : Résumez le document actuel de manière concise
- **Améliorer** : Améliorez le style d'écriture et corrigez les erreurs
- **Analyser** : Analysez le document et fournissez des insights
- **Traduire** : Traduisez entre les langues

Vous pouvez personnaliser le prompt de chaque bouton dans les paramètres.

## Paramètres

### Paramètres de base

| Paramètre | Description |
|-----------|-------------|
| Modèle | Sélectionnez le modèle Claude (opus-4-5, sonnet-4-5, haiku-4-5) |
| Langue | Langue de l'interface (Auto ou choisir parmi 11 langues) |

### Contexte de fichier

| Paramètre | Description |
|-----------|-------------|
| Inclure le contenu du fichier | Inclure le contenu du fichier actuel dans le contexte |
| Préférer le texte sélectionné | Inclure uniquement la sélection au lieu du fichier entier quand du texte est sélectionné |
| Longueur maximale du contenu | Maximum de caractères à inclure du fichier (pour économiser les tokens) |

### Actions rapides

Personnalisez le prompt pour chaque bouton d'action rapide dans les paramètres. Laissez vide pour utiliser les valeurs par défaut.

### Serveurs MCP

Connectez des serveurs MCP (Model Context Protocol) pour étendre les capacités de l'agent IA.

| Paramètre | Description |
|-----------|-------------|
| Ajouter un serveur | Connecter des serveurs MCP de type stdio, SSE ou HTTP |
| Activer/Désactiver le serveur | Basculer les serveurs individuels |
| Panneau d'outils | Voir les outils disponibles des serveurs MCP connectés |

### Paramètres avancés

| Paramètre | Description |
|-----------|-------------|
| Clé API | Clé API Anthropic (optionnel) |
| Chemin Claude CLI | Chemin vers l'exécutable claude (auto-détecté si vide) |
| Prompt système personnalisé | Instructions personnalisées pour Claude |
| Mode débogage | Activer la journalisation de débogage pour le dépannage |

## Dépannage

### Problèmes CLI

**Impossible de trouver Node.js ou Claude CLI ?**

1. **Vérifier les installations** : Exécutez `node --version` et `claude --version` dans votre terminal
2. **Configuration manuelle** : Si l'auto-détection échoue, définissez les chemins manuellement dans **Paramètres > Plugins communautaires > Note Sage**

**Trouver les chemins des exécutables :**
```bash
# Emplacement de Node.js
which node

# Emplacement de Claude CLI
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Utilisateurs Windows** : Claude doit être installé dans WSL. Le support natif Windows est encore en test.

### Mode débogage

**Activer la journalisation détaillée :**
1. Allez dans **Paramètres > Plugins communautaires > Note Sage**
2. Activez "Mode débogage"
3. Ouvrez la Console développeur : `Cmd+Opt+I` (Mac) ou `Ctrl+Shift+I` (Windows/Linux)

## Feuille de route

### Fonctionnalités terminées
- [x] **Intégration serveur MCP** - Connecter des outils et ressources externes
- [x] **Support multilingue** - 11 langues avec support RTL
- [x] **Personnalisation des actions rapides** - Paramètres de prompt par bouton
- [x] **Outils de gestion des plugins Obsidian** - Gérer les plugins via l'IA

### Fonctionnalités à venir
- [ ] **Modes d'interaction** - Mode écriture, mode planification et workflows personnalisés
- [ ] **Contrôles de permissions** - Permissions granulaires d'accès et d'édition de fichiers
- [ ] **Support multiplateforme** - Compatibilité Windows/WSL améliorée
- [ ] **Intégration menu contextuel** - "Ajouter au contexte IA" depuis l'explorateur de fichiers
- [ ] **Liaison de fichiers** - Ouvrir les fichiers lus/édités par le modèle
- [ ] **Copier/coller amélioré** - Copier/coller de contexte intelligent

## Confidentialité et traitement des données

### Services distants

Ce plugin utilise l'**API Anthropic Claude** pour traiter vos requêtes. Lorsque vous envoyez un message :
- Votre texte de prompt est envoyé aux serveurs d'Anthropic
- Si le contexte "Page actuelle" est activé, le contenu du fichier est également envoyé
- Les données sont traitées selon la [Politique de confidentialité d'Anthropic](https://www.anthropic.com/privacy)

### Exigences de compte

- **Clé API Anthropic** : Requise pour l'accès à l'API
  - Obtenez-en une sur [console.anthropic.com](https://console.anthropic.com)
  - Stockée localement dans les données du plugin de votre coffre (non chiffrée)

### Accès au système de fichiers

Ce plugin accède à des emplacements en dehors de votre coffre Obsidian :
- **Détection Claude CLI** : Recherche dans les chemins système pour localiser l'exécutable Claude
  - macOS/Linux : `~/.local/bin/`, `/usr/local/bin/`, `/opt/homebrew/bin/`
  - Windows : `%USERPROFILE%\AppData\`, `C:\Program Files\`
- **Permissions de l'agent** : Utilise des permissions élevées (`bypassPermissions`) permettant à l'IA de lire/éditer des fichiers dans votre coffre

### Stockage local des données

- Les messages de chat sont stockés uniquement en mémoire (effacés au redémarrage)
- Les paramètres sont stockés dans `.obsidian/plugins/obsidian-note-sage/data.json`
- Les conversations peuvent être sauvegardées manuellement dans votre coffre comme fichiers markdown

## Licence

MIT License
