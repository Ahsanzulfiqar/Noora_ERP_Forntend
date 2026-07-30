import { api } from '../authapi'

export const dashboardAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getAdminDashboard: build.query({
      query: ({ from, to, warehouseIds }) => ({
        method: 'POST',
        body: {
          query: `
            query AdminDashboard($warehouseIds: [ID], $from: String, $to: String) {
              AdminDashboard(warehouseIds: $warehouseIds, from: $from, to: $to) {
                revenue
                netProfit
                stockValue
                purchases
                receivables
                payables
                countrySales {
                  country
                  orders
                  revenue
                  receivables
                }
              }
            }
          `,
          variables: {
            from: from || null,
            to: to || null,
            ...(warehouseIds && warehouseIds.length > 0 ? { warehouseIds } : {}),
          },
        },
      }),
      transformResponse: (response) => response?.data?.AdminDashboard || null,
    }),
  }),
})

export const { useGetAdminDashboardQuery } = dashboardAPI
