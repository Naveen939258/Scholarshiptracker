import { Routes, Route } from "react-router-dom";
import AdminLogin from './Pages/Admin/AdminLogin';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Layout from './Components/Layout/Layout';
import DashBoard from './Pages/Admin/DashBoard';
import Users from "./Pages/Admin/Users";
import AdminScholarships from "./Pages/Admin/AdminScholarships";
import AdminApplication from "./Pages/Admin/AdminApplication";
import AdminNotification from "./Pages/Admin/AdminNotification";
import AdminProfile from "./Pages/Admin/AdminProfile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashBoard/>
            </Layout>
          </ProtectedRoute>
        }
      /><Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/scholarships"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminScholarships />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminApplication />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminNotification />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>


  );
}

export default App;
