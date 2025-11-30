import { z } from 'zod';

export const Zod_BrandfetchSearchInput = z.object({
  query: z.string(),
});

export type BrandfetchSearchInput = z.infer<typeof Zod_BrandfetchSearchInput>;

export const Zod_BrandfetchSearchResponse = z.array(
  z.object({
    icon: z.string().optional(),
    name: z.string().optional(),
    domain: z.string(),
    claimed: z.boolean(),
    brandId: z.string(),
  })
);

export type BrandfetchSearchResponse = z.infer<typeof Zod_BrandfetchSearchResponse>;

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

    const url = new URL(`https://api.brandfetch.io/v2/search/${query}`);
    url.searchParams.set('c', this.clientId);

    const response = await fetch(url, { method: 'GET' });

    const data = await response.json();
    return data;
  }
}
