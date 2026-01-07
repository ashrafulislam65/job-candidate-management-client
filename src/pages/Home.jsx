import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100-200px)]">
            {/* Hero Section */}
            <section className="hero bg-base-100 py-16 md:py-24 overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

                <div className="hero-content text-center px-4">
                    <div className="max-w-3xl">
                        <div className="badge badge-outline border-primary/30 font-black uppercase tracking-widest mb-6 p-4 animate-bounce">
                            New Era of Recruitment
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-8">
                            Empower Your <span className="text-primary underline decoration-secondary decoration-8 underline-offset-8">Growth</span>
                        </h1>
                        <p className="text-lg md:text-xl font-bold opacity-70 mb-10 max-w-2xl mx-auto italic leading-relaxed">
                            A streamlined, intelligent platform for managing top talent. From application to hiring - handle the complete lifecycle with premium precision.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {user ? (
                                <Link to="/app" className="btn btn-primary btn-lg font-black uppercase italic px-12 shadow-xl hover:scale-105 transition-all">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-lg font-black uppercase italic px-12 shadow-xl hover:scale-105 transition-all">
                                        Join Now
                                    </Link>
                                    <Link to="/login" className="btn btn-outline btn-lg font-black uppercase italic px-12 hover:bg-neutral hover:text-neutral-content transition-all">
                                        Candidate Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features/Stats Section */}
            <section className="bg-base-200 py-16 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-xl p-8 border border-base-300 hover:border-primary transition-colors group">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-2.123-7.931A4.125 4.125 0 1 0 15 19.128v0Zm0 0a9.043 9.043 0 0 1-2.908-1.4 9.045 9.045 0 0 1-2.908 1.4V19c0 .524.044 1.037.13 1.537a9.047 9.047 0 0 1 2.778-1.537c.135-.046.273-.087.412-.122A9.043 9.043 0 0 1 15 19.128Zm0 0V19c0-1.259-.442-2.42-1.181-3.328a3 3 0 0 0-4.638 0A5.25 5.25 0 0 0 7.5 18v.328c0 .524.044 1.037.13 1.537a9.047 9.047 0 0 0 2.778-1.537c.135-.046.273-.087.412-.122a9.047 9.047 0 0 0 4.18 1.128Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter">Candidate Management</h3>
                        <p className="font-bold opacity-60 text-sm">Efficiently track, filter, and manage high-quality candidates throughout the funnel.</p>
                    </div>
                    <div className="card bg-base-100 shadow-xl p-8 border border-base-300 hover:border-secondary transition-colors group">
                        <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-secondary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter">Interview Scheduler</h3>
                        <p className="font-bold opacity-60 text-sm">Organize technical and final interviews with multi-stage evaluation logic.</p>
                    </div>
                    <div className="card bg-base-100 shadow-xl p-8 border border-base-300 hover:border-accent transition-colors group">
                        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-accent">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.003 9.003 0 0 0 8.354-5.646 9.003 9.003 0 0 0-8.354-5.646V3.75A9.003 9.003 0 0 0 3.646 9.394a9.003 9.003 0 0 0 16.708 0 9.003 9.003 0 0 0-8.354-5.646v17.25Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter">Instant Analytics</h3>
                        <p className="font-bold opacity-60 text-sm">View recruitment progress at a glance with integrated charts and status badges.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
