import { api } from '../authapi'

export const stocksAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // Add Opening Stock (manual inventory with multiple batches)
    addOpeningStock: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation AddOpeningStock($data: AddOpeningStockInput!) {
              AddOpeningStock(data: $data) {
                _id
                warehouse
                product
                variant
                quantity
                reserved
                avgCost
                batches {
                  batchNo
                  expiryDate
                  quantity
                  unitCost
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

    // Get Warehouse Stock By ID
    getWarehouseStockById: build.query({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetWarehouseStockById($id: ID!) {
              GetWarehouseStockById(id: $id) {
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
                avgCost
                batches {
                  batchNo
                  expiryDate
                  quantity
                  unitCost
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response) => response?.data?.GetWarehouseStockById,
      providesTags: (result, error, id) => [{ type: 'Stock', id }],
    }),

    // Update Inventory (adjust warehouse stock batches)
    updateInventory: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation UpdateStockWithBatches($data: UpdateStockWithBatchesInput!) {
              UpdateStockWithBatches(data: $data) {
                _id
                warehouse
                product
                variant
                quantity
                reserved
                avgCost
                batches {
                  batchNo
                  expiryDate
                  quantity
                  unitCost
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { data },
        },
      }),
      invalidatesTags: (result, error, arg) => [
        'Stock',
        'WarehouseStock',
        { type: 'Stock', id: arg?._id },
      ],
    }),
  }),
})

export const {
  useAddOpeningStockMutation,
  useCreateWarehouseStockMutation,
  useGetWarehouseProductBatchesQuery,
  useGetWarehouseStockByIdQuery,
  useUpdateInventoryMutation,
} = stocksAPI
