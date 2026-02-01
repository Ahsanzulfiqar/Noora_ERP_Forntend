import { api } from '../authapi'

export const variantsAPI = api.injectEndpoints({
  endpoints: (build) => ({

    // CREATE VARIANT
    createVariant: build.mutation({
      query: (data) => ({
        method: 'POST',
        body: {
          query: `
            mutation CreateProductVariant($data: CreateProductVariantInput!) {
              CreateProductVariant(data: $data) {
                _id
                product
                name
                sku
                barcode
                purchasePrice
                salePrice
                attributes { name value }
                packSize
                netWeight
                isActive
                images { url alt }
              }
            }
          `,
          variables: { data },
        },
      }),
      invalidatesTags: ['Variants'],
    }),

    // UPDATE VARIANT
    updateVariant: build.mutation({
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
                attributes { name value }
                packSize
                netWeight
                isActive
                images { url alt }
              }
            }
          `,
          variables: { _id: id, data },
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Variants',
        { type: 'Variants', id },
      ],
    }),

    // GET VARIANTS BY PRODUCT ID
    getVariantsByProduct: build.query({
      query: (productId) => ({
        method: 'POST',
        body: {
          query: `
            query GetVariantsByProduct($productId: ID!) {
              GetVariantsByProduct(productId: $productId) {
                _id
                product
                name
                sku
                barcode
                purchasePrice
                salePrice
                packSize
                netWeight
                isActive
                attributes { name value }
                images { url alt }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { productId },
        },
      }),
      transformResponse: (response) =>
        response?.data?.GetVariantsByProduct || [],
      providesTags: (result, error, productId) =>
        result
          ? [
            ...result.map(({ _id }) => ({ type: 'Variants', id: _id })),
            { type: 'Variants', id: `PRODUCT-${productId}` },
          ]
          : [{ type: 'Variants', id: `PRODUCT-${productId}` }],
    }),

    // GET VARIANT BY VARIANT ID
    getVariantById: build.query({
      query: (id) => ({
        method: 'POST',
        body: {
          query: `
            query GetVariantById($id: ID!) {
              GetVariantById(_id: $id) {
                _id
                product
                name
                sku
                barcode
                purchasePrice
                salePrice
                packSize
                netWeight
                isActive
                attributes { name value }
                images { url alt }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response) =>
        response?.data?.GetVariantById || null,
      providesTags: (result, error, id) => [{ type: 'Variants', id }],
    }),

    // GET ALL VARIANTS
    getAllProductVariants: build.query({
      query: () => ({
        method: 'POST',
        body: {
          query: `
            {
              GetAllProductVariants {
                _id
                product
                name
                sku
                barcode
                purchasePrice
                salePrice
                packSize
                netWeight
                isActive
                attributes { name value }
                images { url alt }
                createdAt
                updatedAt
              }
            }
          `,
        },
      }),
      transformResponse: (response) => response?.data?.GetAllProductVariants || [],
      providesTags: ['Variants'],
    }),

  }),
})

export const {
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useGetVariantsByProductQuery,
  useGetVariantByIdQuery,
  useGetAllProductVariantsQuery,
} = variantsAPI
