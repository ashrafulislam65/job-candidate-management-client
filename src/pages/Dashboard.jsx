import AdminDashboard from "./AdminDashboard";
import CandidateDashboard from "./CandidateDashboard";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
    const { user, logout, role, isRoleLoading } = useAuth();

    if (isRoleLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200">
            {/* Premium Navbar */}
            <div className="navbar bg-base-100 shadow-lg px-4 lg:px-8">
                <div className="flex-1">
                    <a className="text-2xl font-black uppercase tracking-widest text-primary italic">JobPortal</a>
                </div>
                <div className="flex-none gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold opacity-50 uppercase tracking-tighter">Logged in as</p>
                        <p className="text-sm font-black">{user?.email}</p>
                    </div>
                    <div className="badge badge-primary font-bold uppercase">{role}</div>
                    <button onClick={logout} className="btn btn-error btn-sm btn-outline font-bold">
                        Logout
                    </button>
                </div>
            </div>

            <main className="container mx-auto p-4 lg:p-8">
                {role === 'admin' || role === 'staff' ? (
                    <AdminDashboard />
                ) : role === 'candidate' ? (
                    <CandidateDashboard />
                ) : (
                    <div className="alert alert-warning shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Access Limited. Your role is: <span className="font-bold underline">{role || 'None'}</span>. Please contact support.</span>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
