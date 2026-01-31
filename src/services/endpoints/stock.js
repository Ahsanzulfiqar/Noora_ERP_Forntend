import { api } from '../api'

export const purchasesAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // CREATE Warehouse Stock
    createWarehouseStock: build.mutation({
      query: (data) => ({
        method: 'POST',
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

    // GET Warehouse Stock
    getWarehouseStock: build.query({
      query: ({ filter, page = 1, limit = 50 }) => ({
        method: 'POST',
        body: {
          query: `
            query GetWarehouseStock(
              $filter: WarehouseStockFilterInput
              $page: Int
              $limit: Int
            ) {
              GetWarehouseStock(
                filter: $filter
                page: $page
                limit: $limit
              ) {
                data {
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
      providesTags: ['Stock'],
    }),

    // GET Warehouse Product Batches
    getWarehouseProductBatches: build.query({
      query: ({ warehouseId, productId, variantId = null }) => ({
        method: 'POST',
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
  usePostToStockMutation,
  useCreateWarehouseStockMutation,
  useGetWarehouseStockQuery,
  useGetWarehouseProductBatchesQuery,
} = purchasesAPI
