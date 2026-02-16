import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../../../services/authenticateendpoint/product';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import product1 from '@/assets/images/product/noimage.png';
import { currency } from '@/context/constants';
import { Col, Card, CardBody, Spinner, Alert, Row, CardHeader, CardTitle, Table, Badge } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { categoryOptions, subCategoryOptions } from '../../product-add/utils';

const ProductDetails = () => {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(productId);

  const [mainImage, setMainImage] = useState(product1);

  // Safely access product object from GraphQL response
  const product = data?.data?.GetProductById || data?.GetProductById || data;

  const {
    name,
    brand,
    sku,
    barcode,
    category,
    subCategory,
    purchasePrice,
    salePrice,
    images = [],
    attributes = [],
    description,
    isActive,
    createdAt,
    updatedAt,
  } = product || {};

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0]?.url || product1);
    } else {
      setMainImage(product1);
    }
  }, [images]);

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        Error loading product: {error.message || 'Unknown error occurred'}
      </Alert>
    );
  }

  if (!product) {
    return <Alert variant="warning" className="m-3">Product not found</Alert>;
  }

  return (
    <Row className="justify-content-center">
      <Col xl={10}>
        <Card className="border-0 shadow-sm overflow-hidden mb-4">
          <CardHeader className="bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0 fw-bold text-dark">Product Specification</h4>
                <p className="text-muted mb-0 fs-13">Detailed information about {name}</p>
              </div>
              <div className="d-flex gap-2">
                <Badge bg={isActive ? 'success-subtle' : 'danger-subtle'} className={`text-${isActive ? 'success' : 'danger'} px-3 py-2 fs-12 border border-${isActive ? 'success' : 'danger'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Link to={`/products/product-edit/${productId}`} className="btn btn-primary btn-sm px-3">
                  <IconifyIcon icon="solar:pen-new-square-broken" className="me-1 fs-16" /> Edit
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <Row>
              <Col lg={5}>
                <div className="product-gallery">
                  <div className="p-3 border rounded-3 bg-light text-center mb-3 shadow-sm" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={mainImage}
                      alt={name}
                      className="img-fluid rounded"
                      style={{ maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="d-flex gap-2 overflow-auto pb-2 custom-scrollbar">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`border rounded-2 p-1 cursor-pointer transition-all ${mainImage === img.url ? 'border-primary shadow-sm' : 'border-light'}`}
                          onClick={() => setMainImage(img.url)}
                          style={{ width: '70px', height: '70px', flexShrink: 0, cursor: 'pointer' }}
                        >
                          <img src={img.url || product1} alt="" className="img-fluid rounded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>

              <Col lg={7}>
                <div className="ps-lg-4 mt-4 mt-lg-0">
                  <div className="mb-4">
                    <h2 className="display-6 fw-bold text-dark mb-2">{name}</h2>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                        <IconifyIcon icon="solar:tag-horizontal-broken" className="me-1 text-primary" />
                        Brand: <span className="fw-bold">{brand || 'N/A'}</span>
                      </span>
                      <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                        <IconifyIcon icon="solar:box-broken" className="me-1 text-primary" />
                        SKU: <span className="fw-bold">{sku || 'N/A'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-primary-subtle border border-primary-subtle mb-4">
                    <Row className="align-items-center">
                      <Col>
                        <p className="text-primary-emphasis mb-1 fs-14">Selling Price</p>
                        <h3 className="fw-bold text-primary mb-0">{currency}{salePrice ? Number(salePrice).toLocaleString() : '0.00'}</h3>
                      </Col>
                      <Col className="border-start border-primary-subtle ps-4">
                        <p className="text-primary-emphasis mb-1 fs-14">Purchase Price</p>
                        <h4 className="fw-semibold text-muted mb-0">{currency}{purchasePrice ? Number(purchasePrice).toLocaleString() : '0.00'}</h4>
                      </Col>
                    </Row>
                  </div>

                  {description && (
                    <div className="mb-4">
                      <h5 className="fw-bold text-dark border-bottom pb-2 mb-2">Description</h5>
                      <p className="text-muted leading-relaxed" style={{ whiteSpace: 'pre-line' }}>{description}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">General Information</h5>
                    <Table borderless size="sm" className="mb-0">
                      <tbody>
                        <tr className="mb-2">
                          <td className="ps-0 py-2 text-muted" style={{ width: '150px' }}>Category</td>
                          <td className="py-2 fw-semibold text-dark">{categoryOptions?.find(opt => opt.value === category)?.label || category || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="ps-0 py-2 text-muted">Sub-Category</td>
                          <td className="py-2 fw-semibold text-dark">{subCategoryOptions?.find(opt => opt.value === subCategory)?.label || subCategory || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="ps-0 py-2 text-muted">Barcode</td>
                          <td className="py-2 fw-semibold text-dark font-monospace">{barcode || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="ps-0 py-2 text-muted">Created At</td>
                          <td className="py-2 text-dark">{createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="ps-0 py-2 text-muted">Last Updated</td>
                          <td className="py-2 text-dark">{updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  {attributes && attributes.length > 0 && (
                    <div className="mt-4">
                      <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Specifications</h5>
                      <Row>
                        {attributes.map((attr, idx) => (
                          <Col sm={6} key={idx} className="mb-3">
                            <div className="p-2 border rounded-2 bg-light d-flex justify-content-between align-items-center">
                              <span className="text-muted fs-13">{attr.name}</span>
                              <span className="fw-bold text-dark">{attr.value}</span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default ProductDetails;