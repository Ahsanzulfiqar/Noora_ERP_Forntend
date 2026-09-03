import { api } from '../authapi'

const countryFields = `
  _id
  name
  code
  iso2
  phoneCode
  currency
  isActive
  createdAt
  updatedAt
`

const cityFields = `
  _id
  name
  isActive
  country {
    _id
    name
    code
    currency
  }
  createdAt
  updatedAt
`

export const locationsAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getCountries: build.query({
      query: (isActive) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetCountries($isActive: Boolean) {
              GetCountries(isActive: $isActive) {
                ${countryFields}
              }
            }
          `,
          variables: { isActive },
        },
      }),
      transformResponse: (response) => response?.data?.GetCountries || [],
      providesTags: (result) => ['Country', ...result.map(({ _id }) => ({ type: 'Country', id: _id }))],
    }),

    getCities: build.query({
      query: ({ countryId, isActive } = {}) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            query GetCities($countryId: ID!, $isActive: Boolean) {
              GetCities(countryId: $countryId, isActive: $isActive) {
                ${cityFields}
              }
            }
          `,
          variables: { countryId, isActive },
        },
      }),
      transformResponse: (response) => response?.data?.GetCities || [],
      providesTags: (result) => ['City', ...result.map(({ _id }) => ({ type: 'City', id: _id }))],
    }),

    seedDefaultLocations: build.mutation({
      query: () => ({
        method: 'POST',
        auth: true,
        body: { query: `mutation SeedDefaultLocations { SeedDefaultLocations }` },
      }),
      transformResponse: (response) => response?.data?.SeedDefaultLocations,
      invalidatesTags: ['Country', 'City'],
    }),

    createCountry: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation CreateCountry($data: CreateCountryInput!) {
              CreateCountry(data: $data) { ${countryFields} }
            }
          `,
          variables: { data },
        },
      }),
      transformResponse: (response) => response?.data?.CreateCountry,
      invalidatesTags: ['Country'],
    }),

    updateCountry: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation UpdateCountry($id: ID!, $data: UpdateCountryInput!) {
              UpdateCountry(id: $id, data: $data) { ${countryFields} }
            }
          `,
          variables: { id, data },
        },
      }),
      transformResponse: (response) => response?.data?.UpdateCountry,
      invalidatesTags: (result, error, { id }) => ['Country', { type: 'Country', id }, 'City'],
    }),

    deleteCountry: build.mutation({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `mutation DeleteCountry($id: ID!) { DeleteCountry(id: $id) }`,
          variables: { id },
        },
      }),
      transformResponse: (response) => response?.data?.DeleteCountry,
      invalidatesTags: ['Country', 'City'],
    }),

    createCity: build.mutation({
      query: (data) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation CreateCity($data: CreateCityInput!) {
              CreateCity(data: $data) { ${cityFields} }
            }
          `,
          variables: { data },
        },
      }),
      transformResponse: (response) => response?.data?.CreateCity,
      invalidatesTags: ['City'],
    }),

    updateCity: build.mutation({
      query: ({ id, data }) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `
            mutation UpdateCity($id: ID!, $data: UpdateCityInput!) {
              UpdateCity(id: $id, data: $data) { ${cityFields} }
            }
          `,
          variables: { id, data },
        },
      }),
      transformResponse: (response) => response?.data?.UpdateCity,
      invalidatesTags: (result, error, { id }) => ['City', { type: 'City', id }],
    }),

    deleteCity: build.mutation({
      query: (id) => ({
        method: 'POST',
        auth: true,
        body: {
          query: `mutation DeleteCity($id: ID!) { DeleteCity(id: $id) }`,
          variables: { id },
        },
      }),
      transformResponse: (response) => response?.data?.DeleteCity,
      invalidatesTags: ['City'],
    }),
  }),
})

export const {
  useGetCountriesQuery,
  useGetCitiesQuery,
  useSeedDefaultLocationsMutation,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = locationsAPI
