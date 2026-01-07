import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

const CandidateDashboard = () => {
    const { data: candidate, isLoading, error } = useQuery({
        queryKey: ["candidateProfile"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/candidates/me");
            return res.data;
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
                    <div className="avatar placeholder mb-4">
                        <div className="bg-neutral text-neutral-content rounded-full w-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                            <span className="text-3xl font-black uppercase">{candidate.name?.charAt(0)}</span>
                        </div>
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
                            <div className="stat-title text-[10px] font-black uppercase tracking-widest">Experience</div>
                            <div className="stat-value text-base font-bold text-accent">{candidate.experience_years} Years</div>
                        </div>
                        <div className="stat bg-base-200 rounded-2xl p-4 shadow-sm">
                            <div className="stat-title text-[10px] font-black uppercase tracking-widest">Age</div>
                            <div className="stat-value text-base font-bold text-accent">{candidate.age} Years</div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-secondary/10 border-2 border-dashed border-secondary/30 rounded-3xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="font-black uppercase tracking-tighter italic text-secondary mb-1">Recruiter Note</h4>
                        <p className="text-sm font-bold opacity-80 leading-relaxed italic text-secondary">"Your application is currently being evaluated by our expert panel. We precisely value your background and will reach out shortly."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
