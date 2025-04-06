import type { CardDetails, ValidationErrors } from './types';

export const validateCardNumber = (cardNumber: string): boolean => {
  if (!cardNumber) return false;

  // Remove spaces and dashes
  const cleanedNumber = cardNumber.replace(/[\s-]/g, '');

  // Check if the card number contains only digits and has a valid length (13-19 digits)
  if (!/^\d{13,19}$/.test(cleanedNumber)) return false;

  // Luhn algorithm validation
  let sum = 0;
  let shouldDouble = false;

  // Loop through the digits in reverse order
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (expiryDate: string): boolean => {
  if (!expiryDate) return false;

  // Check format MM/YY
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;

  const parts = expiryDate.split('/');
  if (parts.length !== 2) return false;

  const [monthStr, yearStr] = parts;
  if (!monthStr || !yearStr) return false;

  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000; // Assuming 20xx

  // Check if month is valid (1-12)
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

  // Check if the card is not expired
  return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const validateCVV = (cvv: string): boolean => {
  // CVV should be 3 or 4 digits
  return /^\d{3,4}$/.test(cvv);
};

export const formatCardNumber = (value: string): string => {
  if (!value) return '';

  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Limit to 19 digits (max card number length)
  const trimmed = digits.substring(0, 19);

  // Add space after every 4 digits
  const formatted = trimmed.replace(/(\d{4})(?=\d)/g, '$1 ');

  return formatted;
};

export const formatExpiryDate = (value: string): string => {
  if (!value) return '';

  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Limit to 4 digits
  const trimmed = digits.substring(0, 4);

  // Format as MM/YY
  if (trimmed.length > 2) {
    return `${trimmed.substring(0, 2)}/${trimmed.substring(2)}`;
  }

  return trimmed;
};

export const validateCardDetails = (
  cardDetails: CardDetails,
  touched: { cardNumber: boolean; expiryDate: boolean; cvv: boolean }
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (touched.cardNumber) {
    if (!cardDetails.cardNumber) {
      errors.cardNumber = 'cardNumberRequired';
    } else if (!validateCardNumber(cardDetails.cardNumber)) {
      errors.cardNumber = 'cardNumberInvalid';
    }
  }

  if (touched.expiryDate) {
    if (!cardDetails.expiryDate) {
      errors.expiryDate = 'expiryDateRequired';
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      errors.expiryDate = 'expiryDateInvalid';
    } else if (!validateExpiryDate(cardDetails.expiryDate)) {
      errors.expiryDate = 'expiryDatePast';
    }
  }

  if (touched.cvv) {
    if (!cardDetails.cvv) {
      errors.cvv = 'cvvRequired';
    } else if (!validateCVV(cardDetails.cvv)) {
      errors.cvv = 'cvvInvalid';
    }
  }

  return errors;
};

export const isFormValid = (
  cardDetails: CardDetails,
  errors: ValidationErrors
): boolean => {
  const hasAllValues =
    cardDetails.cardNumber !== '' &&
    cardDetails.expiryDate !== '' &&
    cardDetails.cvv !== '';

  // Check if there are no errors
  const hasNoErrors = !errors.cardNumber && !errors.expiryDate && !errors.cvv;

  return hasAllValues && hasNoErrors;
};
