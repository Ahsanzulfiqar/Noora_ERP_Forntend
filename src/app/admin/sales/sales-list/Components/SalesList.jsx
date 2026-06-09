import { useEffect, useMemo, useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import PageTItle from '@/components/PageTItle'
import FilterBar from './FilterBar'
import KpiGrid from './KpiGrid'
import SalesTrendChart from './SalesTrendChart'
import SalesByStatusDonut from './SalesByStatusDonut'
import TopSellersChart from './TopSellersChart'
import TopProjectsChart from './TopProjectsChart'
import SalesTableExpanded from './SalesTableExpanded'
import { useGetAdminSalesDashboardQuery } from '@/services/authenticateendpoint/sales'
import { useAuth } from '@/hooks/useAuth'
import { toIsoDate } from './formatters'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'

const startOfMonth = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

const initialFilter = {
  from: startOfMonth(),
  to: new Date(),
  projectId: '',
  sellerId: '',
  warehouseId: '',
  status: '',
  search: '',
}

const SalesList = () => {
  const { role } = useAuth()
  const isAdmin = role?.toLowerCase() === 'admin'

  const [appliedFilter, setAppliedFilter] = useState(initialFilter)

  const hasNonDateFilters = Boolean(
    appliedFilter.projectId ||
      appliedFilter.sellerId ||
      appliedFilter.warehouseId ||
      appliedFilter.status
  )

  const dashboardFilter = useMemo(() => {
    const f = {}
    const from = toIsoDate(appliedFilter.from)
    const to = toIsoDate(appliedFilter.to)
    if (from) f.dateFrom = from
    if (to) f.dateTo = to
    if (appliedFilter.projectId) f.projectId = appliedFilter.projectId
    if (appliedFilter.sellerId) f.sellerId = appliedFilter.sellerId
    if (appliedFilter.warehouseId) f.warehouseId = appliedFilter.warehouseId
    return f
  }, [appliedFilter])

  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useGetAdminSalesDashboardQuery(
    dashboardFilter,
    { refetchOnMountOrArgChange: true, skip: !isAdmin }
  )

  useEffect(() => {
    if (dashboardError) toast.error(extractApiErrorMessage(dashboardError));
  }, [dashboardError]);

  const chartCol = hasNonDateFilters ? { md: 6, lg: 3 } : { md: 6, lg: 4 }

  return (
    <>
      <PageTItle title="All Sales" />

      {isAdmin && (
        <>
          <FilterBar onApply={setAppliedFilter} />

          {dashboardLoading && !dashboard ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <KpiGrid data={dashboard} />

              <Row className="mb-3">
                <Col {...chartCol} className="mb-3">
                  <SalesTrendChart data={dashboard?.salesTrend} />
                </Col>
                <Col {...chartCol} className="mb-3">
                  <SalesByStatusDonut data={dashboard?.statusBreakdown} />
                </Col>
                <Col {...chartCol} className="mb-3">
                  <TopSellersChart
                    data={dashboard?.topSellers}
                    orientation={hasNonDateFilters ? 'horizontal' : 'vertical'}
                  />
                </Col>
                {hasNonDateFilters && (
                  <Col {...chartCol} className="mb-3">
                    <TopProjectsChart data={dashboard?.topProjects} />
                  </Col>
                )}
              </Row>
            </>
          )}
        </>
      )}

      <SalesTableExpanded filter={appliedFilter} />
    </>
  )
}

export default SalesList
