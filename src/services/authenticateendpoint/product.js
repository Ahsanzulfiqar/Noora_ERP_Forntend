import { api } from '../authapi'

export const productsAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // GET ALL PRODUCTS
    getAllProducts: build.query({
      query: () => ({
        method: 'POST',
        body: {
          query: `
            {
              GetAllProducts {
                _id
                name
                brand
                sku
                category
                subCategory
                purchasePrice
                salePrice
                isActive
                attributes {
                  name
                  value
                }
                images {
                  url
                  alt
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response) => response?.data?.GetAllProducts || [],
      providesTags: ['Products'],
    }),

    // GET PRODUCT BY ID
    getProductById: build.query({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            query GetProductById($_id: ID!) {
              GetProductById(_id: $_id) {
                _id
                name
                brand
                sku
                barcode
                description
                category
                subCategory
                purchasePrice
                salePrice
                isActive
                attributes {
                  name
                  value
                }
                images {
                  url
                  alt
                }
                categoryInfo {
                  _id
                  name
                }
                subCategoryInfo {
                  _id
                  name
                }
              }
            }
          `,
          variables: {
            _id: id,
          },
        },
      }),
      transformResponse: (response) => response?.data?.GetProductById || null,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),

    // CREATE PRODUCT
    createProduct: build.mutation({
      query: (data) => ({
        method: 'POST',
        body: {
          query: `
        mutation CreateProduct($data: CreateProductInput!) {
          CreateProduct(data: $data) {
            _id
            name
            brand
            sku
            barcode
            description
            category
            subCategory
            purchasePrice
            salePrice
            isActive
            attributes {
              name
              value
            }
            images {
              url
              alt
            }
            createdAt
            updatedAt
          }
        }
      `,
          variables: {
            data,
          },
        },
      }),
      invalidatesTags: ['Products'],
    }),

    // UPDATE PRODUCT
    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        body: {
          query: `
            mutation UpdateProduct($_id: ID!, $data: UpdateProductInput!) {
              UpdateProduct(_id: $_id, data: $data) {
                _id
                name
                brand
                sku
                barcode
                description
                category
                subCategory
                purchasePrice
                salePrice
                isActive
                attributes {
                  name
                  value
                }
                images {
                  url
                  alt
                }
              }
            }
          `,
          variables: {
            _id: id,
            data,
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Products',
        { type: 'Products', id },
      ],
    }),


    // UPDATE PRODUCT VARIANT
    updateProductVariant: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        body: {
          query: `
            mutation UpdateProductVariant($_id: ID!, $data: UpdateProductVariantInput!) {
              UpdateProductVariant(_id: $_id, data: $data) {
                _id
                product
                name
                sku
                barcode
                purchasePrice
                salePrice
                attributes {
                  name
                  value
                }
                packSize
                netWeight
                isActive
                images {
                  url
                  alt
                }
              }
            }
          `,
          variables: {
            _id: id,
            data,
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Products',
        { type: 'Products', id },
      ],
    }),
    // DELETE PRODUCT
    deleteProduct: build.mutation({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
        mutation DeleteProduct($_id: ID!) {
          DeleteProduct(_id: $_id)
        }
      `,
          variables: {
            _id: id,
          },
        },
      }),
      invalidatesTags: (result, error, id) => [
        'Products',
        { type: 'Products', id },
      ],
    }),

  }),
})

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsAPI
