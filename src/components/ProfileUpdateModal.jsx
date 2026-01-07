import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";

const ProfileUpdateModal = ({ onClose, currentName, currentPhoto }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: currentName || ""
        }
    });
    const [preview, setPreview] = useState(null);

    const updateProfileMutation = useMutation({
        mutationFn: async (formData) => {
            const res = await axiosSecure.patch("/api/users/update-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Profile Updated",
                text: "Your changes have been saved.",
                timer: 2000,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries(["dbUser"]);
            queryClient.invalidateQueries(["candidateProfile"]);
            onClose();
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "Failed to update profile", "error");
        }
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.photo?.[0]) formData.append("photo", data.photo[0]);

        updateProfileMutation.mutate(formData);
    };

    const handlePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="modal modal-open bg-black/60 backdrop-blur-sm">
            <div className="modal-box bg-base-100 border border-base-300 rounded-3xl shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                >✕</button>

                <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-8 underline decoration-primary decoration-4 underline-offset-8">Update <span className="text-primary">Profile</span></h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="avatar ring ring-primary ring-offset-base-100 ring-offset-2 rounded-full overflow-hidden w-24 h-24 shadow-inner bg-base-300 flex items-center justify-center">
                            {preview ? (
                                <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                            ) : currentPhoto ? (
                                <img src={currentPhoto.startsWith('http') ? currentPhoto : `${import.meta.env.VITE_API_URL}${currentPhoto}`} alt="Profile" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-4xl font-black opacity-30 uppercase">{currentName?.charAt(0) || "U"}</span>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("photo")}
                            onChange={handlePreview}
                            className="file-input file-input-bordered file-input-primary file-input-sm w-full font-bold"
                        />
                        <p className="text-[10px] font-bold opacity-50 uppercase italic tracking-widest text-center">Supported: JPG, PNG, WEBP</p>
                    </div>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text font-black uppercase text-[10px] opacity-70">Display Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            className="input input-bordered w-full font-bold focus:border-primary"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="text-error text-[10px] font-bold mt-1 uppercase italic">{errors.name.message}</p>}
                    </div>

                    <div className="modal-action mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost font-black uppercase italic"
                        >Cancel</button>
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="btn btn-primary font-black uppercase italic px-8 shadow-lg hover:scale-105 transition-all"
                        >
                            {updateProfileMutation.isPending ? <span className="loading loading-spinner"></span> : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdateModal;
