import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { useState } from "react";

const CandidateList = () => {
    const queryClient = useQueryClient();
    const [editingCandidate, setEditingCandidate] = useState(null);

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
            queryClient.invalidateQueries(["candidates"]);
        },
    });

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <p>Loading candidates...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Candidate List</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Phone</th>
                            <th className="px-4 py-2 border">Experience</th>
                            <th className="px-4 py-2 border">Age</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates?.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">
                                    No candidates found
                                </td>
                            </tr>
                        ) : (
                            candidates?.map((candidate) => (
                                <tr key={candidate._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{candidate.name}</td>
                                    <td className="px-4 py-2 border">{candidate.email}</td>
                                    <td className="px-4 py-2 border">{candidate.phone}</td>
                                    <td className="px-4 py-2 border">{candidate.experience_years} years</td>
                                    <td className="px-4 py-2 border">{candidate.age}</td>
                                    <td className="px-4 py-2 border">
                                        <span className={`px-2 py-1 rounded text-sm ${candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                candidate.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {candidate.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => setEditingCandidate(candidate)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(candidate._id, candidate.name)}
                                            disabled={deleteMutation.isPending}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                                        >
                                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simple Edit Modal */}
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

// Simple Edit Modal Component
const EditModal = ({ candidate, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: candidate.name,
        phone: candidate.phone,
        experience_years: candidate.experience_years,
        age: candidate.age,
        status: candidate.status,
    });

    const editMutation = useMutation({
        mutationFn: async (data) => {
            await axiosSecure.put(`/api/candidates/${candidate._id}`, data);
        },
        onSuccess: () => {
            onSuccess();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        editMutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Edit Candidate</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Experience (years)</label>
                        <input
                            type="number"
                            value={formData.experience_years}
                            onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Age</label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="pending">Pending</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Hired">Hired</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={editMutation.isPending}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {editMutation.isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CandidateList;
