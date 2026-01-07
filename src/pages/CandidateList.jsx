import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import ScheduleInterviewModal from "../components/ScheduleInterviewModal";

const CandidateList = () => {
    const queryClient = useQueryClient();
    const { role } = useAuth();
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Selection state
    const [selectedIds, setSelectedIds] = useState([]);
    const [rangeInput, setRangeInput] = useState("");
    const [showBulkModal, setShowBulkModal] = useState(false);

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
            const isUpcoming = await Swal.fire({
                title: 'Download Selection',
                text: "Select which phone numbers you want to download",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Upcoming Only',
                cancelButtonText: 'All Candidates',
                reverseButtons: true
            });

            const url = isUpcoming.isConfirmed
                ? "/api/candidates/download-phones?upcomingOnly=true"
                : "/api/candidates/download-phones";

            const res = await axiosSecure.get(url, {
                responseType: "blob",
            });

            const blob = new Blob([res.data], { type: "text/plain" });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = isUpcoming.isConfirmed ? "upcoming-phones.txt" : "all-candidate-phones.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

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

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredCandidates.map(c => c._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleApplyRange = () => {
        // Range format: "2-10"
        const [start, end] = rangeInput.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start > end || start < 1) {
            Swal.fire("Invalid Range", "Please enter a valid range (e.g., 2-10)", "error");
            return;
        }

        // Apply range to current filtered list (1-indexed based on table display)
        const idsInRange = filteredCandidates.slice(start - 1, end).map(c => c._id);
        setSelectedIds(prev => [...new Set([...prev, ...idsInRange])]);
        setRangeInput("");
        Swal.fire("Range Applied", `Selected candidates from ${start} to ${end}`, "success");
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
        const matchesSearch =
            c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone?.includes(searchTerm);

        let matchesStatus = true;
        if (filter === "hired") matchesStatus = c.status === "Hired";
        else if (filter === "rejected") matchesStatus = c.status === "Rejected";
        else if (filter !== "all") matchesStatus = c.status === filter;

        return matchesSearch && matchesStatus;
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

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm">
                <div className="form-control relative flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="SEARCH CANDIDATES..."
                        className="input input-bordered w-full pl-10 font-bold bg-base-200/50 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>

                <div className="tabs tabs-boxed bg-base-200">
                    <button
                        onClick={() => { setFilter("all"); setSelectedIds([]); }}
                        className={`tab font-bold transition-all ${filter === "all" ? "tab-active !bg-primary !text-primary-content" : ""}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => { setFilter("hired"); setSelectedIds([]); }}
                        className={`tab font-bold transition-all ${filter === "hired" ? "tab-active !bg-success !text-success-content" : ""}`}
                    >
                        Hired
                    </button>
                    <button
                        onClick={() => { setFilter("rejected"); setSelectedIds([]); }}
                        className={`tab font-bold transition-all ${filter === "rejected" ? "tab-active !bg-error !text-error-content" : ""}`}
                    >
                        Rejected
                    </button>
                    <button
                        onClick={() => { setFilter("Passed First Interview"); setSelectedIds([]); }}
                        className={`tab font-bold transition-all ${filter === "Passed First Interview" ? "tab-active !bg-accent !text-accent-content" : ""}`}
                    >
                        Passed 1st
                    </button>
                </div>

                {!isStaff && (
                    <div className="flex items-center gap-2 ml-auto">
                        <div className="join">
                            <input
                                type="text"
                                placeholder="Range (e.g. 2-10)"
                                className="input input-bordered input-sm join-item w-32 font-bold"
                                value={rangeInput}
                                onChange={(e) => setRangeInput(e.target.value)}
                            />
                            <button onClick={handleApplyRange} className="btn btn-sm btn-secondary join-item font-black uppercase">Apply</button>
                        </div>
                        <button
                            disabled={selectedIds.length === 0}
                            onClick={() => setShowBulkModal(true)}
                            className="btn btn-sm btn-primary font-black uppercase tracking-tighter"
                        >
                            Bulk Schedule ({selectedIds.length})
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-3xl border border-base-300 shadow-xl">
                <table className="table table-zebra w-full">
                    {/* head */}
                    <thead className="bg-base-200">
                        <tr className="text-secondary uppercase font-black tracking-widest text-[10px]">
                            {!isStaff && (
                                <th className="w-10">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-sm"
                                        checked={selectedIds.length > 0 && selectedIds.length === filteredCandidates?.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
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
                                    {!isStaff && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary checkbox-sm shadow-sm"
                                                checked={selectedIds.includes(candidate._id)}
                                                onChange={() => handleToggleSelect(candidate._id)}
                                            />
                                        </td>
                                    )}
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="bg-primary text-primary-content rounded-full w-10 ring ring-primary/20 ring-offset-base-100 ring-offset-2 overflow-hidden">
                                                    {candidate.photo ? (
                                                        <img
                                                            src={candidate.photo.startsWith('http') ? candidate.photo : `${import.meta.env.VITE_API_URL}${candidate.photo}`}
                                                            alt={candidate.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <span className="font-black text-xl">{candidate.name?.charAt(0)}</span>
                                                    )}
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
                                                candidate.status === 'Second Interview Scheduled' ? 'badge-secondary' :
                                                    candidate.status === 'Passed First Interview' ? 'badge-accent' :
                                                        candidate.status === 'Hired' ? 'badge-success' :
                                                            candidate.status === 'Rejected' ? 'badge-error' :
                                                                'badge-neutral'
                                            }`}>
                                            {candidate.status}
                                        </span>
                                    </td>
                                    {!isStaff && (
                                        <td className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {candidate.status === 'Passed First Interview' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedIds([candidate._id]);
                                                            setShowBulkModal(true);
                                                        }}
                                                        className="btn btn-xs btn-outline btn-secondary font-black uppercase tracking-tighter"
                                                        title="Passed 1st stage. Schedule next."
                                                    >
                                                        2nd Interview
                                                    </button>
                                                )}
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
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Schedule Multi Modal */}
            {showBulkModal && (
                <ScheduleInterviewModal
                    preSelectedCandidates={selectedIds}
                    onClose={() => {
                        setShowBulkModal(false);
                        setSelectedIds([]);
                    }}
                />
            )}
            {/* Refactored Edit Modal */}
            {editingCandidate && (
                <EditModal
                    candidate={editingCandidate}
                    onClose={() => setEditingCandidate(null)}
                    onSuccess={() => {
                        setEditingCandidate(null);
                        queryClient.invalidateQueries(["candidates"]);
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
            previous_experience: candidate.previous_experience || "",
            photo: candidate.photo || "",
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
                                <option value="Passed First Interview">Passed First Interview</option>
                                <option value="Second Interview Scheduled">Second Interview Scheduled</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Photo URL</span></label>
                            <input
                                type="text"
                                className="input input-bordered input-sm font-bold"
                                {...register("photo")}
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Previous Roles (JSON/Text)</span></label>
                            <textarea
                                className="textarea textarea-bordered textarea-sm font-bold h-20"
                                {...register("previous_experience")}
                                placeholder='e.g. Senior Dev at Google, Team Lead at Meta'
                            ></textarea>
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
