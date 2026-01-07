import AdminDashboard from "./AdminDashboard";
import CandidateDashboard from "./CandidateDashboard";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
    const { user, logout, role, isRoleLoading } = useAuth();

    if (isRoleLoading) return <p>Loading role...</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.email} ({role})</span>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            </div>

            {role === 'admin' || role === 'staff' ? (
                <AdminDashboard />
            ) : role === 'candidate' ? (
                <CandidateDashboard />
            ) : (
                <div className="bg-yellow-100 p-4 rounded text-yellow-700">
                    <p>Access Limited. Role: {role || 'None'}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
