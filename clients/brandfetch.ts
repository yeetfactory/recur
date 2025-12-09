import {
  BrandfetchSearchInput,
  BrandfetchSearchResponse,
  Zod_BrandfetchSearchInput,
} from '@/types';

/**
 * A class for interacting with the Brandfetch API.
 */
export class Brandfetch {
  /**
   * The client ID for the Brandfetch API.
   */
  private clientId: string;

  /**
   * Creates a new instance of the Brandfetch class.
   * @param clientId - The client ID for the Brandfetch API.
   */
  constructor(clientId: string) {
    this.clientId = clientId;
  }

  /**
   * Searches for brands using the Brandfetch API.
   * @param args - The search input.
   * @returns A promise that resolves to the search response.
   * @throws If the input is invalid, an error is thrown.
   */
  async search(args: BrandfetchSearchInput): Promise<BrandfetchSearchResponse> {
    const input = Zod_BrandfetchSearchInput.safeParse(args);

    if (!input.success) {
      throw new Error('Invalid input, you should provide a query string');
    }

    const { query } = input.data;

    // Use string concatenation or URL if supported. Expo supports URL.
    const url = new URL(`https://api.brandfetch.io/v2/search/${query}`);
    if (this.clientId) {
      url.searchParams.set('c', this.clientId);
    } else {
      console.warn('Brandfetch Client ID is missing/empty. API usage might be limited or fail.');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error(`Brandfetch API Error: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing to avoid crashing UI if not handled strictly
      return [];
    }

    try {
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Brandfetch response is not an array:', data);
        return [];
      }
      return data;
    } catch (e) {
      console.error('Failed to parse Brandfetch response', e);
      return [];
    }
  }
}
