import React from 'react';

const LoaderSpinner = ({ show = false, colSpan = 1 }) => {
    if (!show) return null;

    const spinnerStyles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40dvh',
            width: '100%'
        },
        tableRow: {
            height: '40dvh'
        },
        tableCell: {
            padding: 0,
            height: '40dvh',
            verticalAlign: 'middle'
        },
        spinner: {
            width: '3rem',
            height: '3rem'
        }
    };

    return (
        <tr style={spinnerStyles.tableRow}>
            <td 
                colSpan={colSpan} 
                style={spinnerStyles.tableCell}
                className="text-center"
            >
                <div style={spinnerStyles.container}>
                    <div 
                        className="spinner-border text-primary" 
                        style={spinnerStyles.spinner}
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default LoaderSpinner;