import { useMemo, useState } from 'react'
import { Badge, Card, CardBody, CardHeader, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import PageTItle from '@/components/PageTItle'
import { useAuth } from '@/hooks/useAuth'
import { useGetWarehouseStockQuery } from '@/services/authenticateendpoint/warehouse'
import { formatCount } from '../components/formatters'

const SellerStockPage = () => {
  const { role } = useAuth()
  const isSeller = role?.toLowerCase() === 'seller'
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')

  const { data: stockData, isLoading } = useGetWarehouseStockQuery(
    { page, limit, filter: {} },
    { skip: isSeller, refetchOnMountOrArgChange: true }
  )

  const rows = stockData?.data || []
  const total = stockData?.total || 0
  const totalPages = stockData?.totalPages || Math.ceil(total / limit) || 1

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.trim().toLowerCase()
    return rows.filter(
      (r) =>
        r.productName?.toLowerCase().includes(q) ||
        r.variantName?.toLowerCase().includes(q) ||
        r.warehouseName?.toLowerCase().includes(q)
    )
  }, [rows, search])

  return (
    <>
      <PageTItle title="Stock" />

      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">Stock</h3>
          <p className="text-muted mb-0">Warehouse inventory</p>
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
                placeholder="Search product, variant, warehouse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32 }}
              />
            </div>
            <div className="text-muted small">
              {formatCount(total)} items
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="table-centered table-nowrap mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="ps-3">Product</th>
                  <th>Variant</th>
                  <th>Warehouse</th>
                  <th>Available</th>
                  <th>Reserved</th>
                  <th className="pe-3">Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      <Spinner animation="border" variant="primary" size="sm" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const isLow =
                      Number(r.reorderLevel) > 0 && Number(r.quantity) <= Number(r.reorderLevel)
                    return (
                      <tr key={r._id}>
                        <td className="ps-3 fw-semibold">{r.productName || '—'}</td>
                        <td>{r.variantName || '—'}</td>
                        <td>{r.warehouseName || '—'}</td>
                        <td>
                          <Badge bg={isLow ? 'danger' : 'success'} className="px-2 py-1">
                            {formatCount(r.quantity)}
                          </Badge>
                        </td>
                        <td>{formatCount(r.reserved)}</td>
                        <td className="pe-3">{formatCount(r.reorderLevel)}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </Table>
          </div>
          <CustomTablePaginations
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default SellerStockPage
