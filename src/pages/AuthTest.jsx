import useAuth from "../hooks/useAuth";

const AuthTest = () => {
  const { user, loading, register, login, logout } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h3>Auth Test</h3>

      <p>
        Status: {user ? `Logged in as ${user.email}` : "Not logged in"}
      </p>

      {!user && (
        <>
          <button
            onClick={() =>
              register("testuser@gmail.com", "123456")
            }
          >
            Register Test User
          </button>

          <br /><br />

          <button
            onClick={() =>
              login("testuser@gmail.com", "123456")
            }
          >
            Login Test User
          </button>
        </>
      )}

      {user && (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
};

export default AuthTest;
