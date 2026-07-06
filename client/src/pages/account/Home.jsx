import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import './Home.scss';

const Home = () => {
    const { user, loading, handleSignout } = useAuth();
    const navigate = useNavigate();

    const onSignout = async () => {
        const result = await handleSignout();
        if (result.success) {
            navigate('/sign-in');
        } else {
            alert('Logout failed: ' + result.error);
        }
    };

    // Helper to get user initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="global-loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading CareerPilot Workspace...</p>
            </div>
        );
    }

    return (
        <div className="home-page">
            {/* Header/Navbar */}
            <header className="navbar">
                <div className="logo">
                    Career<span>Pilot</span>
                </div>
                <nav className="nav-links">
                    <a href="#features" onClick={(e) => e.preventDefault()}>Features</a>
                    <a href="#about" onClick={(e) => e.preventDefault()}>Pricing</a>
                    <a href="#resources" onClick={(e) => e.preventDefault()}>Resources</a>
                </nav>
                <div className="nav-actions">
                    {user ? (
                        <div className="user-profile-nav">
                            <div className="user-avatar" title={user.name}>
                                {getInitials(user.name)}
                            </div>
                            <span className="user-name">{user.name}</span>
                            <button className="signout-btn-nav" onClick={onSignout}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '15px', height: '15px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/sign-in" className="login-btn">Sign In</Link>
                            <Link to="/sign-up" className="signup-btn">Start Free</Link>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="home-container">
                {user ? (
                    /* Authenticated User Dashboard */
                    <>
                        <div className="dashboard-header">
                            <h1 className="welcome-text">Welcome back, {user.name.split(' ')[0]}!</h1>
                            <p className="welcome-sub">Your career pipeline is clear. What would you like to build today?</p>
                        </div>

                        <div className="dashboard-grid">
                            <div className="hub-card">
                                <div className="hub-top">
                                    <div className="hub-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                        </svg>
                                    </div>
                                    <h3 className="hub-title">AI Resume Architect</h3>
                                    <p className="hub-desc">Draft, score, and optimize your resume for applicant tracking systems.</p>
                                </div>
                                <div className="hub-action">
                                    <span>Open Builder</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>

                            <div className="hub-card">
                                <div className="hub-top">
                                    <div className="hub-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H9v4.5Zm0 0V9m0 12V3m0 18h3.75M9 3h3.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Zm-9-6.375V6.75m0 10.5V18" />
                                        </svg>
                                    </div>
                                    <h3 className="hub-title">Application Runway</h3>
                                    <p className="hub-desc">Organize, structure, and track your job applications on a visual Kanban board.</p>
                                </div>
                                <div className="hub-action">
                                    <span>Track Applications</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>

                            <div className="hub-card">
                                <div className="hub-top">
                                    <div className="hub-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Zm0 0c-2.924 0-5.385-1.939-6.196-4.595a8.978 8.978 0 0 1 3.38-1.503M12 18c2.924 0 5.385-1.939 6.196-4.595a8.978 8.978 0 0 0-3.38-1.503m0 0a4.5 4.5 0 1 1-6.196 0" />
                                        </svg>
                                    </div>
                                    <h3 className="hub-title">Interview Cockpit</h3>
                                    <p className="hub-desc">Ace custom domain preparation guides, question sets, and tips.</p>
                                </div>
                                <div className="hub-action">
                                    <span>Enter Cockpit</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Guest Landing Screen */
                    <>
                        <div className="landing-hero">
                            <span className="badge">INTRODUCING CAREERPILOT v1.0</span>
                            <h1 className="hero-title">Your complete career navigation dashboard.</h1>
                            <p className="hero-desc">
                                From ATS resume builder and pipeline trackers to personalized prep cards, CareerPilot guides you step-by-step to your dream tech job.
                            </p>
                            <div className="cta-group">
                                <Link to="/sign-up" className="cta-primary">Launch Your Pilot Trial</Link>
                                <Link to="/sign-in" className="cta-secondary">Sign In</Link>
                            </div>
                        </div>

                        <div className="features-section" id="features">
                            <div className="feature-card">
                                <div className="card-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                </div>
                                <h3 className="card-title">Stunning Speed</h3>
                                <p className="card-desc">Instantly load templates, track applications, and preview results with no lag.</p>
                            </div>

                            <div className="feature-card">
                                <div className="card-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="card-title">ATS Optimizer</h3>
                                <p className="card-desc">Automatically analyze your resumes against job roles to match key ATS vocabulary.</p>
                            </div>

                            <div className="feature-card">
                                <div className="card-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                    </svg>
                                </div>
                                <h3 className="card-title">Metrics Dashboard</h3>
                                <p className="card-desc">Review custom analytics on application conversion rates, interviews, and responses.</p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;