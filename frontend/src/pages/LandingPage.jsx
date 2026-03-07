import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroScene from '../components/HeroScene';
import { FiSearch, FiCalendar, FiUsers, FiMapPin, FiStar, FiShield, FiZap, FiHeart } from 'react-icons/fi';
import './LandingPage.css';

const FEATURED_CITIES = [
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop', count: '2,400+ stays' },
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop', count: '1,800+ stays' },
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop', count: '3,100+ stays' },
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop', count: '1,500+ stays' },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop', count: '900+ stays' },
    { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop', count: '1,200+ stays' },
];

const FEATURES = [
    { icon: <FiShield size={28} />, title: 'Verified Stays', desc: 'Every property is verified for quality and comfort' },
    { icon: <FiZap size={28} />, title: 'Instant Booking', desc: 'Book in seconds with our seamless process' },
    { icon: <FiHeart size={28} />, title: 'Best Prices', desc: 'Price match guarantee on every booking' },
    { icon: <FiStar size={28} />, title: 'Top Rated', desc: 'Curated collection of highest-rated properties' },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        city: '',
        startDate: '',
        endDate: '',
        roomsCount: 1,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchData.city) params.append('city', searchData.city);
        if (searchData.startDate) params.append('startDate', searchData.startDate);
        if (searchData.endDate) params.append('endDate', searchData.endDate);
        if (searchData.roomsCount) params.append('roomsCount', searchData.roomsCount);
        navigate(`/search?${params.toString()}`);
    };

    const handleCityClick = (cityName) => {
        navigate(`/search?city=${cityName}`);
    };

    return (
        <div className="landing-page" id="landing-page">
            {/* Hero Section with 3D Scene */}
            <section className="hero-section" id="hero-section">
                <div className="hero-3d-bg">
                    <HeroScene />
                </div>
                <div className="hero-overlay" />
                <div className="hero-content container">
                    <div className="hero-text animate-fade-in-up">
                        <span className="hero-tag">✨ Premium Hotel Booking</span>
                        <h1 className="hero-title">
                            Discover Your
                            <span className="hero-gradient-text"> Perfect Stay</span>
                        </h1>
                        <p className="hero-subtitle">
                            Explore curated luxury hotels and unique stays worldwide.
                            Book your dream experience with immersive 3D previews.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form className="search-bar glass-card animate-fade-in-up stagger-2" onSubmit={handleSearch} id="search-bar">
                        <div className="search-field">
                            <FiMapPin className="search-icon" />
                            <div className="search-field-content">
                                <label className="search-label">Where</label>
                                <input
                                    type="text"
                                    placeholder="Search destinations"
                                    className="search-input"
                                    value={searchData.city}
                                    onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                                    id="search-city"
                                />
                            </div>
                        </div>
                        <div className="search-divider" />
                        <div className="search-field">
                            <FiCalendar className="search-icon" />
                            <div className="search-field-content">
                                <label className="search-label">Check in</label>
                                <input
                                    type="date"
                                    className="search-input"
                                    value={searchData.startDate}
                                    onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                                    id="search-checkin"
                                />
                            </div>
                        </div>
                        <div className="search-divider" />
                        <div className="search-field">
                            <FiCalendar className="search-icon" />
                            <div className="search-field-content">
                                <label className="search-label">Check out</label>
                                <input
                                    type="date"
                                    className="search-input"
                                    value={searchData.endDate}
                                    onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                                    id="search-checkout"
                                />
                            </div>
                        </div>
                        <div className="search-divider" />
                        <div className="search-field">
                            <FiUsers className="search-icon" />
                            <div className="search-field-content">
                                <label className="search-label">Rooms</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    className="search-input"
                                    value={searchData.roomsCount}
                                    onChange={(e) => setSearchData({ ...searchData, roomsCount: parseInt(e.target.value) })}
                                    id="search-rooms"
                                />
                            </div>
                        </div>
                        <button type="submit" className="search-btn" id="search-submit">
                            <FiSearch size={20} />
                        </button>
                    </form>

                    {/* Stats */}
                    <div className="hero-stats animate-fade-in-up stagger-3">
                        <div className="stat-item">
                            <span className="stat-number">50K+</span>
                            <span className="stat-label">Properties</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">200+</span>
                            <span className="stat-label">Cities</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">4.9</span>
                            <span className="stat-label">Avg Rating</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">1M+</span>
                            <span className="stat-label">Happy Guests</span>
                        </div>
                    </div>
                </div>
                <div className="hero-bottom-gradient" />
            </section>

            {/* Features Section */}
            <section className="features-section" id="features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Why NivasNow</span>
                        <h2 className="section-title">A Better Way to Book</h2>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((feature, i) => (
                            <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="destinations-section" id="destinations-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Top Destinations</span>
                        <h2 className="section-title">Trending Places to Stay</h2>
                    </div>
                    <div className="destinations-grid">
                        {FEATURED_CITIES.map((city, i) => (
                            <div
                                key={city.name}
                                className="destination-card"
                                onClick={() => handleCityClick(city.name)}
                                style={{ animationDelay: `${i * 0.1}s` }}
                                id={`dest-${city.name.toLowerCase()}`}
                            >
                                <div className="destination-image">
                                    <img src={city.image} alt={city.name} loading="lazy" />
                                    <div className="destination-overlay" />
                                </div>
                                <div className="destination-info">
                                    <h3 className="destination-name">{city.name}</h3>
                                    <span className="destination-count">{city.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" id="cta-section">
                <div className="container">
                    <div className="cta-card glass-card">
                        <div className="cta-glow" />
                        <h2 className="cta-title">Ready to Find Your Perfect Stay?</h2>
                        <p className="cta-text">
                            Join millions of travelers who trust NivasNow for unforgettable experiences.
                        </p>
                        <div className="cta-buttons">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')} id="cta-signup">
                                Get Started Free
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/search')} id="cta-explore">
                                Explore Hotels
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h3 className="footer-logo">NivasNow</h3>
                            <p className="footer-tagline">Your gateway to premium stays worldwide.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Explore</h4>
                            <a href="/search">Hotels</a>
                            <a href="/search?city=Mumbai">Mumbai</a>
                            <a href="/search?city=Goa">Goa</a>
                        </div>
                        <div className="footer-links">
                            <h4>Company</h4>
                            <a href="#">About Us</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                        </div>
                        <div className="footer-links">
                            <h4>Support</h4>
                            <a href="#">Help Center</a>
                            <a href="#">Safety</a>
                            <a href="#">Privacy</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 NivasNow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
