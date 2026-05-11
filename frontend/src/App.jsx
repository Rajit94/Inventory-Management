import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";

const pages = {
  dashboard: <Dashboard />,
  products: <Products />,
  categories: <Categories />,
  suppliers: <Suppliers />,
};

function App() {
  const { user, checking, isAuthenticated, login, logout } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (checking) {
    return (
      <div className="loading-screen">
        <div className="loading-ring" />
        <p>Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthenticated={login} />;
  }

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} />
      <main className="main">{pages[page]}</main>
    </div>
  );
}

export default App;
