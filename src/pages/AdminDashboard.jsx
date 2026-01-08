import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import CandidateList from "./CandidateList";
import CandidateUpload from "../components/CandidateUpload";
import InterviewManagement from "./InterviewManagement";
import UserManagement from "./UserManagement";

import useAuth from "../hooks/useAuth";

const AdminDashboard = () => {
    const { role } = useAuth();
    const [activeTab, setActiveTab] = useState("candidates");
    const isAdmin = role?.toLowerCase() === 'admin';

    // Fetch Analytics Data
    const { data: candidates } = useQuery({
        queryKey: ["candidates"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/candidates");
            return res.data;
        }
    });

    const { data: interviews } = useQuery({
        queryKey: ["interviews"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/interviews");
            return res.data;
        }
    });

    const stats = {
        total: candidates?.length || 0,
        pipeline: interviews?.filter(i => i.status === "Scheduled").length || 0,
        hired: candidates?.filter(c => c.status === "Hired").length || 0,
        rejected: candidates?.filter(c => c.status === "Rejected").length || 0
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">
                    {isAdmin ? "Admin" : "Staff"} <span className="text-primary">Panel</span>
                </h2>

                
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
                    {isAdmin && (
                        <button
                            role="tab"
                            onClick={() => setActiveTab("users")}
                            className={`tab font-bold transition-all ${activeTab === "users" ? "tab-active !bg-primary !text-primary-content" : ""}`}
                        >
                            User Management
                        </button>
                    )}
                </div>
            </header>

            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-base-100 p-4 rounded-3xl shadow-lg border border-base-300 hover:border-primary transition-all group">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Global Talent Pool</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-3xl font-black italic">{stats.total.toString().padStart(2, '0')}</span>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07m0 0a2.146 2.146 0 0 1 .126-.305m0 0 1.144-3.24m1.144 3.24c.045.127.087.256.126.386m-2.288-3.626.013-.037M12 8.25a.75.75 0 0 1 .75.75v.013a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 p-4 rounded-3xl shadow-lg border border-base-300 hover:border-accent transition-all group">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Active Pipeline</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-3xl font-black italic">{stats.pipeline.toString().padStart(2, '0')}</span>
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 p-4 rounded-3xl shadow-lg border border-base-300 hover:border-success transition-all group">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Onboarded</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-3xl font-black italic">{stats.hired.toString().padStart(2, '0')}</span>
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 p-4 rounded-3xl shadow-lg border border-base-300 hover:border-error transition-all group">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Rejected</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-3xl font-black italic">{stats.rejected.toString().padStart(2, '0')}</span>
                        <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

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
