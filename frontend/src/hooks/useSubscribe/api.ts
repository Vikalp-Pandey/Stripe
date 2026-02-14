import axios from "axios";

async function createSubscription() {
  const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL
  const res = await axios.get(`${baseUrl}/api/payment/checkout-payment`);
  return res.data
}
export default createSubscription;
