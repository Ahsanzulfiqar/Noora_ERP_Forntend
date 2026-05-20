import { api } from '../authapi'

export const purchasesAPI = api.injectEndpoints({
  endpoints: (build) => ({

    // GET ALL PURCHASES
    getAllPurchases: build.query({
      query: () => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query {
              GetAllPurchases {
                _id
                supplierName
                invoiceNo
                warehouse
                purchaseDate
                status
                subTotal
                taxAmount
                totalAmount
                postedToStock
                items {
                  product
                  variant
                  quantity
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response) =>
        response?.data?.GetAllPurchases || [],
      providesTags: ['Purchases'],
    }),

    // CREATE PURCHASE
    createPurchase: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation CreatePurchase($data: CreatePurchaseInput!) {
              CreatePurchase(data: $data) {
                _id
                supplierName
                invoiceNo
                warehouse
                purchaseDate
                status
                postedToStock
                subTotal
                taxAmount
                totalAmount
                notes
                items {
                  product
                  productName
                  variant
                  variantName
                  quantity
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            data,
          },
        },
      }),
      invalidatesTags: ['Purchases'],
    }),

    // GET PURCHASE BY ID
    getPurchaseById: build.query({
      query: (_id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetPurchaseById($_id: ID!) {
              GetPurchaseById(_id: $_id) {
                _id
                supplierName
                invoiceNo
                warehouse
                warehouseName
                purchaseDate
                status
                subTotal
                taxAmount
                totalAmount
                postedToStock
                notes
                items {
                  product
                  productName
                  variant
                  variantName
                  sku
                  quantity
                  purchasePrice
                  lineTotal
                  batchNo
                  expiryDate
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            _id,
          },
        },
      }),
      transformResponse: (response) =>
        response?.data?.GetPurchaseById || null,
      providesTags: (result, error, _id) => [
        { type: 'Purchases', id: _id },
      ],
    }),

    // UPDATE PURCHASE
    updatePurchase: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation UpdatePurchase($id: ID!, $data: UpdatePurchaseInput!) {
              UpdatePurchase(id: $id, data: $data) {
                _id
                supplierName
                invoiceNo
                warehouse
                purchaseDate
                status
                subTotal
                taxAmount
                totalAmount
                postedToStock
                items {
                  product
                  productName
                  variant
                  variantName
                  quantity
                }
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
        'Purchases',
        { type: 'Purchases', id },
      ],
    }),

    // DELETE PURCHASE (if backend supports it)
    deletePurchase: build.mutation({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation DeletePurchase($id: ID!) {
              DeletePurchase(id: $id)
            }
          `,
          variables: {
            id,
          },
        },
      }),
      invalidatesTags: ['Purchases'],
    }),

    // POST TO STOCK
    postToStock: build.mutation({
      query: ({ purchaseId, items, taxAmount }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation PostToStock($purchaseId: ID!, $items: [PostToStockItemInput!]!, $taxAmount: Float) {
              PostToStock(purchaseId: $purchaseId, items: $items, taxAmount: $taxAmount) {
                _id
                status
                postedToStock
                subTotal
                taxAmount
                totalAmount
                warehouse
                warehouseName
                payment {
                  status
                  paidAmount
                  balanceAmount
                }
                items {
                  product
                  productName
                  variant
                  variantName
                  sku
                  quantity
                  purchasePrice
                  lineTotal
                  batchNo
                  expiryDate
                }
              }
            }
          `,
          variables: { purchaseId, items, taxAmount },
        },
      }),
      invalidatesTags: (result, error, { purchaseId }) => [
        { type: 'Purchases', id: purchaseId },
        'Purchases',
      ],
    }),

    // CONFIRM PURCHASE
    confirmPurchase: build.mutation({
      query: (purchaseId) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation ConfirmPurchase($purchaseId: ID!) {
              ConfirmPurchase(purchaseId: $purchaseId) {
                _id
                supplierName
                invoiceNo
                status
                postedToStock
                warehouse
                purchaseDate
                items {
                  product
                  productName
                  variant
                  variantName
                  quantity
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { purchaseId },
        },
      }),
      invalidatesTags: (result, error, purchaseId) => [
        { type: 'Purchases', id: purchaseId },
        'Purchases',
      ],
    }),

  }),
})

export const {
  useGetAllPurchasesQuery,
  useCreatePurchaseMutation,
  useGetPurchaseByIdQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  usePostToStockMutation,
  useConfirmPurchaseMutation,
} = purchasesAPI
