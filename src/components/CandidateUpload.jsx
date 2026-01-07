import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

const CandidateUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(null);
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axiosSecure.post("/api/candidates/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: (data) => {
            setMessage({
                type: "success",
                text: `Success! Added ${data.added} candidates. ${data.errors?.length || 0} errors.`,
            });
            setFile(null);
            queryClient.invalidateQueries(["candidates"]);
            // Reset file input
            document.getElementById("file-input").value = "";
        },
        onError: (error) => {
            setMessage({
                type: "error",
                text: error.response?.data || "Upload failed. Please try again.",
            });
        },
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            const validTypes = [
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ];
            if (validTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setMessage(null);
            } else {
                setMessage({
                    type: "error",
                    text: "Please select a valid Excel file (.xls or .xlsx)",
                });
                setFile(null);
            }
        }
    };

    const handleUpload = () => {
        if (!file) {
            setMessage({ type: "error", text: "Please select a file first" });
            return;
        }
        uploadMutation.mutate(file);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4">Upload Candidates (Excel)</h3>

            <div className="flex gap-4 items-center">
                <input
                    id="file-input"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="border px-3 py-2 rounded"
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || uploadMutation.isPending}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </button>
            </div>

            {message && (
                <div
                    className={`mt-4 p-4 rounded ${message.type === "success"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {file && (
                <p className="mt-2 text-sm text-gray-600">
                    Selected: <strong>{file.name}</strong>
                </p>
            )}
        </div>
    );
};

export default CandidateUpload;
