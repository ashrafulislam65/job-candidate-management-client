import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

const CandidateDashboard = () => {
    const { data: candidate, isLoading, error } = useQuery({
        queryKey: ["candidateProfile"],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get("/api/candidates/me");
                return res.data;
            } catch (err) {
                if (err.response?.status === 404) {
                    return null; 
                }
                throw err;
            }
        },
    });

    if (isLoading) return (
        <div className="flex justify-center p-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    if (error) return (
        <div className="alert alert-error shadow-lg">
            <span>Error loading profile: {error.message}</span>
        </div>
    );

    if (!candidate) return (
        <div className="hero bg-base-100 rounded-3xl border border-dashed border-base-300 p-10">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h2 className="text-3xl font-bold italic">No Profile Found</h2>
                    <p className="py-6 opacity-70">It looks like your information hasn't been uploaded to the system yet. Please wait for the recruitment team to update your status.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="card lg:card-side bg-base-100 shadow-2xl overflow-hidden border border-base-300">
                <div className="bg-primary text-primary-content p-8 flex flex-col items-center justify-center min-w-[200px] text-center">
                    <div className="avatar ring ring-primary ring-offset-base-100 ring-offset-2 rounded-full overflow-hidden w-24 h-24 mb-4 shadow-xl">
                        {candidate.photo ? (
                            <img src={candidate.photo.startsWith('http') ? candidate.photo : `${import.meta.env.VITE_API_URL}${candidate.photo}`} alt="Profile" className="object-cover w-full h-full" />
                        ) : (
                            <div className="bg-neutral text-neutral-content flex items-center justify-center w-full h-full">
                                <span className="text-3xl font-black uppercase">{candidate.name?.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-black uppercase text-secondary italic tracking-tighter">{candidate.name}</h2>
                    <div className="badge badge-secondary font-bold mt-2 uppercase text-[10px] tracking-widest">{candidate.status}</div>
                </div>

                <div className="card-body bg-base-100">
                    <h2 className="card-title text-2xl font-black uppercase tracking-tighter mb-4 italic underline decoration-primary decoration-4 underline-offset-4 text-primary">Application Overview</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="stat bg-base-200 rounded-2xl p-4 shadow-sm">
                            <div className="stat-title text-[10px] font-black uppercase tracking-widest">Email Address</div>
                            <div className="stat-value text-base font-bold text-accent">{candidate.email}</div>
                        </div>
                        <div className="stat bg-base-200 rounded-2xl p-4 shadow-sm">
                            <div className="stat-title text-[10px] font-black uppercase tracking-widest">Contact Number</div>
                            <div className="stat-value text-base font-bold text-accent">{candidate.phone}</div>
                        </div>
                        <div className="stat bg-base-200 rounded-2xl p-4 shadow-sm">
                            <div className="stat-title text-[10px] font-black uppercase tracking-widest">Total Experience</div>
                            <div className="stat-value text-base font-bold text-accent">{candidate.experience_years} Years</div>
                        </div>
                        <div className="stat bg-base-200 rounded-2xl p-4 shadow-sm">
                            <div className="stat-title text-[10px] font-black uppercase tracking-widest">Previous Roles</div>
                            <div className="stat-value text-base font-bold text-accent italic">{candidate.previous_experience || "N/A"}</div>
                        </div>
                    </div>

                    <div className="mt-8 p-8 bg-gradient-to-br from-primary to-primary-focus text-primary-content rounded-3xl shadow-xl border border-white/10 relative overflow-hidden group">
                        {/* Decorative Background Elements */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                        <div className="absolute -left-10 -top-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h9m-12-3h.008v.008H3v-.008z" />
                                    </svg>
                                </div>
                                <h4 className="font-black uppercase tracking-widest text-[10px]">Status Update</h4>
                            </div>
                            <p className="text-lg font-medium leading-relaxed italic pr-4">
                                "Your profile reflects <span className="underline decoration-secondary decoration-2 underline-offset-4 font-black">{candidate.experience_years} years</span> of professional background. We are currently reviewing your {candidate.previous_experience ? 'previous roles' : 'history'} against our current openings."
                            </p>
                            <div className="mt-4 flex items-center gap-2 opacity-60">
                                <span className="w-8 h-[2px] bg-white/30"></span>
                                <span className="text-[9px] font-black uppercase tracking-widest">Recruitment Team</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
