import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

const CandidateDashboard = () => {
    const { data: candidate, isLoading, error } = useQuery({
        queryKey: ["candidateProfile"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/candidates/me");
            return res.data;
        },
    });

    if (isLoading) return <p>Loading your profile...</p>;
    if (error) return <p className="text-red-500">Error loading profile: {error.message}</p>;
    if (!candidate) return <p className="text-yellow-600">No profile found. Please contact admin.</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Application Status</h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            candidate.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                                candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                                    candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                        }`}>
                        Status: {candidate.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        <p className="text-lg">{candidate.name}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <p className="text-lg">{candidate.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-lg">{candidate.phone}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Age</label>
                        <p className="text-lg">{candidate.age} years</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Experience</label>
                        <p className="text-lg">{candidate.experience_years} years</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Your application is being reviewed. You will be notified of any updates via email.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
