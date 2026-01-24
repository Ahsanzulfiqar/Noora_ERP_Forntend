import "./GlobalSpinner.css";

const GlobalSpinner = ({
    show = false,
}) => {
    if (!show) return null;

    return (
        <div className="global-spinner-container">
            <div className="spinner">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`bar bar${i + 1}`} />
                ))}
            </div>

        </div>
    );
};

export default GlobalSpinner;
