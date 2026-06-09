import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikSelectField from '@/components/formikfield/FormikSelectField';
import { useCreateCategoryMutation, useUpdateCategoryMutation, useGetCategoryByIdQuery } from '@/services/authenticateendpoint/category';
import StatusAlert from '@/components/StatusAlert';
import { toast } from 'react-toastify';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const AddCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const { data: categoryData, isLoading: isLoadingCategory, error: categoryError } = useGetCategoryByIdQuery(id, { skip: !isEdit });
    const [createCategory, { isLoading: isCreating, isSuccess: isCreateSuccess, error: createError }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateCategoryMutation();

    useEffect(() => {
        if (categoryError) toast.error(extractApiErrorMessage(categoryError));
    }, [categoryError]);
    useEffect(() => {
        if (createError) toast.error(extractApiErrorMessage(createError));
    }, [createError]);
    useEffect(() => {
        if (updateError) toast.error(extractApiErrorMessage(updateError));
    }, [updateError]);

    const handleSubmit = async (values) => {
        try {
            const data = {
                name: values.name,
                description: values.description,
                isActive: values.isActive === 'true' || values.isActive === true
            };

            if (isEdit) {
                await updateCategory({ id, data }).unwrap();
            } else {
                await createCategory(data).unwrap();
            }
        } catch (err) {
            console.error('Failed to save category:', err);
        }
    };

    if (isEdit && isLoadingCategory) return <div>Loading category...</div>;

    const initialValues = {
        name: categoryData?.name || '',
        description: categoryData?.description || '',
        isActive: categoryData?.isActive !== undefined ? categoryData.isActive : true
    };

    return (
        <Col xl={12} lg={12}>
            <StatusAlert
                isSuccess={isCreateSuccess || isUpdateSuccess}
                message={isEdit ? "Category updated successfully" : "Category created successfully"}
                error={createError || updateError}
                path="/admin/category/category-list"
                redirect={true}
            />
            <Card>
                <CardHeader>
                    <CardTitle as={'h4'}>{isEdit ? 'Edit' : 'Create'} Category</CardTitle>
                </CardHeader>

                <CardBody>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string(),
                            isActive: Yup.boolean()
                        })}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <Row>
                                    <Col lg={6}>
                                        <FormikTextField name="name" label="Category Name" placeholder="Enter category name" />
                                    </Col>

                                    <Col lg={6}>
                                        <FormikSelectField
                                            name="isActive"
                                            label="Status"
                                            options={[
                                                { value: true, label: 'Active' },
                                                { value: false, label: 'Inactive' }
                                            ]}
                                        />
                                    </Col>

                                    <Col lg={12}>
                                        <FormikTextField
                                            name="description"
                                            label="Description"
                                            placeholder="Enter category description"
                                            as="textarea"
                                            rows={3}
                                        />
                                    </Col>
                                </Row>

                                <div className="p-3 bg-light mt-4 rounded">
                                    <Row className="justify-content-end g-2">
                                        <Col lg={2}>
                                            <Link to="/admin/category/category-list" className="btn btn-outline-secondary w-100">
                                                Cancel
                                            </Link>
                                        </Col>
                                        <Col lg={2}>
                                            <Button type="submit" variant="primary" className="w-100" disabled={isCreating || isUpdating}>
                                                {isCreating || isUpdating ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                                            </Button>
                                        </Col>

                                    </Row>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </Col>
    );
};

export default AddCategory;
