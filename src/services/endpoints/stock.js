import { api } from '../api'

export const purchasesAPI = api.injectEndpoints({
    endpoints: (build) => ({

        // POST To Stock
        postToStock: build.mutation({
            query: (purchaseId) => ({
                method: 'POST',
                body: {
                    query: `
            mutation PostToStock($purchaseId: ID!) {
              PostToStock(purchaseId: $purchaseId) {
                _id
                supplierName
                invoiceNo
                warehouse
                postedToStock
                status
              }
            }
          `,
                    variables: { purchaseId },
                },
            }),
            invalidatesTags: ['Purchases', 'Stock'],
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
    useGetWarehouseStockQuery,
    useGetWarehouseProductBatchesQuery,
} = purchasesAPI
