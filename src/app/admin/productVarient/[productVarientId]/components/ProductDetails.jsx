import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { formatCurrency } from '@/helpers/currency';
import { useState, useEffect } from 'react';
import { Alert, Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'react-bootstrap';
import product1 from '@/assets/images/product/noimage.png';
import { Link } from 'react-router-dom';
const ProductDetails = ({ variant, productvarientId }) => {
  const [mainImage, setMainImage] = useState(product1);

  useEffect(() => {
    if (variant?.images?.length > 0) {
      setMainImage(variant.images[0].url);
    } else {
      setMainImage(product1);
    }
  }, [variant]);

  if (!variant) {
    return <Alert variant="warning" className="m-3">Variant not found</Alert>;
  }

  const images = variant?.images || [];
  const generalInfo = [
    { label: 'Net Weight', value: variant.netWeight || '-' },
    { label: 'Pack Size', value: variant.packSize || '-' },
  ];

  return (
    <Row className="justify-content-center">
      <Col xl={10}>
        <Card className="border-0 shadow-sm overflow-hidden mb-4">
          <CardHeader className="bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0 fw-bold text-dark">Product Variant Specification</h4>
                <p className="text-muted mb-0 fs-13">Detailed information about {variant.name}</p>
              </div>
              <div className="d-flex gap-2">
                <Badge bg={variant.isActive ? 'success-subtle' : 'danger-subtle'} className={`text-${variant.isActive ? 'success' : 'danger'} px-3 py-2 fs-12 border border-${variant.isActive ? 'success' : 'danger'}`}>
                  {variant.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Link to={`/products/product-varient-edit/${productvarientId}`} className="btn btn-primary btn-sm px-3">
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
                    src={mainImage || product1}
                    alt={variant.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                {images.length > 1 && (
                  <div className="d-flex gap-2 overflow-auto pb-2 custom-scrollbar">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-2 p-1 ${mainImage === img.url ? 'border-primary shadow-sm' : 'border-light'}`}
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
                    <h2 className="display-6 fw-bold text-dark mb-2">{variant.name}</h2>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                        <IconifyIcon icon="solar:box-broken" className="me-1 text-primary" />
                        SKU: <span className="fw-bold">{variant.sku || '-'}</span>
                      </span>
                      <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                        <IconifyIcon icon="solar:barcode-broken" className="me-1 text-primary" />
                        Barcode: <span className="fw-bold">{variant.barcode || '-'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-primary-subtle border border-primary-subtle mb-4">
                    <Row className="align-items-center">
                      <Col>
                        <p className="text-primary-emphasis mb-1 fs-14">Purchase Price</p>
                        <h4 className="fw-semibold text-muted mb-0">{formatCurrency(variant.purchasePrice)}</h4>
                      </Col>
                      <Col className="border-start border-primary-subtle ps-4">
                        <p className="text-primary-emphasis mb-1 fs-14">Selling Price</p>
                        <h3 className="fw-bold text-primary mb-0">{formatCurrency(variant.salePrice)}</h3>
                      </Col>
                    </Row>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">General Information</h5>
                    <Table borderless size="sm" className="mb-0">
                      <tbody>
                        {generalInfo.map((item) => (
                          <tr key={item.label}>
                            <td className="ps-0 py-2 text-muted" style={{ width: '150px' }}>{item.label}</td>
                            <td className={`py-2 text-dark ${item.mono ? 'fw-semibold font-monospace' : 'fw-semibold'}`}>{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {variant.attributes && variant.attributes.length > 0 && (
                    <div className="mt-4">
                      <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Attributes</h5>
                      <Row>
                        {variant.attributes.map((attr, idx) => (
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