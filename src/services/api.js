import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Custom base query that handles GraphQL errors properly
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:4000/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await baseQuery(args, api, extraOptions)

  // Check if the response contains GraphQL errors
  if (result.data && result.data.errors) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        data: result.data,
      },
    }
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['User', 'Project', 'Warehouses', 'WarehouseStock'],
  endpoints: () => ({}), // empty, others will inject
})
