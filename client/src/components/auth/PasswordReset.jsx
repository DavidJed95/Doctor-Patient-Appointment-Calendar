import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../config";

import InputField from "../common/InputField";
import Button from "../common/Button";
import styles from "../form/userAuthentication.module.css";

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setNewPassword(value);
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      setStatusMessage(data.message);
      if (response.ok) {
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 3000);
      }
    } catch (error) {
      console.error("error resetting password: ", error);
      setStatusMessage(error.message);
    }
  };
  return (
    <div className={styles.form}>
      <h1>PasswordReset</h1>
      <InputField
        placeholder="Enter new password"
        value={newPassword}
        name="password"
        type="password"
        onChange={handleChange}
        required
      />
      <Button
        label="Reset Password"
        type="submit"
        handleClick={handlePasswordReset}
      />
      <p
        className={
          statusMessage.includes("success") ? styles.success : styles.failure
        }
      >
        {statusMessage}
      </p>
    </div>
  );
};
export default PasswordReset;
