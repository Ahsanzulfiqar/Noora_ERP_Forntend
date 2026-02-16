import { api } from '../authapi'

export const warehousesAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // GET ALL WAREHOUSES
    getAllWarehouses: build.query({
      query: () => ({
        method: 'POST',
        body: {
          query: `
            query {
              GetAllWarehouses {
                _id
                name
                contact
                ismain
                mainId
                country
                city
              }
            }
          `,
        },
      }),
      transformResponse: (response) =>
        response?.data?.GetAllWarehouses || [],
      providesTags: ['Warehouses'],
    }),

    // CREATE WAREHOUSE
    createWarehouse: build.mutation({
      query: (data) => ({
        method: 'POST',
        body: {
          query: `
            mutation CreateWarehouse($data: CreateWarehouseInput!) {
              CreateWarehouse(data: $data)
            }
          `,
          variables: {
            data,
          },
        },
      }),
      invalidatesTags: ['Warehouses'],
    }),

    // GET WAREHOUSE BY ID
    getWarehouseById: build.query({
      query: (_id) => ({
        method: 'POST',
        body: {
          query: `
        query GetWarehouseById($_id: ID!) {
          GetWarehouseById(_id: $_id) {
            _id
            name
            contact
            ismain
            mainId
            country
            city
          }
        }
      `,
          variables: {
            _id,
          },
        },
      }),
      transformResponse: (response) =>
        response?.data?.GetWarehouseById || null,
      providesTags: (result, error, _id) => [{ type: 'Warehouses', id: _id }],
    }),


    // UPDATE WAREHOUSE
    // UPDATE WAREHOUSE
    updateWarehouse: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        body: {
          query: `
        mutation UpdateWarehouse($_id: ID!, $data: UpdateWarehouseInput!) {
          UpdateWarehouse(_id: $_id, data: $data)
        }
      `,
          variables: {
            _id: id,   // 👈 map id → _id
            data,
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Warehouses',
        { type: 'Warehouses', id },
      ],
    }),


    // DELETE WAREHOUSE
    // DELETE WAREHOUSE
    deleteWarehouse: build.mutation({
      query: (_id) => ({
        method: 'POST',
        body: {
          query: `
        mutation RemoveWarehouse($_id: ID!) {
          RemoveWarehouse(_id: $_id)
        }
      `,
          variables: { _id },
        },
      }),
      invalidatesTags: ['Warehouses'],
    }),

    // GET WAREHOUSE STOCK
    getWarehouseStock: build.query({
      query: (params) => ({
        method: 'POST',
        body: {
          query: `
            query GetWarehouseStock($filter: WarehouseStockFilterInput, $page: Int, $limit: Int) {
              GetWarehouseStock(filter: $filter, page: $page, limit: $limit) {
                data {
                  _id
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
          variables: {
            filter: params?.filter || {},
            page: params?.page || 1,
            limit: params?.limit || 50,
          },
        },
      }),
      transformResponse: (response) => response?.data?.GetWarehouseStock || { data: [], total: 0 },
      providesTags: ['WarehouseStock'],
    }),

  }),
})

export const {
  useGetAllWarehousesQuery,
  useCreateWarehouseMutation,
  useGetWarehouseByIdQuery,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWarehouseStockQuery,
} = warehousesAPI
