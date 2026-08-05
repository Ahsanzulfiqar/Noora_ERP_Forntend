import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie, deleteCookie } from 'cookies-next';

const authSessionKey = '_LARKON_AUTH_KEY_';

const baseQuery = fetchBaseQuery({
baseUrl: import.meta.env.VITE_GRAPHQL_URL ?? import.meta.env.VITE_API_URL,
  method: 'POST',
  prepareHeaders: (headers) => {
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

// Detect token-expired / unauthenticated responses from the GraphQL backend.
// Only true authentication failures (bad/expired token) should trigger a logout.
// Authorization failures (FORBIDDEN / 403) mean the user is authenticated but
// their role isn't permitted for the operation — surface the error, don't log out.
const AUTH_MESSAGE_PATTERNS = [
  'jwt expired',
  'token expired',
  'token has expired',
  'invalid token',
  'invalid signature',
  'unauthenticated',
  'not authenticated',
  'authentication required',
];

const isAuthErrorPayload = (payload) => {
  const errs = payload?.errors || payload?.data?.errors;
  if (!Array.isArray(errs) || errs.length === 0) return false;
  return errs.some((e) => {
    const code = (e?.extensions?.code || '').toString().toUpperCase();
    if (code === 'UNAUTHENTICATED') return true;
    const msg = (e?.message || '').toString().toLowerCase();
    return AUTH_MESSAGE_PATTERNS.some((p) => msg.includes(p));
  });
};

// Guard so concurrent in-flight queries that all fail with auth errors
// don't each kick off their own redirect.
let isLoggingOut = false;
const forceLogout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  try { deleteCookie(authSessionKey); } catch (_) { /* cookie may already be gone */ }
  if (typeof window === 'undefined') return;
  const onSignInPage = window.location.pathname.startsWith('/auth/sign-in');
  if (onSignInPage) return;
  const redirectTo = window.location.pathname + window.location.search;
  window.location.assign(`/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`);
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // HTTP-level auth failure (401 only). 403 = permission denied, keep the session.
  if (result.error && result.error.status === 401) {
    forceLogout();
    return result;
  }

  // 200 OK with GraphQL errors — surface as RTK error, and log out on auth errors
  if (result.data && result.data.errors) {
    if (isAuthErrorPayload(result.data)) {
      forceLogout();
    }
    return { error: result.data };
  }

  return result;
};

export const api = createApi({
  reducerPath: 'authapi',
  baseQuery: baseQueryWithReauth,

  tagTypes: ['User', 'Project', 'Sales', 'Category', 'SubCategory', 'Courier', 'Products', 'Variants', 'Purchases', 'Sellers', 'Warehouses', 'WarehouseStock', 'Stock', 'StockTransfer', 'Account'],

  endpoints: () => ({}), // empty, others will inject
})
