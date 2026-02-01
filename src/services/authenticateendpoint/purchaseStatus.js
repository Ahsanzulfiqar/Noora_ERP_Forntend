import { api } from '../authapi'

export const purchaseStatusAPI = api.injectEndpoints({
    endpoints: (build) => ({
        // CONFIRM PURCHASE
        confirmPurchase: build.mutation({
            query: (purchaseId) => ({
                method: 'POST',
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
                  purchasePrice
                  lineTotal
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
    useConfirmPurchaseMutation,
} = purchaseStatusAPI
