import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Stats from './components/Stats';
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse';
import { useAuth } from '@/hooks/useAuth';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { FilterDateRange, FilterClearAll } from '@/components/Filters';

const getDefaultDates = () => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  const fmt = (d) => d.toISOString().split('T')[0];
  return { from: fmt(from), to: fmt(to) };
};

const DashboardPage = () => {
  const defaults = getDefaultDates();
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const { role } = useAuth();
  const isAdmin = role?.toLowerCase() === 'admin';

  const { data: warehouses = [], error: warehousesError, refetch: refetchWarehouses } = useGetAllWarehousesQuery(undefined, { skip: !isAdmin });

  useEffect(() => {
    if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
  }, [warehousesError]);

return (
    <>
      {isAdmin && (
        <Row className="mb-3">
          <Col xs={12}>
            <Card>
              <CardBody className="py-2">
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <label className="mb-0 text-muted fw-semibold fs-13">Warehouse:</label>
                    <Form.Select
                      size="sm"
                      style={{ width: 180 }}
                      value={selectedWarehouse || ''}
                      onChange={(e) => setSelectedWarehouse(e.target.value || null)}
                    >
                      <option value="">All Warehouses</option>
                      {warehouses.map((wh) => (
                        <option key={wh._id} value={wh._id}>
                          {wh.name} {wh.city ? `(${wh.city})` : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <FilterDateRange
                    inline
                    label="Date Range"
                    size="sm"
                    from={from}
                    to={to}
                    onChange={({ from: nextFrom, to: nextTo }) => {
                      setFrom(nextFrom)
                      setTo(nextTo)
                    }}
                    style={{ width: 240 }}
                  />
                  <FilterClearAll
                    size="sm"
                    onClear={() => {
                      setSelectedWarehouse(null)
                      setFrom('')
                      setTo('')
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Stats
          from={from}
          to={to}
          warehouseIds={selectedWarehouse ? [selectedWarehouse] : []}
        />
       
      </Row>
    </>
  );
};
export default DashboardPage;