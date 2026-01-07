import { useNavigate, Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      const token = await result.user.getIdToken();
      console.log("User Token:", token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/app");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "Invalid credentials. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label text-sm font-semibold">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="form-control">
              <label className="label text-sm font-semibold">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary w-full text-lg">Login</button>
            </div>
          </form>
          <p className="text-center mt-4 text-sm">
            Don't have an account? <Link to="/register" className="link link-primary font-bold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
