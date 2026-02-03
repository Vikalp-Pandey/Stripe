import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {signupUser, signinUser } from "./api";

export const useAuth = ()=>{
    const signup = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
         toast.success("Account created successfully.");
         window.location.href = "/payement"
    },
    onError: (error: any) => {
      console.log(error); 
    },
  });
    const signin = useMutation({
    mutationFn: signinUser,
    onSuccess: () => {
         toast.success("User Signed in Successfully.");
         window.location.href = "/payement"
    },
    onError: (error: any) => {
      console.log(error); 
    },
  });

  return {
    signup:signup,
    signin:signin
  }
}
