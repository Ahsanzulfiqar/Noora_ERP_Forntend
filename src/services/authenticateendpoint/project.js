import { api } from '../authapi'

export const projectsAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // GET ALL PROJECTS
    getAllProjects: build.query({
      query: () => ({
        method: 'POST',
        body: {
          query: `
            query {
              GetAllProjects {
                _id
                name
                channel
                warehouses
                sellers
                isActive
                createdAt
              }
            }
          `,
        },
      }),
      transformResponse: (response) => response?.data?.GetAllProjects || [],
      providesTags: ['Project'],
    }),

    // GET PROJECT BY ID
    getProjectById: build.query({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            query GetProjectById($id: ID!) {
              GetProjectById(_id: $id) {
                _id
                name
                channel
                warehouses
                sellers
                isActive
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response) => response?.data?.GetProjectById,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    // CREATE PROJECT
    createProject: build.mutation({
      query: (data) => ({
        method: 'POST',
        body: {
          query: `
            mutation CreateProject($data: CreateProjectInput!) {
              CreateProject(data: $data) {
                _id
                name
                channel
                warehouses
                sellers
                isActive
              }
            }
          `,
          variables: { data },
        },
      }),
      invalidatesTags: ['Project'],
    }),

    // UPDATE PROJECT
    updateProject: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        body: {
          query: `
            mutation UpdateProject($id: ID!, $data: UpdateProjectInput!) {
              UpdateProject(_id: $id, data: $data) {
                _id
                name
                channel
                warehouses
                sellers
                isActive
              }
            }
          `,
          variables: { id, data },
        },
      }),
      invalidatesTags: (result, error, { id }) => ['Project', { type: 'Project', id }],
    }),

    // DELETE PROJECT
    deleteProject: build.mutation({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            mutation DeleteProject($id: ID!) {
              DeleteProject(_id: $id)
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ['Project'],
    }),
  }),
})

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsAPI
