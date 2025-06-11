# Correções GA4 Tracking - Sportingbet CWC

## Resumo das Correções

Este documento detalha as correções realizadas no tracking do Google Analytics 4 para refletir que o site Sportingbet CWC é **informativo sobre odds**, não uma casa de apostas real.

## Problemas Identificados e Corrigidos

### 1. Eventos de Apostas Inadequados
**Antes (Problemático):**
- `bet_place_attempt` - Sugeria apostas reais
- `bet_place_success` - Confirmava apostas reais
- `bet_place_error` - Erros em apostas reais
- `odds_click` - Clicks para apostar

**Depois (Correto):**
- `odds_view_interest` - Interesse em informações sobre odds
- `betting_education_engagement` - Engajamento educativo
- `betting_simulation_completed` - Simulação educativa completa
- `widget_information_load` - Carregamento de informações

### 2. Categorias Corrigidas

**Categorias Antigas (Inadequadas):**
- `betting_odds_box` 
- `bet_box`
- `odds_widget`

**Categorias Novas (Apropriadas):**
- `odds_information` - Para informações sobre odds
- `betting_education` - Para conteúdo educativo sobre apostas

### 3. Parâmetros Customizados Limpos

**Removidos parâmetros desnecessários:**
- `market_id`, `option_id` - IDs específicos de apostas
- `value` - Valores monetários de apostas reais
- `event_time` - Timing de eventos de apostas

**Mantidos parâmetros informativos:**
- `market_type`, `market_title` - Informações sobre mercados
- `odds_value` - Valor informativo das odds
- `home_team`, `away_team` - Informações das equipes

## Arquivos Modificados

### 1. `components/article/related-odds.tsx`
- ✅ Removido redirect para `/sportsbook/` inexistente
- ✅ Substituído `odds_click` por `odds_view_interest`
- ✅ Adicionado alert informativo sobre site não permitir apostas reais
- ✅ Categoria alterada para `odds_information`

### 2. `components/betting-odds-box.tsx`
- ✅ Eventos alterados para `betting_education_*`
- ✅ Categoria alterada para `betting_education`
- ✅ Comentários atualizados para refletir natureza educativa

### 3. `components/chat/betbox.tsx`
- ✅ `bet_place_attempt` → `betting_simulation_attempt`
- ✅ `bet_place_success` → `betting_simulation_completed`
- ✅ `bet_place_error` → `betting_simulation_error`
- ✅ Categoria alterada para `betting_education`

### 4. `components/article/widget-embed.tsx`
- ✅ `widget_load` → `widget_information_load`
- ✅ `widget_interaction` → `widget_information_interaction`
- ✅ Categoria alterada para `odds_information`

### 5. `lib/analytics.ts`
- ✅ Adicionadas funções específicas para tracking informativo
- ✅ `trackOddsInformationView()` - Para visualização de odds
- ✅ `trackBettingEducationEngagement()` - Para engajamento educativo
- ✅ `trackWidgetInformationLoad()` - Para carregamento de widgets

## Eventos GA4 Atuais

### Categoria: `odds_information`
- `odds_view_interest` - Usuário visualiza detalhes de odds
- `widget_information_load` - Widget de odds carregado
- `widget_information_interaction` - Interação com elemento do widget
- `widget_information_error` - Erro no carregamento do widget

### Categoria: `betting_education`
- `betting_education_engagement` - Engajamento com interface educativa
- `betting_education_navigation` - Navegação na interface educativa
- `betting_simulation_attempt` - Tentativa de simulação educativa
- `betting_simulation_completed` - Simulação educativa completa
- `betting_simulation_error` - Erro na simulação educativa

## Parâmetros Customizados Padrão

Os seguintes parâmetros devem ser configurados no GA4:
- `event_category` (text)
- `event_action` (text)  
- `event_label` (text)
- `market_type` (text)
- `market_title` (text)
- `odds_value` (number)
- `home_team` (text)
- `away_team` (text)
- `widget_type` (text)

## Mensagem Importante

⚠️ **AVISO IMPORTANTE**: Este site é puramente **informativo** sobre odds e mercados esportivos. Não permite, facilita ou processa apostas reais. Para apostas, usuários devem consultar casas de apostas licenciadas.

## Implementação

As correções foram implementadas em dezembro de 2024 para garantir que o tracking do GA4 reflita fielmente a natureza informativa e educativa do site, evitando confusões sobre funcionalidades de apostas reais que não existem. 