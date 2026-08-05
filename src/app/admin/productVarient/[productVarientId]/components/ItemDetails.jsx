import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const ItemDetails = ({ variant }) => {
  if (!variant) return null;

  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Items Detail</CardTitle>
        </CardHeader>
        <CardBody>
          <div>
            <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">
              <li>
                <span className="fw-medium text-dark">SKU</span>
                <span className="mx-2">:</span>{variant.sku}
              </li>
              <li>
                <span className="fw-medium text-dark">Barcode</span>
                <span className="mx-2">:</span>{variant.barcode}
              </li>
              <li>
                <span className="fw-medium text-dark">Pack Size</span>
                <span className="mx-2">:</span>{variant.packSize}
              </li>
              <li>
                <span className="fw-medium text-dark">Net Weight</span>
                <span className="mx-2">:</span>{variant.netWeight}
              </li>
              <li>
                <span className="fw-medium text-dark">Created At</span>
                <span className="mx-2">:</span>{variant.createdAt ? new Date(variant.createdAt).toLocaleDateString() : '-'}
              </li>
              <li>
                <span className="fw-medium text-dark">Updated At</span>
                <span className="mx-2">:</span>{variant.updatedAt ? new Date(variant.updatedAt).toLocaleDateString() : '-'}
              </li>
              <li>
                <span className="fw-medium text-dark">Status</span>
                <span className="mx-2">:</span>{variant.isActive ? 'Active' : 'Inactive'}
              </li>
            </ul>
          </div>
          <div className="mt-3">
            <Link to="" className="link-primary text-decoration-underline link-offset-2">
              View More Details <IconifyIcon icon="bx:arrow-to-right" className="align-middle fs-16" />
            </Link>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default ItemDetails;