import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const CandidateList = () => {
    const queryClient = useQueryClient();
    const { role } = useAuth();
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [filter, setFilter] = useState("all");

    // Fetch candidates
    const { data: candidates, isLoading, error } = useQuery({
        queryKey: ["candidates"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/candidates");
            return res.data;
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axiosSecure.delete(`/api/candidates/${id}`);
        },
        onSuccess: () => {
            Swal.fire("Deleted!", "Candidate has been removed.", "success");
            queryClient.invalidateQueries(["candidates"]);
        },
        onError: (err) => {
            Swal.fire("Error!", err.message || "Failed to delete candidate.", "error");
        }
    });

    const handleDelete = (id, name) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete ${name}. This action cannot be undone!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            background: 'var(--fallback-b1,oklch(var(--b1)))',
            color: 'var(--fallback-bc,oklch(var(--bc)))',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    const handleDownloadPhones = async () => {
        try {
            const res = await axiosSecure.get("/api/candidates/download-phones", {
                responseType: "blob",
            });

            const blob = new Blob([res.data], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "candidate-phones.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            Swal.fire({
                icon: 'success',
                title: 'Downloaded!',
                text: 'Phone numbers have been downloaded successfully.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Download Error:", error);
            Swal.fire("Error", "Failed to download phone numbers", "error");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    if (error) return (
        <div className="alert alert-error">
            <span>Error: {error.message}</span>
        </div>
    );

    const filteredCandidates = candidates?.filter(c => {
        if (filter === "all") return true;
        if (filter === "hired") return c.status === "Hired";
        if (filter === "rejected") return c.status === "Rejected";
        return true;
    });

    const isStaff = role === 'staff';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic underline decoration-primary decoration-4 underline-offset-4">Candidate List</h2>
                    <div className="badge badge-outline border-primary/30 font-bold opacity-70 italic">{filteredCandidates?.length} found</div>
                </div>
                <button
                    onClick={handleDownloadPhones}
                    className="btn btn-primary btn-sm md:btn-md font-black italic shadow-lg hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0 4.5-4.5M12 16.5V3" />
                    </svg>
                    Download Phones
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="tabs tabs-boxed bg-base-100 border border-base-300 w-fit">
                <button
                    onClick={() => setFilter("all")}
                    className={`tab font-bold transition-all ${filter === "all" ? "tab-active !bg-primary !text-primary-content" : ""}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("hired")}
                    className={`tab font-bold transition-all ${filter === "hired" ? "tab-active !bg-success !text-success-content" : ""}`}
                >
                    Hired
                </button>
                <button
                    onClick={() => setFilter("rejected")}
                    className={`tab font-bold transition-all ${filter === "rejected" ? "tab-active !bg-error !text-error-content" : ""}`}
                >
                    Rejected
                </button>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-3xl border border-base-300 shadow-xl">
                <table className="table table-zebra w-full">
                    {/* head */}
                    <thead className="bg-base-200">
                        <tr className="text-secondary uppercase font-black tracking-widest text-[10px]">
                            <th>Candidate</th>
                            <th>Contact Info</th>
                            <th>Details</th>
                            <th>Status</th>
                            {!isStaff && <th className="text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCandidates?.length === 0 ? (
                            <tr>
                                <td colSpan={isStaff ? "4" : "5"} className="text-center py-10 opacity-50 italic font-bold">
                                    No candidates found in this category
                                </td>
                            </tr>
                        ) : (
                            filteredCandidates?.map((candidate) => (
                                <tr key={candidate._id} className="hover:bg-primary/5 transition-colors">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-primary text-primary-content rounded-full w-10 ring ring-primary/20 ring-offset-base-100 ring-offset-2">
                                                    <span className="font-black">{candidate.name?.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-black text-base italic">{candidate.name}</div>
                                                <div className="text-[10px] opacity-60 font-bold uppercase tracking-tighter">Candidate ID: {candidate._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                                </svg>
                                                {candidate.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.312a2.25 2.25 0 0 0-.714-1.615l-3.94-3.581a2.25 2.25 0 0 0-3.12 0l-1.605 1.457a1.5 1.5 0 0 1-1.915.068l-4.441-3.27a1.5 1.5 0 0 1-.068-1.915l1.457-1.605a2.25 2.25 0 0 0 0-3.12l-3.581-3.94a2.25 2.25 0 0 0-1.615-.714H4.125a2.25 2.25 0 0 0-2.25 2.25v1.313c0 .62.375 1.178.948 1.423a15.421 15.421 0 0 0 7.29 2.162" />
                                                </svg>
                                                {candidate.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <div className="badge badge-outline border-base-300 text-[10px] font-black uppercase">Exp: {candidate.experience_years}Y</div>
                                            <div className="badge badge-outline border-base-300 text-[10px] font-black uppercase">Age: {candidate.age}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm font-black uppercase tracking-widest ${candidate.status === 'pending' ? 'badge-warning' :
                                            candidate.status === 'Interview Scheduled' ? 'badge-info' :
                                                candidate.status === 'Hired' ? 'badge-success' :
                                                    candidate.status === 'Rejected' ? 'badge-error' :
                                                        'badge-neutral'
                                            }`}>
                                            {candidate.status}
                                        </span>
                                    </td>
                                    {!isStaff && (
                                        <td className="text-right">
                                            <div className="join shadow-sm border border-base-300">
                                                <button
                                                    onClick={() => setEditingCandidate(candidate)}
                                                    className="btn btn-square btn-ghost btn-sm join-item hover:bg-info hover:text-info-content"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(candidate._id, candidate.name)}
                                                    disabled={deleteMutation.isPending}
                                                    className="btn btn-square btn-ghost btn-sm join-item hover:bg-error hover:text-error-content"
                                                >
                                                    {deleteMutation.isPending ? <span className="loading loading-spinner loading-xs"></span> : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modern Edit Modal */}
            {editingCandidate && (
                <EditModal
                    candidate={editingCandidate}
                    onClose={() => setEditingCandidate(null)}
                    onSuccess={() => {
                        queryClient.invalidateQueries(["candidates"]);
                        setEditingCandidate(null);
                    }}
                />
            )}
        </div>
    );
};

// Refactored Edit Modal Component
const EditModal = ({ candidate, onClose, onSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: candidate.name,
            phone: candidate.phone,
            experience_years: candidate.experience_years,
            age: candidate.age,
            status: candidate.status,
        }
    });

    const editMutation = useMutation({
        mutationFn: async (data) => {
            await axiosSecure.put(`/api/candidates/${candidate._id}`, data);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Candidate info has been updated.',
                timer: 2000,
                showConfirmButton: false
            });
            onSuccess();
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "Failed to update candidate", "error");
        }
    });

    const onSubmit = (data) => {
        editMutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 bg-base-300/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 animate-in zoom-in-95 duration-300">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Edit <span className="text-primary">Candidate</span></h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle font-bold">✕</button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="form-control">
                            <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Full Name</span></label>
                            <input
                                type="text"
                                className={`input input-bordered input-sm font-bold ${errors.name ? 'input-error' : ''}`}
                                {...register("name", { required: "Name is required" })}
                                placeholder="Candidate Name"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Phone Number</span></label>
                            <input
                                type="text"
                                className={`input input-bordered input-sm font-bold ${errors.phone ? 'input-error' : ''}`}
                                {...register("phone", { required: "Phone is required" })}
                                placeholder="Phone Number"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Experience (Yrs)</span></label>
                                <input
                                    type="number"
                                    className={`input input-bordered input-sm font-bold ${errors.experience_years ? 'input-error' : ''}`}
                                    {...register("experience_years", { required: "Required" })}
                                    placeholder="Years"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Age</span></label>
                                <input
                                    type="number"
                                    className={`input input-bordered input-sm font-bold ${errors.age ? 'input-error' : ''}`}
                                    {...register("age", { required: "Required" })}
                                    placeholder="Age"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Recruitment Status</span></label>
                            <select
                                className="select select-bordered select-sm font-bold"
                                {...register("status")}
                            >
                                <option value="pending">Pending</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                            </select>
                        </div>

                        <div className="card-actions justify-end mt-8 gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-ghost btn-sm font-black uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={editMutation.isPending}
                                className="btn btn-primary btn-sm font-black uppercase px-6"
                            >
                                {editMutation.isPending ? <span className="loading loading-spinner loading-xs"></span> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CandidateList;
