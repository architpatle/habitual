import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // Save token
    localStorage.setItem("token", data.token);

    // Go to dashboard
    navigate("/");
  };

  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center", color: "white" }}>
      <form onSubmit={handleLogin} style={{ width: 320 }}>
        <h2>Unlock Habitual</h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 12 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={{ width: "100%", marginTop: 12 }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
