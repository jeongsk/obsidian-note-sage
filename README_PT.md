# Note Sage

[한국어](README.md) | [English](README_EN.md) | [简体中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | [Español](README_ES.md) | [Português](README_PT.md) | [Русский](README_RU.md) | [हिन्दी](README_HI.md) | [العربية](README_AR.md)

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

Traga agentes de IA diretamente para o seu cofre Obsidian. Este plugin integra o Claude Code CLI perfeitamente com o Obsidian - permitindo que você converse com IA, edite arquivos e gerencie sua base de conhecimento sem sair do seu espaço de trabalho.

## Por quê?

Trabalhar com IA não deveria interromper seu fluxo de trabalho ou perder o contexto do seu cofre.

Este plugin mantém o Claude ciente do seu ambiente Obsidian enquanto permite que você permaneça no seu espaço de trabalho em vez de alternar para o terminal. Também fornece recursos para ajudá-lo a gerenciar o contexto de forma mais eficaz.

## Recursos

- **Integração direta de IA**: Converse com o Claude Code diretamente na interface do Obsidian
- **Abordagem arquivo-primeiro**: Agentes de IA podem ler, editar e criar arquivos no seu cofre
- **Consciente do contexto**: Inclui automaticamente o contexto relevante do cofre nas conversas
- **Colaboração em tempo real**: Veja as edições da IA acontecerem ao vivo na sua interface Obsidian
- **Ações rápidas**: Execute tarefas comuns rapidamente com prompts predefinidos (Resumir, Melhorar, Analisar, Traduzir)
- **Integração de servidor MCP**: Conecte ferramentas e recursos externos ao agente de IA
- **Interface multilíngue**: Suporte para 11 idiomas (português, inglês, coreano, japonês, chinês, alemão, francês, espanhol, russo, hindi, árabe)
- **Gerenciamento de sessões**: Mantenha a continuidade da conversa e salve conversas

## Instalação

### Pré-requisitos

- **Conta Anthropic** - Necessária para acesso à API Claude ([console.anthropic.com](https://console.anthropic.com))
- **Node.js** - Necessário para execução do plugin
- **Claude Code CLI** - Obtenha em [Anthropic's Claude Code](https://www.anthropic.com/claude-code)

### Configuração

*Em breve na loja de plugins da comunidade Obsidian*

1. **Verificar acesso CLI**: Certifique-se de que você pode executar `claude` no seu terminal
2. **Baixar**: Obtenha a versão mais recente (`obsidian-note-sage.zip`) da [página de releases](../../releases)
3. **Instalar**: Extraia e coloque a pasta em `[seu_cofre]/.obsidian/plugins/obsidian-note-sage`
4. **Habilitar**: Ative o plugin nas configurações de Plugins da Comunidade do Obsidian
5. **Começar a conversar**: Use o painel Note Sage na barra lateral direita do seu espaço de trabalho

> [!WARNING]
> **Aviso de versão de prévia**
>
> Este plugin está em desenvolvimento ativo e modificará arquivos no seu cofre. Atualmente usa permissões elevadas (`--permission-mode bypassPermissions` e `dangerously-skip-permissions`) para funcionalidade completa.
>
> **Recomendado**: Faça backup do seu cofre antes de usar. Controles de permissão granulares estão planejados para versões futuras.

## Uso

### Uso básico

1. Clique no ícone Note Sage na barra lateral direita
2. Digite sua mensagem na entrada do chat
3. Pressione Enter para enviar (Shift+Enter para nova linha)
4. Use o botão "Página atual" para incluir/excluir o contexto da nota atual

### Ações rápidas

Use os botões de ação rápida acima da entrada do chat para executar tarefas comuns rapidamente:

- **Resumir**: Resuma o documento atual de forma concisa
- **Melhorar**: Melhore o estilo de escrita e corrija erros
- **Analisar**: Analise o documento e forneça insights
- **Traduzir**: Traduza entre idiomas

Você pode personalizar o prompt de cada botão nas configurações.

## Configurações

### Configurações básicas

| Configuração | Descrição |
|--------------|-----------|
| Modelo | Selecione o modelo Claude (opus-4-5, sonnet-4-5, haiku-4-5) |
| Idioma | Idioma da interface (Auto ou escolha entre 11 idiomas) |

### Contexto de arquivo

| Configuração | Descrição |
|--------------|-----------|
| Incluir conteúdo do arquivo | Incluir conteúdo do arquivo atual no contexto |
| Preferir texto selecionado | Incluir apenas a seleção em vez do arquivo inteiro quando há texto selecionado |
| Comprimento máximo do conteúdo | Máximo de caracteres a incluir do arquivo (para economia de tokens) |

### Ações rápidas

Personalize o prompt para cada botão de ação rápida nas configurações. Deixe vazio para usar os padrões.

### Servidores MCP

Conecte servidores MCP (Model Context Protocol) para estender as capacidades do agente de IA.

| Configuração | Descrição |
|--------------|-----------|
| Adicionar servidor | Conectar servidores MCP tipo stdio, SSE ou HTTP |
| Habilitar/Desabilitar servidor | Alternar servidores individuais |
| Painel de ferramentas | Ver ferramentas disponíveis dos servidores MCP conectados |

### Configurações avançadas

| Configuração | Descrição |
|--------------|-----------|
| Chave API | Chave API Anthropic (opcional) |
| Caminho do Claude CLI | Caminho para o executável claude (auto-detectado se vazio) |
| Prompt de sistema personalizado | Instruções personalizadas para o Claude |
| Modo de depuração | Habilitar log de depuração para solução de problemas |

## Solução de problemas

### Problemas de CLI

**Não consegue encontrar Node.js ou Claude CLI?**

1. **Verificar instalações**: Execute `node --version` e `claude --version` no seu terminal
2. **Configuração manual**: Se a auto-detecção falhar, defina os caminhos manualmente em **Configurações > Plugins da Comunidade > Note Sage**

**Encontrar caminhos dos executáveis:**
```bash
# Localização do Node.js
which node

# Localização do Claude CLI
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Usuários Windows**: O Claude deve ser instalado no WSL. O suporte nativo do Windows ainda está em testes.

### Modo de depuração

**Habilitar log detalhado:**
1. Vá para **Configurações > Plugins da Comunidade > Note Sage**
2. Habilite "Modo de depuração"
3. Abra o Console do Desenvolvedor: `Cmd+Opt+I` (Mac) ou `Ctrl+Shift+I` (Windows/Linux)

## Roadmap

### Recursos concluídos
- [x] **Integração de servidor MCP** - Conectar ferramentas e recursos externos
- [x] **Suporte multilíngue** - 11 idiomas com suporte RTL
- [x] **Personalização de ações rápidas** - Configurações de prompt por botão
- [x] **Ferramentas de gerenciamento de plugins Obsidian** - Gerenciar plugins através da IA

### Recursos futuros
- [ ] **Modos de interação** - Modo de escrita, modo de planejamento e fluxos de trabalho personalizados
- [ ] **Controles de permissão** - Permissões granulares de acesso e edição de arquivos
- [ ] **Suporte multiplataforma** - Compatibilidade Windows/WSL aprimorada
- [ ] **Integração de menu de contexto** - "Adicionar ao contexto de IA" do explorador de arquivos
- [ ] **Vinculação de arquivos** - Abrir os arquivos lidos/editados pelo modelo
- [ ] **Copiar/colar aprimorado** - Copiar/colar de contexto inteligente

## Privacidade e tratamento de dados

### Serviços remotos

Este plugin usa a **API Anthropic Claude** para processar suas solicitações. Quando você envia uma mensagem:
- Seu texto do prompt é enviado para os servidores da Anthropic
- Se o contexto "Página atual" estiver habilitado, o conteúdo do arquivo também é enviado
- Os dados são processados de acordo com a [Política de Privacidade da Anthropic](https://www.anthropic.com/privacy)

### Requisitos de conta

- **Chave API Anthropic**: Necessária para acesso à API
  - Obtenha uma em [console.anthropic.com](https://console.anthropic.com)
  - Armazenada localmente nos dados do plugin do seu cofre (não criptografada)

### Acesso ao sistema de arquivos

Este plugin acessa locais fora do seu cofre Obsidian:
- **Detecção do Claude CLI**: Pesquisa caminhos do sistema para localizar o executável do Claude
  - macOS/Linux: `~/.local/bin/`, `/usr/local/bin/`, `/opt/homebrew/bin/`
  - Windows: `%USERPROFILE%\AppData\`, `C:\Program Files\`
- **Permissões do agente**: Usa permissões elevadas (`bypassPermissions`) permitindo que a IA leia/edite arquivos no seu cofre

### Armazenamento local de dados

- Mensagens de chat são armazenadas apenas na memória (limpas ao reiniciar)
- Configurações armazenadas em `.obsidian/plugins/obsidian-note-sage/data.json`
- Conversas podem ser salvas manualmente no seu cofre como arquivos markdown

## Licença

MIT License
