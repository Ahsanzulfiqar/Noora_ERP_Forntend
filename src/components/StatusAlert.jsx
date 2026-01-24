import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const StatusAlert = ({
  isSuccess = false,
  error = null,
  message = "",
  redirect = false,
  path = "",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // SUCCESS ALERT
    if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed && redirect && path) {
          navigate(path);
        }
      });
    }

    // ERROR ALERT
    if (error) {
      // Extract error message from GraphQL error structure or fallback to standard error
      const errorMessage =
        error?.data?.errors?.[0]?.message ||
        error?.message ||
        "Something went wrong";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  }, [isSuccess, error, message, redirect, path, navigate]);

  return null; // no UI render
};

export default StatusAlert;
