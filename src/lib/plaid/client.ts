import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { config } from '@/lib/config';

let plaidClient: PlaidApi | null = null;

/**
 * Get or create Plaid API client
 */
export function getPlaidClient(): PlaidApi {
  if (plaidClient) {
    return plaidClient;
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments[config.plaid.env as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': config.plaid.clientId,
        'PLAID-SECRET': config.plaid.secret,
      },
    },
  });

  plaidClient = new PlaidApi(configuration);
  return plaidClient;
}

/**
 * Create a link token for Plaid Link
 */
export async function createLinkToken(userId: string): Promise<string> {
  const client = getPlaidClient();

  const request = {
    user: {
      client_user_id: userId,
    },
    client_name: 'Rockwood Golf Tournament',
    products: ['auth'],
    country_codes: ['US'],
    language: 'en',
    account_filters: {
      depository: {
        account_subtypes: ['checking', 'savings'],
      },
    },
  } as any;

  const response = await client.linkTokenCreate(request);
  return response.data.link_token;
}

/**
 * Exchange public token for access token
 */
export async function exchangePublicToken(publicToken: string): Promise<{
  accessToken: string;
  itemId: string;
}> {
  const client = getPlaidClient();

  const request = {
    public_token: publicToken,
  };

  const response = await client.itemPublicTokenExchange(request);

  return {
    accessToken: response.data.access_token,
    itemId: response.data.item_id,
  };
}

/**
 * Create a transfer (payment) - simplified version for demo
 */
export async function createTransfer(
  accessToken: string,
  accountId: string,
  amount: number,
  description: string,
  userLegalName: string
): Promise<{
  transferId: string;
  status: string;
}> {
  const client = getPlaidClient();

  // Simplified transfer creation - in production use proper authorization flow
  const request = {
    access_token: accessToken,
    account_id: accountId,
    amount: amount.toString(),
    description,
    ach_class: 'ppd',
    network: 'ach',
    type: 'debit',
    user: {
      legal_name: userLegalName,
    },
  } as any;

  const response = await client.transferCreate(request);

  return {
    transferId: response.data.transfer.id,
    status: response.data.transfer.status,
  };
}

/**
 * Get transfer status
 */
export async function getTransferStatus(transferId: string): Promise<string> {
  const client = getPlaidClient();

  const response = await client.transferGet({
    transfer_id: transferId,
  });

  return response.data.transfer.status;
}