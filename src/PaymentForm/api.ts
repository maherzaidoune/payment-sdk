import type { CardDetails, TokenApiResponse } from './types';

const API_URL = 'https://api.sandbox.checkout.com/tokens';

interface TokenRequest {
  type: 'card';
  number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
}

export const createToken = async (
  cardDetails: CardDetails,
  apiKey: string
): Promise<TokenApiResponse> => {
  try {
    // Parse expiry date MM/YY
    const [month = '', year = ''] = cardDetails.expiryDate.split('/');

    // Format card number by removing spaces
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');

    const tokenRequest: TokenRequest = {
      type: 'card',
      number: cardNumber,
      expiry_month: month,
      expiry_year: year,
      cvv: cardDetails.cvv,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(tokenRequest),
    });

    console.log('response', JSON.stringify(response));
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create token');
    }

    return await response.json();
  } catch (error) {
    console.log('error', error);
    if (error instanceof Error) {
      throw new Error(`Token creation failed: ${error.message}`);
    }
    throw new Error('Token creation failed');
  }
};
