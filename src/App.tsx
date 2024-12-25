import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/register";
import ResearchLayout from "./pages/research/research-layout";
import Research from "./pages/research/research";
import ProtectedRoute from "middleware/protected-route/protected-route";
import DashBoard from "./pages/dashboard/dashboard";
import ResearchDetail from "pages/research/research-detail/research-detail";
import EditProfile from "pages/profile/edit-profile/edit-profile";
import ChangePassword from "pages/profile/change-password/change-password";
import FavoriteResearch from "pages/research/favorite-research/favorite-research";
import NonProtectedRoute from "middleware/non-protected-route/non-protected-route";
import ProtectedAdminRoute from "middleware/protected-admin-route/protected-admin-route";
import NonProtectedAdminRoute from "middleware/non-protected-admin-route/non-protected-admin-route";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<NonProtectedRoute><Login /></NonProtectedRoute>} />
            <Route path="/register" element={<NonProtectedRoute><Register /></NonProtectedRoute>} />
            <Route path="/" element={<ResearchLayout />}>
                <Route index element={<NonProtectedAdminRoute><Navigate to="research" replace /></NonProtectedAdminRoute>} />
                <Route path="research" element={<NonProtectedAdminRoute><Research /></NonProtectedAdminRoute>} />
                <Route path="research/:id" element={<NonProtectedAdminRoute><ResearchDetail /></NonProtectedAdminRoute>} />
                <Route path="research/favorite-research" element={<ProtectedRoute><FavoriteResearch /></ProtectedRoute>} />
            </Route>
            <Route path="profile/edit-profile" element={<ProtectedRoute><EditProfile></EditProfile></ProtectedRoute>} />
            <Route path="profile/change-password" element={<ProtectedRoute><ChangePassword></ChangePassword></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/research" replace />} />
            <Route path="/dashboard" element={<ProtectedAdminRoute><DashBoard></DashBoard></ProtectedAdminRoute>} />
        </Routes>
    );
}

export default App;
