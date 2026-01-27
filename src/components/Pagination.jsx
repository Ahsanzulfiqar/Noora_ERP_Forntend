
import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import IconifyIcon from './wrappers/IconifyIcon';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxDisplayedPages = 5; // Number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

    if (endPage - startPage + 1 < maxDisplayedPages) {
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }

    for (let number = startPage; number <= endPage; number++) {
        items.push(
            <BootstrapPagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => onPageChange(number)}
            >
                {number}
            </BootstrapPagination.Item>
        );
    }

    return (
        <div className="d-flex justify-content-end align-items-center mt-3">
            <BootstrapPagination>
                <BootstrapPagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <IconifyIcon icon="mdi:chevron-left" className="fs-18" />
                </BootstrapPagination.Prev>

                {startPage > 1 && (
                    <>
                        <BootstrapPagination.Item onClick={() => onPageChange(1)}>1</BootstrapPagination.Item>
                        {startPage > 2 && <BootstrapPagination.Ellipsis />}
                    </>
                )}

                {items}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <BootstrapPagination.Ellipsis />}
                        <BootstrapPagination.Item onClick={() => onPageChange(totalPages)}>{totalPages}</BootstrapPagination.Item>
                    </>
                )}

                <BootstrapPagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <IconifyIcon icon="mdi:chevron-right" className="fs-18" />
                </BootstrapPagination.Next>
            </BootstrapPagination>
        </div>
    );
};

export default Pagination;
