import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import { FaTwitter, FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

const MainLayout = () => {
  const { user, logout, dbUser, role } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", "Logout failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 font-inter">
      {/* Premium Persistent Navbar */}
      <header className="sticky top-0 z-[50] w-full border-b border-base-300 bg-base-100/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between">
            {/* Left: Logo */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-12">
                  <span className="text-primary-content font-black text-2xl -rotate-12 italic">J</span>
                </div>
                <span className="text-2xl font-black uppercase tracking-widest text-base-content italic hidden sm:block">
                  Job<span className="text-primary">Portal</span>
                </span>
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-8 font-black uppercase text-[10px] tracking-widest italic">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-all py-2 border-b-4 hover:text-primary ${isActive ? 'text-primary border-primary' : 'opacity-70 border-transparent hover:border-primary/30'}`
                }
              >
                Home
              </NavLink>
              {user && (
                <NavLink
                  to="/app"
                  className={({ isActive }) =>
                    `transition-all py-2 border-b-4 hover:text-primary ${isActive ? 'text-primary border-primary' : 'opacity-70 border-transparent hover:border-primary/30'}`
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </div>

            {/* Right: User Profile / Auth */}
            <div className="flex-1 flex justify-end items-center gap-4">


              {user ? (
                <div className="flex items-center gap-2">
                  <div className="badge badge-primary badge-outline font-black uppercase tracking-tighter px-4 py-3 rounded-xl border-2 hidden sm:flex">
                    {role}
                  </div>

                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="flex items-center gap-3 hover:bg-base-200 p-2 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-base-300">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10 ring ring-primary ring-offset-base-100 group-hover:ring-offset-2 transition-all shadow-md overflow-hidden">
                          {dbUser?.photo ? (
                            <img src={dbUser.photo.startsWith('http') ? dbUser.photo : `${import.meta.env.VITE_API_URL}${dbUser.photo}`} alt="Profile" className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-xl font-black uppercase italic">{dbUser?.name?.charAt(0) || user?.email?.charAt(0)}</span>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:block text-left pr-2">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest leading-none mb-1">Account</p>
                        <p className="text-sm font-black italic leading-none">{dbUser?.name?.split(' ')[0] || user?.email?.split('@')[0]}</p>
                      </div>
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[100] menu p-4 shadow-2xl bg-base-100 rounded-3xl w-72 mt-4 border border-base-300 gap-2 animate-in fade-in zoom-in duration-200">
                      <li className="menu-title px-0 mb-2">
                        <div className="flex items-center gap-4 p-2 bg-base-200 rounded-2xl">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-12 flex items-center justify-center overflow-hidden shadow-lg">
                              {dbUser?.photo ? (
                                <img src={dbUser.photo.startsWith('http') ? dbUser.photo : `${import.meta.env.VITE_API_URL}${dbUser.photo}`} alt="Profile" className="object-cover w-full h-full" />
                              ) : (
                                <span className="text-2xl font-black uppercase italic">{dbUser?.name?.charAt(0) || user?.email?.charAt(0)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col overflow-hidden text-base-content">
                            <span className="text-sm font-black truncate">{dbUser?.name || 'User'}</span>
                            <span className="text-[10px] opacity-60 font-bold truncate">{user?.email}</span>
                            <span className="badge badge-primary badge-xs font-black uppercase mt-1">{role}</span>
                          </div>
                        </div>
                      </li>
                      <div className="divider my-0 opacity-10"></div>
                      <li>
                        <button
                          onClick={() => setShowProfileModal(true)}
                          className="flex items-center gap-3 font-bold hover:bg-primary hover:text-primary-content rounded-xl p-3 transition-all active:scale-95"
                        >
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary-content/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                          </div>
                          Update Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 font-bold text-error hover:bg-error hover:text-error-content rounded-xl p-3 transition-all active:scale-95"
                        >
                          <div className="p-2 bg-error/10 rounded-lg group-hover:bg-error-content/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                          </div>
                          Logout Session
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn btn-ghost btn-sm font-black uppercase italic px-6 rounded-xl hover:bg-base-200">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm font-black uppercase italic px-6 rounded-xl shadow-lg shadow-primary/20">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow bg-base-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-base-100 border-t border-base-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center rotate-12 shadow-lg shadow-primary/20">
                  <span className="text-primary-content font-black text-2xl italic -rotate-12">J</span>
                </div>
                <span className="text-2xl font-black uppercase tracking-widest italic">Job<span className="text-primary">Portal</span></span>
              </div>
              <p className="text-sm font-bold opacity-60 leading-relaxed">
                Streamlining recruitment for modern teams. We bridge the gap between talent and opportunity with precision and speed.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-primary-content transition-all hover:scale-110">
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-primary-content transition-all hover:scale-110">
                  <FaLinkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-primary-content transition-all hover:scale-110">
                  <FaGithub className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-primary-content transition-all hover:scale-110">
                  <FaFacebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">Company</h4>
              <ul className="space-y-4 text-sm font-bold opacity-70">
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">About Us</a></li>
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">Careers</a></li>
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">Blog</a></li>
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">Press Kit</a></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">Resources</h4>
              <ul className="space-y-4 text-sm font-bold opacity-70">
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">Documentation</a></li>
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">Help Center</a></li>
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">Community</a></li>
                <li><a href="#" className="hover:text-primary hover:pl-2 transition-all">Contact Support</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">Stay Updated</h4>
              <p className="text-xs font-bold opacity-60 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
              <div className="join w-full">
                <input className="input input-bordered input-sm join-item w-full font-bold focus:border-primary" placeholder="Email address" />
                <button className="btn btn-primary btn-sm join-item font-black uppercase italic">Join</button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
            <p className="text-[10px] font-black uppercase tracking-widest">© 2026 JOBPORTAL SYSTEMS. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {showProfileModal && (
        <ProfileUpdateModal
          currentName={dbUser?.name}
          currentPhoto={dbUser?.photo}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
