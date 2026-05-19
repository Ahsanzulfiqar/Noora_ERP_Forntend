import { api } from '../authapi'

export const salesAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // GET ALL SALES (with pagination and search)
    // GET ALL SALES (with pagination and search/filter)
    getSales: build.query({
      query: ({ page = 1, limit = 20, filter = {} } = {}) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
        query FilterSales($filter: SaleFilterInput, $page: Int, $limit: Int) {
          FilterSales(filter: $filter, page: $page, limit: $limit) {
            data {
              _id
              invoiceNo
              status
              seller
              warehouse
              totalAmount
              courier {
                courierName
                trackingNo
              }
              payment {
                status
                mode
                bankAccount
                paidAmount
                balanceAmount
                paidAt
              }
              createdAt
            }
            total
            page
            limit
            totalPages
          }
        }
      `,
          variables: {
            page,
            limit,
            filter: {
              sellerId: filter.sellerId || "",
              status: filter.status || "",
              search: filter.search || ""
            }
          },
        },
      }),

      transformResponse: (response) =>
        response?.data?.FilterSales ?? {
          data: [],
          total: 0,
          page: 1,
          limit: 0,
          totalPages: 0,
        },

      providesTags: ['Sales'],
    }),


    // GET ADMIN SALES DASHBOARD (analytics: KPIs + charts)
    getAdminSalesDashboard: build.query({
      query: (filter = {}) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query AdminSalesDashboard($filter: AdminSalesDashboardFilterInput) {
              AdminSalesDashboard(filter: $filter) {
                totalRevenue
                netProfit
                totalOrders
                pendingOrders
                deliveredOrders
                cancelledOrders
                returnedOrders
                paidAmount
                balanceAmount
                codPending
                averageOrderValue
                deliveryRate
                returnRate
                cancellationRate
                topSellers { seller sellerName revenue orders profit }
                topProjects { project projectName revenue orders profit }
                topProducts { product productName sku quantity revenue profit }
                salesTrend { date revenue orders }
                statusBreakdown { status orders revenue }
              }
            }
          `,
          variables: { filter },
        },
      }),
      transformResponse: (response) => response?.data?.AdminSalesDashboard || null,
      providesTags: ['Sales'],
    }),

    // GET SALE BY ID
    getSaleById: build.query({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetSaleById($id: ID!) {
              GetSaleById(id: $id) {
                _id
                invoiceNo
                status
                seller
                warehouse
                project
                customerName
                customerPhone
                country
                city
                address
                subTotal
                taxAmount
                totalAmount
                courier {
                  courierName
                  trackingNo
                  trackingUrl
                }
                shippedAt
                createdAt
                items {
                  product
                  productName
                  variant
                  variantName
                  sku
                  quantity
                  salePrice
                  lineTotal
                }
                payment {
                  status
                  mode
                  bankAccount
                  paidAmount
                  balanceAmount
                  paidAt
                }
                statusHistory {
                  status
                  at
                  note
                }
              }
            }
          `,
          variables: {
            id,
          },
        },
      }),
      transformResponse: (response) => response?.data?.GetSaleById || null,
      providesTags: (result, error, id) => [{ type: 'Sales', id }],
    }),

    // CREATE SALE
    createSale: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation CreateSale($data: CreateSaleInput!) {
              CreateSale(data: $data) {
                _id
                invoiceNo
                seller
                warehouse
                status
                subTotal
                taxAmount
                totalAmount
                courier {
                  courierName
                  trackingNo
                  trackingUrl
                }
                deliveryNotes
                createdAt
              }
            }
          `,
          variables: {
            data,
          },
        },
      }),
      invalidatesTags: ['Sales'],
    }),

    // UPDATE SALE
    updateSale: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation UpdateSale($id: ID!, $data: UpdateSaleInput!) {
              UpdateSale(id: $id, data: $data) {
                _id
                invoiceNo
                status
                status
                totalAmount
                courier {
                  courierName
                  trackingNo
                  trackingUrl
                }
                deliveryNotes
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
        'Sales',
        { type: 'Sales', id },
      ],
    }),

    // CONFIRM SALE
    confirmSale: build.mutation({
      query: (saleId) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation ConfirmSale($saleId: ID!) {
              ConfirmSale(saleId: $saleId) {
                _id
                status
                statusTimestamps {
                  confirmedAt
                }
              }
            }
          `,
          variables: {
            saleId,
          },
        },
      }),
      invalidatesTags: (result, error, saleId) => [
        'Sales',
        { type: 'Sales', id: saleId },
      ],
    }),

    // MARK OUT FOR DELIVERY
    markOutForDelivery: build.mutation({
      query: ({ saleId, data }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation MarkOutForDelivery($saleId: ID!, $data: OutForDeliveryInput!) {
              MarkOutForDelivery(saleId: $saleId, data: $data) {
                _id
                status
                courier {
                  courierId
                  courierName
                  trackingNo
                  trackingUrl
                  charges {
                    baseCharge
                    codCharge
                    returnCharge
                  }
                }
                statusTimestamps {
                  outForDeliveryAt
                }
              }
            }
          `,
          variables: {
            saleId,
            data,
          },
        },
      }),
      invalidatesTags: (result, error, { saleId }) => [
        'Sales',
        { type: 'Sales', id: saleId },
      ],
    }),

    // MARK DELIVERED
    markDelivered: build.mutation({
      query: (saleId) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation MarkDelivered($saleId: ID!) {
              MarkDelivered(saleId: $saleId) {
                _id
                status
                statusTimestamps {
                  deliveredAt
                }
              }
            }
          `,
          variables: {
            saleId,
          },
        },
      }),
      invalidatesTags: (result, error, saleId) => [
        'Sales',
        { type: 'Sales', id: saleId },
      ],
    }),

    // RETURN SALE
    returnSale: build.mutation({
      query: (saleId) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation ReturnSale($saleId: ID!) {
              ReturnSale(saleId: $saleId) {
                _id
                status
                statusTimestamps {
                  returnedAt
                }
              }
            }
          `,
          variables: {
            saleId,
          },
        },
      }),
      invalidatesTags: (result, error, saleId) => [
        'Sales',
        { type: 'Sales', id: saleId },
      ],
    }),

    // MARK SALE PAID
    markSalePaid: build.mutation({
      query: ({ saleId, payment }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation MarkSalePaid($saleId: ID!, $payment: PaymentInput!) {
              MarkSalePaid(saleId: $saleId, payment: $payment) {
                _id
                invoiceNo
                status
                totalAmount
                payment {
                  status
                  mode
                  bankAccount
                  paidAmount
                  balanceAmount
                  paidAt
                }
              }
            }
          `,
          variables: {
            saleId,
            payment,
          },
        },
      }),
      invalidatesTags: (result, error, { saleId }) => [
        'Sales',
        { type: 'Sales', id: saleId },
      ],
    }),

    // CANCEL SALE
    cancelSale: build.mutation({
      query: (saleId) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation CancelSale($saleId: ID!) {
              CancelSale(saleId: $saleId)
            }
          `,
          variables: {
            saleId,
          },
        },
      }),
      invalidatesTags: (result, error, saleId) => [
        'Sales',
        { type: 'Sales', id: saleId },
      ],
    }),
  }),
})

export const {
  useGetSalesQuery,
  useGetAdminSalesDashboardQuery,
  useGetSaleByIdQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useConfirmSaleMutation,
  useMarkOutForDeliveryMutation,
  useMarkDeliveredMutation,
  useReturnSaleMutation,
  useCancelSaleMutation,
  useMarkSalePaidMutation,
} = salesAPI
