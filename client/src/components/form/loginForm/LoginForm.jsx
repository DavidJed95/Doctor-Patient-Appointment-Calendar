import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";

import { useDispatch } from "react-redux";
import { updateLoginStatus, setUser } from "../../../redux/reducers/userSlice";
import usePageTitle from "../../../hooks/usePageTitle";

import styles from "../userAuthentication.module.css";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import LoadingSpinner from "../LoadingSpinner";

const LoginForm = () => {
  const [userDetails, setUserDetails] = useState({ id: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  usePageTitle('Login')
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  /**
   * Function that handles the submission of the login information
   * @param {*} event - event of submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const requestBody = userDetails;

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const data = await response.json();
      setMessage(data.message);
      console.log("data: ", data);

      if (response.ok) {
        dispatch(updateLoginStatus(true));
        dispatch(setUser(data.user));

        setTimeout(() => {
          navigate(data.redirectTo);
        }, 3000);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage(error.message);
      setLoading(false);
    }
  };

  const handleCompletion = () => {
    setLoading(false);
  };

  // TODO: need to change message of missing id or password in server
  return (
    <div className="container">
      <form action="/auth/login" className={styles.form}>
        <div className={`${styles.div}`}>
          <div className={styles.overlap}>
            <h1 className={styles.userAuthHeading}>Login</h1>

            <div>
              <InputField
                label="ID:"
                placeholder="Enter Your ID"
                value={userDetails.id}
                name="id"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.form.input}>
              <InputField
                className={styles.form.input}
                label="Password:"
                placeholder="Enter Your Password"
                value={userDetails.password}
                name="password"
                type="password"
                onChange={handleChange}
                required
              />
            </div>
            <Button
              className={styles.frame}
              label="Login"
              type="submit"
              handleClick={handleSubmit}
            />
            <div>
              <Link to="/register">Sign Up</Link>
            </div>
            <div>
              <Link to="/password-reset">Forgot your Password?</Link>
            </div>
            {message && (
              <p
                className={
                  message.includes("success") ? styles.success : styles.failure
                }
              >
                {message}
              </p>
            )}
            {loading && <LoadingSpinner onCompletion={handleCompletion} />}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
