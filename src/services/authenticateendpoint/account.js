import { api } from '../authapi'

export const accountAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // ACCOUNT QUERIES

    // GET ACCOUNTS (supports optional type / isActive / search filters)
    getAccounts: build.query({
      query: ({ type, isActive, search } = {}) => ({
        method: 'POST',
        body: {
          query: `
            query GetAccounts($type: AccountType, $isActive: Boolean, $search: String) {
              GetAccounts(type: $type, isActive: $isActive, search: $search) {
                _id
                code
                name
                type
                parentId
                isActive
              }
            }
          `,
          variables: {
            ...(type !== undefined && { type }),
            ...(isActive !== undefined && { isActive }),
            ...(search !== undefined && { search }),
          },
        },
      }),
      transformResponse: (response) => response?.data?.GetAccounts || [],
      providesTags: ['Account'],
    }),

    // GET ACCOUNT BY ID
    getAccountById: build.query({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            query GetAccountById($id: ID!) {
              GetAccountById(id: $id) {
                _id
                code
                name
                type
                parentId
                isActive
                createdAt
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response) => response?.data?.GetAccountById,
      providesTags: (result, error, id) => [{ type: 'Account', id }],
    }),

    // GET ACCOUNT TREE (hierarchical view)
    getAccountTree: build.query({
      query: () => ({
        method: 'POST',
        body: {
          query: `
            query GetAccountTree {
              GetAccountTree {
                _id
                code
                name
                type
                children {
                  _id
                  code
                  name
                  type
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response) => response?.data?.GetAccountTree || [],
      providesTags: ['Account'],
    }),

    // ACCOUNT MUTATIONS

    // SEED DEFAULT ACCOUNTS
    seedDefaultAccounts: build.mutation({
      query: () => ({
        method: 'POST',
        body: {
          query: `
            mutation SeedDefaultAccounts {
              SeedDefaultAccounts {
                _id
                code
                name
                type
                parentId
                isActive
              }
            }
          `,
        },
      }),
      invalidatesTags: ['Account'],
    }),

    // CREATE ACCOUNT
    createAccount: build.mutation({
      query: (data) => ({
        method: 'POST',
        body: {
          query: `
            mutation CreateAccount($data: CreateAccountInput!) {
              CreateAccount(data: $data) {
                _id
                code
                name
                type
                parentId
                isActive
              }
            }
          `,
          variables: { data },
        },
      }),
      invalidatesTags: ['Account'],
    }),

    // UPDATE ACCOUNT
    updateAccount: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        body: {
          query: `
            mutation UpdateAccount($id: ID!, $data: UpdateAccountInput!) {
              UpdateAccount(id: $id, data: $data) {
                _id
                code
                name
                type
                parentId
                isActive
              }
            }
          `,
          variables: { id, data },
        },
      }),
      invalidatesTags: (result, error, { id }) => ['Account', { type: 'Account', id }],
    }),

    // DISABLE ACCOUNT
    disableAccount: build.mutation({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            mutation DisableAccount($id: ID!) {
              DisableAccount(id: $id) {
                _id
                name
                isActive
              }
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: (result, error, id) => ['Account', { type: 'Account', id }],
    }),

    // ENABLE ACCOUNT
    enableAccount: build.mutation({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            mutation EnableAccount($id: ID!) {
              EnableAccount(id: $id) {
                _id
                name
                isActive
              }
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: (result, error, id) => ['Account', { type: 'Account', id }],
    }),

    // DELETE ACCOUNT
    deleteAccount: build.mutation({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            mutation DeleteAccount($id: ID!) {
              DeleteAccount(id: $id)
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ['Account'],
    }),
  }),
})

export const {
  useGetAccountsQuery,
  useGetAccountByIdQuery,
  useGetAccountTreeQuery,
  useSeedDefaultAccountsMutation,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDisableAccountMutation,
  useEnableAccountMutation,
  useDeleteAccountMutation,
} = accountAPI
