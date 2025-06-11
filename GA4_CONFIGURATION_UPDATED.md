# GA4 Configuration - Updated Documentation
## Sportingbet CWC Website Analytics

### ✅ GA4 Setup Confirmation
- **Measurement ID**: `G-RP42Y35MC2` 
- **Implementation**: Configured in `app/layout.tsx` with gtag.js
- **Status**: ✅ Active and tracking data

### ✅ Standard Custom Parameters (Already Configured)
As confirmed, we're using the 3 basic custom parameters:
- `event_category` (text)
- `event_action` (text) 
- `event_label` (text)

### 📊 Additional Custom Parameters Implemented

Based on our current tracking implementation, we are passing the following **additional custom parameters** beyond the 3 standard ones:

#### **Odds Information Parameters:**
- `market_type` (text) - Type of betting market
- `market_title` (text) - Title of the market
- `odds_value` (number) - Numerical odds value
- `home_team` (text) - Home team identifier
- `away_team` (text) - Away team identifier

#### **Educational Betting Parameters:**
- `bet_title` (text) - Title of the educational bet simulation
- `runner_name` (text) - Name of the selection
- `bet_odd` (number) - Odds value for educational purposes
- `stake_amount` (number) - Amount used in educational simulation
- `potential_profit` (number) - Calculated potential profit for education
- `thread_id` (text) - Chat thread identifier

#### **Widget Information Parameters:**
- `widget_type` (text) - Type of information widget
- `widget_size` (number) - Size of widget content
- `element_index` (number) - Index of interacted element
- `element_class` (text) - CSS class of element
- `element_text` (text) - Text content of element

#### **Error Tracking Parameters:**
- `error_message` (text) - Error description
- `error_type` (text) - Type of error encountered

---

## 🎯 Current GA4 Events Implementation

### **Category: `odds_information`** (Informational Content)
| Event Name | Action | Trigger | Components |
|------------|--------|---------|------------|
| `odds_view_interest` | `view_odds_details` | User views odds information | RelatedOdds |
| `odds_information_interest` | `view_betting_option_details` | User views betting option details | BettingOddsBox |
| `widget_information_load` | `load_odds_widget` | Widget loads successfully | WidgetEmbed |
| `widget_information_interaction` | `interact_with_odds_element` | User interacts with widget element | WidgetEmbed |
| `widget_information_error` | `widget_load_error` | Widget fails to load | WidgetEmbed |

### **Category: `betting_education`** (Educational Content)
| Event Name | Action | Trigger | Components |
|------------|--------|---------|------------|
| `betting_education_engagement` | `open_betting_interface` | User opens educational interface | BetBox |
| `betting_education_navigation` | `close_betting_interface` | User closes educational interface | BetBox, BettingOddsBox |
| `betting_simulation_attempt` | `simulate_betting_process` | User attempts educational simulation | BetBox |
| `betting_simulation_completed` | `complete_betting_simulation` | Educational simulation completed | BetBox |
| `betting_simulation_error` | `simulation_error` | Educational simulation fails | BetBox |
| `betting_education_interest` | `view_betting_calculation` | User views betting calculations | BettingOddsBox |
| `betting_demo_completed` | `complete_betting_demo` | Educational demo completed | BettingOddsBox |

### **Existing Events** (Previously Implemented)
| Event Name | Category | Action | Components |
|------------|----------|--------|------------|
| `article_vote` | `article_voting` | User votes on article | ArticleVoting |
| `navigation_click` | `sidebar_logo` | User clicks logo | Sidebar |
| `new_message` | `chat` | User sends new message | ChatHome |
| `suggested_question_click` | `chat` | User clicks suggested question | ChatHome |

---

## 🔧 Implementation Details

### **Files Modified with GA4 Tracking:**
1. **`components/article/related-odds.tsx`** - Odds information viewing
2. **`components/betting-odds-box.tsx`** - Educational betting interface  
3. **`components/chat/betbox.tsx`** - Chat betting education
4. **`components/article/widget-embed.tsx`** - Widget information tracking
5. **`lib/analytics.ts`** - Analytics utility functions

### **Key Implementation Notes:**
- ✅ All events reflect the **informational/educational** nature of the website
- ✅ No real betting functionality is tracked (site is informational only)
- ✅ Educational simulations are clearly marked as such in tracking
- ✅ Error handling implemented for all widget and interaction failures
- ✅ Consistent parameter naming across all components

---

## 🚀 Release Information

**Release Status**: ✅ **LIVE** - All GA4 tracking is currently active on production

**Implementation Date**: December 2024

**Testing Status**: Events are firing and data is flowing to GA4 property `G-RP42Y35MC2`

---

## ⚠️ Important Clarification

**Website Nature**: This is a **sports information and odds comparison website**. It does NOT facilitate real betting or gambling. All "betting" references in our tracking refer to:
- Educational content about how betting works
- Informational displays of odds from various sources  
- Simulated calculations for educational purposes

Users who wish to place real bets are directed to licensed gambling operators. 