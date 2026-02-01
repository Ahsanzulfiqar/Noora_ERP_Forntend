import { api } from '../api'

export const purchasesAPI = api.injectEndpoints({
  endpoints: (build) => ({

    // GET ALL PURCHASES
    getAllPurchases: build.query({
      query: () => ({
        method: 'POST',
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
                  quantity
                  purchasePrice
                  lineTotal
                  batchNo
                  expiryDate
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
} = purchasesAPI
