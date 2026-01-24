// React form with Formik
// Reusable Components

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import FormikTextField from '@/components/formikfield/FormikTextField'
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from '../../../../../services/authenticateendpoint/project'
import { useGetAllWarehousesQuery } from '../../../../../services/endpoints/warehouse'
import { useGetAllUsersQuery } from '../../../../../services/authenticateendpoint/users'
import Button from '@mui/material/Button'
import StatusAlert from '../../../../../components/StatusAlert'
import ChoicesSearchFormInput from '../../../../../components/formikfield/ChoicesSearchFormInput'
import FormikToggleSwitch from '../../../../../components/formikfield/FormikToggleSwitch'

const AddEditproject = () => {
  const [createProject, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] = useCreateProjectMutation()
  const [updateProject, { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess }] = useUpdateProjectMutation()

  // Fetch Warehouses
  const { data: warehousesData } = useGetAllWarehousesQuery();
  const warehouseOptions = warehousesData?.map(w => ({ value: w._id, label: w.name })) || [];

  // Fetch Users (Sellers)
  const { data: usersData } = useGetAllUsersQuery();
  const sellerOptions = usersData
    ?.filter(u => u.role === 'SELLER')
    ?.map(u => ({ value: u._id, label: u.name })) || [];

  const { projectId } = useParams();

  const { data } = useGetProjectByIdQuery(projectId, { skip: !projectId })

  return (
    <Col xl={12} lg={12}>
      <StatusAlert
        isSuccess={createSuccess || updateSuccess}
        error={createError || updateError}
        message={projectId ? "Project updated successfully" : "Project created successfully"}
        path="/projects/project-list"
        redirect={true}
      />
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>{projectId ? 'Edit' : 'Add'} Project Information</CardTitle>
        </CardHeader>

        <CardBody>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: data?.name || '',
              channel: data?.channel || '',
              warehouse: data?.warehouses?.[0] || '',
              sellers: data?.sellers?.[0] || '',
              isActive: data?.isActive !== undefined ? data.isActive : true,
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              channel: Yup.string().required('Required'),
              warehouse: Yup.string().required('Required'),
              sellers: Yup.string().required('Required'),
              isActive: Yup.boolean(),
            })}


            onSubmit={async (values, { resetForm }) => {
              try {
                const payload = {
                  ...values,
                  warehouseIds: values.warehouse ? [values.warehouse] : [],
                  sellerIds: values.sellers ? [values.sellers] : [],
                }
                delete payload.warehouse;
                delete payload.sellers;

                if (projectId) {
                  await updateProject({ id: projectId, data: payload }).unwrap()
                  console.log('Project updated')
                } else {
                  await createProject(payload).unwrap()
                  resetForm()
                  console.log('Project created')
                }
              } catch (err) {
                console.error('Operation failed:', err)
              }
            }}

          >

            {({ values, errors, touched, setFieldValue }) => {
              console.log("values", values);
              console.log("errors", errors);
              return (
                <Form>
                  <Row>
                    <Col lg={6}>
                      <FormikTextField name="name" label="Project Name" placeholder="Enter Project Name" />
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="channel" label="Channel" placeholder="Enter Channel" />
                    </Col>

                    <Col lg={6}>
                      <Field name="warehouse">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            {...field}
                            label="Warehouse"
                            options={warehouseOptions}
                            placeholder="Select Warehouse"
                            onChange={(val) => setFieldValue('warehouse', val)}
                            value={values.warehouse}
                          />
                        )}
                      </Field>
                    </Col>

                    <Col lg={6}>
                      <Field name="sellers">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            {...field}
                            label="Seller"
                            options={sellerOptions}
                            placeholder="Select Seller"
                            onChange={(val) => setFieldValue('sellers', val)}
                            value={values.sellers}
                          />
                        )}
                      </Field>
                    </Col>


                    <Col lg={6}>
                      <FormikToggleSwitch
                        name="isActive"
                        label="Active Status"
                      />
                    </Col>

                  </Row>

                  <div className="p-3 bg-light mt-4 rounded">
                    <Row className="justify-content-end g-2">
                      <Col lg={2}>
                        <Link to="/admin/project/project-list" className="btn btn-primary w-100">
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

export default AddEditproject
