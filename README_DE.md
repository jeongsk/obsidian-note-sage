# Note Sage

[한국어](README.md) | [English](README_EN.md) | [简体中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | [Español](README_ES.md) | [Português](README_PT.md) | [Русский](README_RU.md) | [हिन्दी](README_HI.md) | [العربية](README_AR.md)

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

Bringen Sie KI-Agenten direkt in Ihren Obsidian-Vault. Dieses Plugin integriert Claude Code CLI nahtlos mit Obsidian - so können Sie mit KI chatten, Dateien bearbeiten und Ihre Wissensbasis verwalten, ohne Ihren Arbeitsbereich zu verlassen.

## Warum?

Die Arbeit mit KI sollte Ihren Workflow nicht unterbrechen oder den Kontext Ihres Vaults verlieren.

Dieses Plugin hält Claude über Ihre Obsidian-Umgebung informiert und ermöglicht es Ihnen, in Ihrem Arbeitsbereich zu bleiben, anstatt zum Terminal zu wechseln. Es bietet auch Funktionen, die Ihnen helfen, den Kontext effektiver zu verwalten.

## Funktionen

- **Direkte KI-Integration**: Chatten Sie mit Claude Code direkt in der Obsidian-Oberfläche
- **Datei-zuerst-Ansatz**: KI-Agenten können Dateien in Ihrem Vault lesen, bearbeiten und erstellen
- **Kontextbewusst**: Fügt automatisch relevanten Vault-Kontext in Gespräche ein
- **Echtzeit-Zusammenarbeit**: Sehen Sie KI-Bearbeitungen live in Ihrer Obsidian-Oberfläche
- **Schnellaktionen**: Führen Sie häufige Aufgaben schnell mit vordefinierten Prompts aus (Zusammenfassen, Verbessern, Analysieren, Übersetzen)
- **MCP-Server-Integration**: Verbinden Sie externe Tools und Ressourcen mit dem KI-Agenten
- **Mehrsprachige Benutzeroberfläche**: Unterstützung für 11 Sprachen (Deutsch, Englisch, Koreanisch, Japanisch, Chinesisch, Französisch, Spanisch, Portugiesisch, Russisch, Hindi, Arabisch)
- **Sitzungsverwaltung**: Behalten Sie die Gesprächskontinuität bei und speichern Sie Gespräche

## Installation

### Voraussetzungen

- **Anthropic-Konto** - Erforderlich für den Claude-API-Zugang ([console.anthropic.com](https://console.anthropic.com))
- **Claude Code CLI** - Holen Sie es von [Anthropic's Claude Code](https://www.anthropic.com/claude-code)

### Einrichtung

*Demnächst im Obsidian Community Plugin Store*

1. **CLI-Zugang überprüfen**: Stellen Sie sicher, dass Sie `claude` in Ihrem Terminal ausführen können
2. **Herunterladen**: Holen Sie sich die neueste Version (`obsidian-note-sage.zip`) von der [Release-Seite](../../releases)
3. **Installieren**: Entpacken Sie den Ordner und legen Sie ihn in `[Ihr_Vault]/.obsidian/plugins/obsidian-note-sage` ab
4. **Aktivieren**: Aktivieren Sie das Plugin in den Obsidian Community Plugins-Einstellungen
5. **Starten Sie das Chatten**: Verwenden Sie das Note Sage-Panel in der rechten Seitenleiste Ihres Arbeitsbereichs

> [!WARNING]
> **Vorschau-Version Hinweis**
>
> Dieses Plugin befindet sich in aktiver Entwicklung und wird Dateien in Ihrem Vault ändern. Es verwendet derzeit erhöhte Berechtigungen (`--permission-mode bypassPermissions` und `dangerously-skip-permissions`) für volle Funktionalität.
>
> **Empfohlen**: Sichern Sie Ihren Vault vor der Verwendung. Feinkörnige Berechtigungskontrollen sind für zukünftige Versionen geplant.

## Verwendung

### Grundlegende Verwendung

1. Klicken Sie auf das Note Sage-Symbol in der rechten Seitenleiste
2. Geben Sie Ihre Nachricht in das Chat-Eingabefeld ein
3. Drücken Sie Enter zum Senden (Shift+Enter für neue Zeile)
4. Verwenden Sie die Schaltfläche "Aktuelle Seite", um den Kontext der aktuellen Notiz ein-/auszuschließen

### Schnellaktionen

Verwenden Sie die Schnellaktions-Schaltflächen über dem Chat-Eingabefeld, um häufige Aufgaben schnell auszuführen:

- **Zusammenfassen**: Fassen Sie das aktuelle Dokument prägnant zusammen
- **Verbessern**: Verbessern Sie den Schreibstil und korrigieren Sie Fehler
- **Analysieren**: Analysieren Sie das Dokument und liefern Sie Erkenntnisse
- **Übersetzen**: Übersetzen Sie zwischen Sprachen

Sie können den Prompt jeder Schaltfläche in den Einstellungen anpassen.

## Einstellungen

### Grundeinstellungen

| Einstellung | Beschreibung |
|-------------|--------------|
| Modell | Claude-Modell auswählen (opus-4-5, sonnet-4-5, haiku-4-5) |
| Sprache | Oberflächensprache (Auto oder aus 11 Sprachen wählen) |

### Dateikontext

| Einstellung | Beschreibung |
|-------------|--------------|
| Dateiinhalt einbeziehen | Aktuellen Dateiinhalt in den Kontext einbeziehen |
| Ausgewählten Text bevorzugen | Nur Auswahl statt der gesamten Datei einbeziehen, wenn Text ausgewählt ist |
| Maximale Inhaltslänge | Maximale Zeichen, die aus der Datei einbezogen werden sollen (zur Token-Einsparung) |

### Schnellaktionen

Passen Sie den Prompt für jede Schnellaktions-Schaltfläche in den Einstellungen an. Leer lassen für Standardwerte.

### MCP-Server

Verbinden Sie MCP-Server (Model Context Protocol), um die Fähigkeiten des KI-Agenten zu erweitern.

| Einstellung | Beschreibung |
|-------------|--------------|
| Server hinzufügen | Verbinden Sie stdio-, SSE- oder HTTP-Typ MCP-Server |
| Server aktivieren/deaktivieren | Einzelne Server umschalten |
| Tools-Panel | Verfügbare Tools von verbundenen MCP-Servern anzeigen |

### Erweiterte Einstellungen

| Einstellung | Beschreibung |
|-------------|--------------|
| API-Schlüssel | Anthropic API-Schlüssel (optional) |
| Claude CLI-Pfad | Pfad zur claude-Ausführungsdatei (automatisch erkannt wenn leer) |
| Benutzerdefinierter System-Prompt | Benutzerdefinierte Anweisungen für Claude |
| Debug-Modus | Debug-Protokollierung zur Fehlerbehebung aktivieren |

## Fehlerbehebung

### CLI-Probleme

**Claude CLI nicht gefunden?**

1. **Installation überprüfen**: Führen Sie `claude --version` in Ihrem Terminal aus
2. **Manuelle Konfiguration**: Bei fehlgeschlagener Auto-Erkennung Pfad manuell in **Einstellungen > Community Plugins > Note Sage** setzen

**Ausführungspfad finden:**
```bash
# Claude CLI-Speicherort
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Windows-Benutzer**: Claude muss in WSL installiert sein. Native Windows-Unterstützung wird noch getestet.

### Debug-Modus

**Detaillierte Protokollierung aktivieren:**
1. Gehen Sie zu **Einstellungen > Community Plugins > Note Sage**
2. Aktivieren Sie "Debug-Modus"
3. Öffnen Sie die Entwicklerkonsole: `Cmd+Opt+I` (Mac) oder `Ctrl+Shift+I` (Windows/Linux)

## Roadmap

### Abgeschlossene Funktionen
- [x] **MCP-Server-Integration** - Externe Tools und Ressourcen verbinden
- [x] **Mehrsprachige Unterstützung** - 11 Sprachen mit RTL-Unterstützung
- [x] **Schnellaktionen-Anpassung** - Prompt-Einstellungen pro Schaltfläche
- [x] **Obsidian Plugin-Verwaltungstools** - Plugins über KI verwalten

### Geplante Funktionen
- [ ] **Interaktionsmodi** - Schreibmodus, Planungsmodus und benutzerdefinierte Workflows
- [ ] **Berechtigungskontrollen** - Feinkörnige Dateizugriffs- und Bearbeitungsberechtigungen
- [ ] **Plattformübergreifende Unterstützung** - Verbesserte Windows/WSL-Kompatibilität
- [ ] **Kontextmenü-Integration** - "Zum KI-Kontext hinzufügen" aus dem Datei-Explorer
- [ ] **Dateiverknüpfung** - Vom Modell gelesene/bearbeitete Dateien öffnen
- [ ] **Verbessertes Kopieren/Einfügen** - Intelligentes Kontext-Kopieren/Einfügen

## Datenschutz & Datenverarbeitung

### Remote-Dienste

Dieses Plugin verwendet die **Anthropic Claude API** zur Verarbeitung Ihrer Anfragen. Wenn Sie eine Nachricht senden:
- Ihr Prompt-Text wird an Anthropic-Server gesendet
- Wenn der "Aktuelle Seite"-Kontext aktiviert ist, werden auch Dateiinhalte gesendet
- Daten werden gemäß [Anthropics Datenschutzrichtlinie](https://www.anthropic.com/privacy) verarbeitet

### Kontoanforderungen

- **Anthropic API-Schlüssel**: Erforderlich für API-Zugang
  - Erhalten Sie einen unter [console.anthropic.com](https://console.anthropic.com)
  - Wird lokal in den Plugin-Daten Ihres Vaults gespeichert (nicht verschlüsselt)

### Dateisystemzugriff

Dieses Plugin greift auf Speicherorte außerhalb Ihres Obsidian-Vaults zu:
- **Claude CLI-Erkennung**: Durchsucht Systempfade, um die Claude-Ausführungsdatei zu finden
  - macOS/Linux: `~/.local/bin/`, `/usr/local/bin/`, `/opt/homebrew/bin/`
  - Windows: `%USERPROFILE%\AppData\`, `C:\Program Files\`
- **Agenten-Berechtigungen**: Verwendet erhöhte Berechtigungen (`bypassPermissions`), die der KI das Lesen/Bearbeiten von Dateien in Ihrem Vault ermöglichen

### Lokale Datenspeicherung

- Chat-Nachrichten werden nur im Speicher gehalten (beim Neustart gelöscht)
- Einstellungen werden in `.obsidian/plugins/obsidian-note-sage/data.json` gespeichert
- Gespräche können manuell als Markdown-Dateien in Ihrem Vault gespeichert werden

## Lizenz

MIT License
