import { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import PaymentForm, { PaymentFormHandle } from '../PaymentForm';
import type { Theme, Translations } from '../PaymentForm/types';

describe('PaymentForm Component', () => {
  const mockOnCardDetailsChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(
      <PaymentForm
        onCardDetailsChange={mockOnCardDetailsChange}
        onSubmit={mockOnSubmit}
        onError={mockOnError}
      />
    );

    expect(getByTestId('card-number-input')).toBeTruthy();
    expect(getByTestId('expiry-date-input')).toBeTruthy();
    expect(getByTestId('cvv-input')).toBeTruthy();
    expect(getByText('Card Number')).toBeTruthy();
    expect(getByText('Expiry Date')).toBeTruthy();
    expect(getByText('CVV')).toBeTruthy();
  });

  describe('Input Validation', () => {
    it('does not validate on change', () => {
      const { getByTestId, queryByText } = render(
        <PaymentForm
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        />
      );

      const cardInput = getByTestId('card-number-input');
      fireEvent.changeText(cardInput, '1234');

      expect(queryByText('Invalid card number')).toBeNull();
      expect(mockOnCardDetailsChange).not.toHaveBeenCalled();
    });

    it('validates card number on blur', () => {
      const { getByTestId, queryByText } = render(
        <PaymentForm
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        />
      );

      const cardInput = getByTestId('card-number-input');

      // Invalid card number
      fireEvent.changeText(cardInput, '1234');
      fireEvent(cardInput, 'blur');
      expect(queryByText('Invalid card number')).toBeTruthy();
      expect(mockOnCardDetailsChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ cardNumber: '1234' }),
        false
      );

      // Valid card number
      fireEvent.changeText(cardInput, '4242 4242 4242 4242');
      fireEvent(cardInput, 'blur');
      expect(queryByText('Invalid card number')).toBeFalsy();
      expect(mockOnCardDetailsChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ cardNumber: '4242 4242 4242 4242' }),
        false
      );
    });

    it('validates expiry date on blur', () => {
      const { getByTestId, queryByText } = render(
        <PaymentForm
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        />
      );

      const expiryInput = getByTestId('expiry-date-input');

      fireEvent.changeText(expiryInput, '01/20');
      fireEvent(expiryInput, 'blur');
      expect(queryByText('Card has expired')).toBeTruthy();

      const futureYear = String(new Date().getFullYear() + 2).slice(-2);
      fireEvent.changeText(expiryInput, `12/${futureYear}`);
      fireEvent(expiryInput, 'blur');
      expect(queryByText('Invalid expiry date format')).toBeFalsy();
      expect(queryByText('Card has expired')).toBeFalsy();
    });

    it('validates CVV on blur', () => {
      const { getByTestId, queryByText } = render(
        <PaymentForm
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        />
      );

      const cvvInput = getByTestId('cvv-input');

      // Invalid CVV
      fireEvent.changeText(cvvInput, '12');
      fireEvent(cvvInput, 'blur');
      expect(queryByText('Invalid CVV')).toBeTruthy();

      // Valid CVV
      fireEvent.changeText(cvvInput, '123');
      fireEvent(cvvInput, 'blur');
      expect(queryByText('Invalid CVV')).toBeFalsy();
    });

    it('validates all fields on submit', async () => {
      const formRef = createRef<PaymentFormHandle>();
      const { queryByText } = render(
        <PaymentForm
          ref={formRef}
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        />
      );

      await act(async () => {
        await formRef.current?.submit();
      });

      expect(queryByText('Card number is required')).toBeTruthy();
      expect(queryByText('Expiry date is required')).toBeTruthy();
      expect(queryByText('CVV is required')).toBeTruthy();
    });
  });

  describe('Form State', () => {
    it('resets form state correctly', () => {
      const formRef = createRef<PaymentFormHandle>();
      const { getByTestId } = render(
        <PaymentForm
          ref={formRef}
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        />
      );

      const cardInput = getByTestId('card-number-input');
      const expiryInput = getByTestId('expiry-date-input');
      const cvvInput = getByTestId('cvv-input');

      fireEvent.changeText(cardInput, '4242 4242 4242 4242');
      fireEvent.changeText(expiryInput, '12/25');
      fireEvent.changeText(cvvInput, '123');

      act(() => {
        formRef.current?.reset();
      });

      expect(cardInput.props.value).toBe('');
      expect(expiryInput.props.value).toBe('');
      expect(cvvInput.props.value).toBe('');
    });

    it('checks form validity correctly', () => {
      const formRef = createRef<PaymentFormHandle>();
      const { getByTestId } = render(
        <PaymentForm
          ref={formRef}
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        />
      );

      expect(formRef.current?.isValid()).toBe(false);

      const cardInput = getByTestId('card-number-input');
      const expiryInput = getByTestId('expiry-date-input');
      const cvvInput = getByTestId('cvv-input');

      fireEvent.changeText(cardInput, '4242 4242 4242 4242');
      fireEvent.changeText(expiryInput, '12/25');
      fireEvent.changeText(cvvInput, '123');

      fireEvent(cardInput, 'blur');
      fireEvent(expiryInput, 'blur');
      fireEvent(cvvInput, 'blur');

      expect(formRef.current?.isValid()).toBe(true);
    });
  });

  describe('Customization', () => {
    it('merges custom translations with defaults', () => {
      const customTranslations: Partial<Translations> = {
        cardNumberLabel: 'Custom Card Number',
        cvvLabel: 'Custom CVV',
        errors: {
          cardNumberRequired: 'Custom card number required',
          cardNumberInvalid: 'Invalid card number',
          expiryDateRequired: 'Expiry date is required',
          expiryDateInvalid: 'Invalid expiry date format',
          expiryDatePast: 'Card has expired',
          cvvRequired: 'CVV is required',
          cvvInvalid: 'Invalid CVV',
        },
      };

      const { getByText, getByTestId, queryByText } = render(
        <PaymentForm
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
          translations={customTranslations}
        />
      );

      expect(getByText('Custom Card Number')).toBeTruthy();
      expect(getByText('Custom CVV')).toBeTruthy();
      expect(getByText('Expiry Date')).toBeTruthy();

      const cardInput = getByTestId('card-number-input');
      fireEvent.changeText(cardInput, '');
      fireEvent(cardInput, 'blur');

      expect(queryByText('Custom card number required')).toBeTruthy();
    });

    it('merges custom theme with defaults', () => {
      const customTheme: Partial<Theme> = {
        colors: {
          primary: '#FF0000',
          error: '#00FF00',
          background: '#FFFFFF',
          text: '#000000',
          border: '#CCCCCC',
        },
      };

      const { getByTestId } = render(
        <PaymentForm
          onCardDetailsChange={mockOnCardDetailsChange}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
          theme={customTheme}
        />
      );

      const cardInput = getByTestId('card-number-input');
      expect(cardInput).toBeTruthy();
    });
  });
});
