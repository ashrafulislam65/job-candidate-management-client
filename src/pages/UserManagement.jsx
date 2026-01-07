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
            await axiosSecure.patch(`/api/users/${uid}/role`, { role });
        },
        onSuccess: () => {
            Swal.fire("Updated!", "User role has been updated.", "success");
            queryClient.invalidateQueries(["users"]);
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "Failed to update role", "error");
        }
    });

    const handleRoleChange = (uid, email, newRole) => {
        Swal.fire({
            title: "Change Role?",
            text: `Are you sure you want to change role for ${email} to ${newRole}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, change it!",
            background: 'var(--fallback-b1,oklch(var(--b1)))',
            color: 'var(--fallback-bc,oklch(var(--bc)))',
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ uid, role: newRole });
            }
        });
    };

    if (isLoading) return <div className="flex justify-center p-10"><span className="loading loading-spinner text-primary"></span></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic underline decoration-primary decoration-4 underline-offset-4">User Management</h2>
                <div className="badge badge-outline border-primary/30 font-bold opacity-70 italic">{users?.length} accounts</div>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-3xl border border-base-300 shadow-xl">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr className="text-secondary uppercase font-black tracking-widest text-[10px]">
                            <th>User Info</th>
                            <th>Current Role</th>
                            <th className="text-right">Assign Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.uid} className="hover:bg-primary/5 transition-colors">
                                <td>
                                    <div className="font-black text-base italic">{user.name || 'No Name'}</div>
                                    <div className="text-[10px] opacity-60 font-bold tracking-tighter uppercase">{user.email}</div>
                                </td>
                                <td>
                                    <span className={`badge badge-sm font-black uppercase tracking-widest ${user.role === 'admin' ? 'badge-primary' :
                                            user.role === 'staff' ? 'badge-secondary' :
                                                'badge-ghost opacity-50'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleRoleChange(user.uid, user.email, 'admin')}
                                            disabled={user.role === 'admin' || updateRoleMutation.isPending}
                                            className="btn btn-xs btn-primary font-black uppercase"
                                        >
                                            Admin
                                        </button>
                                        <button
                                            onClick={() => handleRoleChange(user.uid, user.email, 'staff')}
                                            disabled={user.role === 'staff' || updateRoleMutation.isPending}
                                            className="btn btn-xs btn-secondary font-black uppercase"
                                        >
                                            Staff
                                        </button>
                                        <button
                                            onClick={() => handleRoleChange(user.uid, user.email, 'candidate')}
                                            disabled={user.role === 'candidate' || updateRoleMutation.isPending}
                                            className="btn btn-xs btn-ghost font-black uppercase"
                                        >
                                            Candidate
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
