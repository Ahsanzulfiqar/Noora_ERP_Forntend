import { api } from '../authapi'

export const couriersAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // GET ALL COURIERS
    getAllCouriers: build.query({
      query: () => ({
        method: 'POST',
        body: {
          query: `
            query {
              GetAllCouriers {
                _id
                name
                isActive
                charges {
                  baseCharge
                  codCharge
                  returnCharge
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response) => response?.data?.GetAllCouriers || [],
      providesTags: ['Courier'],
    }),

    // GET COURIER BY ID
    getCourierById: build.query({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            query GetCourierById($id: ID!) {
              GetCourierById(_id: $id) {
                _id
                name
                isActive
                charges {
                  baseCharge
                  codCharge
                  returnCharge
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response) => response?.data?.GetCourierById,
      providesTags: (result, error, id) => [{ type: 'Courier', id }],
    }),

    // CREATE COURIER
    createCourier: build.mutation({
      query: (data) => ({
        method: 'POST',
        body: {
          query: `
            mutation CreateCourier($data: CreateCourierInput!) {
              CreateCourier(data: $data) {
                _id
                name
                isActive
                charges {
                  baseCharge
                  codCharge
                  returnCharge
                }
                createdAt
              }
            }
          `,
          variables: { data },
        },
      }),
      invalidatesTags: ['Courier'],
    }),

    // UPDATE COURIER
    updateCourier: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        body: {
          query: `
            mutation UpdateCourier($id: ID!, $data: UpdateCourierInput!) {
              UpdateCourier(_id: $id, data: $data) {
                _id
                name
                isActive
                charges {
                  baseCharge
                  codCharge
                  returnCharge
                }
                updatedAt
              }
            }
          `,
          variables: { id, data },
        },
      }),
      invalidatesTags: (result, error, { id }) => ['Courier', { type: 'Courier', id }],
    }),

    // DELETE COURIER
    deleteCourier: build.mutation({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            mutation DeleteCourier($id: ID!) {
              DeleteCourier(_id: $id)
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ['Courier'],
    }),
  }),
})

export const {
  useGetAllCouriersQuery,
  useGetCourierByIdQuery,
  useCreateCourierMutation,
  useUpdateCourierMutation,
  useDeleteCourierMutation,
} = couriersAPI
