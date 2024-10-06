import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../userAuthentication.module.css";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import UserSelector, { UserType } from "../../user/UserSelector";
import usePageTitle from "../../../hooks/usePageTitle";

/**
 * Registration form page component
 * @returns The registration
 */
const RegistrationForm = () => {
  const initialState = {
    userType: UserType.Patient,
    id: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    languages: "",
    medicalStatus: "",
    medicalLicense: "",
    specialization: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  usePageTitle('SignUp')
  /**
   * This method handles the change of the input values
   * @param {*} event - event target to change
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  /**
   * This method handles the Submission of the form
   * @param {*} event event target to change for submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.id ||
      !formData.password ||
      !formData.passwordConfirm ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile ||
      !formData.languages
    ) {
      setMessage("Please enter all required fields.");
      return;
    }

    const creationDate = new Date();
    const formattedCreationDate = creationDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const requestBody = {
      userType: formData.userType,
      id: formData.id,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      languages: formData.languages,
      creationDate: formattedCreationDate,
      medicalStatus:
        formData.userType === UserType.Patient
          ? formData.medicalStatus
          : undefined,
      medicalLicense:
        formData.userType === UserType.MedicalSpecialist
          ? formData.medicalLicense
          : undefined,
      specialization:
        formData.userType === UserType.MedicalSpecialist
          ? formData.specialization
          : undefined,
    };

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 2000);
      }
    } catch (error) {
      console.error(
        "An error occurred during registration due to false data insertion:",
        error
      );
      setMessage(
        error.message ||
          "An error occurred during registration due to false data insertion."
      );
    }
  };

  const renderPatientFields = () => {
    return (
      <div>
        <InputField
          label="Medical Status:"
          placeholder="Medical Status"
          value={formData.medicalStatus}
          name="medicalStatus"
          onChange={handleChange}
          required
        />
      </div>
    );
  };

  const renderDoctorFields = () => {
    return (
      <>
        <div>
          <InputField
            label="Medical License:"
            placeholder="Medical License"
            value={formData.medicalLicense}
            name="medicalLicense"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <InputField
            label="Specialization:"
            placeholder="Family Doctor, Pediatrician, Orthopedics, Physiotherapy, Hydrotherapy, Occupational Therapy, Eyes, Urology, Psychology, Otorhinolaryngology"
            value={formData.specialization}
            name="specialization"
            onChange={handleChange}
            required
          />
        </div>
      </>
    );
  };

  return (
    <form action="/auth/register" method="POST" className={styles.form}>
      <h1 className={styles.userAuthHeading}>Register</h1>

      <UserSelector onChange={handleChange} />
      <div>
        <InputField
          label="ID:"
          placeholder="ID"
          pattern="[0-9]{9}"
          value={formData.id}
          name="id"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        {/* Minimum eight and maximum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character */}
        <InputField
          label="Password:"
          placeholder="Password"
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}"
          value={formData.password}
          name="password"
          type="password"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        {/* Minimum eight and maximum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character */}
        <InputField
          label="Password Confirmation:"
          placeholder="Confirm your password:"
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}"
          value={formData.passwordConfirm}
          name="passwordConfirm"
          type="password"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <InputField
          label="First Name:"
          placeholder="First Name"
          value={formData.firstName}
          name="firstName"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <InputField
          label="Last Name:"
          placeholder="Last Name"
          value={formData.lastName}
          name="lastName"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <InputField
          label="Email:"
          placeholder="name@gmail.com"
          value={formData.email}
          name="email"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <InputField
          label="Mobile:"
          placeholder="Mobile"
          value={formData.mobile}
          name="mobile"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <InputField
          label="Languages:"
          placeholder="Languages"
          value={formData.languages}
          name="languages"
          onChange={handleChange}
          required
        />
      </div>

      {formData.userType === UserType.Patient && renderPatientFields()}

      {formData.userType === UserType.MedicalSpecialist && renderDoctorFields()}

      <Button label="Register" type="submit" handleClick={handleSubmit} />
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
export default RegistrationForm;
