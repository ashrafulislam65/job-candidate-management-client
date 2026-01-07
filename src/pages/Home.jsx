import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaRocket, FaChartLine, FaShieldAlt, FaCheckCircle, FaUsers } from "react-icons/fa";

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero bg-base-100 py-20 lg:py-32 overflow-hidden relative border-b border-base-200">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>

                <div className="hero-content text-center px-4 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-block badge badge-outline border-primary/40 font-black uppercase tracking-widest mb-8 p-4 bg-base-100/50 backdrop-blur-sm animate-fade-in-up">
                            🚀 The Future of Hiring is Here
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-10 text-base-content">
                            Unleash <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Your Potential</span>
                        </h1>
                        <p className="text-lg md:text-2xl font-bold opacity-60 mb-12 max-w-2xl mx-auto italic leading-relaxed">
                            A streamlined, intelligent ecosystem for modern recruitment. Filter faster, hire smarter, and build your dream team with precision.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            {user ? (
                                <Link to="/app" className="btn btn-primary btn-lg font-black uppercase italic px-12 shadow-xl hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all text-lg">
                                    Return to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-lg font-black uppercase italic px-12 shadow-xl hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all text-lg">
                                        Start Hiring Free
                                    </Link>
                                    <Link to="/login" className="btn btn-ghost btn-lg font-black uppercase italic px-12 border-2 border-base-300 hover:bg-base-200 hover:border-base-content/20 transition-all text-lg">
                                        Existing User
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 px-4 bg-base-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-3">Why Choose JobPortal</h2>
                        <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Built for Speed & Scale</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-[2.5rem] bg-base-200 border border-base-300 hover:border-primary/50 transition-all hover:bg-base-100 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-primary/20"></div>
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <FaRocket className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="text-2xl font-black uppercase italic mb-4">Instant Filtering</h4>
                            <p className="font-bold opacity-60 leading-relaxed">Stop drowning in resumes. Our advanced filtering system helps you identify top talent in seconds, not hours.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-[2.5rem] bg-base-200 border border-base-300 hover:border-secondary/50 transition-all hover:bg-base-100 hover:shadow-2xl hover:shadow-secondary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-secondary/20"></div>
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <FaChartLine className="w-8 h-8 text-secondary" />
                            </div>
                            <h4 className="text-2xl font-black uppercase italic mb-4">Real-time Analytics</h4>
                            <p className="font-bold opacity-60 leading-relaxed">Make data-driven decisions with our live dashboard. Track hiring pipelines, interview success rates, and more.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-[2.5rem] bg-base-200 border border-base-300 hover:border-accent/50 transition-all hover:bg-base-100 hover:shadow-2xl hover:shadow-accent/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-accent/20"></div>
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <FaShieldAlt className="w-8 h-8 text-accent" />
                            </div>
                            <h4 className="text-2xl font-black uppercase italic mb-4">Bank-Grade Security</h4>
                            <p className="font-bold opacity-60 leading-relaxed">Your data is safe with us. We use enterprise-grade encryption to protect sensitive candidate and company information.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 px-4 bg-base-200 border-y border-base-300 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-sm font-black text-secondary uppercase tracking-widest mb-3">Our Process</h2>
                            <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none">Simple, Smooth, <br /><span className="text-secondary">Effective.</span></h3>
                            <p className="text-lg font-bold opacity-60 mb-8 max-w-md">Our platform removes the friction from hiring. Follow a simple 3-step process to build your dream team.</p>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-content flex items-center justify-center font-black text-xl shrink-0">1</div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase italic">Create Account</h4>
                                        <p className="font-bold opacity-50 text-sm mt-1">Register your company profile in under 2 minutes.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full bg-base-100 border-2 border-secondary text-secondary flex items-center justify-center font-black text-xl shrink-0">2</div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase italic">Post & Manage</h4>
                                        <p className="font-bold opacity-50 text-sm mt-1">Upload candidate lists or let them apply directly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full bg-base-100 border-2 border-secondary text-secondary flex items-center justify-center font-black text-xl shrink-0">3</div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase italic">Interview & Hire</h4>
                                        <p className="font-bold opacity-50 text-sm mt-1">Schedule interviews and track results seamlessly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 relative">
                            {/* Decorative Visual */}
                            <div className="relative z-10 bg-base-100 p-8 rounded-[3rem] shadow-2xl border border-base-300 rotate-3 hover:rotate-0 transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                                        <FaCheckCircle className="w-6 h-6 text-success" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-black uppercase italic">Candidate Hired!</div>
                                        <div className="text-xs font-bold opacity-50 uppercase tracking-widest">Just Now</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-base-200 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-base-200 rounded-full w-full"></div>
                                    <div className="h-4 bg-base-200 rounded-full w-5/6"></div>
                                </div>
                                <div className="mt-8 flex gap-4">
                                    <div className="btn btn-sm btn-primary font-black uppercase italic w-full">View Profile</div>
                                    <div className="btn btn-sm btn-ghost border-base-300 w-12 px-0"><FaUsers /></div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-full h-full bg-secondary/5 rounded-[3rem] -rotate-6 z-0 scale-95"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 bg-base-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-base-200">
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-black italic text-primary mb-2">10k+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Candidates Hired</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-black italic text-secondary mb-2">500+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Companies Trusted</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-black italic text-accent mb-2">1M+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Interviews Scheduled</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-black italic text-neutral mb-2">99%</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
