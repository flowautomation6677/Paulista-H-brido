# Documentação da Experiência do Usuário (UX) - Compra Híbrida

Este documento detalha a jornada do usuário no "Wizard de Recomendação", a experiência projetada e os processos técnicos do modelo implementado no site **Paulista.store**.

## 1. Visão Geral e Estratégia
O objetivo central é resolver a insegurança técnica do cliente na compra de um assento sanitário e aumentar o ticket médio através de ancoragem de preços.
A estratégia **Híbrida** combina:
*   **Autoatendimento Digital (Wizard)**: Identificação visual rápida (30s) e recomendação estratificada (Melhor, Básico, Luxo).
*   **Válvulas de Escape**: Recursos para recuperar usuários indecisos (Comparativo, WhatsApp, Catálogo Geral).

## 2. Passo a Passo da Jornada (Fluxo de Navegação)

A jornada foi otimizada para **2 etapas principais** para reduzir atrito, com foco Mobile-First.

### Etapa 1: Identificação Visual (O Funil)
*   **O que o usuário vê:** Uma pergunta direta "Qual o formato do seu vaso?" com opções visuais claras.
*   **Interação:** Botões grandes (Cards) com ícones/fotos:
    *   **Oval** (Formato de Ovo)
    *   **Quadrado / Reto**
    *   **Redondo** (Padrão)
    *   **Outros Formatos**
*   **Objetivo:** Classificar o usuário tecnicamente em menos de 5 segundos.

### Etapa 2: O Dashboard de Resultados (A Conversão)
Ao selecionar um formato (ex: Quadrado), o usuário é levado imediatamente ao resultado.

#### Navegação
*   **Botão Voltar:** Um botão "VOLTAR" (bg-gray-100) proeminente no topo esquerdo, permitindo correção rápida da escolha.

#### Cenário A: Formato Identificado (Oval, Quadrado, Redondo)
*   **Barra Superior:** "✓ Modelos compatíveis com VASO [FORMATO]".
*   **O Herói ("Nossa Recomendação"):**
    *   **Galeria Interativa:** Carrossel de imagens com *swipe*. **Clique na imagem abre Zoom (Lightbox)** para ver detalhes.
    *   **Prova Social:** Estrelas (4.8/5) e "42 avaliações".
    *   **Preço Ancorado:** De ~R$ 189~ por Preço Oferta.
    *   **Ação Principal:** Botão Verde Vibrante ("💬 COMPRAR PELO WHATSAPP >>").
*   **Válvulas de Escape:**
    *   **Modal "Tira-Teima":** Comparativo técnico (Básico vs Premium).
    *   **Opção de Luxo:** Upsell para a Galeria de Resina (Ticket Alto).
    *   **Opção Econômica:** Downsell com alertas de trade-off (ex: "Tampa bate").
    *   **Botão catálogo:** Link secundário (Outline Button) para ver a loja completa.

#### Cenário B: Formato Desconhecido (Outros Formatos)
*   **Barra Superior:** "! Análise de Especialista Necessária" (Alerta Amarelo).
*   **Card de Conversão (Anti-Abandono):**
    *   **Título:** "Vaso com formato exclusivo?".
    *   **Argumento:** "Existem mais de 200 modelos fora de linha. Comprar errado é o erro mais comum."
    *   **Ação Principal:** Botão Verde Grande "📸 ENVIAR FOTO AGORA" (Direto para WhatsApp).
    *   **Ação Secundária:** Botão "Ver catálogo completo da loja" (Estilo secundário, menos peso visual).

#### D. A Saída de Segurança (Persistent Footer)
*   **Sticky Footer:** Barra fixa no rodapé mobile com foto de atendente + Botão "Falar com Atendente".

## 3. Identidade Visual e UI (Design System)

O app utiliza uma estética **Clean & Trustworthy** (Limpa e Confiável).

### Cores Principais
*   **Verde (Ação/Sucesso):** `green-600` a `green-500`. Compra e confirmação.
*   **Azul (Institucional):** `blue-600` a `blue-900`. Branding.
*   **Amber/Dourado (Atenção/Luxo):** `amber-500`. Alertas e upsell premium.
*   **Cinza (Neutro):** Backdrops e textos secundários.

### Elementos de UI
*   **Botões:**
    *   *Primário:* Verde Sólido + Sombra.
    *   *Secundário:* Branco + Borda Cinza.
*   **Cards:** Bordas arredondadas e sombras suaves.
*   **Feedback Visual:** Ícones de check (✓) ou alerta (!) dinâmicos.

## 4. Integrações Técnicas
*   **Google Tag Manager (GTM):** Centraliza todos os scripts de rastreamento.
*   **Nuvemshop:** Checkouts gerados via link direto.
*   **Google Ads:** Disparo de eventos via `dataLayer` (ex: `conversion_click`, `select_shape`, `view_product_zoom`).
*   **WhatsApp API:** Links com mensagens contextuais ("Vi o formato oval...", "Tenho um vaso diferente...").

