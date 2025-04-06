export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface ValidationErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface TouchedFields {
  cardNumber: boolean;
  expiryDate: boolean;
  cvv: boolean;
}

export interface Theme {
  colors: {
    primary: string;
    error: string;
    background: string;
    text: string;
    border: string;
  };
}

export interface Translations {
  cardNumberLabel: string;
  cardNumberPlaceholder: string;
  expiryDateLabel: string;
  expiryDatePlaceholder: string;
  cvvLabel: string;
  cvvPlaceholder: string;
  errors: {
    cardNumberRequired: string;
    cardNumberInvalid: string;
    expiryDateRequired: string;
    expiryDateInvalid: string;
    expiryDatePast: string;
    cvvRequired: string;
    cvvInvalid: string;
  };
}

export interface PaymentFormProps {
  onCardDetailsChange?: (details: CardDetails, isValid: boolean) => void;
  onSubmit?: (tokenResponse: TokenApiResponse) => void;
  onError?: (error: any) => void;
  onPaymentCompleted?: (paymentResponse: TokenApiResponse) => void;
  translations?: Partial<Translations>;
  theme?: Partial<Theme>;
  containerStyle?: any;
}

export interface PaymentFormHandle {
  submit: () => Promise<void>;
  isValid: () => boolean;
  reset: () => void;
}

export interface TokenApiResponse {
  token: string;
  expiry_month: string;
  expiry_year: string;
  last4: string;
  scheme: string;
}

export const DEFAULT_THEME: Theme = {
  colors: {
    primary: '#0240FF',
    error: '#FF0000',
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
