import { api } from '../authapi'

export const stockTransferAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // GET ALL STOCK TRANSFERS
    getStockTransfers: build.query({
      query: () => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetStockTransfers {
              GetStockTransfers {
                _id
                transferNo
                fromWarehouse
                fromWarehouseName
                toWarehouse
                toWarehouseName
                status
                note
                createdAt
                confirmedAt
                items {
                  product
                  productName
                  variant
                  variantName
                  quantity
                  batchNo
                  expiryDate
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response) => response?.data?.GetStockTransfers || [],
      providesTags: ['StockTransfer'],
    }),

    // GET STOCK TRANSFER BY ID
    getStockTransferById: build.query({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetStockTransferById($id: ID!) {
              GetStockTransferById(id: $id) {
                _id
                transferNo
                fromWarehouse
                toWarehouse
                status
                note
                confirmedAt
                createdAt
                items {
                  product
                  variant
                  quantity
                  batchNo
                  expiryDate
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response) => response?.data?.GetStockTransferById || null,
      providesTags: (result, error, id) => [{ type: 'StockTransfer', id }],
    }),

    // CREATE STOCK TRANSFER
    createStockTransfer: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation CreateStockTransfer($data: CreateStockTransferInput!) {
              CreateStockTransfer(data: $data) {
                _id
                transferNo
                fromWarehouse
                toWarehouse
                status
                note
                createdAt
                items {
                  product
                  variant
                  quantity
                  batchNo
                  expiryDate
                }
              }
            }
          `,
          variables: { data },
        },
      }),
      invalidatesTags: ['StockTransfer', 'Stock', 'WarehouseStock'],
    }),

    // CONFIRM STOCK TRANSFER
    confirmStockTransfer: build.mutation({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation ConfirmStockTransfer($id: ID!) {
              ConfirmStockTransfer(id: $id) {
                _id
                transferNo
                status
                confirmedAt
                updatedAt
              }
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: (result, error, id) => [
        'StockTransfer',
        { type: 'StockTransfer', id },
        'Stock',
        'WarehouseStock',
      ],
    }),

    // CANCEL STOCK TRANSFER
    cancelStockTransfer: build.mutation({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation CancelStockTransfer($id: ID!) {
              CancelStockTransfer(id: $id) {
                _id
                transferNo
                status
                updatedAt
              }
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: (result, error, id) => [
        'StockTransfer',
        { type: 'StockTransfer', id },
      ],
    }),
  }),
})

export const {
  useGetStockTransfersQuery,
  useGetStockTransferByIdQuery,
  useCreateStockTransferMutation,
  useConfirmStockTransferMutation,
  useCancelStockTransferMutation,
} = stockTransferAPI
