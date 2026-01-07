import { useNavigate, Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axiosSecure from "./api/axiosSecure";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Register = () => {
  const { register: firebaseRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1. Register in Firebase
      const result = await firebaseRegister(data.email, data.password);

      // 2. Save to MongoDB
      await axiosSecure.post('/api/users/register-role', {
        uid: result.user.uid,
        email: result.user.email,
        role: 'candidate' // Default role
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/app");
    } catch (err) {
      console.error("Registration Error:", err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message || "Failed to create account. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary w-full text-lg">Register</button>
            </div>
          </form>
          <p className="text-center mt-4 text-sm">
            Already have an account? <Link to="/login" className="link link-primary font-bold">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
