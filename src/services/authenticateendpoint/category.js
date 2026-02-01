import { api } from '../authapi'

export const categoryAPI = api.injectEndpoints({
    endpoints: (build) => ({
        // CATEGORY QUERIES

        // FILTER CATEGORIES
        filterCategories: build.query({
            query: ({
        auth: true, filter, page = 1, limit = 20 }) => ({
                method: 'POST',
                body: {
                    query: `
            query FilterCategories($filter: CategoryFilterInput, $page: Int, $limit: Int) {
              FilterCategories(filter: $filter, page: $page, limit: $limit) {
                total
                page
                limit
                totalPages
                data {
                  _id
                  name
                  slug
                  description
                  isActive
                  isDeleted
                  createdAt
                  updatedAt
                }
              }
            }
          `,
                    variables: { filter, page, limit },
                },
            }),
            transformResponse: (response) => response?.data?.FilterCategories || { data: [], total: 0 },
            providesTags: ['Category'],
        }),

        // GET CATEGORY BY ID
        getCategoryById: build.query({
            query: (id) => ({
                method: 'POST',
                body: {
                    query: `
            query GetCategoryById($id: ID!) {
              GetCategoryById(id: $id) {
                _id
                name
                slug
                description
                isActive
                isDeleted
                deletedAt
                createdAt
                updatedAt
              }
            }
          `,
                    variables: { id },
                },
            }),
            transformResponse: (response) => response?.data?.GetCategoryById,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),

        // CATEGORY MUTATIONS

        // CREATE CATEGORY
        createCategory: build.mutation({
            query: (data) => ({
                method: 'POST',
                body: {
                    query: `
            mutation CreateCategory($data: CreateCategoryInput!) {
              CreateCategory(data: $data) {
                _id
                name
                slug
                isActive
                description
              }
            }
          `,
                    variables: { data },
                },
            }),
            invalidatesTags: ['Category'],
        }),

        // UPDATE CATEGORY
        updateCategory: build.mutation({
            query: ({
        auth: true, id, data }) => ({
                method: 'POST',
                body: {
                    query: `
            mutation UpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
              UpdateCategory(id: $id, data: $data) {
                _id
                name
                slug
                description
                isActive
                updatedAt
              }
            }
          `,
                    variables: { id, data },
                },
            }),
            invalidatesTags: (result, error, { id }) => ['Category', { type: 'Category', id }],
        }),

        // DELETE CATEGORY
        deleteCategory: build.mutation({
            query: (id) => ({
                method: 'POST',
                body: {
                    query: `
            mutation DeleteCategory($id: ID!) {
              DeleteCategory(id: $id)
            }
          `,
                    variables: { id },
                },
            }),
            invalidatesTags: ['Category'],
        }),

        // SUB-CATEGORY QUERIES

        // FILTER SUB-CATEGORIES
        filterSubCategories: build.query({
            query: ({
        auth: true, filter, page = 1, limit = 20 }) => ({
                method: 'POST',
                body: {
                    query: `
            query FilterSubCategories($filter: SubCategoryFilterInput, $page: Int, $limit: Int) {
              FilterSubCategories(filter: $filter, page: $page, limit: $limit) {
                total
                page
                limit
                totalPages
                data {
                  _id
                  name
                  slug
                  category
                  categoryName
                  description
                  isActive
                  isDeleted
                  createdAt
                  updatedAt
                }
              }
            }
          `,
                    variables: { filter, page, limit },
                },
            }),
            transformResponse: (response) => response?.data?.FilterSubCategories || { data: [], total: 0 },
            providesTags: ['SubCategory'],
        }),

        // GET SUB-CATEGORY BY ID
        getSubCategoryById: build.query({
            query: (id) => ({
                method: 'POST',
                body: {
                    query: `
            query GetSubCategoryById($id: ID!) {
              GetSubCategoryById(id: $id) {
                _id
                name
                slug
                category
                categoryName
                description
                isActive
                isDeleted
                deletedAt
                createdAt
                updatedAt
              }
            }
          `,
                    variables: { id },
                },
            }),
            transformResponse: (response) => response?.data?.GetSubCategoryById,
            providesTags: (result, error, id) => [{ type: 'SubCategory', id }],
        }),

        // SUB-CATEGORY MUTATIONS

        // CREATE SUB-CATEGORY
        createSubCategory: build.mutation({
            query: (data) => ({
                method: 'POST',
                body: {
                    query: `
            mutation CreateSubCategory($data: CreateSubCategoryInput!) {
              CreateSubCategory(data: $data) {
                _id
                name
                slug
                category
                categoryName
              }
            }
          `,
                    variables: { data },
                },
            }),
            invalidatesTags: ['SubCategory'],
        }),

        // UPDATE SUB-CATEGORY
        updateSubCategory: build.mutation({
            query: ({
        auth: true, id, data }) => ({
                method: 'POST',
                body: {
                    query: `
            mutation UpdateSubCategory($id: ID!, $data: UpdateSubCategoryInput!) {
              UpdateSubCategory(id: $id, data: $data) {
                _id
                name
                slug
                category
                categoryName
                description
                isActive
                updatedAt
              }
            }
          `,
                    variables: { id, data },
                },
            }),
            invalidatesTags: (result, error, { id }) => ['SubCategory', { type: 'SubCategory', id }],
        }),

        // DELETE SUB-CATEGORY
        deleteSubCategory: build.mutation({
            query: (id) => ({
                method: 'POST',
                body: {
                    query: `
            mutation DeleteSubCategory($id: ID!) {
              DeleteSubCategory(id: $id)
            }
          `,
                    variables: { id },
                },
            }),
            invalidatesTags: ['SubCategory'],
        }),
    }),
})

export const {
    useFilterCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFilterSubCategoriesQuery,
    useGetSubCategoryByIdQuery,
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
} = categoryAPI
