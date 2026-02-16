import { api } from '../authapi'

export const userManagementAPI = api.injectEndpoints({
    endpoints: (build) => ({

        // CREATE USER
        createUser: build.mutation({
            query: (data) => ({
                method: 'POST',
                body: {
                    query: `
            mutation CreateUser($data: CreateUserInput!) {
              CreateUser(data: $data) {
                _id
                name
                email
                role
                assignedProjects
                assignedWarehouses
                isActive
              }
            }
          `,
                    variables: { data },
                },
            }),
            transformResponse: (response) => {
                if (response?.errors) {
                    throw response.errors[0];
                }
                return response?.data?.CreateUser;
            },
            invalidatesTags: ['User'],
        }),

        // UPDATE USER
        updateUser: build.mutation({
            query: ({ id, data }) => ({
                method: 'POST',
                body: {
                    query: `
            mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
              UpdateUser(_id: $id, data: $data) {
                _id
                name
                email
                role
                isActive
                phone
                assignedProjects
                assignedWarehouses
              }
            }
          `,
                    variables: { id, data },
                },
            }),
            transformResponse: (response) => {
                if (response?.errors) {
                    throw response.errors[0];
                }
                return response?.data?.UpdateUser;
            },
            invalidatesTags: ['User'],
        }),

        // DEACTIVATE USER
        deactivateUser: build.mutation({
            query: (id) => ({
                method: 'POST',
                body: {
                    query: `
            mutation DeactivateUser($id: ID!) {
              DeactivateUser(_id: $id)
            }
          `,
                    variables: { id },
                },
            }),
            transformResponse: (response) => {
                if (response?.errors) {
                    throw response.errors[0];
                }
                return response?.data?.DeactivateUser;
            },
            invalidatesTags: ['User'],
        }),

        // ACTIVATE USER
        activateUser: build.mutation({
            query: (id) => ({
                method: 'POST',
                body: {
                    query: `
            mutation ActivateUser($id: ID!) {
              ActivateUser(_id: $id)
            }
          `,
                    variables: { id },
                },
            }),
            transformResponse: (response) => {
                if (response?.errors) {
                    throw response.errors[0];
                }
                return response?.data?.ActivateUser;
            },
            invalidatesTags: ['User'],
        }),

        // GET ALL USERS
        getAllUsers: build.query({
            query: () => ({
                method: 'POST',
                auth: true,
                body: {
                    query: `
            query {
              GetAllUsers {
                _id
                name
                email
                role
                isActive
                assignedProjects
                assignedWarehouses
                createdAt
              }
            }
          `,
                },
            }),
            transformResponse: (response) => {
                if (response?.errors) {
                    throw response.errors[0];
                }
                return response?.data?.GetAllUsers;
            },
            providesTags: ['User'],
        }),

        // GET USER BY ID
        getUserById: build.query({
            query: (id) => ({
                method: 'POST',
                body: {
                    query: `
            query GetUserById($id: ID!) {
              GetUserById(_id: $id) {
                _id
                name
                email
                role
                isActive
                assignedProjects
                assignedWarehouses
                assignedWarehouseDetails {
                  _id
                  name
                }
                assignedProjectDetails {
                  _id
                  name
                }
              }
            }
          `,
                    variables: { id },
                },
            }),
            transformResponse: (response) => {
                if (response?.errors) {
                    throw response.errors[0];
                }
                return response?.data?.GetUserById;
            },
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

    }),
})

export const {
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeactivateUserMutation,
    useActivateUserMutation,
    useGetAllUsersQuery,
    useGetUserByIdQuery,
} = userManagementAPI
