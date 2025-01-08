"use client"
import { useRouter } from "next/router";

const SuccessPage = () => {
  const router = useRouter();
  const { payment_id, status, merchant_order_id } = router.query;

  return (
    <div>
      <h1>¡Pago Exitoso!</h1>
      <p>Payment ID: {payment_id}</p>
      <p>Status: {status}</p>
      <p>Order ID: {merchant_order_id}</p>
    </div>
  );
};

export default SuccessPage;
