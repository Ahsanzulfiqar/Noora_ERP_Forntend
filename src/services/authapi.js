import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie } from 'cookies-next';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4000/graphql', // 👈 Your base URL
  method: 'POST',
  prepareHeaders: (headers) => {
    const authSessionKey = '_LARKON_AUTH_KEY_';
    const cookieValue = getCookie(authSessionKey);

    if (cookieValue) {
      try {
        let token = '';
        if (typeof cookieValue === 'string' && (cookieValue.startsWith('{') || cookieValue.startsWith('['))) {
          const session = JSON.parse(cookieValue);
          token = session?.token || session?.accessToken || '';
        } else {
          token = cookieValue;
        }

        if (token) {
          // Remove "Bearer " prefix if it exists and trim quotes/spaces
          const cleanToken = token.toString().replace(/^Bearer\s+/i, '').replace(/^"(.*)"$/, '$1').trim();
          headers.set('Authorization', cleanToken);
        }
      } catch (e) {
        console.error('Error parsing auth cookie', e);
      }
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Detect GraphQL errors in a 200 OK response
  if (result.data && result.data.errors) {
    return { error: result.data };
  }

  return result;
};

export const api = createApi({
  reducerPath: 'authapi',
  baseQuery: baseQueryWithReauth,

  tagTypes: ['User', 'Project', 'Sales', 'Category', 'SubCategory', 'Courier', 'Products', 'Variants', 'Purchases', 'Sellers', 'Warehouses', 'WarehouseStock', 'Stock'],

  endpoints: () => ({}), // empty, others will inject
})
