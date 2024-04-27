"use client";

import { Toaster } from "react-hot-toast";
const ToastProvider = () => {
  return <Toaster toastOptions={{ style: { width: "400px" } }} />;
};

export default ToastProvider;
