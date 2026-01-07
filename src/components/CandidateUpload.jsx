import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import Swal from "sweetalert2";

const CandidateUpload = () => {
    const [file, setFile] = useState(null);
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
            Swal.fire({
                icon: "success",
                title: "Upload Successful!",
                text: `Successfully added ${data.added} candidates.`,
                confirmButtonColor: "var(--fallback-p,oklch(var(--p)))",
            });
            setFile(null);
            queryClient.invalidateQueries(["candidates"]);
            document.getElementById("file-input").value = "";
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: error.response?.data || "Something went wrong during upload.",
            });
        },
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = [
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ];
            if (validTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Invalid File Type",
                    text: "Please select a valid Excel file (.xls or .xlsx)",
                });
                setFile(null);
                e.target.value = "";
            }
        }
    };

    const handleUpload = () => {
        if (!file) {
            Swal.fire("Notice", "Please select a file first", "info");
            return;
        }
        uploadMutation.mutate(file);
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter italic mb-1">Upload Candidates</h3>
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Supports .xls and .xlsx formats only</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            id="file-input"
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs font-bold"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploadMutation.isPending}
                            className="btn btn-primary btn-sm px-8 font-black uppercase italic shadow-md"
                        >
                            {uploadMutation.isPending ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                "Start Upload"
                            )}
                        </button>
                    </div>
                </div>

                {file && (
                    <div className="mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <div className="badge badge-outline border-primary/30 gap-2 p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-tighter">Ready: {file.name}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateUpload;
