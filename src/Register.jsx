import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axiosSecure from "./api/axiosSecure";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // 1. Register in Firebase
      const result = await register(email, password);

      // 2. Get Token (needed for axiosSecure, though verifyToken middleware might bypass for this specific endpoint if public, but here we use secure)
      // Actually, axiosSecure uses the *current* user. After register, 'auth.currentUser' is set. 
      // We'll trust axiosSecure interceptor to pick it up, or explicit token if needed.
      // Better to wait a bit or just force token fetch if needed, but interceptor handles it.

      // 3. Save to MongoDB
      await axiosSecure.post('/api/users/register-role', {
        uid: result.user.uid,
        email: result.user.email,
        role: 'candidate' // Default role
      });

      console.log("User registered in DB");
      navigate("/app");
    } catch (err) {
      console.error("Registration Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button>Register</button>
    </form>
  );
};

export default Register;
