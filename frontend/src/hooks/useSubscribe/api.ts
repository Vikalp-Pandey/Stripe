import axios from "axios";

async function createSubscription() {
  const baseUrl = import.meta.env.BASE_BACKEND_URL
  const res = await axios.get(`${baseUrl}/api/payment/checkout-payment`);


  if (!res.data?.url) {
    throw new Error("Failed to create checkout session");
  }

  return res.data;
}

export default createSubscription;
