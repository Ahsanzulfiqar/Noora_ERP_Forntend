import { useState } from 'react';
import { Row, Col, Card, CardBody, Form } from 'react-bootstrap';
import Stats from './components/Stats';
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse';

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

  const { data: warehouses = [] } = useGetAllWarehousesQuery();

return (
    <>
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
                <div className="d-flex align-items-center gap-2">
                  <label className="mb-0 text-muted fw-semibold fs-13">From:</label>
                  <Form.Control
                    type="date"
                    size="sm"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    style={{ width: 150 }}
                  />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="mb-0 text-muted fw-semibold fs-13">To:</label>
                  <Form.Control
                    type="date"
                    size="sm"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    style={{ width: 150 }}
                  />
                </div>
               
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

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