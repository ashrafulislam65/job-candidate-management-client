import useAuth from "./hooks/useAuth";

const Register = () => {
  const { register } = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    register(email, password)
      .then(res => console.log(res.user))
      .catch(err => console.error(err));
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
