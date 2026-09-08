import { useEffect } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormikTextField from '@/components/formikfield/FormikTextField'
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from '../../../../../services/authenticateendpoint/project'
import { useGetCountriesQuery } from '../../../../../services/authenticateendpoint/locations'
import { useGetAllUsersQuery } from '../../../../../services/authenticateendpoint/users'
import Button from '@mui/material/Button'
import StatusAlert from '../../../../../components/StatusAlert'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import ChoicesSearchFormInput from '../../../../../components/formikfield/ChoicesSearchFormInput'
import FormikToggleSwitch from '../../../../../components/formikfield/FormikToggleSwitch'
import { useAuth } from '../../../../../hooks/useAuth'

const AddEditproject = () => {
  const { role, id: currentUserId } = useAuth()
  const isAdmin = role === 'ADMIN'

  const [createProject, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] = useCreateProjectMutation()
  const [updateProject, { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess }] = useUpdateProjectMutation()

  const { data: countriesData, error: countriesError } = useGetCountriesQuery(true)
  const countryOptions = countriesData?.map((country) => ({ value: country._id, label: country.name })) || []

  const { data: usersData, error: usersError } = useGetAllUsersQuery(undefined, { skip: !isAdmin });
  const sellerOptions = usersData
    ?.filter(u => u.role === 'SELLER')
    ?.map(u => ({ value: u._id, label: u.name })) || [];

  const { projectId } = useParams();

  const { data, error: projectError } = useGetProjectByIdQuery(projectId, { skip: !projectId })

  useEffect(() => {
    if (countriesError) toast.error(extractApiErrorMessage(countriesError))
  }, [countriesError])
  useEffect(() => {
    if (usersError) toast.error(extractApiErrorMessage(usersError));
  }, [usersError]);
  useEffect(() => {
    if (projectError) toast.error(extractApiErrorMessage(projectError));
  }, [projectError]);
  useEffect(() => {
    if (createError) toast.error(extractApiErrorMessage(createError));
  }, [createError]);
  useEffect(() => {
    if (updateError) toast.error(extractApiErrorMessage(updateError));
  }, [updateError]);

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
              countryIds: data?.countries || [],
              sellerId: isAdmin ? (data?.seller || '') : currentUserId,
              isActive: data?.isActive !== undefined ? data.isActive : true,
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              channel: Yup.string().required('Required'),
              countryIds: Yup.array().of(Yup.string()).min(1, 'Select at least one country').required('Required'),
              sellerId: Yup.string().required('Required'),
              isActive: Yup.boolean(),
            })}


            onSubmit={async (values, { resetForm }) => {
              try {
                const payload = {
                  name: values.name,
                  channel: values.channel,
                  countryIds: values.countryIds,
                  sellerId: values.sellerId,
                  isActive: values.isActive,
                }

                if (projectId) {
                  await updateProject({ id: projectId, data: payload }).unwrap()
                } else {
                  await createProject({ ...payload, warehouseIds: [] }).unwrap()
                  resetForm()
                }
              } catch (err) {
                console.error('Operation failed:', err)
              }
            }}
          >
            {({ values, setFieldValue }) => (
                <Form>
                  <Row>
                    <Col lg={6}>
                      <FormikTextField name="name" label="Project Name" placeholder="Enter Project Name" />
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="channel" label="Channel" placeholder="Enter Channel" />
                    </Col>

                    <Col lg={6}>
                      <Field name="countryIds">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            {...field}
                            id="countryIds"
                            label="Countries"
                            multiple
                            options={countryOptions}
                            placeholder="Select Countries"
                            onChange={(val) => setFieldValue('countryIds', val)}
                            value={values.countryIds}
                          />
                        )}
                      </Field>
                    </Col>

                  {isAdmin && (
                    <Col lg={6}>
                      <Field name="sellerId">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            {...field}
                            label="Seller"
                            options={sellerOptions}
                            placeholder="Select Seller"
                            onChange={(val) => setFieldValue('sellerId', val)}
                            value={values.sellerId}
                          />
                        )}
                      </Field>
                    </Col>
                  )}

                  <Col lg={6}>
                    <FormikToggleSwitch name="isActive" label="Active Status" />
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
            }
          </Formik>
        </CardBody>
      </Card>
    </Col >
  )
}

export default AddEditproject
