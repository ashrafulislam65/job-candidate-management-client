import { useState } from "react";
import CandidateList from "./CandidateList";
import CandidateUpload from "../components/CandidateUpload";
import InterviewManagement from "./InterviewManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("candidates");

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-4 border-b">
                <button
                    onClick={() => setActiveTab("candidates")}
                    className={`px-4 py-2 ${activeTab === "candidates"
                            ? "border-b-2 border-blue-500 font-bold"
                            : "text-gray-600"
                        }`}
                >
                    Candidates
                </button>
                <button
                    onClick={() => setActiveTab("interviews")}
                    className={`px-4 py-2 ${activeTab === "interviews"
                            ? "border-b-2 border-blue-500 font-bold"
                            : "text-gray-600"
                        }`}
                >
                    Interviews
                </button>
            </div>

            {/* Content */}
            {activeTab === "candidates" ? (
                <>
                    <CandidateUpload />
                    <CandidateList />
                </>
            ) : (
                <InterviewManagement />
            )}
        </div>
    );
};

export default AdminDashboard;
