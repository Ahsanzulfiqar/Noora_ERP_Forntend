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
    }),
})

export const {
    useAddManualStockMutation,
} = stocksAPI
