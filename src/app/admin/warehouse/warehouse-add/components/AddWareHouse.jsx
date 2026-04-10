import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import FormikTextField from '@/components/formikfield/FormikTextField'
import { useCreateWarehouseMutation, useGetAllWarehousesQuery, useGetWarehouseByIdQuery, useUpdateWarehouseMutation } from '../../../../../services/authenticateendpoint/warehouse'
import Button from '@mui/material/Button'
import StatusAlert from '../../../../../components/StatusAlert'
import countryList from 'react-select-country-list'
import FormikToggleSwitch from '../../../../../components/formikfield/FormikToggleSwitch'
import ChoicesSearchFormInput from '../../../../../components/formikfield/ChoicesSearchFormInput'

const AddWareHouse = () => {
  const [createWarehouse, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] = useCreateWarehouseMutation()
  const [updateWarehouse, { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess }] = useUpdateWarehouseMutation()

  const countries = countryList().getData()
  const { warehouseId } = useParams();

  const { data } = useGetWarehouseByIdQuery(warehouseId, { skip: !warehouseId })
  const { data: allWarehouses } = useGetAllWarehousesQuery()
  const warehouseOptions = allWarehouses
    ?.filter((w) => w._id !== warehouseId)
    ?.map((w) => ({
      value: w._id,
      label: w.name,
    })) || []
  return (
    <Col xl={12} lg={12}>
      <StatusAlert
        isSuccess={createSuccess || updateSuccess}
        error={createError || updateError}
        message={warehouseId ? "Warehouse updated successfully" : "Warehouse created successfully"}
        path="/warehouses/warehouse-list"
        redirect={true}
      />
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>{warehouseId ? 'Edit' : 'Add'} WareHouse Information</CardTitle>
        </CardHeader>

        <CardBody>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: data?.name || '',
              country: data?.country || '',
              city: data?.city || '',
              ismain: data?.ismain ?? true,
              mainId: data?.mainId && data.mainId !== 'null' ? data.mainId : '',
              contact: data?.contact || '',
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              country: Yup.string().required('Required'),
              city: Yup.string().required('Required'),
              ismain: Yup.boolean().required(),
              mainId: Yup.string().nullable(),
              contact: Yup.string().required('Required'),
            })}


            onSubmit={async (values, { resetForm }) => {
              try {
                const payload = {
                  ...values,
                  mainId: values.ismain
                    ? "null"
                    : values.mainId
                      ? String(values.mainId)
                      : "null",
                }

                if (warehouseId) {
                  await updateWarehouse({ id: warehouseId, data: payload }).unwrap()
                  console.log('Warehouse updated')
                } else {
                  await createWarehouse(payload).unwrap()
                  resetForm()
                  console.log('Warehouse created')
                }
              } catch (err) {
                console.error('Operation failed:', err)
              }
            }}
          >
            {({ values, setFieldValue }) => {
              const handleMainWarehouseSelect = (selectedId) => {
                setFieldValue('mainId', selectedId)
                const selectedWarehouse = allWarehouses?.find(w => w._id === selectedId)
                if (selectedWarehouse) {
                  setFieldValue('name', selectedWarehouse.name || '')
                  setFieldValue('country', selectedWarehouse.country || '')
                  setFieldValue('city', selectedWarehouse.city || '')
                  setFieldValue('contact', selectedWarehouse.contact || '')
                }
              }
        const handleToggleChange = (newValue) => {
                setFieldValue('ismain', newValue)
                if (!newValue) {
                  const firstOption = warehouseOptions[0]
                  if (firstOption) {
                    const firstWarehouse = allWarehouses?.find(w => w._id === firstOption.value)
                    if (firstWarehouse) {
                      setFieldValue('mainId', firstWarehouse._id)
                      setFieldValue('name', firstWarehouse.name || '')
                      setFieldValue('country', firstWarehouse.country || '')
                      setFieldValue('city', firstWarehouse.city || '')
                      setFieldValue('contact', firstWarehouse.contact || '')
                    }
                  }
                } else {
                  setFieldValue('mainId', '')
                  setFieldValue('name', '')
                  setFieldValue('country', '')
                  setFieldValue('city', '')
                  setFieldValue('contact', '')
                }
              }

              return (
                <Form>
                  <Row>
                    <Col lg={12}>
                      <FormikToggleSwitch
                        name="ismain"
                        label="Is WareHouse Main"
                        inline
                        onChange={handleToggleChange}
                      />
                    </Col>

                    {!values.ismain && (
                      <Col lg={6}>
                        <Field name="mainId">
                          {({ field }) => (
                            <ChoicesSearchFormInput
                              label="Main Warehouse"
                              labelClassName="form-label fw-bold"
                              className="form-control"
                              id="mainId"
                              {...field}
                              value={values.mainId || ''}
                              options={warehouseOptions}
                              onChange={handleMainWarehouseSelect}
                              placeholder="Select Main Warehouse"
                            />
                          )}
                        </Field>
                      </Col>
                    )}

                    <Col lg={6}>
                      <FormikTextField name="name" label="Name" placeholder="Enter WareHouse Name" />
                    </Col>

                    <Col lg={6}>
                      <Field name="country">
                        {({ field, form }) => (
                          <ChoicesSearchFormInput
                            label="Country"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="country"
                            {...field}
                            options={countries}
                            onChange={(val) => form.setFieldValue('country', val)}
                            placeholder="Select Country"
                          />
                        )}
                      </Field>
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="city" label="City" placeholder="Enter City Name" />
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="contact" label="Contact" placeholder="Enter Contact" />
                    </Col>
                  </Row>

                  <div className="p-3 bg-light mt-4 rounded">
                    <Row className="justify-content-end g-2">
                      <Col lg={2}>
                        <Link to="/warehouses/warehouse-list" className="btn btn-primary w-100">
                          Cancel
                        </Link>
                      </Col>
                      <Col lg={2}>
                        <Button
                          type="submit"
                          className="btn btn-outline-secondary w-100"
                          disabled={isCreating || isUpdating}
                        >
                          {isCreating || isUpdating ? 'Saving...' : 'Save'}
                        </Button>

                      </Col>


                    </Row>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </CardBody>
      </Card>
    </Col >
  )
}

export default AddWareHouse
