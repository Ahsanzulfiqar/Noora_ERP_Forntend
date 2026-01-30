import React from 'react';
import { Form } from 'react-bootstrap';
import Pagination from '@/components/Pagination';

const CustomTablePaginations = ({
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    options = [10, 20, 50, 100]
}) => {
    return (
        <div className="pt-2 pb-0 px-3 border-top d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
                <span>Rows per page:</span>
                <Form.Select
                    size="sm"
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                    style={{ width: '80px' }}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
            </div>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};

export default CustomTablePaginations;
