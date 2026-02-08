import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useSubscribe = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const baseUrl = import.meta.env.BASE_BACKEND_URL;
      const res = await axios.get(`${baseUrl}/api/payment/checkout-payment`);
      return res.data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout (changing the window location)
      window.location.href = data.url;
    },
  });

  return mutation;
};

export default useSubscribe;
