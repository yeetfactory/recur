import { Brandfetch } from '@/clients/brandfetch';
import { BRANDFETCH_CLIENT_ID } from '@/envs';

/**
 * A singleton instance of the Brandfetch client.
 * @type {Brandfetch}
 */
export const brandfetch = new Brandfetch(BRANDFETCH_CLIENT_ID);
