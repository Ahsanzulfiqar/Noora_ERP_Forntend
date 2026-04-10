import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCreateProductMutation, useGetProductByIdQuery, useUpdateProductMutation } from '../../../../../services/authenticateendpoint/product'
import { useFilterCategoriesQuery, useFilterSubCategoriesQuery } from '../../../../../services/authenticateendpoint/category'
import { toast } from 'react-toastify'

import FormikTextArea from '../../../../../components/formikfield/FormikTextArea'
import FormikTextField from '../../../../../components/formikfield/FormikTextField'
import ChoicesSearchFormInput from '../../../../../components/formikfield/ChoicesSearchFormInput'
import StatusAlert from '../../../../../components/StatusAlert'
import FileUpload from './FileUpload';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import ProductDetails from './ProductDetails'
import { statusOptions } from '../utils'
import FormikInputGroupField from '../../../../../components/formikfield/FormikInputGroupField'
import { DollarSign, Plus, Trash2 } from 'lucide-react'
import FormikToggleSwitch from '../../../../../components/formikfield/FormikToggleSwitch'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'


const AddProduct = () => {
  const { productId } = useParams();

  const { data } = useGetProductByIdQuery(productId, { skip: !productId })
  const [createProduct, { isLoading: createLoading, error: createError, isSuccess: createSuccess }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess }] = useUpdateProductMutation()
  const navigate = useNavigate()

  // Fetch categories and subcategories from API
  const { data: categoriesData } = useFilterCategoriesQuery({ filter: { isActive: true }, page: 1, limit: 100 })
  const { data: subCategoriesData } = useFilterSubCategoriesQuery({ filter: { isActive: true }, page: 1, limit: 100 })

  // Transform categories into dropdown options
  const categoryOptions = React.useMemo(() => {
    if (!categoriesData?.data) return []
    return categoriesData.data.map(cat => ({
      value: cat._id,
      label: cat.name
    }))
  }, [categoriesData])

  // Transform subcategories into dropdown options
  const allSubCategoryOptions = React.useMemo(() => {
    if (!subCategoriesData?.data) return []
    return subCategoriesData.data.map(subCat => ({
      value: subCat._id,
      label: subCat.name,
      categoryId: subCat.category
    }))
  }, [subCategoriesData])

  const getSubCategoryOptionsByCategory = React.useCallback((categoryId) => {
    if (!categoryId) return []
    return allSubCategoryOptions.filter(subCat => subCat.categoryId === categoryId)
  }, [allSubCategoryOptions])

  return (
    <>
      <StatusAlert
        isSuccess={createSuccess || updateSuccess}
        error={createError || updateError}
        message={productId ? 'Product updated successfully' : 'Product created successfully'}
        path="/products/product-list"
        redirect={true} />
      <Formik
        enableReinitialize={true}
        initialValues={{
          _id: data?._id || '',
          name: data?.name || '',
          brand: data?.brand || '',
          sku: data?.sku || '',
          barcode: data?.barcode || '',
          description: data?.description || '',
          category: data?.category || '',
          subCategory: data?.subCategory || '',
          purchasePrice: data?.purchasePrice || '',
          salePrice: data?.salePrice || '',
          isActive: data ? !!data.isActive : true,
          attributes: data?.attributes || [{ name: '', value: '' }],
          images: data?.images || [{ url: '', alt: '' }],
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          brand: Yup.string().required('Required'),
          sku: Yup.string().required('Required'),
          barcode: Yup.string().required('Required'),
          description: Yup.string().required('Required'),
          category: Yup.string().required('Required'),
          subCategory: Yup.string().when('category', ([category], schema) => {
            const hasSubCategories = getSubCategoryOptionsByCategory(category).length > 0
            return hasSubCategories ? schema.required('Required') : schema.notRequired()
          }),
          purchasePrice: Yup.number().required('Required'),
          salePrice: Yup.number().required('Required'),
          isActive: Yup.boolean().required('Required'),

          attributes: Yup.array().of(
            Yup.object({
              name: Yup.string().required('Required'),
              value: Yup.string().required('Required'),
            })
          ),

          // images: Yup.array().of(
          //   Yup.object({
          //     url: Yup.string().required('Image URL Required'),
          //     alt: Yup.string().required('Alt Text Required'),
          //   })
          // ),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // eslint-disable-next-line no-unused-vars
            const { _id, ...rest } = values
            const payload = {
              ...rest,
              purchasePrice: Number(values.purchasePrice),
              salePrice: Number(values.salePrice),
              isActive: values.isActive,
              attributes: values.attributes.filter(attr => attr.name.trim() !== '' && attr.value.trim() !== ''),
              images: values.images,
            }

            if (productId) {
              await updateProduct({ id: productId, data: payload }).unwrap()
            } else {
              await createProduct(payload).unwrap()
            }
            navigate('/products/product-list')
          } catch (err) {
            console.error(err)
          } finally {
            setSubmitting(false)
          }
        }}>
        {({ values, errors, setFieldValue }) => {
          const filteredSubCategoryOptions = getSubCategoryOptionsByCategory(values.category)
          const hasSubCategories = filteredSubCategoryOptions.length > 0

          console.log('errors', errors)
          console.log('values', values)
          return (
            <Form>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}

                  sx={{ background: '#ffffffff', border: '1px solid #dcdcdcff', borderRadius: '10px', p: 0, height: '100%' }}
                >
                  <ProductDetails values={values} />

                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}
                  sx={{ background: '#ffffffff', border: '1px solid #dcdcdcff', borderRadius: '10px', px: 3, pb: 2 }}

                >
                  <Row

                  >

                    <Col lg={12}>
                      <FileUpload
                        title="Add Product Photo"
                        onFileUpload={(files) => {
                          const imageArray = files.map(file => ({
                            url: file.preview || '',
                            alt: file.name || 'Product Image'
                          }));
                          setFieldValue('images', imageArray);
                        }}
                      />
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="name" label="Product Name" placeholder="Enter Product Name" />
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="brand" label="Brand" placeholder="Enter Brand" />
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="sku" label="SKU" placeholder="Enter SKU" />
                    </Col>

                    <Col lg={6}>
                      <FormikTextField name="barcode" label="Barcode" placeholder="Enter Barcode" />
                    </Col>



                    <Col lg={6}>
                      <Field name="category">
                        {({ field, form }) => {
                          return (
                            <ChoicesSearchFormInput
                              label="Category"
                              labelClassName="form-label fw-bold"
                              className="form-control"
                              id="category"
                              {...field}
                              options={categoryOptions}
                              onChange={(val) => {
                                form.setFieldValue('category', val)
                                form.setFieldValue('subCategory', '')
                              }}
                              placeholder="Select category"
                            />
                          )
                        }}
                      </Field>
                    </Col>

                    <Col lg={6}>
                      <Field name="subCategory">
                        {({ field, form }) => {
                          return (
                            <ChoicesSearchFormInput
                              label="Sub Category"
                              labelClassName="form-label fw-bold"
                              className="form-control"
                              id="subCategory"
                              {...field}
                              options={filteredSubCategoryOptions}
                              onChange={(val) => form.setFieldValue('subCategory', val)}
                              placeholder={
                                !form.values.category
                                  ? 'Select category first'
                                  : hasSubCategories
                                    ? 'Select sub category'
                                    : 'No sub category available'
                              }
                              disabled={!form.values.category || !hasSubCategories}
                            />
                          )
                        }}
                      </Field>
                    </Col>

                    <Col lg={12}>
                      <FormikTextArea name="description" label="Description" placeholder="Write Description ..." />
                    </Col>

                    <Col lg={4}>
                      <FormikInputGroupField
                        label="Purchase Price"
                        name="purchasePrice"
                        type="number"
                        placeholder="0.00"
                        icon={<DollarSign size={18} />}
                        iconClass="fs-20"
                      />
                      {/* <FormikTextField type="number" name="purchasePrice" label="Purchase Price" placeholder="Enter Purchase Price" /> */}
                    </Col>

                    <Col lg={4}>
                      <FormikInputGroupField
                        label="Sale Price"
                        name="salePrice"
                        type="number"
                        placeholder="0.00"
                        icon={<DollarSign size={18} />}
                        iconClass="fs-20"
                      />

                      {/* <FormikTextField type="number" name="salePrice" label="Sale Price" placeholder="Enter Sale Price" /> */}
                    </Col>

                    <Col lg={4}>
                      <FormikToggleSwitch
                        name="isActive"
                        label="Is Active"
                      />
                    </Col>

                  </Row>

                  {/* ----------------------- */}
                  {/* ATTRIBUTE ARRAY FIELDS */}
                  {/* ----------------------- */}
                  <Box
                    sx={{ border: '1px solid #dfdfdfff', borderRadius: '10px', }}
                  >
                    <FieldArray name="attributes">
                      {({ push, remove }) => (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px', paddingRight: '8px', paddingY: '8px' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Product Attributes</Typography>
                            <IconButton type="button" className="btn btn-secondary" onClick={() => push({ name: '', value: '' })}
                              sx={{
                                backgroundColor: '#5c7186', borderRadius: '7px',
                                '&:hover': {
                                  backgroundColor: '#7b8792ff !important',
                                  '& svg': {
                                    stroke: '#ffffffff !important'
                                  }
                                }
                              }}>
                              <Plus size={20} color="#ffffff" strokeWidth={2.50} />
                            </IconButton>

                          </Box>
                          <Divider />
                          <Box sx={{ paddingX: '16px', paddingY: '12px' }}>
                            {values.attributes.map((item, index) => (
                              <Grid key={index} container spacing={2}>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
                                  <FormikTextField name={`attributes[${index}].name`} label="Attribute Name" placeholder="Color / Size" />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
                                  <FormikTextField name={`attributes[${index}].value`} label="Attribute Value" placeholder="Red / XL" />
                                </Grid>

                                <Grid size={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                                  <IconButton type="button" onClick={() => remove(index)}
                                    sx={{ backgroundColor: '#ffdcdcff', marginTop: '28px', marginLeft: '2px' }}>
                                    <Trash2 size={17} color="#ff3939ff" strokeWidth={2} />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            ))}
                          </Box>
                        </>
                      )}
                    </FieldArray>
                  </Box>

                </Grid>
              </Grid>



              <Box className="p-3 bg-light mt-4 rounded">
                <Row className="justify-content-end g-2">


                  <Col lg={2}>
                    <Link to="" className="btn btn-primary w-100">
                      Cancel
                    </Link>
                  </Col>
                  <Col lg={2}>
                    <button type="submit" className="btn btn-outline-secondary w-100" disabled={createLoading || updateLoading}>
                      {createLoading || updateLoading ? 'Saving...' : 'Save'}
                    </button>
                  </Col>
                </Row>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default AddProduct
