import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = (props) => {
  const { toastState } = props;
  const { position, autoCloseTime } = toastState;

  return (
    <div>
      <ToastContainer
        position={position || "top-right"}
        autoClose={autoCloseTime || 2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        limit={1}
      />
    </div>
  );
};

export default Toast;
