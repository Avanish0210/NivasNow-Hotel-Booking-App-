import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiSettings } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="main-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" id="nav-logo">
                    <div className="logo-icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M14 2L2 9L14 16L26 9L14 2Z" fill="url(#grad1)" opacity="0.9" />
                            <path d="M2 19L14 26L26 19" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" />
                            <path d="M2 14L14 21L26 14" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                            <defs>
                                <linearGradient id="grad1" x1="2" y1="2" x2="26" y2="26">
                                    <stop stopColor="#FF385C" />
                                    <stop offset="1" stopColor="#7C3AED" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="logo-text">NivasNow</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link" id="nav-home">
                        <FiHome size={16} />
                        <span>Home</span>
                    </Link>
                    <Link to="/search" className="nav-link" id="nav-explore">
                        <span>Explore</span>
                    </Link>
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button className="user-avatar" onClick={() => setMenuOpen(!menuOpen)} id="user-menu-btn">
                                <FiUser size={18} />
                                <span className="user-name">{user?.name || user?.email?.split('@')[0]}</span>
                            </button>
                            {menuOpen && (
                                <div className="dropdown-menu animate-fade-in-down" id="user-dropdown">
                                    <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                        <FiSettings size={16} />
                                        <span>Dashboard</span>
                                    </Link>
                                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                                        <FiLogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">Login</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm" id="nav-signup">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
