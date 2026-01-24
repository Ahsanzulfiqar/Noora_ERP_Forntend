import { api } from '../api'

export const authAPI = api.injectEndpoints({
    endpoints: (build) => ({

        // LOGIN
        login: build.mutation({
            query: (data) => ({
                method: 'POST',
                body: {
                    query: `
            mutation Login($data: LoginInput!) {
              Login(data: $data) {
                token
                user {
                  _id
                  name
                  email
                  role
                }
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
                return response?.data?.Login;
            },
        }),

    }),
})

export const {
    useLoginMutation,
} = authAPI
