import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import ScheduleInterviewModal from "../components/ScheduleInterviewModal";
import Swal from "sweetalert2";

import useAuth from "../hooks/useAuth";

const InterviewManagement = () => {
    const { role } = useAuth();
    const isAdmin = role === 'admin';
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("upcoming");
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Fetch interviews
    const { data: interviews, isLoading, error } = useQuery({
        queryKey: ["interviews"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/interviews");
            return res.data;
        },
    });

    // Update status mutation (for both interview and candidate)
    const updateResultMutation = useMutation({
        mutationFn: async ({ interviewId, candidateId, result, interviewType }) => {
            // result can be 'Passed' or 'Rejected'
            await axiosSecure.put(`/api/interviews/${interviewId}/status`, { status: result });

            // Branching Logic for Final Status
            let candidateStatus = 'Rejected';
            if (result === 'Passed') {
                candidateStatus = interviewType === 'Second Interview' ? 'Hired' : 'Passed First Interview';
            }

            await axiosSecure.put(`/api/candidates/${candidateId}`, { status: candidateStatus });
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Process Complete!',
                text: 'Recruitment status has been successfully updated.',
                timer: 2000,
                showConfirmButton: false
            });
            queryClient.invalidateQueries(["interviews"]);
            queryClient.invalidateQueries(["candidates"]);
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "Failed to update result", "error");
        }
    });

    const handleMarkResult = (interviewId, candidateId, name, result, interviewType) => {
        const nextStatus = result === 'Passed'
            ? (interviewType === 'Second Interview' ? 'Hired' : 'Passed First Interview')
            : 'Rejected';

        Swal.fire({
            title: `Mark ${name} as ${result}?`,
            text: `Candidate status will move to: ${nextStatus.toUpperCase()}`,
            icon: result === 'Passed' ? 'success' : 'warning',
            showCancelButton: true,
            confirmButtonColor: result === 'Passed' ? 'var(--fallback-s,oklch(var(--s)))' : 'var(--fallback-er,oklch(var(--er)))',
            confirmButtonText: `Confirm ${result}`,
            background: 'var(--fallback-b1,oklch(var(--b1)))',
            color: 'var(--fallback-bc,oklch(var(--bc)))',
        }).then((res) => {
            if (res.isConfirmed) {
                updateResultMutation.mutate({ interviewId, candidateId, result, interviewType });
            }
        });
    };

    const toggleInterviewStatus = useMutation({
        mutationFn: async ({ id, status }) => {
            await axiosSecure.put(`/api/interviews/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["interviews"]);
        }
    });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    if (error) return <div className="alert alert-error">Error loading interviews</div>;

    const upcomingInterviews = interviews?.filter(i => i.status === "Scheduled");
    const completedInterviews = interviews?.filter(i => i.status !== "Scheduled");

    const displayInterviews = activeTab === "upcoming" ? upcomingInterviews : completedInterviews;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Interview <span className="text-primary">Management</span></h2>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Track and schedule candidate evaluations</p>
                </div>
                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                // Context-aware phone download from Interview page
                                const url = "/api/candidates/download-phones?upcomingOnly=true";
                                axiosSecure.get(url, { responseType: "blob" }).then(res => {
                                    const blob = new Blob([res.data], { type: "text/plain" });
                                    const downloadUrl = window.URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = downloadUrl;
                                    link.download = "upcoming-interview-phones.txt";
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                });
                            }}
                            className="btn btn-outline btn-sm font-black italic"
                        >
                            Download Upcoming Phones
                        </button>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="btn btn-primary btn-sm font-black italic shadow-lg hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Schedule
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div role="tablist" className="tabs tabs-lifted">
                <button
                    role="tab"
                    onClick={() => setActiveTab("upcoming")}
                    className={`tab font-black uppercase tracking-widest text-[11px] ${activeTab === "upcoming" ? "tab-active [--tab-bg:var(--fallback-b1,oklch(var(--b1)))] text-primary" : "opacity-60"}`}
                >
                    Upcoming ({upcomingInterviews?.length || 0})
                </button>
                <button
                    role="tab"
                    onClick={() => setActiveTab("completed")}
                    className={`tab font-black uppercase tracking-widest text-[11px] ${activeTab === "completed" ? "tab-active [--tab-bg:var(--fallback-b1,oklch(var(--b1)))] text-primary" : "opacity-60"}`}
                >
                    Results Management ({completedInterviews?.length || 0})
                </button>
            </div>

            {/* Interview List */}
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-xl overflow-hidden min-h-[400px]">
                {displayInterviews?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] opacity-40 italic">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <p className="font-bold">No {activeTab} interviews recorded</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-base-200">
                                <tr className="text-secondary font-black tracking-widest text-[10px] uppercase">
                                    <th>Candidate</th>
                                    <th>Schedule</th>
                                    <th>Type</th>
                                    <th>Status/Result</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayInterviews?.map((interview) => (
                                    <tr key={interview._id} className="hover:bg-primary/5 transition-colors group">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-lg w-10">
                                                        <span className="font-black text-xs">{interview.candidate?.name?.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-black text-sm italic">{interview.candidate?.name || "N/A"}</div>
                                                    <div className="text-[10px] opacity-60 font-medium">{interview.candidate?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-xs font-bold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-primary">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    {interview.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                    {interview.time}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="badge badge-outline border-base-300 font-black text-[10px] uppercase">{interview.type}</div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm font-black uppercase tracking-tighter ${interview.status === "Scheduled" ? "badge-info" :
                                                interview.status === "Passed" ? "badge-success" :
                                                    interview.status === "Rejected" ? "badge-error" :
                                                        "badge-ghost"
                                                }`}>
                                                {interview.status}
                                            </span>
                                            {interview.status === 'Passed' && (
                                                <div className="text-[9px] font-black uppercase opacity-50 mt-1">Qualified for next stage</div>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            {isAdmin ? (
                                                activeTab === 'upcoming' ? (
                                                    <button
                                                        onClick={() => toggleInterviewStatus.mutate({ id: interview._id, status: 'Completed' })}
                                                        className="btn btn-ghost btn-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-content"
                                                    >
                                                        Mark Done
                                                    </button>
                                                ) : (
                                                    interview.status === 'Completed' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleMarkResult(interview._id, interview.candidateId, interview.candidate?.name, 'Passed', interview.type)}
                                                                className="btn btn-success btn-xs font-black uppercase tracking-tighter shadow-sm"
                                                            >
                                                                Pass
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkResult(interview._id, interview.candidateId, interview.candidate?.name, 'Rejected', interview.type)}
                                                                className="btn btn-error btn-xs font-black uppercase tracking-tighter shadow-sm"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black italic opacity-30 uppercase tracking-widest">Finalized</span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-[10px] font-black italic opacity-30 uppercase tracking-widest">View Only</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showScheduleModal && (
                <ScheduleInterviewModal onClose={() => setShowScheduleModal(false)} />
            )}
        </div>
    );
};

export default InterviewManagement;
