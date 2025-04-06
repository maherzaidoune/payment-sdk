import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { PaymentForm } from 'react-native-checkout';
import type {
  PaymentFormHandle,
  CardDetails,
  TokenApiResponse,
} from 'react-native-checkout';

export default function App() {
  const paymentFormRef = useRef<PaymentFormHandle>(null);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isValid, setIsValid] = useState(false);
  const [token, setToken] = useState<TokenApiResponse | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (paymentFormRef.current) {
        const isAvailable = await paymentFormRef.current.isAvailable();
        console.log('Payment form is available:', isAvailable);
      }
    };

    checkAvailability();
  }, []);

  const handleCardDetailsChange = (details: CardDetails, valid: boolean) => {
    setCardDetails(details);
    setIsValid(valid);
  };

  const handleSubmit = () => {
    paymentFormRef.current?.submit();
  };

  const handlePaymentSuccess = (tokenResponse: TokenApiResponse) => {
    setToken(tokenResponse);
    Alert.alert('Success', 'Payment token created successfully');
  };

  const handlePaymentError = (error: any) => {
    Alert.alert('Error', error.message || 'Payment failed');
  };

  const renderTokenInfo = () => {
    if (!token) return null;

    return (
      <View style={styles.tokenContainer}>
        <Text>Card Details: {JSON.stringify(cardDetails.cardNumber)}</Text>
        <Text style={styles.tokenTitle}>Token Information</Text>
        <Text style={styles.tokenInfo}>Token: {token.token}</Text>
        <Text style={styles.tokenInfo}>Last 4: {token.last4}</Text>
        <Text style={styles.tokenInfo}>
          Expiry: {token.expiry_month}/{token.expiry_year}
        </Text>
        <Text style={styles.tokenInfo}>Scheme: {token.scheme}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Payment Form</Text>
            <PaymentForm
              ref={paymentFormRef}
              onCardDetailsChange={handleCardDetailsChange}
              onSubmit={handlePaymentSuccess}
              onError={handlePaymentError}
              onPaymentCompleted={(payment) => {
                console.log('Payment completed:', payment);
              }}
              translations={{
                cvvLabel: '!NOT_CVV',
              }}
              theme={{
                colors: {
                  primary: '#6200EE',
                  error: '#B00020',
                  background: '#FFFFFF',
                  text: '#000000',
                  border: '#CCCCCC',
                },
              }}
            />

            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.disabledButton]}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Payment</Text>
            </TouchableOpacity>

            <View style={styles.flowApiDemo}>
              <Text style={styles.subtitle}>Demo</Text>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={() => paymentFormRef.current?.submit()}
              >
                <Text style={styles.apiButtonText}>submit()</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.apiButton}
                onPress={() => {
                  const valid = paymentFormRef.current?.isValid();
                  Alert.alert(
                    'Is Valid',
                    `Form is ${valid ? 'valid' : 'invalid'}`
                  );
                }}
              >
                <Text style={styles.apiButtonText}>isValid()</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.apiButton}
                onPress={() => {
                  paymentFormRef.current?.unmount();
                  setTimeout(() => {
                    paymentFormRef.current?.mount('form-container');
                  }, 1000);
                }}
              >
                <Text style={styles.apiButtonText}>unmount() / mount()</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.apiButton}
                onPress={() => paymentFormRef.current?.reset()}
              >
                <Text style={styles.apiButtonText}>reset()</Text>
              </TouchableOpacity>
            </View>

            {renderTokenInfo()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tokenContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  tokenTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tokenInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  flowApiDemo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e6e6ff',
    borderRadius: 8,
  },
  apiButton: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 4,
    marginVertical: 4,
  },
  apiButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});
