import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const MainLayout = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", "Logout failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 font-inter">
      {/* Multi-theme Navbar */}
      <header className="sticky top-0 z-[50] w-full border-b border-base-300 bg-base-100/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-content font-black text-xl italic">A</span>
              </div>
              <span className="text-xl font-black uppercase tracking-tighter italic hidden sm:block">
                Anti<span className="text-primary">Gravity</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-4 font-black uppercase text-[10px] tracking-widest italic opacity-70">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/app" className="hover:text-primary transition-colors">Dashboard</Link>
            </div>

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar online">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-neutral text-neutral-content flex items-center justify-center">
                    <span className="font-black italic">{user.email?.charAt(0).toUpperCase()}</span>
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                  <li className="menu-title opacity-50 font-black uppercase text-[10px]">User Account</li>
                  <li><Link to="/app">Dashboard</Link></li>
                  <div className="divider my-0"></div>
                  <li><button onClick={handleLogout} className="text-error font-bold">Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm font-black uppercase italic px-6 rounded-full">
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-base-200 border-t border-base-300">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-content font-black text-xs italic">A</span>
                </div>
                <span className="text-lg font-black uppercase tracking-tighter italic">AntiGravity</span>
              </div>
              <p className="text-sm font-bold opacity-60 italic max-w-xs">
                Advanced candidate management for high-growth tech teams.
              </p>
            </div>

            <div className="flex gap-8 font-black uppercase text-[10px] tracking-widest italic opacity-50">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
            <p className="text-[10px] font-black uppercase">© 2026 ANTIGRAVITY SYSTEMS. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4 text-[10px] font-black uppercase">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
