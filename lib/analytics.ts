export const trackEvent = (
  eventName: string,
  eventCategory: string,
  eventLabel: string,
  eventValue?: any
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: eventValue,
    });
  }
};

// Specific functions for odds information tracking
export const trackOddsInformationView = (
  marketData: {
    homeTeam: string;
    awayTeam?: string;
    marketType: string;
    title: string;
  },
  optionName: string,
  odds: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'odds_view_interest', {
      event_category: 'odds_information',
      event_action: 'view_odds_details',
      event_label: `${marketData.homeTeam} vs ${marketData.awayTeam || 'TBD'} - ${optionName}`,
      market_type: marketData.marketType,
      market_title: marketData.title,
      odds_value: odds,
      home_team: marketData.homeTeam,
      away_team: marketData.awayTeam || null
    });
  }
};

export const trackBettingEducationEngagement = (
  betTitle: string,
  runnerName: string,
  action: 'open_betting_interface' | 'close_betting_interface' | 'simulate_betting_process' | 'complete_betting_simulation'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'betting_education_engagement', {
      event_category: 'betting_education',
      event_action: action,
      event_label: `${betTitle} - ${runnerName}`,
      bet_title: betTitle,
      runner_name: runnerName
    });
  }
};

export const trackWidgetInformationLoad = (
  widgetType: 'odds_information_widget' | 'information_widget',
  htmlContent: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'widget_information_load', {
      event_category: 'odds_information',
      event_action: 'load_odds_widget',
      event_label: 'Odds information widget loaded',
      widget_type: widgetType,
      widget_size: htmlContent.length
    });
  }
};

// Chat events
export const trackNewMessage = (message: string) => {
  trackEvent(
    'new_message',
    'chat',
    'User sent a new message',
    message
  );
};

export const trackSuggestedQuestionClick = (question: string) => {
  trackEvent(
    'suggested_question_click',
    'chat',
    'User clicked a suggested question',
    question
  );
};

export const trackRelatedQuestionClick = (question: string) => {
  trackEvent(
    'related_question_click',
    'chat',
    'User clicked a related question',
    question
  );
}; 