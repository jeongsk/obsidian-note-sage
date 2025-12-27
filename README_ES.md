# Note Sage

[한국어](README.md) | [English](README_EN.md) | [简体中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | [Español](README_ES.md) | [Português](README_PT.md) | [Русский](README_RU.md) | [हिन्दी](README_HI.md) | [العربية](README_AR.md)

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

Lleva agentes de IA directamente a tu bóveda de Obsidian. Este plugin integra Claude Code CLI perfectamente con Obsidian, permitiéndote chatear con IA, editar archivos y gestionar tu base de conocimientos sin salir de tu espacio de trabajo.

## ¿Por qué?

Trabajar con IA no debería interrumpir tu flujo de trabajo ni perder el contexto de tu bóveda.

Este plugin mantiene a Claude consciente de tu entorno de Obsidian mientras te permite permanecer en tu espacio de trabajo en lugar de cambiar a la terminal. También proporciona funciones para ayudarte a gestionar el contexto de manera más efectiva.

## Características

- **Integración directa de IA**: Chatea con Claude Code directamente en la interfaz de Obsidian
- **Enfoque de archivo primero**: Los agentes de IA pueden leer, editar y crear archivos en tu bóveda
- **Consciente del contexto**: Incluye automáticamente el contexto relevante de la bóveda en las conversaciones
- **Colaboración en tiempo real**: Ve las ediciones de IA en vivo en tu interfaz de Obsidian
- **Acciones rápidas**: Ejecuta tareas comunes rápidamente con prompts predefinidos (Resumir, Mejorar, Analizar, Traducir)
- **Integración de servidor MCP**: Conecta herramientas y recursos externos al agente de IA
- **Interfaz multilingüe**: Soporte para 11 idiomas (español, inglés, coreano, japonés, chino, alemán, francés, portugués, ruso, hindi, árabe)
- **Gestión de sesiones**: Mantén la continuidad de la conversación y guarda conversaciones

## Instalación

### Requisitos previos

- **Cuenta de Anthropic** - Requerida para acceso a la API de Claude ([console.anthropic.com](https://console.anthropic.com))
- **Claude Code CLI** - Obtenerlo de [Anthropic's Claude Code](https://www.anthropic.com/claude-code)

### Configuración

*Próximamente en la tienda de plugins de la comunidad de Obsidian*

1. **Verificar acceso CLI**: Asegúrate de poder ejecutar `claude` en tu terminal
2. **Descargar**: Obtén la última versión (`obsidian-note-sage.zip`) de la [página de releases](../../releases)
3. **Instalar**: Extrae y coloca la carpeta en `[tu_bóveda]/.obsidian/plugins/obsidian-note-sage`
4. **Habilitar**: Activa el plugin en la configuración de plugins de la comunidad de Obsidian
5. **Comenzar a chatear**: Usa el panel de Note Sage en la barra lateral derecha de tu espacio de trabajo

> [!WARNING]
> **Aviso de versión de vista previa**
>
> Este plugin está en desarrollo activo y modificará archivos en tu bóveda. Actualmente utiliza permisos elevados (`--permission-mode bypassPermissions` y `dangerously-skip-permissions`) para funcionalidad completa.
>
> **Recomendado**: Haz una copia de seguridad de tu bóveda antes de usar. Los controles de permisos detallados están planeados para futuras versiones.

## Uso

### Uso básico

1. Haz clic en el icono de Note Sage en la barra lateral derecha
2. Escribe tu mensaje en la entrada del chat
3. Presiona Enter para enviar (Shift+Enter para nueva línea)
4. Usa el botón "Página actual" para incluir/excluir el contexto de la nota actual

### Acciones rápidas

Usa los botones de acción rápida sobre la entrada del chat para ejecutar tareas comunes rápidamente:

- **Resumir**: Resume el documento actual de forma concisa
- **Mejorar**: Mejora el estilo de escritura y corrige errores
- **Analizar**: Analiza el documento y proporciona insights
- **Traducir**: Traduce entre idiomas

Puedes personalizar el prompt de cada botón en la configuración.

## Configuración

### Configuración básica

| Ajuste | Descripción |
|--------|-------------|
| Modelo | Seleccionar modelo de Claude (opus-4-5, sonnet-4-5, haiku-4-5) |
| Idioma | Idioma de la interfaz (Auto o elegir entre 11 idiomas) |

### Contexto de archivo

| Ajuste | Descripción |
|--------|-------------|
| Incluir contenido del archivo | Incluir contenido del archivo actual en el contexto |
| Preferir texto seleccionado | Incluir solo la selección en lugar del archivo completo cuando hay texto seleccionado |
| Longitud máxima de contenido | Máximo de caracteres a incluir del archivo (para ahorro de tokens) |

### Acciones rápidas

Personaliza el prompt para cada botón de acción rápida en la configuración. Deja vacío para usar valores predeterminados.

### Servidores MCP

Conecta servidores MCP (Model Context Protocol) para extender las capacidades del agente de IA.

| Ajuste | Descripción |
|--------|-------------|
| Agregar servidor | Conectar servidores MCP tipo stdio, SSE o HTTP |
| Habilitar/Deshabilitar servidor | Alternar servidores individuales |
| Panel de herramientas | Ver herramientas disponibles de servidores MCP conectados |

### Configuración avanzada

| Ajuste | Descripción |
|--------|-------------|
| Clave API | Clave API de Anthropic (opcional) |
| Ruta de Claude CLI | Ruta al ejecutable de claude (auto-detectado si está vacío) |
| Prompt de sistema personalizado | Instrucciones personalizadas para Claude |
| Modo de depuración | Habilitar registro de depuración para solución de problemas |

## Solución de problemas

### Problemas de CLI

**¿No puedes encontrar Claude CLI?**

1. **Verificar instalación**: Ejecuta `claude --version` en tu terminal
2. **Configuración manual**: Si la auto-detección falla, establece la ruta manualmente en **Configuración > Plugins de la comunidad > Note Sage**

**Encontrar ruta del ejecutable:**
```bash
# Ubicación de Claude CLI
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Usuarios de Windows**: Claude debe estar instalado en WSL. El soporte nativo de Windows aún está en pruebas.

### Modo de depuración

**Habilitar registro detallado:**
1. Ve a **Configuración > Plugins de la comunidad > Note Sage**
2. Habilita "Modo de depuración"
3. Abre la consola del desarrollador: `Cmd+Opt+I` (Mac) o `Ctrl+Shift+I` (Windows/Linux)

## Hoja de ruta

### Características completadas
- [x] **Integración de servidor MCP** - Conectar herramientas y recursos externos
- [x] **Soporte multilingüe** - 11 idiomas con soporte RTL
- [x] **Personalización de acciones rápidas** - Configuración de prompts por botón
- [x] **Herramientas de gestión de plugins de Obsidian** - Gestionar plugins a través de IA

### Características próximas
- [ ] **Modos de interacción** - Modo de escritura, modo de planificación y flujos de trabajo personalizados
- [ ] **Controles de permisos** - Permisos detallados de acceso y edición de archivos
- [ ] **Soporte multiplataforma** - Compatibilidad mejorada con Windows/WSL
- [ ] **Integración de menú contextual** - "Agregar al contexto de IA" desde el explorador de archivos
- [ ] **Vinculación de archivos** - Abrir los archivos leídos/editados por el modelo
- [ ] **Copiar/pegar mejorado** - Copiar/pegar de contexto inteligente

## Privacidad y manejo de datos

### Servicios remotos

Este plugin usa la **API de Anthropic Claude** para procesar tus solicitudes. Cuando envías un mensaje:
- Tu texto del prompt se envía a los servidores de Anthropic
- Si el contexto de "Página actual" está habilitado, el contenido del archivo también se envía
- Los datos se procesan según la [Política de Privacidad de Anthropic](https://www.anthropic.com/privacy)

### Requisitos de cuenta

- **Clave API de Anthropic**: Requerida para acceso a la API
  - Obtén una en [console.anthropic.com](https://console.anthropic.com)
  - Se almacena localmente en los datos del plugin de tu bóveda (no cifrado)

### Acceso al sistema de archivos

Este plugin accede a ubicaciones fuera de tu bóveda de Obsidian:
- **Detección de Claude CLI**: Busca en rutas del sistema para localizar el ejecutable de Claude
  - macOS/Linux: `~/.local/bin/`, `/usr/local/bin/`, `/opt/homebrew/bin/`
  - Windows: `%USERPROFILE%\AppData\`, `C:\Program Files\`
- **Permisos del agente**: Usa permisos elevados (`bypassPermissions`) permitiendo que la IA lea/edite archivos en tu bóveda

### Almacenamiento de datos local

- Los mensajes de chat se almacenan solo en memoria (se borran al reiniciar)
- La configuración se almacena en `.obsidian/plugins/obsidian-note-sage/data.json`
- Las conversaciones se pueden guardar manualmente en tu bóveda como archivos markdown

## Licencia

MIT License
