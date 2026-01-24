import React from 'react';

const TableNoData = ({ colSpan, message = "No Record Found" }) => {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center py-5">
                <div className="text-muted fs-18 fw-medium">{message}</div>
            </td>
        </tr>
    );
};

export default TableNoData;
