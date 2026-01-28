import PageTItle from '@/components/PageTItle';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikPasswordField from '@/components/formikfield/FormikPasswordField';
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput';
import StatusAlert from '@/components/StatusAlert';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery
} from '../../../../services/authenticateendpoint/users';
import { useGetAllWarehousesQuery } from '../../../../services/endpoints/warehouse';
import { useGetAllProjectsQuery } from '../../../../services/authenticateendpoint/project';
import FormikRadioGroup from '@/components/formikfield/FormikRadioGroup';
import { useEffect, useState } from 'react';
import { ROLE_OPTIONS } from '@/assets/data/roles';

const RoleAddPage = () => {
  const { roleId } = useParams();
  const isEditMode = !!roleId;

  const [createUser, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess }] = useUpdateUserMutation();

  const { data: userData, isLoading: isFetchingUser } = useGetUserByIdQuery(roleId, { skip: !isEditMode });
  const { data: warehouses } = useGetAllWarehousesQuery();
  const { data: projects } = useGetAllProjectsQuery();

  const navigate = useNavigate();

  const warehouseOptions = warehouses?.map(w => ({
    value: w._id,
    label: w.name
  })) || [];

  const projectOptions = projects?.map(p => ({
    value: p._id,
    label: p.name
  })) || [];

  const [initialFormValues, setInitialFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    // projectIds: [],
    warehouseIds: [],
    isActive: true
  });

  useEffect(() => {
    if (isEditMode && userData) {
      setInitialFormValues({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: '', // Password usually left blank on edit unless being changed
        role: userData.role || '',
        // projectIds: userData.assignedProjects || [],
        warehouseIds: userData.assignedWarehouses || [],
        isActive: userData.isActive ?? true
      });
    }
  }, [isEditMode, userData]);

  const isLoading = isCreating || isUpdating;
  const isSuccess = createSuccess || updateSuccess;
  const error = createError || updateError;

  if (isEditMode && isFetchingUser) {
    return <div className="text-center p-5">Loading User Data...</div>;
  }

  return <>
    <StatusAlert
      isSuccess={isSuccess}
      error={error}
      message={isEditMode ? "User updated successfully" : "User created successfully"}
      path="/role/role-list"
      redirect={true}
    />
    <PageTItle title={isEditMode ? "User Edit" : "User Add"} />
    <Row>
      <Col lg={12}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>{isEditMode ? "Update User Information" : "User Information"}</CardTitle>
          </CardHeader>
          <Formik
            enableReinitialize
            initialValues={initialFormValues}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              email: Yup.string().email('Invalid email').required('Required'),
              phone: Yup.string().required('Required'),
              password: isEditMode
                ? Yup.string().min(6, 'Too short')
                : Yup.string().required('Required').min(6, 'Too short'),
              role: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const { isActive, ...rest } = values;

                if (isEditMode) {
                  const payload = { ...rest, isActive };
                  // If password is empty in edit mode, remove it from payload so it doesn't get updated/cleared
                  if (!payload.password) {
                    delete payload.password;
                  }
                  await updateUser({ id: roleId, data: payload }).unwrap();
                } else {
                  // isActive is not supported in CreateUserInput
                  const payload = { ...rest };
                  await createUser(payload).unwrap();
                }
                navigate('/role/role-list');
              } catch (err) {
                console.error(`Failed to ${isEditMode ? 'update' : 'create'} user:`, err);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <CardBody>
                  <Row>
                    <Col lg={6}>
                      <FormikTextField name="name" label="Full Name" placeholder="Enter Full Name" />
                    </Col>
                    <Col lg={6}>
                      <FormikTextField name="email" label="Email Address" placeholder="Enter Email" />
                    </Col>
                    <Col lg={6}>
                      <FormikTextField name="phone" label="Phone Number" placeholder="Enter Phone" />
                    </Col>
                    <Col lg={6}>
                      <FormikPasswordField
                        name="password"
                        label={isEditMode ? "Password (leave blank to keep current)" : "Password"}
                        placeholder="Enter Password"
                      />
                    </Col>
                    <Col lg={6}>
                      <Field name="role">
                        {({ field, form }) => (
                          <ChoicesSearchFormInput
                            label="Role"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="role"
                            {...field}
                            options={ROLE_OPTIONS}
                            onChange={(val) => form.setFieldValue('role', val)}
                            placeholder="Select role"
                          />
                        )}
                      </Field>
                    </Col>
                    {/* <Col lg={6}>
                      <Field name="projectIds">
                        {({ field, form }) => (
                          <ChoicesSearchFormInput
                            label="Assigned Projects"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="projectIds"
                            {...field}
                            multiple
                            options={projectOptions}
                            onChange={(val) => form.setFieldValue('projectIds', val)}
                            placeholder="Select projects"
                          />
                        )}
                      </Field>
                    </Col> */}
                    <Col lg={6}>
                      <Field name="warehouseIds">
                        {({ field, form }) => (
                          <ChoicesSearchFormInput
                            label="Assigned Warehouses"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="warehouseIds"
                            {...field}
                            multiple
                            options={warehouseOptions}
                            onChange={(val) => form.setFieldValue('warehouseIds', val)}
                            placeholder="Select warehouses"
                          />
                        )}
                      </Field>
                    </Col>
                    <Col lg={6} className="mt-1">
                      <FormikRadioGroup
                        label="User Status"
                        name="isActive"
                        options={[
                          { label: 'Active', value: true },
                          { label: 'In Active', value: false },
                        ]}
                      />
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter className="border-top">
                  <div className="d-flex gap-2">

                    <Link to="/role/role-list" className="btn btn-outline-secondary">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update User' : 'Create User')}
                    </button>
                  </div>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </Col>
    </Row>
  </>;
};

export default RoleAddPage;