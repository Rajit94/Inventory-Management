import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import "./index.css";

const pages = {
  dashboard:  <Dashboard />,
  products:   <Products />,
  categories: <Categories />,
  suppliers:  <Suppliers />,
};

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="main">{pages[page]}</main>
    </div>
  );
}

export default App;