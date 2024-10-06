import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../userAuthentication.module.css";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import usePageTitle from "../../../hooks/usePageTitle";

const PasswordResetForm = () => {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  usePageTitle("Password Reset");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "id") {
      setId(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      id,
      email,
    };
    try {
      // Send a password reset request to the server
      const response = await fetch(
        "http://localhost:8000/auth/password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Handle the response from the server
      const data = await response.json();

      if (response.ok) {
        // Password reset was successful
        setMessage(data.message);
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 2000);
      } else {
        // Password reset failed
        setMessage(data.message);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error during password reset:", error);
      setMessage(
        "The given ID or Email do not exist in the system. Something went wrong (database)"
      );
    }
  };

  return (
    <form action="auth/password-reset" method="POST" className={styles.form}>
      <h1 className={styles.userAuthHeading}>Password Reset</h1>
      <InputField
        label="ID:"
        pattern="[0-9]{9}"
        placeholder="ID"
        value={id}
        name="id"
        onChange={handleChange}
        required
      />
      <InputField
        label="Email:"
        placeholder="name@gmail.com"
        value={email}
        name="email"
        onChange={handleChange}
        required
      />
      <Button type="submit" label="Reset Password" handleClick={handleSubmit} />
      {message && (
        <p
          className={
            message.includes("success") ? styles.success : styles.failure
          }
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default PasswordResetForm;
