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
  const scrollRef = useRef(null);

  // Safely access product object from GraphQL response
  const product = data?.data?.GetProductById || data?.GetProductById || data;
  console.log('productproductproduct', product);


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
  } = product || {};

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0]?.url || product1);
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
      <Alert variant="danger">
        Error loading product: {error.message || 'Unknown error occurred'}
      </Alert>
    );
  }

  if (!product) {
    return <Alert variant="warning">Product not found</Alert>;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Try to find label, otherwise use value or default
  const categoryLabel = categoryOptions?.find(opt => opt.value === category)?.label || category || 'Category';
  const subCategoryLabel = subCategoryOptions?.find(opt => opt.value === subCategory)?.label || subCategory || 'N/A';

  return (
    <Row>
      <Col xs={12}>
        <Card className="border-0 shadow-sm">
          <CardBody>
            <Row>
              <Col lg={4}>
                <div className="p-2 border rounded bg-light text-center">
                  <img
                    src={mainImage}
                    alt={name}
                    className="img-fluid rounded"
                    style={{ maxHeight: '350px', objectFit: 'contain' }}
                  />
                </div>
                {images.length > 1 && (
                  <div className="d-flex gap-2 mt-2 overflow-auto no-scrollbar py-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`border rounded p-1 cursor-pointer ${mainImage === img.url ? 'border-primary' : 'border-light'}`}
                        onClick={() => setMainImage(img.url)}
                        style={{ width: '60px', height: '60px', flexShrink: 0, cursor: 'pointer' }}
                      >
                        <img src={img.url || product1} alt="" className="img-fluid rounded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </Col>

              <Col lg={8}>
                <div className="ps-lg-3 mt-3 mt-lg-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge bg={isActive ? 'success' : 'danger'} className="text-uppercase px-3 py-1 fs-12">
                      {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Link to={`/products/product-edit/${productId}`} className="btn btn-sm btn-soft-primary">
                      <IconifyIcon icon="solar:pen-new-square-broken" className="me-1 fs-16" /> Edit Product
                    </Link>
                  </div>

                  <h2 className="mb-2 fw-bold text-dark">{name}</h2>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="text-muted fs-14">Brand: <span className="text-dark fw-medium">{brand || 'N/A'}</span></span>
                    <span className="text-muted fs-14">•</span>
                    <span className="text-muted fs-14">SKU: <span className="text-dark fw-medium">{sku || 'N/A'}</span></span>
                  </div>

                  <div className="mb-4">
                    <h3 className="fw-bold text-primary mb-0">{currency}{salePrice ? Number(salePrice).toFixed(2) : '0.00'}</h3>
                    {purchasePrice && <p className="text-muted fs-13 mb-0">Purchase Price: {currency}{Number(purchasePrice).toFixed(2)}</p>}
                  </div>

                  <div className="mt-4">
                    <h4 className="mb-3 text-dark">Specifications</h4>
                    <div className="table-responsive">
                      <Table hover className="mb-0 table-nowrap table-borderless">
                        <tbody>
                          <tr>
                            <th scope="row" style={{ width: '200px' }} className="text-muted">Category</th>
                            <td>{categoryLabel}</td>
                          </tr>
                          <tr>
                            <th scope="row" className="text-muted">Sub Category</th>
                            <td>{subCategoryLabel}</td>
                          </tr>
                          <tr>
                            <th scope="row" className="text-muted">Barcode</th>
                            <td>{barcode || 'N/A'}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  {attributes && attributes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-3 text-dark">Product Attributes</h4>
                      <div className="table-responsive">
                        <Table hover className="mb-0 table-nowrap table-borderless">
                          <tbody>
                            {attributes.map((attr, idx) => (
                              <tr key={idx}>
                                <th scope="row" style={{ width: '200px' }} className="text-muted">{attr.name}</th>
                                <td>{attr.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
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