import SigninForm from "./components/signinForm";
import SignupForm from "./components/signupForm";
import EBucketSubscription from "./components/subscriptionPurchase";
import {BrowserRouter, Routes,Route} from "react-router-dom";

const App = () => {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path={"/payement"} element={<EBucketSubscription/>}/>
        <Route path={"/signup"} element={<SignupForm/>}/>
        <Route path={"/signin"} element={<SigninForm/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;

