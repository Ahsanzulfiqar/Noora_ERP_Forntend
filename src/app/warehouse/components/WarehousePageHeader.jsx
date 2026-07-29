import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { FilterSelect } from '@/components/Filters'
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse'
import { useSelectedWarehouse } from '../hooks/useSelectedWarehouse'

const WarehousePageHeader = ({ title, subtitle, actions }) => {
  const { data: warehouses = [] } = useGetAllWarehousesQuery()
  const [warehouseId, setWarehouseId] = useSelectedWarehouse()

  useEffect(() => {
    if (!warehouseId && warehouses.length > 0) {
      setWarehouseId(warehouses[0]._id)
    }
  }, [warehouses, warehouseId, setWarehouseId])

  return (
    <>
      <PageTItle title={title} />
      <Row className="mb-3 align-items-center g-3">
        <Col className="flex-grow-1">
          <h3 className="mb-0">{title}</h3>
          {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
        </Col>
        {actions ? <Col md="auto">{actions}</Col> : null}
        <Col md="auto">
          <FilterSelect
            inline
            label="Warehouse"
            size="sm"
            value={warehouseId}
            onChange={setWarehouseId}
            options={warehouses.map((w) => ({ value: w._id, label: w.name }))}
            placeholder="Select warehouse"
            style={{ minWidth: 200 }}
          />
        </Col>
      </Row>
    </>
  )
}

export default WarehousePageHeader
