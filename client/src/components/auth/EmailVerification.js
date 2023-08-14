import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../form/userAuthentication.module.css'

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');

  useEffect(() => {
    async function verifyEmail() {
      try {
        console.log('Token being sent: ', token);
        const response = await fetch(
          `http://localhost:8000/auth/verify-email/${token}`,
        );
        const data = await response.json();
        console.log('Response data: ', data);
        if (response.ok) {
          setVerificationStatus(data.message);
          setTimeout(() => {
            navigate(data.redirectTo);
          }, 2000);
        } else {
          setVerificationStatus(data.message);
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('An error occurred during email verification.');
      }
    }
    verifyEmail();
  }, [token, navigate]);
  return (
    <div className={`${styles.form} ${styles.emailAuthHeading}`}>
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};
export default EmailVerification;
