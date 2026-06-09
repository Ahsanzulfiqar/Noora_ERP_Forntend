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

    // Update Stock With Batches (physical stock correction)
    updateStockWithBatches: build.mutation({
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
  }),
})

export const {
  useAddOpeningStockMutation,
  useUpdateStockWithBatchesMutation,
  useCreateWarehouseStockMutation,
  useGetWarehouseStockQuery,
  useGetWarehouseProductBatchesQuery,
  useGetWarehouseStockByIdQuery,
} = stocksAPI
