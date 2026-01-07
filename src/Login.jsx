import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await login(email, password);
      const token = await result.user.getIdToken();
      console.log("User Token:", token);
      navigate("/app");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <input name="password" type="password" />
      <button>Login</button>
    </form>
  );
};

export default Login;
