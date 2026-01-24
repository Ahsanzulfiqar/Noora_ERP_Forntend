// React form with Formik for Product
// Reusable FileInput component included

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import FormikTextField from '@/components/formikfield/FormikTextField'
import FormikSelectField from '@/components/formikfield/FormikSelectField'
import FormikFileInput from '@/components/formikfield/FormikFileInput'

const AddCategory = () => {
  return (
    <Col xl={12} lg={12}>
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Product Varient Information</CardTitle>
        </CardHeader>

        <CardBody>
          <Formik
            initialValues={{
              _id: '',
              name: '',
              brand: '',
              sku: '',
              barcode: '',
              description: '',
              category: '',
              subCategory: '',
              purchasePrice: '',
              salePrice: '',
              attributes: [{ name: '', value: '' }],
              isActive: '',
              images: [],
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              brand: Yup.string().required('Required'),
              sku: Yup.string().required('Required'),
              barcode: Yup.string().required('Required'),
              category: Yup.string().required('Required'),
              purchasePrice: Yup.number().required('Required'),
              salePrice: Yup.number().required('Required'),
              isActive: Yup.string().required('Required'),
              images: Yup.array().min(1, 'Image is required'),
            })}
            onSubmit={(values) => {
              console.log('Product Data:', values)
            }}>
            {({ values }) => (
              <Form>
                <Row>
                  <Col lg={6}>
                    <FormikTextField name="name" label="Product Name" placeholder="Product Name" />
                  </Col>

                  <Col lg={6}>
                    <FormikTextField name="brand" label="Brand" placeholder="Brand" />
                  </Col>

                  <Col lg={6}>
                    <FormikTextField name="sku" label="SKU" placeholder="SKU" />
                  </Col>

                  <Col lg={6}>
                    <FormikTextField name="barcode" label="Barcode" placeholder="Barcode" />
                  </Col>

                  <Col lg={12}>
                    <FormikTextField name="description" label="Description" placeholder="Description" />
                  </Col>

                  <Col lg={6}>
                    <FormikSelectField name="category" label="Category" options={[]} />
                  </Col>

                  <Col lg={6}>
                    <FormikSelectField name="subCategory" label="Sub Category" options={[]} />
                  </Col>

                  <Col lg={6}>
                    <FormikTextField name="purchasePrice" type="number" label="Purchase Price" placeholder="Purchase Price" />
                  </Col>

                  <Col lg={6}>
                    <FormikTextField name="salePrice" type="number" label="Sale Price" placeholder="Sale Price" />
                  </Col>

                  {/* Image Upload */}
                  <Col lg={12} className="mt-3">
                    <FormikFileInput name="images" label="Product Images" multiple />
                  </Col>
                </Row>

                <div className="p-3 bg-light mt-4 rounded">
                  <Row className="justify-content-end g-2">
                    <Col lg={2}>
                      <button type="submit" className="btn btn-outline-secondary w-100">
                        Create
                      </button>
                    </Col>

                    <Col lg={2}>
                      <Link to="" className="btn btn-primary w-100">
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
  )
}

export default AddCategory

