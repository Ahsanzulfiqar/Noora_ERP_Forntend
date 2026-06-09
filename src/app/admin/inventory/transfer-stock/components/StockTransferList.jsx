import React, { useState, useEffect } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardTitle, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import TableNoData from '@/components/TableNoData'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import LoaderSpinner from '@/components/loaders/LoaderSpinner'
import { useGetStockTransfersQuery } from '@/services/authenticateendpoint/stockTransfer'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/assets/data/roles'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'

const statusBadgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'draft':
      return 'badge bg-secondary text-white text-capitalize'
    case 'confirmed':
    case 'completed':
      return 'badge bg-success text-white text-capitalize'
    case 'cancelled':
      return 'badge bg-danger text-white text-capitalize'
    default:
      return 'badge bg-light text-dark text-capitalize'
  }
}

const StockTransferList = () => {
  const { role } = useAuth()
  const isSales = role === ROLES.SALES

  const { data: transfers, isLoading, error, refetch } = useGetStockTransfersQuery()
  const list = transfers || []

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const totalPages = Math.max(1, Math.ceil(list.length / limit))
  const paginated = list.slice((page - 1) * limit, page * limit)

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <div>
              <CardTitle as={'h4'}>Stock Transfers ({list.length})</CardTitle>
            </div>
            <div className="d-flex gap-2 align-items-center">
              {isSales ? (
                <button
                  type="button"
                  className="btn btn-sm btn-primary disabled"
                  disabled
                  aria-disabled="true"
                  style={{ pointerEvents: 'none', opacity: 0.65 }}
                >
                  Transfer Stock
                </button>
              ) : (
                <Link to="/inventory/transfer-stock/add" className="btn btn-sm btn-primary">
                  Transfer Stock
                </Link>
              )}
            </div>
          </div>

          <div>
            <div className="table-responsive" style={{ height: 'calc(100vh - 309px)', overflowY: 'auto' }}>
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Transfer No</th>
                    <th>From Warehouse</th>
                    <th>To Warehouse</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Confirmed At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <LoaderSpinner show={isLoading} colSpan={8} />}
                  {!isLoading && paginated.length > 0 ? (
                    paginated.map((t) => (
                      <tr key={t._id}>
                        <td>{t.transferNo || 'N/A'}</td>
                        <td>{t.fromWarehouseName || 'N/A'}</td>
                        <td>{t.toWarehouseName || 'N/A'}</td>
                        <td>{t.items?.length || 0}</td>
                        <td>
                          <span className={statusBadgeClass(t.status)}>
                            {t.status || 'N/A'}
                          </span>
                        </td>
                        <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>{t.confirmedAt ? new Date(t.confirmedAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/inventory/transfer-stock/detail/${t._id}`}
                              className="btn btn-light btn-sm"
                            >
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    !isLoading && <TableNoData colSpan={8} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <CustomTablePaginations
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default StockTransferList
