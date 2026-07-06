import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import './Auth.scss';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email request, 2: OTP & Reset
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // UI Helpers
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Flow states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [devOtp, setDevOtp] = useState(''); // Dev helper to display OTP

    const { handleForgotPassword, handleResetPassword } = useAuth();
    const navigate = useNavigate();

    // Password strength visualizer
    React.useEffect(() => {
        if (!newPassword) {
            setPasswordStrength(0);
            return;
        }

        let strength = 1;
        if (newPassword.length >= 8) {
            strength += 1;
        }
        const hasNumber = /\d/.test(newPassword);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        if (hasNumber && hasSpecial && newPassword.length >= 6) {
            strength += 1;
        }

        setPasswordStrength(Math.min(strength, 3));
    }, [newPassword]);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!email.trim()) {
            setErrorMsg('Please enter your email address.');
            return;
        }

        setIsSubmitting(true);
        const result = await handleForgotPassword(email.trim());
        setIsSubmitting(false);

        if (result.success) {
            setSuccessMsg('A 6-digit verification code has been sent to your email.');
            // Save the OTP in state so we can show it as a helper for development
            if (result.otp) {
                setDevOtp(result.otp);
            }
            setStep(2);
        } else {
            setErrorMsg(result.error || 'Failed to request reset. Please verify your email.');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!otp.trim() || !newPassword || !confirmPassword) {
            setErrorMsg('All fields are required.');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMsg('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        const result = await handleResetPassword(email.trim(), otp.trim(), newPassword);
        setIsSubmitting(false);

        if (result.success) {
            setSuccessMsg('Your password has been successfully reset. Redirecting to login...');
            setTimeout(() => {
                navigate('/sign-in');
            }, 3000);
        } else {
            setErrorMsg(result.error || 'Verification code failed or expired.');
        }
    };

    return (
        <div className="auth-container">
            {/* Left Column: Premium Branding & Feature Showcase */}
            <div className="auth-left-panel">
                <div className="brand-logo">
                    Career<span>Pilot</span>
                </div>

                <div className="hero-content">
                    <h1 className="hero-title">Reset your pilot keys securely.</h1>
                    <p className="hero-subtitle">
                        CareerPilot secures your authentication keys with advanced industry hashing, making sure your workspace dashboard remains completely private.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <div className="feature-text">
                                <h3 className="feature-title">Secure Recovery Flow</h3>
                                <p className="feature-desc">Uses 6-digit OTP parameters with transient database lifespans.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div className="feature-text">
                                <h3 className="feature-title">One-Way Encryption</h3>
                                <p className="feature-desc">Your original password is never recoverable directly, protecting your keys from databases.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hero-footer">
                    <span>© 2026 CareerPilot. All rights reserved.</span>
                    <span>Version 1.0.0</span>
                </div>
            </div>

            {/* Right Column: Dynamic Form */}
            <div className="auth-right-panel">
                <div className="auth-card">
                    <div className="card-header">
                        <div className="card-logo">
                            Career<span>Pilot</span>
                        </div>
                        <h2 className="card-title">Reset password</h2>
                        <p className="card-subtitle">
                            {step === 1 
                                ? "Enter your email address to receive a security OTP code." 
                                : "Enter the verification code and set a new password."}
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="auth-alert" style={{ marginBottom: '1.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="auth-alert alert-success" style={{ marginBottom: '1.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Developer Helper Box */}
                    {step === 2 && devOtp && (
                        <div className="auth-alert alert-success" style={{ marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.25)', color: '#c7d2fe' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.718 1.314l-.041.02c-.08.04-.168.08-.261.121-.299.13-.679.294-1.077.491a13.385 13.385 0 00-3.376 2.378M21 12a9 9 0 11-18 0 9 9 0 0 1 18 0z" />
                            </svg>
                            <span><strong>Dev Helper:</strong> Recovery code generated: <strong>{devOtp}</strong></span>
                        </div>
                    )}

                    {step === 1 ? (
                        /* Step 1: Request Form */
                        <form className="auth-form" onSubmit={handleRequestOtp}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-btn" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Sending OTP...</span>
                                    </>
                                ) : (
                                    <span>Send Verification Code</span>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* Step 2: Verification and Reset Form */
                        <form className="auth-form" onSubmit={handleReset}>
                            <div className="form-group">
                                <label htmlFor="otp">Verification Code</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isSubmitting}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.822 7.822 3 3m-3-3a9 9 0 0 1-8.622-8.622m0 0 3-3m3 3a2.25 2.25 0 0 0 2.249 2.25m3.75-2.25a3.75 3.75 0 0 0-3.75-3.75" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {newPassword && (
                                    <div className="password-strength">
                                        <div className={`strength-bar ${passwordStrength >= 1 ? 'active-weak' : ''}`}></div>
                                        <div className={`strength-bar ${passwordStrength >= 2 ? 'active-medium' : ''}`}></div>
                                        <div className={`strength-bar ${passwordStrength >= 3 ? 'active-strong' : ''}`}></div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isSubmitting}
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.822 7.822 3 3m-3-3a9 9 0 0 1-8.622-8.622m0 0 3-3m3 3a2.25 2.25 0 0 0 2.249 2.25m3.75-2.25a3.75 3.75 0 0 0-3.75-3.75" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="auth-btn" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Resetting...</span>
                                    </>
                                ) : (
                                    <span>Reset Password</span>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="auth-card-footer">
                        Remember your keys?
                        <Link to="/sign-in">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
