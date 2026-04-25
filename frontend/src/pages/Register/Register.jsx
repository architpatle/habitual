import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import styles from "../Login/Login.module.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/register",
        form
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <h2>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">
          Register
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;