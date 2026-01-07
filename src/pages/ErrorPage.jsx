import { Link, useRouteError } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-base-300 text-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                <div className="card-body items-center py-16">
                    <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <FaExclamationTriangle className="w-10 h-10 text-error" />
                    </div>

                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-error to-primary italic tracking-tighter mb-2">404</h1>
                    <h2 className="text-2xl font-black uppercase tracking-widest opacity-70 mb-4">Page Not Found</h2>

                    <p className="font-bold opacity-60 max-w-xs mb-8">
                        Oops! The page you are looking for seems to have vanished into the digital void.
                    </p>

                    <Link to="/" className="btn btn-primary btn-wide font-black uppercase italic shadow-lg hover:scale-105 transition-all gap-2">
                        <FaHome />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
