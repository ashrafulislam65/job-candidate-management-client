import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

const ScheduleInterviewModal = ({ onClose, preSelectedCandidates = [] }) => {
    const queryClient = useQueryClient();
    const [selectedCandidates, setSelectedCandidates] = useState(
        preSelectedCandidates
    );
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        type: "Technical",
    });

    // Fetch candidates for selection
    const { data: candidates } = useQuery({
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
            queryClient.invalidateQueries(["interviews"]);
            onClose();
        },
    });

    const handleToggleCandidate = (candidateId) => {
        setSelectedCandidates((prev) =>
            prev.includes(candidateId)
                ? prev.filter((id) => id !== candidateId)
                : [...prev, candidateId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCandidates.length === 0) {
            alert("Please select at least one candidate");
            return;
        }

        // Schedule interview for each selected candidate
        selectedCandidates.forEach((candidateId) => {
            scheduleMutation.mutate({
                candidateId,
                date: formData.date,
                time: formData.time,
                type: formData.type,
            });
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Schedule Interview</h3>

                <form onSubmit={handleSubmit}>
                    {/* Interview Details */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({ ...formData, date: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Time</label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) =>
                                setFormData({ ...formData, time: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="Technical">Technical</option>
                            <option value="HR">HR</option>
                            <option value="Managerial">Managerial</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    {/* Candidate Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Select Candidates ({selectedCandidates.length} selected)
                        </label>
                        <div className="border rounded max-h-60 overflow-y-auto">
                            {candidates?.map((candidate) => (
                                <label
                                    key={candidate._id}
                                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCandidates.includes(candidate._id)}
                                        onChange={() => handleToggleCandidate(candidate._id)}
                                        className="mr-2"
                                    />
                                    <span>
                                        {candidate.name} ({candidate.email})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={scheduleMutation.isPending}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {scheduleMutation.isPending ? "Scheduling..." : "Schedule"}
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

export default ScheduleInterviewModal;
