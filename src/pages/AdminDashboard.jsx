import { useState } from "react";
import CandidateList from "./CandidateList";
import CandidateUpload from "../components/CandidateUpload";
import InterviewManagement from "./InterviewManagement";
import UserManagement from "./UserManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("candidates");

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Admin <span className="text-primary">Panel</span></h2>

                {/* daisyUI Tabs */}
                <div role="tablist" className="tabs tabs-boxed bg-base-100 p-1 shadow-inner border border-base-300">
                    <button
                        role="tab"
                        onClick={() => setActiveTab("candidates")}
                        className={`tab font-bold transition-all ${activeTab === "candidates" ? "tab-active !bg-primary !text-primary-content" : ""}`}
                    >
                        Candidates
                    </button>
                    <button
                        role="tab"
                        onClick={() => setActiveTab("interviews")}
                        className={`tab font-bold transition-all ${activeTab === "interviews" ? "tab-active !bg-primary !text-primary-content" : ""}`}
                    >
                        Interviews
                    </button>
                    <button
                        role="tab"
                        onClick={() => setActiveTab("users")}
                        className={`tab font-bold transition-all ${activeTab === "users" ? "tab-active !bg-primary !text-primary-content" : ""}`}
                    >
                        User Management
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="bg-base-100 rounded-3xl p-6 lg:p-8 shadow-xl border border-base-300 min-h-[60vh]">
                {activeTab === "candidates" ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <CandidateUpload />
                        </section>
                        <div className="divider opacity-20"></div>
                        <section>
                            <CandidateList />
                        </section>
                    </div>
                ) : activeTab === "interviews" ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <InterviewManagement />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <UserManagement />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
