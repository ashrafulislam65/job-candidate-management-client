import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import Swal from "sweetalert2";

const UserManagement = () => {
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/users");
            return res.data;
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ uid, role }) => {
            // Ensure we send the role the backend expects
            await axiosSecure.patch(`/api/users/${uid}/role`, { role });
        },
        onSuccess: () => {
            Swal.fire({
                title: "Success",
                text: "User role has been updated.",
                icon: "success",
                background: 'var(--fallback-b1,oklch(var(--b1)))',
                color: 'var(--fallback-bc,oklch(var(--bc)))',
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

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <span className="loading loading-bars loading-lg text-primary"></span>
            <p className="font-black uppercase tracking-widest text-[10px] opacity-50">Fetching account data...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic underline decoration-primary decoration-8 underline-offset-8">User Role Control</h2>
                    <div className="badge badge-primary font-black italic shadow-lg">{users?.length} Users</div>
                </div>
                <button
                    onClick={() => queryClient.invalidateQueries(["users"])}
                    className="btn btn-outline btn-sm font-black italic gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Sync User List
                </button>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-3xl border border-base-300 shadow-2xl">
                <table className="table w-full">
                    <thead className="bg-base-200">
                        <tr className="text-secondary font-black uppercase tracking-widest text-xs border-b-2 border-base-300">
                            <th className="py-6">User Identity</th>
                            <th className="py-6">Assigned Role</th>
                            <th className="py-6 text-right">Management Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.uid} className="hover:bg-primary/5 transition-colors border-b border-base-200">
                                <td className="py-5">
                                    <div className="font-black text-lg italic leading-tight">{user.name || 'UNNAMED USER'}</div>
                                    <div className="text-[11px] font-bold opacity-50 tracking-widest uppercase">{user.email}</div>
                                </td>
                                <td className="py-5">
                                    <div className={`badge font-black uppercase tracking-widest px-4 py-3 rounded-xl border-2 ${user.role?.toLowerCase() === 'admin' ? 'badge-primary' :
                                            user.role?.toLowerCase() === 'staff' ? 'badge-secondary' :
                                                'badge-ghost opacity-40'
                                        }`}>
                                        {user.role || 'pending'}
                                    </div>
                                </td>
                                <td className="py-5">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleRoleChange(user.uid, user.email, 'admin')}
                                            disabled={user.role?.toLowerCase() === 'admin' || updateRoleMutation.isPending}
                                            className="btn btn-sm btn-primary font-black uppercase shadow-lg shadow-primary/20"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                            </svg>
                                            Role: Admin
                                        </button>
                                        <button
                                            onClick={() => handleRoleChange(user.uid, user.email, 'staff')}
                                            disabled={user.role?.toLowerCase() === 'staff' || updateRoleMutation.isPending}
                                            className="btn btn-sm btn-secondary font-black uppercase shadow-lg shadow-secondary/20"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                            Role: Staff
                                        </button>
                                        <button
                                            onClick={() => handleRoleChange(user.uid, user.email, 'candidate')}
                                            disabled={user.role?.toLowerCase() === 'candidate' || updateRoleMutation.isPending}
                                            className="btn btn-sm btn-ghost border-base-300 font-black uppercase hover:bg-base-200"
                                        >
                                            Role: Candidate
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
