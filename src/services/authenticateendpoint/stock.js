import { api } from '../authapi'

export const stocksAPI = api.injectEndpoints({
    endpoints: (build) => ({
        // Add Manual Stock
        addManualStock: build.mutation({
            query: (data) => ({
                method: 'POST',
                body: {
                    query: `
            mutation AddManualStock($data: ManualStockInput!) {
              AddManualStock(data: $data) {
                _id
                quantity
                reserved
                batches {
                  batchNo
                  quantity
                }
              }
            }
          `,
                    variables: { data },
                },
            }),
            invalidatesTags: ['Stock'],
        }),
        // Create Warehouse Stock
        getWarehouseStock: build.query({
            query: ({ filter, page = 1, limit = 50 }) => ({
                method: 'POST',
                body: {
                    query: `
            query GetWarehouseStock($filter: WarehouseStockFilterInput, $page: Int, $limit: Int) {
              GetWarehouseStock(filter: $filter, page: $page, limit: $limit) {
                data {
                  _id
                  warehouse
                  warehouseName
                  product
                  productName
                  variant
                  variantName
                  quantity
                  reserved
                  reorderLevel
                  batches {
                    batchNo
                    expiryDate
                    quantity
                  }
                  createdAt
                  updatedAt
                }
                total
                page
                limit
                totalPages
              }
            }
          `,
                    variables: { filter, page, limit },
                },
            }),
            transformResponse: (response) => response?.data?.GetWarehouseStock || { data: [], total: 0 },
            providesTags: ['Stock'],
        }),
    }),
})

export const {
    useAddManualStockMutation,
    useGetWarehouseStockQuery,
} = stocksAPI
