import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Stats from './components/Stats';
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse';
import { useAuth } from '@/hooks/useAuth';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { FilterSelect, FilterDateRange, FilterClearAll } from '@/components/Filters';

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
                  <FilterSelect
                    inline
                    label="Warehouse"
                    size="sm"
                    style={{ width: 200 }}
                    value={selectedWarehouse || ''}
                    onChange={(v) => setSelectedWarehouse(v || null)}
                    options={[
                      { value: '', label: 'All Warehouses' },
                      ...warehouses.map((wh) => ({
                        value: wh._id,
                        label: `${wh.name}${wh.city ? ` (${wh.city})` : ''}`,
                      })),
                    ]}
                  />
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