import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikSelectField from '@/components/formikfield/FormikSelectField';
import {
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useGetSubCategoryByIdQuery,
    useFilterCategoriesQuery
} from '@/services/authenticateendpoint/category';
import StatusAlert from '@/components/StatusAlert';

const AddSubCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const { data: subCategoryData, isLoading: isLoadingSubCategory } = useGetSubCategoryByIdQuery(id, { skip: !isEdit });
    const { data: categoriesData } = useFilterCategoriesQuery({ limit: 100 });
    const [createSubCategory, { isLoading: isCreating, isSuccess: isCreateSuccess, error: createError }] = useCreateSubCategoryMutation();
    const [updateSubCategory, { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateSubCategoryMutation();

    const categoryOptions = categoriesData?.data?.map(cat => ({
        value: cat._id,
        label: cat.name
    })) || [];

    const handleSubmit = async (values) => {
        try {
            const data = {
                name: values.name,
                categoryId: values.categoryId,
                description: values.description,
                isActive: values.isActive === 'true' || values.isActive === true
            };

            if (isEdit) {
                await updateSubCategory({ id, data }).unwrap();
            } else {
                await createSubCategory(data).unwrap();
            }
        } catch (err) {
            console.error('Failed to save sub-category:', err);
        }
    };

    if (isEdit && isLoadingSubCategory) return <div>Loading sub-category...</div>;

    const initialValues = {
        name: subCategoryData?.name || '',
        categoryId: subCategoryData?.category || '',
        description: subCategoryData?.description || '',
        isActive: subCategoryData?.isActive !== undefined ? subCategoryData.isActive : true
    };

    return (
        <Col xl={12} lg={12}>
            <StatusAlert
                isSuccess={isCreateSuccess || isUpdateSuccess}
                message={isEdit ? "Sub-Category updated successfully" : "Sub-Category created successfully"}
                error={createError || updateError}
                path="/admin/category/subcategory-list"
                redirect={true}
            />
            <Card>
                <CardHeader>
                    <CardTitle as={'h4'}>{isEdit ? 'Edit' : 'Create'} Sub-Category</CardTitle>
                </CardHeader>

                <CardBody>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            categoryId: Yup.string().required('Parent category is required'),
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
                                        <FormikTextField name="name" label="Sub-Category Name" placeholder="Enter sub-category name" />
                                    </Col>

                                    <Col lg={6}>
                                        <FormikSelectField
                                            name="categoryId"
                                            label="Parent Category"
                                            options={categoryOptions}
                                        />
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
                                            placeholder="Enter sub-category description"
                                            as="textarea"
                                            rows={3}
                                        />
                                    </Col>
                                </Row>

                                <div className="p-3 bg-light mt-4 rounded">
                                    <Row className="justify-content-end g-2">
                                        <Col lg={2}>
                                            <Button type="submit" variant="primary" className="w-100" disabled={isCreating || isUpdating}>
                                                {isCreating || isUpdating ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                                            </Button>
                                        </Col>
                                        <Col lg={2}>
                                            <Link to="/admin/category/subcategory-list" className="btn btn-outline-secondary w-100">
                                                Cancel
                                            </Link>
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

export default AddSubCategory;
