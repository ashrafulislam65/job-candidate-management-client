import useAuth from "./hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    login(email, password)
      .then(res => console.log(res.user))
      .catch(err => console.error(err));
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
