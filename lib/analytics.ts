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