import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await register(email, password);
      const token = await result.user.getIdToken();
      console.log("User Token:", token);
      navigate("/app");
    } catch (err) {
      console.error(err);
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
