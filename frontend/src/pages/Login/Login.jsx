import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import styles from "./Login.module.css";

import logo from "../../assets/images/Habitual-logo.png"; 

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await API.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed"
      );

      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {/* Logo */}
      <div className={styles.logoWrapper}>
        <img
          src={logo}
          alt="Logo"
          className={styles.logo}
        />
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          disabled={loading}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={loading ? styles.loadingBtn : ""}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p>
          No account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Login;