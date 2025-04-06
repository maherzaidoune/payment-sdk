import type { Theme, Translations } from './types';

export const DEFAULT_THEME: Theme = {
  colors: {
    primary: '#6200EE',
    error: '#B00020',
    background: '#FFFFFF',
    text: '#000000',
    border: '#CCCCCC',
  },
};

export const DEFAULT_TRANSLATIONS: Translations = {
  cardNumberLabel: 'Card Number',
  cardNumberPlaceholder: 'Enter your card number',
  expiryDateLabel: 'Expiry Date',
  expiryDatePlaceholder: 'MM/YY',
  cvvLabel: 'CVV',
  cvvPlaceholder: 'Enter CVV',
  errors: {
    cardNumberRequired: 'Card number is required',
    cardNumberInvalid: 'Invalid card number',
    expiryDateRequired: 'Expiry date is required',
    expiryDateInvalid: 'Invalid expiry date format',
    expiryDatePast: 'Card has expired',
    cvvRequired: 'CVV is required',
    cvvInvalid: 'Invalid CVV',
  },
};
