import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, role, loading, isRoleLoading } = useAuth();

    // Wait for auth and role to load
    if (loading || isRoleLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>;
    }

    // Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is allowed
    if (!role || !allowedRoles.includes(role)) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-bold">Access Denied</p>
                <p>You don't have permission to access this page.</p>
                <p className="text-sm mt-2">Your role: {role || 'None'}</p>
            </div>
        </div>;
    }

    return children;
};

export default RoleRoute;
