
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './css/styles.css'
import Register from "./component/register";
import Home from "./Home";
function App() {
  return (
    <BrowserRouter>
        <Routes>
 
           <Route index path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="*" element={<App />} /> */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
