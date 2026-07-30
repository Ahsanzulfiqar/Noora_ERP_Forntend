import { useMemo, useState } from 'react'
import { Badge, Card, CardBody, CardHeader, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTItle from '@/components/PageTItle'
import { useGetAllProductsQuery } from '@/services/authenticateendpoint/product'
import { formatCount } from '../components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'

const SellerProductsPage = () => {
  const [search, setSearch] = useState('')
  const { data: products, isLoading } = useGetAllProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const filtered = useMemo(() => {
    const rows = products || []
    if (!search.trim()) return rows
    const q = search.trim().toLowerCase()
    return rows.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    )
  }, [products, search])

  return (
    <>
      <PageTItle title="Products" />

      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">Products</h3>
          <p className="text-muted mb-0">Browse the product catalog</p>
        </Col>
      </Row>

      <Card className="mb-0">
        <CardHeader className="border-bottom">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="position-relative flex-grow-1" style={{ minWidth: 220 }}>
              <IconifyIcon
                icon="bx:search"
                className="position-absolute"
                style={{ top: 9, left: 10, color: '#9ca3af' }}
              />
              <Form.Control
                type="text"
                placeholder="Search by name, SKU, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32 }}
              />
            </div>
            <div className="text-muted small">
              {formatCount(filtered.length)} products
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="table-centered table-nowrap mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="ps-3">Product</th>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Sale Price</th>
                  <th className="pe-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      <Spinner animation="border" variant="primary" size="sm" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id}>
                      <td className="ps-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="avatar-sm rounded bg-soft-success flex-centered flex-shrink-0"
                            style={{ width: 36, height: 36 }}
                          >
                            <IconifyIcon icon="bx:package" className="fs-18 text-success" />
                          </div>
                          <span className="fw-semibold">{p.name || 'Unnamed'}</span>
                        </div>
                      </td>
                      <td>{p.sku || '—'}</td>
                      <td>{p.brand || '—'}</td>
                      <td className="fw-semibold">{formatCurrencyRounded(p.salePrice)}</td>
                      <td className="pe-3">
                        <Badge bg={p.isActive ? 'success' : 'secondary'} className="px-2 py-1">
                          {p.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default SellerProductsPage
