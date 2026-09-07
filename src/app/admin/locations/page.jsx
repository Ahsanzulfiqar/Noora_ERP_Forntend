import { useEffect, useState } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import PageTItle from '@/components/PageTItle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import {
  useCreateCityMutation,
  useCreateCountryMutation,
  useDeleteCityMutation,
  useDeleteCountryMutation,
  useGetCitiesQuery,
  useGetCountriesQuery,
  useSeedDefaultLocationsMutation,
  useUpdateCityMutation,
  useUpdateCountryMutation,
} from '@/services/authenticateendpoint/locations'

const EMPTY_COUNTRY = {
  name: '',
  code: '',
  iso2: '',
  phoneCode: '',
  currency: '',
  isActive: true,
}

const EMPTY_CITY = { countryId: '', name: '', isActive: true }

const LocationsPage = () => {
  const [activeTab, setActiveTab] = useState('countries')
  const [selectedCountryId, setSelectedCountryId] = useState('')
  const [countryModal, setCountryModal] = useState(false)
  const [cityModal, setCityModal] = useState(false)
  const [editingCountryId, setEditingCountryId] = useState(null)
  const [editingCityId, setEditingCityId] = useState(null)
  const [countryForm, setCountryForm] = useState(EMPTY_COUNTRY)
  const [cityForm, setCityForm] = useState(EMPTY_CITY)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: countries = [], isLoading: countriesLoading, error: countriesError } = useGetCountriesQuery()
  const {
    data: cities = [],
    isLoading: citiesLoading,
    error: citiesError,
  } = useGetCitiesQuery({ countryId: selectedCountryId }, { skip: !selectedCountryId })

  const [seedLocations, { isLoading: isSeeding }] = useSeedDefaultLocationsMutation()
  const [createCountry, { isLoading: isCreatingCountry }] = useCreateCountryMutation()
  const [updateCountry, { isLoading: isUpdatingCountry }] = useUpdateCountryMutation()
  const [deleteCountry, { isLoading: isDeletingCountry }] = useDeleteCountryMutation()
  const [createCity, { isLoading: isCreatingCity }] = useCreateCityMutation()
  const [updateCity, { isLoading: isUpdatingCity }] = useUpdateCityMutation()
  const [deleteCity, { isLoading: isDeletingCity }] = useDeleteCityMutation()

  useEffect(() => {
    if (countriesError) toast.error(extractApiErrorMessage(countriesError))
  }, [countriesError])

  useEffect(() => {
    if (citiesError) toast.error(extractApiErrorMessage(citiesError))
  }, [citiesError])

  useEffect(() => {
    if (!countries.length) {
      setSelectedCountryId('')
      return
    }
    if (!countries.some((country) => country._id === selectedCountryId)) {
      setSelectedCountryId(countries[0]._id)
    }
  }, [countries, selectedCountryId])

  const showError = (error) => toast.error(extractApiErrorMessage(error))

  const handleSeed = async () => {
    try {
      const message = await seedLocations().unwrap()
      toast.success(typeof message === 'string' ? message : 'Default locations seeded successfully')
    } catch (error) {
      showError(error)
    }
  }

  const openCountryModal = (country) => {
    setEditingCountryId(country?._id || null)
    setCountryForm(
      country
        ? {
            name: country.name || '',
            code: country.code || '',
            iso2: country.iso2 || '',
            phoneCode: country.phoneCode || '',
            currency: country.currency || '',
            isActive: country.isActive ?? true,
          }
        : EMPTY_COUNTRY,
    )
    setCountryModal(true)
  }

  const openCityModal = (city) => {
    setEditingCityId(city?._id || null)
    setCityForm({
      countryId: city?.country?._id || selectedCountryId,
      name: city?.name || '',
      isActive: city?.isActive ?? true,
    })
    setCityModal(true)
  }

  const handleCountrySubmit = async (event) => {
    event.preventDefault()
    const data = {
      name: countryForm.name.trim(),
      code: countryForm.code.trim().toUpperCase(),
      iso2: countryForm.iso2.trim().toUpperCase(),
      phoneCode: countryForm.phoneCode.trim(),
      currency: countryForm.currency.trim().toUpperCase(),
    }

    if (Object.values(data).some((value) => !value)) {
      toast.error('Complete all country fields')
      return
    }

    try {
      if (editingCountryId) {
        await updateCountry({ id: editingCountryId, data: { ...data, isActive: countryForm.isActive } }).unwrap()
        toast.success('Country updated successfully')
      } else {
        await createCountry(data).unwrap()
        toast.success('Country created successfully')
      }
      setCountryModal(false)
    } catch (error) {
      showError(error)
    }
  }

  const handleCitySubmit = async (event) => {
    event.preventDefault()
    const name = cityForm.name.trim()
    if (!cityForm.countryId || !name) {
      toast.error('Select a country and enter the city name')
      return
    }

    try {
      if (editingCityId) {
        await updateCity({ id: editingCityId, data: { name, isActive: cityForm.isActive } }).unwrap()
        toast.success('City updated successfully')
      } else {
        await createCity({ countryId: cityForm.countryId, name }).unwrap()
        setSelectedCountryId(cityForm.countryId)
        toast.success('City created successfully')
      }
      setCityModal(false)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      if (deleteTarget.type === 'country') {
        await deleteCountry(deleteTarget.item._id).unwrap()
        toast.success('Country deleted successfully')
      } else {
        await deleteCity(deleteTarget.item._id).unwrap()
        toast.success('City deleted successfully')
      }
      setDeleteTarget(null)
    } catch (error) {
      showError(error)
    }
  }

  const isSavingCountry = isCreatingCountry || isUpdatingCountry
  const isSavingCity = isCreatingCity || isUpdatingCity
  const isDeleting = isDeletingCountry || isDeletingCity

  return (
    <>
      <PageTItle title="Locations" />
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <CardTitle as="h4" className="mb-0">
              Location Management
            </CardTitle>
            <Button size="sm" variant="outline-primary" onClick={handleSeed} disabled={isSeeding}>
              {isSeeding ? <Spinner size="sm" className="me-1" /> : <IconifyIcon icon="solar:database-bold-duotone" className="me-1" />}
              Seed Default Locations
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="d-flex gap-2 border-bottom mb-4">
            {['countries', 'cities'].map((tab) => (
              <Button
                key={tab}
                variant="link"
                className={`text-capitalize text-decoration-none rounded-0 px-3 ${activeTab === tab ? 'border-bottom border-primary border-2 text-primary fw-semibold' : 'text-muted'}`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </Button>
            ))}
          </div>

          {activeTab === 'countries' ? (
            <>
              <div className="d-flex justify-content-end mb-3">
                <Button size="sm" onClick={() => openCountryModal()}>
                  <IconifyIcon icon="solar:add-circle-bold" className="me-1" /> Add Country
                </Button>
              </div>
              <div className="table-responsive">
                <table className="table align-middle table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Name</th>
                      <th>Code</th>
                      <th>ISO2</th>
                      <th>Phone Code</th>
                      <th>Currency</th>
                      <th>Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((country) => (
                      <tr key={country._id}>
                        <td className="fw-medium">{country.name}</td>
                        <td>{country.code}</td>
                        <td>{country.iso2}</td>
                        <td>{country.phoneCode}</td>
                        <td>{country.currency}</td>
                        <td>
                          <Badge bg={country.isActive ? 'success' : 'secondary'}>{country.isActive ? 'Active' : 'Inactive'}</Badge>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button size="sm" variant="soft-primary" onClick={() => openCountryModal(country)} aria-label={`Edit ${country.name}`}>
                              <IconifyIcon icon="solar:pen-2-broken" className="fs-18" />
                            </Button>
                            <Button
                              size="sm"
                              variant="soft-danger"
                              onClick={() => setDeleteTarget({ type: 'country', item: country })}
                              aria-label={`Delete ${country.name}`}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!countriesLoading && !countries.length && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">
                          No countries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {countriesLoading && (
                <div className="text-center py-4">
                  <Spinner size="sm" />
                </div>
              )}
            </>
          ) : (
            <>
              <Row className="align-items-end mb-3 g-3">
                <Col md={5} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Country</Form.Label>
                    <Form.Select value={selectedCountryId} onChange={(event) => setSelectedCountryId(event.target.value)}>
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country._id} value={country._id}>
                          {country.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="d-flex justify-content-md-end">
                  <Button size="sm" onClick={() => openCityModal()} disabled={!selectedCountryId}>
                    <IconifyIcon icon="solar:add-circle-bold" className="me-1" /> Add City
                  </Button>
                </Col>
              </Row>
              <div className="table-responsive">
                <table className="table align-middle table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>City</th>
                      <th>Country</th>
                      <th>Country Code</th>
                      <th>Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((city) => (
                      <tr key={city._id}>
                        <td className="fw-medium">{city.name}</td>
                        <td>{city.country?.name}</td>
                        <td>{city.country?.code}</td>
                        <td>
                          <Badge bg={city.isActive ? 'success' : 'secondary'}>{city.isActive ? 'Active' : 'Inactive'}</Badge>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button size="sm" variant="soft-primary" onClick={() => openCityModal(city)} aria-label={`Edit ${city.name}`}>
                              <IconifyIcon icon="solar:pen-2-broken" className="fs-18" />
                            </Button>
                            <Button
                              size="sm"
                              variant="soft-danger"
                              onClick={() => setDeleteTarget({ type: 'city', item: city })}
                              aria-label={`Delete ${city.name}`}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!citiesLoading && selectedCountryId && !cities.length && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          No cities found
                        </td>
                      </tr>
                    )}
                    {!selectedCountryId && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          Select a country to view its cities
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {citiesLoading && (
                <div className="text-center py-4">
                  <Spinner size="sm" />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <Modal show={countryModal} onHide={() => setCountryModal(false)} centered>
        <Form onSubmit={handleCountrySubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCountryId ? 'Edit Country' : 'Add Country'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              {[
                ['name', 'Name', 'Turkey'],
                ['code', 'Country Code', 'TUR'],
                ['iso2', 'ISO2', 'TR'],
                ['phoneCode', 'Phone Code', '+90'],
                ['currency', 'Currency', 'TRY'],
              ].map(([key, label, placeholder]) => (
                <Col md={key === 'name' ? 12 : 6} key={key}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">{label}</Form.Label>
                    <Form.Control
                      value={countryForm[key]}
                      placeholder={placeholder}
                      onChange={(event) => setCountryForm((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </Form.Group>
                </Col>
              ))}
              {editingCountryId && (
                <Col xs={12}>
                  <Form.Check
                    type="switch"
                    label="Active"
                    checked={countryForm.isActive}
                    onChange={(event) => setCountryForm((current) => ({ ...current, isActive: event.target.checked }))}
                  />
                </Col>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCountryModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSavingCountry}>
              {isSavingCountry ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={cityModal} onHide={() => setCityModal(false)} centered>
        <Form onSubmit={handleCitySubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCityId ? 'Edit City' : 'Add City'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!editingCityId && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Country</Form.Label>
                <Form.Select
                  value={cityForm.countryId}
                  onChange={(event) => setCityForm((current) => ({ ...current, countryId: event.target.value }))}>
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label className="fw-semibold">City Name</Form.Label>
              <Form.Control
                value={cityForm.name}
                placeholder="Istanbul"
                onChange={(event) => setCityForm((current) => ({ ...current, name: event.target.value }))}
              />
            </Form.Group>
            {editingCityId && (
              <Form.Check
                className="mt-3"
                type="switch"
                label="Active"
                checked={cityForm.isActive}
                onChange={(event) => setCityForm((current) => ({ ...current, isActive: event.target.checked }))}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCityModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSavingCity}>
              {isSavingCity ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={Boolean(deleteTarget)} onHide={() => setDeleteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{deleteTarget?.item?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default LocationsPage
