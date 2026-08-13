import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Badge, Card, CardBody, CardHeader, Col, Row, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { useGetSubCategoryByIdQuery } from '@/services/authenticateendpoint/category';

const formatDateTime = (value) => {
  if (!value) return '-';
  const normalizedValue = /^\d+$/.test(String(value)) ? Number(value) : value;
  const date = new Date(normalizedValue);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
};

const SubCategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: subCategory, isLoading, error } = useGetSubCategoryByIdQuery(id, { skip: !id });

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading sub-category details...</p>
      </div>
    );
  }

  if (!subCategory) {
    return <Alert variant="warning" className="m-3">Sub-Category not found</Alert>;
  }

  return (
    <Col xl={12}>
      <Card className="border-0 shadow-sm overflow-hidden mb-4">
          <CardHeader className="bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h4 className="mb-0 fw-bold text-dark">Sub-Category Details</h4>
                <p className="text-muted mb-0 fs-13 text-capitalize">
                  Detailed information about {subCategory.name}
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <Badge
                  bg={subCategory.isActive ? 'success-subtle' : 'danger-subtle'}
                  className={`text-${subCategory.isActive ? 'success' : 'danger'} px-3 py-2 fs-12 border border-${subCategory.isActive ? 'success' : 'danger'}`}
                >
                  {subCategory.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => navigate(-1)}
                >
                  <IconifyIcon icon="solar:arrow-left-broken" className="me-1 fs-16" /> Back
                </button>
                <Link to={`/admin/category/subcategory-edit/${id}`} className="btn btn-primary btn-sm px-3">
                  <IconifyIcon icon="solar:pen-new-square-broken" className="me-1 fs-16" /> Edit
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <div className="mb-4">
              <h2 className="display-6 fw-bold text-dark mb-2 text-capitalize">{subCategory.name}</h2>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                  <IconifyIcon icon="solar:hashtag-square-broken" className="me-1 text-primary" />
                  Slug: <span className="fw-bold text-capitalize">{subCategory.slug || '-'}</span>
                </span>
                <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                  <IconifyIcon icon="solar:folder-broken" className="me-1 text-primary" />
                  Parent: <span className="fw-bold text-capitalize">{subCategory.categoryName || '-'}</span>
                </span>
              </div>
            </div>

            {subCategory.description && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-2">Description</h5>
                <p className="text-muted mb-0 text-capitalize" style={{ whiteSpace: 'pre-line' }}>
                  {subCategory.description}
                </p>
              </div>
            )}

            <div>
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">General Information</h5>
              <Table borderless size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <td className="ps-0 py-2 text-muted" style={{ width: '180px' }}>Parent Category</td>
                    <td className="py-2 text-dark fw-semibold text-capitalize">{subCategory.categoryName || '-'}</td>
                  </tr>
                  <tr>
                    <td className="ps-0 py-2 text-muted">Slug</td>
                    <td className="py-2 text-dark fw-semibold text-capitalize">{subCategory.slug || '-'}</td>
                  </tr>
                  <tr>
                    <td className="ps-0 py-2 text-muted">Created At</td>
                    <td className="py-2 text-dark">{formatDateTime(subCategory.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="ps-0 py-2 text-muted">Last Updated</td>
                    <td className="py-2 text-dark">{formatDateTime(subCategory.updatedAt)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
    </Col>
  );
};

export default SubCategoryDetail;
