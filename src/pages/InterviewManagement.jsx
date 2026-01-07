import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import ScheduleInterviewModal from "../components/ScheduleInterviewModal";

const InterviewManagement = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Fetch interviews
    const { data: interviews, isLoading } = useQuery({
        queryKey: ["interviews"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/interviews");
            return res.data;
        },
    });

    const upcomingInterviews = interviews?.filter(
        (i) => i.status === "Scheduled"
    );
    const completedInterviews = interviews?.filter(
        (i) => i.status === "Completed" || i.status === "Cancelled"
    );

    const displayInterviews =
        activeTab === "upcoming" ? upcomingInterviews : completedInterviews;

    if (isLoading) return <p>Loading interviews...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Interview Management</h2>
                <button
                    onClick={() => setShowScheduleModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Schedule Interview
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4 border-b">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-4 py-2 ${activeTab === "upcoming"
                            ? "border-b-2 border-blue-500 font-bold"
                            : "text-gray-600"
                        }`}
                >
                    Upcoming ({upcomingInterviews?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-4 py-2 ${activeTab === "completed"
                            ? "border-b-2 border-blue-500 font-bold"
                            : "text-gray-600"
                        }`}
                >
                    Completed ({completedInterviews?.length || 0})
                </button>
            </div>

            {/* Interview List */}
            <div className="bg-white rounded-lg shadow">
                {displayInterviews?.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">No interviews found</p>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Candidate</th>
                                <th className="px-4 py-2 border">Date</th>
                                <th className="px-4 py-2 border">Time</th>
                                <th className="px-4 py-2 border">Type</th>
                                <th className="px-4 py-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayInterviews?.map((interview) => (
                                <tr key={interview._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">
                                        {interview.candidate?.name || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">{interview.date}</td>
                                    <td className="px-4 py-2 border">{interview.time}</td>
                                    <td className="px-4 py-2 border">{interview.type}</td>
                                    <td className="px-4 py-2 border">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${interview.status === "Scheduled"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {interview.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showScheduleModal && (
                <ScheduleInterviewModal onClose={() => setShowScheduleModal(false)} />
            )}
        </div>
    );
};

export default InterviewManagement;
