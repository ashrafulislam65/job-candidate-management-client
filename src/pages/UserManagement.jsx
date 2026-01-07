import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import Swal from "sweetalert2";

const UserManagement = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/users");
            return res.data;
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ uid, role }) => {
            await axiosSecure.patch(`/api/users/${uid}/role`, { role });
        },
        onSuccess: () => {
            Swal.fire({
                title: "Success",
                text: "User role has been updated.",
                icon: "success",
                background: 'var(--fallback-b1,oklch(var(--b1)))',
                color: 'var(--fallback-bc,oklch(var(--bc)))',
                showConfirmButton: false,
                timer: 1500
            });
            queryClient.invalidateQueries(["users"]);
        },
        onError: (err) => {
            Swal.fire("Error", err.response?.data || err.message || "Failed to update role", "error");
        }
    });

    const handleRoleChange = (uid, email, newRole) => {
        Swal.fire({
            title: "Change Role?",
            text: `Confirm changing role for ${email} to ${newRole}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm Change",
            confirmButtonColor: "oklch(var(--p))",
            background: 'var(--fallback-b1,oklch(var(--b1)))',
            color: 'var(--fallback-bc,oklch(var(--bc)))',
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ uid, role: newRole });
            }
        });
    };

    // Filter Logic
    const filteredUsers = users?.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === "all" || user.role?.toLowerCase() === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <span className="loading loading-bars loading-lg text-primary"></span>
            <p className="font-black uppercase tracking-widest text-[10px] opacity-50">Fetching account data...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-base-300">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">User <span className="text-primary">Orchestration</span></h2>
                    </div>
                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest pl-14">Management & Role Control Panel</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="stats shadow-lg bg-base-100 border border-base-300 rounded-2xl">
                        <div className="stat py-2 px-4">
                            <div className="stat-title text-[10px] font-black uppercase tracking-widest">Total Accounts</div>
                            <div className="stat-value text-2xl font-black text-primary italic">{users?.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control relative w-full md:col-span-2">
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME OR EMAIL..."
                        className="input input-bordered w-full pl-12 font-bold bg-base-100 rounded-2xl border-2 focus:border-primary transition-all uppercase text-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>

                <select
                    className="select select-bordered w-full font-black uppercase text-xs tracking-widest rounded-2xl border-2 transition-all focus:border-primary"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">Display All Roles</option>
                    <option value="admin">Administrators Only</option>
                    <option value="staff">Staff Members Only</option>
                    <option value="candidate">Candidates Only</option>
                </select>
            </div>

            {/* Table Section */}
            <div className="bg-base-100 rounded-[2rem] border-2 border-base-300 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-base-200 border-b-2 border-base-300">
                                <th className="py-6 pl-8 text-secondary font-black uppercase tracking-widest text-[10px]">User Profile</th>
                                <th className="py-6 text-secondary font-black uppercase tracking-widest text-[10px]">Security Role</th>
                                <th className="py-6 pr-8 text-right text-secondary font-black uppercase tracking-widest text-[10px]">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-200">
                            {filteredUsers?.map((user) => (
                                <tr key={user.uid} className="hover:bg-primary/[0.03] transition-colors group">
                                    <td className="py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar ring-2 ring-primary ring-offset-2 ring-offset-base-100 rounded-2xl overflow-hidden w-12 h-12 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                {user.photo ? (
                                                    <img
                                                        src={user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_URL}${user.photo}`}
                                                        alt={user.name}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-neutral text-neutral-content flex items-center justify-center w-full h-full font-black text-xl italic">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-black text-lg italic leading-tight tracking-tighter uppercase group-hover:text-primary transition-colors">
                                                    {user.name || 'UNNAMED USER'}
                                                </div>
                                                <div className="text-[10px] font-black opacity-50 tracking-widest uppercase">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className={`badge h-8 px-4 font-black uppercase tracking-widest text-[10px] rounded-xl border-2 ${user.role?.toLowerCase() === 'admin' ? 'badge-primary shadow-[0_0_15px_rgba(oklch(var(--p))/0.3)]' :
                                                user.role?.toLowerCase() === 'staff' ? 'badge-secondary shadow-[0_0_15px_rgba(oklch(var(--s))/0.3)]' :
                                                    'badge-ghost opacity-60'
                                            }`}>
                                            {user.role || 'pending'}
                                        </div>
                                    </td>
                                    <td className="py-5 pr-8">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleRoleChange(user.uid, user.email, 'admin')}
                                                disabled={user.role?.toLowerCase() === 'admin' || updateRoleMutation.isPending}
                                                className="btn btn-xs sm:btn-sm btn-primary font-black uppercase italic shadow-md hover:shadow-primary/40 disabled:opacity-30 rounded-xl"
                                                title="Elevate to Admin"
                                            >
                                                Admin
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(user.uid, user.email, 'staff')}
                                                disabled={user.role?.toLowerCase() === 'staff' || updateRoleMutation.isPending}
                                                className="btn btn-xs sm:btn-sm btn-secondary font-black uppercase italic shadow-md hover:shadow-secondary/40 disabled:opacity-30 rounded-xl"
                                                title="Make Staff"
                                            >
                                                Staff
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(user.uid, user.email, 'candidate')}
                                                disabled={user.role?.toLowerCase() === 'candidate' || updateRoleMutation.isPending}
                                                className="btn btn-xs sm:btn-sm btn-ghost border-2 border-base-300 font-black uppercase italic hover:bg-base-200 disabled:opacity-30 rounded-xl"
                                                title="Demote to Candidate"
                                            >
                                                Candidate
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers?.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="py-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                            </svg>
                                            <h3 className="text-xl font-black uppercase tracking-tighter">No Users Found</h3>
                                            <p className="text-xs font-bold tracking-widest">Adjust your search or filter settings</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

