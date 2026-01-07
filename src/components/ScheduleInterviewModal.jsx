import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ScheduleInterviewModal = ({ onClose, preSelectedCandidates = [] }) => {
    const queryClient = useQueryClient();
    const [selectedCandidates, setSelectedCandidates] = useState(preSelectedCandidates);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            date: "",
            time: "",
            type: "Technical",
        }
    });

    // Fetch candidates for selection (only those not already interviewed or needing re-interview)
    const { data: candidates, isLoading: isCandidatesLoading } = useQuery({
        queryKey: ["candidates"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/candidates");
            return res.data;
        },
    });

    const scheduleMutation = useMutation({
        mutationFn: async (interviewData) => {
            await axiosSecure.post("/api/interviews", interviewData);
        },
        onSuccess: () => {
            // Success is handled after all mutations finish in onSubmit
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "Failed to schedule", "error");
        }
    });

    const handleToggleCandidate = (candidateId) => {
        setSelectedCandidates((prev) =>
            prev.includes(candidateId)
                ? prev.filter((id) => id !== candidateId)
                : [...prev, candidateId]
        );
    };

    const onSubmit = async (data) => {
        if (selectedCandidates.length === 0) {
            Swal.fire("Notice", "Please select at least one candidate", "warning");
            return;
        }

        Swal.fire({
            title: 'Scheduling...',
            html: 'Please wait while we schedule the interviews.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Schedule interview for each selected candidate
            const promises = selectedCandidates.map((candidateId) =>
                axiosSecure.post("/api/interviews", {
                    candidateId,
                    date: data.date,
                    time: data.time,
                    type: data.type,
                })
            );

            await Promise.all(promises);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `${selectedCandidates.length} interviews scheduled successfully.`,
                timer: 2000,
                showConfirmButton: false
            });

            queryClient.invalidateQueries(["interviews"]);
            queryClient.invalidateQueries(["candidates"]);
            onClose();
        } catch (err) {
            Swal.fire("Error", "Some schedules failed to save.", "error");
        }
    };

    return (
        <div className="fixed inset-0 bg-base-300/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="card w-full max-w-2xl bg-base-100 shadow-2xl border border-base-300 animate-in zoom-in-95 duration-300">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Schedule <span className="text-primary">Interview</span></h3>
                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Plan your technical and HR evaluations</p>
                        </div>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle font-bold">✕</button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200 p-4 rounded-2xl border border-base-300">
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Date</span></label>
                                <input
                                    type="date"
                                    className={`input input-bordered input-sm font-bold ${errors.date ? 'input-error' : ''}`}
                                    {...register("date", { required: "Required" })}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Time</span></label>
                                <input
                                    type="time"
                                    className={`input input-bordered input-sm font-bold ${errors.time ? 'input-error' : ''}`}
                                    {...register("time", { required: "Required" })}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Interview Type</span></label>
                                <select
                                    className="select select-bordered select-sm font-bold"
                                    {...register("type")}
                                >
                                    <option value="Technical">Technical</option>
                                    <option value="HR">HR</option>
                                    <option value="Managerial">Managerial</option>
                                    <option value="General">General</option>
                                    <option value="Second Interview">Second Interview</option>
                                </select>
                            </div>
                        </div>

                        {/* Candidate Selection */}
                        <div className="space-y-3">
                            <label className="label py-0 px-2 flex justify-between items-end">
                                <span className="label-text font-black uppercase text-[10px] opacity-70 italic underline decoration-primary decoration-2 underline-offset-4">Select Candidates</span>
                                <span className="badge badge-primary badge-sm font-black italic">{selectedCandidates.length} Selected</span>
                            </label>

                            <div className="border border-base-300 rounded-2xl max-h-60 overflow-y-auto bg-base-50 p-1">
                                {isCandidatesLoading ? (
                                    <div className="flex justify-center p-10"><span className="loading loading-spinner text-primary"></span></div>
                                ) : candidates?.length === 0 ? (
                                    <p className="text-center p-10 text-xs italic opacity-40">No available candidates found</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                        {candidates?.map((candidate) => (
                                            <div
                                                key={candidate._id}
                                                onClick={() => handleToggleCandidate(candidate._id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedCandidates.includes(candidate._id)
                                                    ? "bg-primary/10 border-primary shadow-sm"
                                                    : "hover:bg-base-200 border-transparent"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCandidates.includes(candidate._id)}
                                                    onChange={(e) => { e.stopPropagation(); handleToggleCandidate(candidate._id); }}
                                                    className="checkbox checkbox-primary checkbox-sm shadow-none"
                                                />
                                                <div className="min-w-0">
                                                    <div className="font-black text-xs truncate">{candidate.name}</div>
                                                    <div className="text-[9px] opacity-60 font-bold truncate uppercase">{candidate.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card-actions justify-end mt-8 gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-ghost btn-sm font-black uppercase tracking-widest text-[11px]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={scheduleMutation.isPending}
                                className="btn btn-primary btn-sm px-10 font-black uppercase italic tracking-tighter shadow-lg"
                            >
                                Confirm Schedule
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ScheduleInterviewModal;
