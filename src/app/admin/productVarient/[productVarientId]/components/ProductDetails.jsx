import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Table } from 'react-bootstrap';
import product1 from '@/assets/images/product/noimage.png';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const ProductDetails = ({ variant, productvarientId }) => {
  if (!variant) return null;

  // Image handling
  const [mainImage, setMainImage] = useState(variant?.images?.[0]?.url || '');

  // Update main image if variant changes
  useEffect(() => {
    if (variant?.images?.length > 0) {
      setMainImage(variant.images[0].url);
    }
  }, [variant]);

  const images = variant?.images || [];

  return (
    <Row>
      <Col xs={12}>
        <Card className="border-0 shadow-sm">
          <CardBody>
            <Row>
              <Col lg={4}>
                <div className="p-2 border rounded bg-light text-center">
                  <img
                    src={mainImage || product1}
                    alt={variant.name}
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
                    <h4 className="badge bg-success text-light fs-14 py-1 px-2 mb-0">{variant.isActive ? 'Active' : 'Inactive'}</h4>
                    <Link to={`/products/product-edit/${productvarientId}`} className="btn btn-sm btn-soft-primary">
                      <IconifyIcon icon="solar:pen-new-square-broken" className="me-1 fs-16" /> Edit Product
                    </Link>
                  </div>

                  <h2 className="mb-2 fw-bold text-dark">{variant.name}</h2>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="text-muted fs-14">SKU: <span className="text-dark fw-medium">{variant.sku || 'N/A'}</span></span>
                    <span className="text-muted fs-14">•</span>
                    <span className="text-muted fs-14">Barcode: <span className="text-dark fw-medium">{variant.barcode || 'N/A'}</span></span>
                  </div>

                  <div className="mb-4">
                    <h3 className="fw-bold text-primary mb-0">{currency}{variant.salePrice ? Number(variant.salePrice).toFixed(2) : '0.00'}</h3>
                    {variant.purchasePrice && <p className="text-muted fs-13 mb-0">Purchase Price: {currency}{Number(variant.purchasePrice).toFixed(2)}</p>}
                  </div>

                  <div className="mt-4">
                    <h4 className="mb-3 text-dark">Specifications</h4>
                    <div className="table-responsive">
                      <Table hover className="mb-0 table-nowrap table-borderless">
                        <tbody>
                          <tr>
                            <th scope="row" style={{ width: '200px' }} className="text-muted">Net Weight</th>
                            <td>{variant.netWeight || 'N/A'}</td>
                          </tr>
                          <tr>
                            <th scope="row" className="text-muted">Pack Size</th>
                            <td>{variant.packSize || 'N/A'}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  {variant.attributes && variant.attributes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-3 text-dark">Attributes</h4>
                      <div className="table-responsive">
                        <Table hover className="mb-0 table-nowrap table-borderless">
                          <tbody>
                            {variant.attributes.map((attr, idx) => (
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