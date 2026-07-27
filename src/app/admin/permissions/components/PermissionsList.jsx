import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getPermissionsListData } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Fragment, useState, useMemo } from 'react';
import { Card, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomTablePaginations from '@/components/table/CustomTablePaginations';
const PermissionsList = () => {
  const permissionsData = useFetchData(getPermissionsListData);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const totalItems = permissionsData?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const pagedData = useMemo(
    () => (permissionsData || []).slice((page - 1) * limit, page * limit),
    [permissionsData, page, limit]
  );
  return <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <div>
              <CardTitle as={'h4'}>All Permissions List</CardTitle>
            </div>
            <Dropdown className="dropdown">
              <DropdownToggle as={'a'} href="#" className=" btn btn-sm btn-outline-light rounded content-none icons-center" data-bs-toggle="dropdown" aria-expanded="false">
                This Month <IconifyIcon className="ms-1" width={16} height={16} icon="bx:chevron-down" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div>
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th style={{
                    width: 20
                  }}>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="customCheck1" />
                        <label className="form-check-label" htmlFor="customCheck1" />
                      </div>
                    </th>
                    <th>Name</th>
                    <th>Assigned To</th>
                    <th>Created Date &amp; Time</th>
                    <th>Last Update</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((item, idx) => <tr key={idx}>
                      <td>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="customCheck2" />
                          <label className="form-check-label" htmlFor="customCheck2">
                            &nbsp;
                          </label>
                        </div>
                      </td>
                      <td>
                        <p className="fs-15 mb-0">{item.name}</p>
                      </td>
                      <td>
                        {item.assignedTo.map((assignItem, idx) => <Fragment key={idx}>
                            <span className={`badge bg-${assignItem == 'Administrator' ? 'info-subtle' : assignItem == 'Analyst' ? 'success-subtle' : assignItem == 'Trial' ? 'warning-subtle' : assignItem == 'Developer' ? 'light' : 'primary-subtle'} text-${assignItem == 'Administrator' ? 'info' : assignItem == 'Analyst' ? 'success' : assignItem == 'Trial' ? 'warning' : assignItem == 'Developer' ? 'dark' : 'primary'} py-1 px-2 fs-11`}>
                              {assignItem}
                            </span>
                            &nbsp;
                          </Fragment>)}
                      </td>
                      <td>
                        {item.date.toLocaleString('en-us', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: 'numeric'
                    })}
                      </td>
                      <td>{item.lastUpdate}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to="" className="btn btn-light btn-sm">
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </Link>
                          <Link to="" className="btn btn-soft-primary btn-sm">
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </Link>
                          <Link to="" className="btn btn-soft-danger btn-sm">
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                          </Link>
                        </div>
                      </td>
                    </tr>)}
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
    </Row>;
};
export default PermissionsList;