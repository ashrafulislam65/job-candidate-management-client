const CandidateDashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">Welcome, Candidate!</p>
                <p className="mt-2 text-sm text-gray-500">Track your application status here.</p>
                {/* Placeholder for future features */}
                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded">
                    <p className="text-center text-gray-400">Application details will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
