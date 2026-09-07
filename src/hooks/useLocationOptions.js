import { useMemo } from 'react'
import { useGetCitiesQuery, useGetCountriesQuery } from '@/services/authenticateendpoint/locations'

const useLocationOptions = (countryName = '') => {
  const countriesQuery = useGetCountriesQuery(true)

  const selectedCountry = useMemo(
    () => (countriesQuery.data || []).find((country) => country.name === countryName),
    [countriesQuery.data, countryName],
  )

  const citiesQuery = useGetCitiesQuery({ countryId: selectedCountry?._id, isActive: true }, { skip: !selectedCountry?._id })

  const countryOptions = useMemo(() => {
    const options = (countriesQuery.data || []).map((country) => ({ value: country.name, label: country.name, phoneCode: country.phoneCode }))
    console.log('countryOptions', options)
    return options
  }, [countriesQuery.data])

  const cityOptions = useMemo(() => (citiesQuery.data || []).map((city) => ({ value: city.name, label: city.name })), [citiesQuery.data])

  return {
    countryOptions,
    cityOptions,
    isLoadingCountries: countriesQuery.isLoading,
    isLoadingCities: citiesQuery.isFetching,
    countriesError: countriesQuery.error,
    citiesError: citiesQuery.error,
  }
}

export default useLocationOptions
