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

      // 2. Save to MongoDB with Name and Role
      await axiosSecure.post('/api/users/register-role', {
        uid: result.user.uid,
        email: result.user.email,
        name: data.name,
        phone: data.phone, // Added phone
        experience_years: data.experience_years,
        previous_experience: data.previous_experience,
        age: data.age, // Added age
        role: 'candidate'
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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-center mb-8">Join the <span className="text-primary underline decoration-secondary decoration-4 underline-offset-4">Team</span></h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Full Name</span></label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input input-bordered w-full font-bold ${errors.name ? 'input-error' : ''}`}
                {...register("name", { required: "Full Name is required" })}
              />
              {errors.name && <p className="text-error text-[10px] font-bold mt-1 uppercase italic tracking-tighter">{errors.name.message}</p>}
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Email Address</span></label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`input input-bordered w-full font-bold ${errors.email ? 'input-error' : ''}`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-error text-[10px] font-bold mt-1 uppercase italic tracking-tighter">{errors.email.message}</p>}
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Phone Number</span></label>
              <input
                type="text"
                placeholder="+8801..."
                className={`input input-bordered w-full font-bold ${errors.phone ? 'input-error' : ''}`}
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && <p className="text-error text-[10px] font-bold mt-1 uppercase italic tracking-tighter">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Experience (Yrs)</span></label>
                <input
                  type="number"
                  placeholder="2"
                  className={`input input-bordered w-full font-bold ${errors.experience_years ? 'input-error' : ''}`}
                  {...register("experience_years", { required: "Required" })}
                />
                {errors.experience_years && <p className="text-error text-[10px] font-bold mt-1 uppercase italic tracking-tighter">{errors.experience_years.message}</p>}
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Age</span></label>
                <input
                  type="number"
                  placeholder="25"
                  className={`input input-bordered w-full font-bold ${errors.age ? 'input-error' : ''}`}
                  {...register("age", { required: "Required" })}
                />
                {errors.age && <p className="text-error text-[10px] font-bold mt-1 uppercase italic tracking-tighter">{errors.age.message}</p>}
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Previous Role</span></label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  className={`input input-bordered w-full font-bold ${errors.previous_experience ? 'input-error' : ''}`}
                  {...register("previous_experience", { required: "Required" })}
                />
                {errors.previous_experience && <p className="text-error text-[10px] font-bold mt-1 uppercase italic tracking-tighter">{errors.previous_experience.message}</p>}
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-black uppercase text-[10px] opacity-70">Password</span></label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full font-bold ${errors.password ? 'input-error' : ''}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "At least 6 characters"
                  }
                })}
              />
              {errors.password && <p className="text-error text-[10px] font-bold mt-1 uppercase italic tracking-tighter">{errors.password.message}</p>}
            </div>

            <div className="form-control mt-8">
              <button className="btn btn-primary w-full font-black uppercase italic shadow-lg">Create Account</button>
            </div>
          </form>
          <p className="text-center mt-6 text-sm font-bold italic opacity-70">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
