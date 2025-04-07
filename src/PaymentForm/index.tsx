import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { View, StyleSheet } from 'react-native';
import type {
  CardDetails,
  PaymentFormProps,
  TouchedFields,
  ValidationErrors,
  TokenApiResponse,
  Theme,
  Translations,
} from './types';
import { createToken } from './api';
import {
  formatCardNumber,
  formatExpiryDate,
  validateCardDetails,
  isFormValid,
} from './utils';
import { DEFAULT_THEME, DEFAULT_TRANSLATIONS } from './types';
import FormInput from './FormInput';

export interface PaymentFormHandle {
  submit: () => Promise<TokenApiResponse | void>;
  isValid: () => boolean;
  isAvailable: () => Promise<boolean>;
  mount: (containerId: string) => PaymentFormHandle;
  unmount: () => PaymentFormHandle;
  reset: () => void;
}

const PaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
  (props, ref) => {
    const {
      apiKey,
      onCardDetailsChange,
      onSubmit,
      onError,
      onPaymentCompleted,
      theme: customTheme,
      translations: customTranslations = {},
      containerStyle,
    } = props;

    const theme = useMemo<Theme>(
      () => ({
        ...DEFAULT_THEME,
        colors: {
          ...DEFAULT_THEME.colors,
          ...(customTheme?.colors || {}),
        },
      }),
      [customTheme]
    );

    const translations = useMemo<Translations>(
      () => ({
        ...DEFAULT_TRANSLATIONS,
        cardNumberLabel:
          customTranslations.cardNumberLabel ||
          DEFAULT_TRANSLATIONS.cardNumberLabel,
        cardNumberPlaceholder:
          customTranslations.cardNumberPlaceholder ||
          DEFAULT_TRANSLATIONS.cardNumberPlaceholder,
        expiryDateLabel:
          customTranslations.expiryDateLabel ||
          DEFAULT_TRANSLATIONS.expiryDateLabel,
        expiryDatePlaceholder:
          customTranslations.expiryDatePlaceholder ||
          DEFAULT_TRANSLATIONS.expiryDatePlaceholder,
        cvvLabel: customTranslations.cvvLabel || DEFAULT_TRANSLATIONS.cvvLabel,
        cvvPlaceholder:
          customTranslations.cvvPlaceholder ||
          DEFAULT_TRANSLATIONS.cvvPlaceholder,
        errors: {
          ...DEFAULT_TRANSLATIONS.errors,
          ...(customTranslations.errors || {}),
        },
      }),
      [customTranslations]
    );

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const [touched, setTouched] = useState<TouchedFields>({
      cardNumber: false,
      expiryDate: false,
      cvv: false,
    });

    const [isMounted, setIsMounted] = useState(true);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const cardDetails = useMemo<CardDetails>(
      () => ({
        cardNumber,
        expiryDate,
        cvv,
      }),
      [cardNumber, expiryDate, cvv]
    );

    const handleSubmit: () => Promise<TokenApiResponse | void> =
      useCallback(async () => {
        const allTouched = {
          cardNumber: true,
          expiryDate: true,
          cvv: true,
        };

        setTouched(allTouched);

        const validationErrors = validateCardDetails(cardDetails, allTouched);
        setErrors(validationErrors);

        if (!isFormValid(cardDetails, validationErrors)) {
          return;
        }

        try {
          const tokenResponse = await createToken(cardDetails, apiKey);
          onSubmit?.(tokenResponse);
          onPaymentCompleted?.(tokenResponse);
          return tokenResponse;
        } catch (error) {
          onError?.(error);
          throw error;
        }
      }, [cardDetails, apiKey, onSubmit, onPaymentCompleted, onError]);

    const getPublicInterface: () => PaymentFormHandle = useCallback(
      () => ({
        submit: handleSubmit,
        isValid: () => isFormValid(cardDetails, errors),
        isAvailable: async () => Promise.resolve(true),
        mount: () => {
          setIsMounted(true);
          return getPublicInterface();
        },
        unmount: () => {
          setIsMounted(false);
          return getPublicInterface();
        },
        reset: () => {
          setCardNumber('');
          setExpiryDate('');
          setCvv('');
          setTouched({
            cardNumber: false,
            expiryDate: false,
            cvv: false,
          });
          setErrors({});
        },
      }),
      [cardDetails, errors, handleSubmit]
    );

    useImperativeHandle(ref, getPublicInterface, [getPublicInterface]);

    const handleCardNumberChange = useCallback((value: string) => {
      const formattedValue = formatCardNumber(value);
      setCardNumber(formattedValue);
    }, []);

    const handleExpiryDateChange = useCallback((value: string) => {
      const formattedValue = formatExpiryDate(value);
      setExpiryDate(formattedValue);
    }, []);

    const handleCVVChange = useCallback((value: string) => {
      const formattedValue = value.replace(/\D/g, '').substring(0, 4);
      setCvv(formattedValue);
    }, []);

    const handleBlur = useCallback(
      (field: keyof CardDetails) => {
        const updatedTouched = { ...touched, [field]: true };
        setTouched(updatedTouched);

        const validationErrors = validateCardDetails(
          cardDetails,
          updatedTouched
        );
        setErrors(validationErrors);

        onCardDetailsChange?.(
          cardDetails,
          isFormValid(cardDetails, validationErrors)
        );
      },
      [cardDetails, touched, onCardDetailsChange]
    );

    const getErrorMessage = useCallback(
      (field: keyof CardDetails, errorKey?: string) => {
        if (!errorKey) return '';
        return (
          translations.errors[errorKey as keyof typeof translations.errors] ||
          ''
        );
      },
      [translations]
    );

    if (!isMounted) return null;

    return (
      <View style={[styles.container, containerStyle]}>
        <FormInput
          label={translations.cardNumberLabel}
          placeholder={translations.cardNumberPlaceholder}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          onBlur={() => handleBlur('cardNumber')}
          error={getErrorMessage('cardNumber', errors.cardNumber)}
          keyboardType="numeric"
          maxLength={19}
          theme={theme}
          testID="card-number-input"
        />

        <View style={styles.row}>
          <FormInput
            label={translations.expiryDateLabel}
            placeholder={translations.expiryDatePlaceholder}
            value={expiryDate}
            onChangeText={handleExpiryDateChange}
            onBlur={() => handleBlur('expiryDate')}
            error={getErrorMessage('expiryDate', errors.expiryDate)}
            keyboardType="numeric"
            maxLength={5}
            containerStyle={styles.halfInput}
            theme={theme}
            testID="expiry-date-input"
          />

          <FormInput
            label={translations.cvvLabel}
            placeholder={translations.cvvPlaceholder}
            value={cvv}
            onChangeText={handleCVVChange}
            onBlur={() => handleBlur('cvv')}
            error={getErrorMessage('cvv', errors.cvv)}
            keyboardType="numeric"
            maxLength={4}
            containerStyle={styles.halfInput}
            theme={theme}
            testID="cvv-input"
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
});

export default PaymentForm;
