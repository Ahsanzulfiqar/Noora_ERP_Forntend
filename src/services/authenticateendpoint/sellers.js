import { api } from '../authapi'

export const sellersAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // GET ALL SELLERS (with pagination and search)
    getSellers: build.query({
      query: ({ search = '', page = 1, limit = 20 } = {}) => ({
        method: 'POST',
        body: {
          query: `
            query GetSellers($search: String, $page: Int, $limit: Int) {
              GetSellers(search: $search, page: $page, limit: $limit) {
                data {
                  _id
                  name
                  email
                  phone
                  companyName
                  isActive
                }
                total
                page
                limit
                totalPages
              }
            }
          `,
          variables: {
            search,
            page,
            limit,
          },
        },
      }),
      transformResponse: (response) => response?.data?.GetSellers || { data: [], total: 0 },
      providesTags: ['Sellers'],
    }),

    // GET SELLER BY ID
    getSellerById: build.query({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            query GetSellerById($id: ID!) {
              GetSellerById(id: $id) {
                _id
                name
                email
                phone
                role
                isActive
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            id,
          },
        },
      }),
      transformResponse: (response) => response?.data?.GetSellerById || null,
      providesTags: (result, error, id) => [{ type: 'Sellers', id }],
    }),

    // CREATE SELLER
    createSeller: build.mutation({
      query: (data) => ({
        method: 'POST',
        body: {
          query: `
            mutation CreateSeller($data: CreateSellerInput!) {
              CreateSeller(data: $data) {
                _id
                name
                email
                phone
                sellerType
                commissionType
                commissionValue
                isActive
              }
            }
          `,
          variables: {
            data,
          },
        },
      }),
      invalidatesTags: ['Sellers'],
    }),

    // UPDATE SELLER
    updateSeller: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        body: {
          query: `
            mutation UpdateSeller($id: ID!, $data: UpdateSellerInput!) {
              UpdateSeller(id: $id, data: $data) {
                _id
                name
                email
                phone
                isActive
                commissionType
                commissionValue
              }
            }
          `,
          variables: {
            id,
            data,
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Sellers',
        { type: 'Sellers', id },
      ],
    }),
  }),
})

export const {
  useGetSellersQuery,
  useGetSellerByIdQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation,
} = sellersAPI
