const AdminDashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">Welcome, Admin!</p>
                <p className="mt-2 text-sm text-gray-500">Manage candidates and interviews here.</p>
                {/* Placeholder for future features */}
                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded">
                    <p className="text-center text-gray-400">Candidate List & Upload will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
