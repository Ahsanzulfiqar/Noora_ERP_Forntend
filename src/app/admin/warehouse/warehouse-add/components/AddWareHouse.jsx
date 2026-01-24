// React form with Formik
// Reusable Components

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import FormikTextField from '@/components/formikfield/FormikTextField'
import FormikSelectField from '@/components/formikfield/FormikSelectField'
import { useCreateWarehouseMutation, useGetAllWarehousesQuery, useGetWarehouseByIdQuery, useUpdateWarehouseMutation } from '../../../../../services/endpoints/warehouse'
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
  console.log(data)
  const { data: allWarehouses } = useGetAllWarehousesQuery()
  const warehouseOptions = allWarehouses
    ?.filter((w) => w._id !== warehouseId) // Filter out the current warehouse if editing
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
              mainId: data?.mainId || "null",
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

            {({ values, errors, touched }) => {
              console.log("values", values);
              console.log("errors", errors);
              return (
                <Form>
                  <Row>
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
                      {/* <ChoicesSearchFormInput
                        name="country"
                        label="Country"
                        options={countries} 
                      />*/}

                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="city" label="City" placeholder="Enter City Name" />
                    </Col>


                    <Col lg={6}>
                      <FormikToggleSwitch
                        name="ismain"
                        label="Is WareHouse Main "
                      />

                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="contact" label="Contact" placeholder="Enter Contact" />
                    </Col>
                    {!values.ismain && (
                      <Col lg={6}>
                        <Field name="mainId">
                          {({ field, form }) => (
                            <ChoicesSearchFormInput
                              label="Main Warehouse"
                              labelClassName="form-label fw-bold"
                              className="form-control"
                              id="mainId"
                              {...field}
                              options={warehouseOptions}
                              onChange={(val) => form.setFieldValue('mainId', val)}
                              placeholder="Select Main Warehouse"
                            />
                          )}
                        </Field>
                      </Col>
                    )}

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
