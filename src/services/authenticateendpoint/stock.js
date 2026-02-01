import { api } from '../authapi'

export const stocksAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // Add Manual Stock
    addManualStock: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
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
    createWarehouseStock: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
                        mutation CreateWarehouseStock($data: CreateWarehouseStockInput!) {
                            CreateWarehouseStock(data: $data) {
                                _id
                                warehouse
                                product
                                variant
                                quantity
                                reserved
                                reorderLevel
                                batches {
                                    batchNo
                                    expiryDate
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

    // Get Warehouse Stock
    getWarehouseStock: build.query({
      query: ({ filter, page = 1, limit = 50 }) => ({
        method: 'POST',
        auth: true,
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

    // Get Warehouse Product Batches
    getWarehouseProductBatches: build.query({
      query: ({ warehouseId, productId, variantId = null }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetWarehouseProductBatches(
              $warehouseId: ID!
              $productId: ID!
              $variantId: ID
            ) {
              GetWarehouseProductBatches(
                warehouseId: $warehouseId
                productId: $productId
                variantId: $variantId
              ) {
                batchNo
                expiryDate
                quantity
              }
            }
          `,
          variables: {
            warehouseId,
            productId,
            variantId,
          },
        },
      }),
      providesTags: ['Stock'],
    }),
  }),
})

export const {
  useAddManualStockMutation,
  useCreateWarehouseStockMutation,
  useGetWarehouseStockQuery,
  useGetWarehouseProductBatchesQuery,
} = stocksAPI
