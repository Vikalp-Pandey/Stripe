import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import createSubscription from "./api";

const useSubscribe = () => {
  const mutation = useMutation({
    
    mutationFn: createSubscription,
    onSuccess: (data) => {
       console.log("FRONTEND RECEIVED:", data);
      // Redirect to Stripe Checkout (changing the window location)
      window.location.href = data?.url;
    },
    onError:(e)=>{
   console.log(e);
    }
  });

  return {subscribe: mutation};
};

export default useSubscribe;
