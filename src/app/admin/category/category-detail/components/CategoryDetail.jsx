import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Badge, Card, CardBody, CardHeader, Col, Row, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { useGetCategoryByIdQuery, useFilterSubCategoriesQuery } from '@/services/authenticateendpoint/category';

const formatDateTime = (value) => {
  if (!value) return '-';
  const normalizedValue = /^\d+$/.test(String(value)) ? Number(value) : value;
  const date = new Date(normalizedValue);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
};

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: category, isLoading, error } = useGetCategoryByIdQuery(id, { skip: !id });
  const { data: subCategoriesData } = useFilterSubCategoriesQuery(
    { filter: { category: id, includeDeleted: false }, page: 1, limit: 1000 },
    { skip: !id },
  );

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading category details...</p>
      </div>
    );
  }

  if (!category) {
    return <Alert variant="warning" className="m-3">Category not found</Alert>;
  }

  const subCategories = subCategoriesData?.data || [];
  const subCount = subCategoriesData?.total ?? subCategories.length;

  return (
    <Col xl={12}>
      <Card className="border-0 shadow-sm overflow-hidden mb-4">
          <CardHeader className="bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h4 className="mb-0 fw-bold text-dark">Category Details</h4>
                <p className="text-muted mb-0 fs-13 text-capitalize">
                  Detailed information about {category.name}
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <Badge
                  bg={category.isActive ? 'success-subtle' : 'danger-subtle'}
                  className={`text-${category.isActive ? 'success' : 'danger'} px-3 py-2 fs-12 border border-${category.isActive ? 'success' : 'danger'}`}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => navigate(-1)}
                >
                  <IconifyIcon icon="solar:arrow-left-broken" className="me-1 fs-16" /> Back
                </button>
                <Link to={`/admin/category/category-edit/${id}`} className="btn btn-primary btn-sm px-3">
                  <IconifyIcon icon="solar:pen-new-square-broken" className="me-1 fs-16" /> Edit
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <div className="mb-4">
              <h2 className="display-6 fw-bold text-dark mb-2 text-capitalize">{category.name}</h2>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                  <IconifyIcon icon="solar:hashtag-square-broken" className="me-1 text-primary" />
                  Slug: <span className="fw-bold text-capitalize">{category.slug || '-'}</span>
                </span>
                <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                  <IconifyIcon icon="solar:layers-broken" className="me-1 text-primary" />
                  Sub-Categories: <span className="fw-bold">{subCount}</span>
                </span>
              </div>
            </div>

            {category.description && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-2">Description</h5>
                <p className="text-muted mb-0 text-capitalize" style={{ whiteSpace: 'pre-line' }}>
                  {category.description}
                </p>
              </div>
            )}

            <div className="mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">General Information</h5>
              <Table borderless size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <td className="ps-0 py-2 text-muted" style={{ width: '180px' }}>Slug</td>
                    <td className="py-2 text-dark fw-semibold text-capitalize">{category.slug || '-'}</td>
                  </tr>
                  <tr>
                    <td className="ps-0 py-2 text-muted">Sub-Categories</td>
                    <td className="py-2 text-dark fw-semibold">{subCount}</td>
                  </tr>
                  <tr>
                    <td className="ps-0 py-2 text-muted">Created At</td>
                    <td className="py-2 text-dark">{formatDateTime(category.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="ps-0 py-2 text-muted">Last Updated</td>
                    <td className="py-2 text-dark">{formatDateTime(category.updatedAt)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {subCategories.length > 0 && (
              <div>
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                  Sub-Categories ({subCategories.length})
                </h5>
                <Row>
                  {subCategories.map((sub) => (
                    <Col sm={6} lg={4} key={sub._id} className="mb-2">
                      <div className="p-2 border rounded-2 bg-light d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-dark text-capitalize">{sub.name}</span>
                        <Badge
                          bg={sub.isActive ? 'success-subtle' : 'danger-subtle'}
                          className={`text-${sub.isActive ? 'success' : 'danger'}`}
                        >
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </CardBody>
        </Card>
    </Col>
  );
};

export default CategoryDetail;
