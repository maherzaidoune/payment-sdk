# React Native Checkout SDK

A React Native SDK for integrating with Checkout.com's payment processing platform. This package provides a customizable payment form that captures and validates card details, and tokenizes them securely using Checkout.com's API.

## Features

- 🔒 Securely capture card details (number, expiry date, CVV)
- ✅ Client-side validation with detailed error messages
- 🎨 Customizable UI with theming support
- 🌐 Integration with Checkout.com's Tokens API
- 📱 Built for React Native with Fabric compatibility

## Installation

```sh
npm install react-native-checkout
# or
yarn add react-native-checkout
```

## Usage

```jsx
import React, { useRef } from 'react';
import { View, Button, Alert } from 'react-native';
import { PaymentForm } from 'react-native-checkout';
import type { PaymentFormHandle } from 'react-native-checkout';

const PaymentScreen = () => {
  const paymentFormRef = useRef<PaymentFormHandle>(null);
  const [isValid, setIsValid] = useState(false);

  // Use component methods
  const handleSubmit = () => {
    paymentFormRef.current?.submit();
  };

  return (
    <View style={{ padding: 20 }}>
      <PaymentForm
        ref={paymentFormRef}
        onReady={(formComponent) => {
          console.log('Form is ready');
        }}
        onChange={(formComponent) => {
          // Check form validity whenever it changes
          setIsValid(formComponent.isValid());
        }}
        onSubmit={(tokenResponse) => {
          console.log('Token created:', tokenResponse);
          // Send token to your server for processing
        }}
        onError={(error) => {
          Alert.alert('Payment Failed', error.message);
        }}
        onPaymentCompleted={(formComponent, payment) => {
          console.log('Payment completed successfully', payment);
        }}
        theme={{
          colors: {
            primary: '#6200EE',
            error: '#B00020',
          },
        }}
      />
      <Button 
        title="Submit Payment" 
        onPress={handleSubmit}
        disabled={!isValid} 
      />
    </View>
  );
};
```

## API Reference

### `PaymentForm` Component

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onCardDetailsChange` | `(details: CardDetails, isValid: boolean) => void` | No | Callback when card details change |
| `onSubmit` | `(token: TokenResponse) => void` | No | Callback when token is created successfully |
| `onError` | `(error: Error) => void` | No | Callback when an error occurs |
| `onReady` | `(self: PaymentFormHandle) => void` | No | Callback when form is ready for interaction |
| `onChange` | `(self: PaymentFormHandle) => void` | No | Callback when form changes after user interaction |
| `onPaymentCompleted` | `(self: PaymentFormHandle, payment: TokenResponse) => void` | No | Callback when payment is processed successfully |
| `theme` | `Theme` | No | Custom theme for styling the form |
| `translations` | `Translations` | No | Custom translations for form labels and error messages |
| `containerStyle` | `StyleProp<ViewStyle>` | No | Style object for the form container |
| `callbacks` | `PaymentFormCallbacks` | No | Additional callback functions |

#### Ref Methods

The `PaymentForm` component exposes the following methods via ref:

| Method | Return Type | Description |
|--------|-------------|-------------|
| `submit()` | `Promise<TokenResponse \| void>` | Validates the form and submits the payment details for tokenization |
| `isValid()` | `boolean` | Returns whether the form is currently valid |
| `isAvailable()` | `Promise<boolean>` | Checks if the form can be rendered |
| `mount(containerID)` | `PaymentFormHandle` | Mounts the form to a container |
| `unmount()` | `PaymentFormHandle` | Unmounts the form |
| `on(eventName, handler)` | `PaymentFormHandle` | Adds an event listener |
| `reset()` | `void` | Resets the form to its initial state |

#### Events

| Event | Handler | Description |
|-------|---------|-------------|
| `ready` | `(self: PaymentFormHandle) => void` | Fired when form is initialized and ready |
| `change` | `(self: PaymentFormHandle) => void` | Fired when form changes after user interaction |
| `submit` | `(self: PaymentFormHandle) => void` | Fired when submission is triggered |
| `payment_completed` | `(self: PaymentFormHandle, payment: TokenResponse) => void` | Fired when payment is successfully processed |
| `error` | `(error: Error) => void` | Fired when an error occurs |

### Types

#### `CardDetails`

```typescript
interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}
```

#### `Theme`

```typescript
interface Theme {
  colors: {
    primary: string;
    error: string;
    background: string;
    text: string;
    border: string;
    borderFocused: string;
  };
  fonts: {
    regular: string;
    bold: string;
  };
}
```

#### `TokenResponse`

```typescript
interface TokenResponse {
  type: string;
  token: string;
  expires_on: string;
  expiry_month: number;
  expiry_year: number;
  scheme: string;
  last4: string;
  bin: string;
  card_type: string;
  card_category: string;
  issuer: string;
  issuer_country: string;
  product_id: string;
  product_type: string;
}
```
## Demo

![Simulator Screenshot - iPhone 16 Pro - 2025-04-07 at 12 05 27](https://github.com/user-attachments/assets/e517c53a-b29a-4d9d-b371-a7601b48a112)


## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)


This readme file, and some boilerplate was generated using AI
