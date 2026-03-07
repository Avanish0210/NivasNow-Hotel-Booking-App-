import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hotelBrowseAPI } from '../services/api';
import { FiSearch, FiMapPin, FiStar, FiArrowRight, FiLoader } from 'react-icons/fi';
import './SearchResults.css';

const SAMPLE_HOTELS = [
    {
        hotel: { id: 1, name: 'The Grand Palace', city: 'Mumbai', photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop'], amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'], active: true },
        price: 4500,
    },
    {
        hotel: { id: 2, name: 'Ocean View Resort', city: 'Goa', photos: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop'], amenities: ['Beach', 'Pool', 'Bar', 'WiFi'], active: true },
        price: 6200,
    },
    {
        hotel: { id: 3, name: 'Mountain Retreat', city: 'Shimla', photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop'], amenities: ['Fireplace', 'Restaurant', 'Hiking', 'WiFi'], active: true },
        price: 3800,
    },
    {
        hotel: { id: 4, name: 'Heritage Haveli', city: 'Jaipur', photos: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop'], amenities: ['Heritage', 'Garden', 'Restaurant', 'WiFi'], active: true },
        price: 5100,
    },
    {
        hotel: { id: 5, name: 'Lakeside Serenity', city: 'Udaipur', photos: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop'], amenities: ['Lake View', 'Spa', 'Pool', 'WiFi'], active: true },
        price: 7200,
    },
    {
        hotel: { id: 6, name: 'Tech City Suites', city: 'Bangalore', photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop'], amenities: ['Gym', 'Co-working', 'Pool', 'WiFi'], active: true },
        price: 3200,
    },
];

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState(searchParams.get('city') || '');

    useEffect(() => {
        fetchHotels();
    }, [searchParams]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const params = {
                city: searchParams.get('city') || '',
                startDate: searchParams.get('startDate') || '',
                endDate: searchParams.get('endDate') || '',
                roomsCount: searchParams.get('roomsCount') || 1,
            };
            const { data } = await hotelBrowseAPI.search(params);
            setHotels(data.content || data || []);
        } catch (err) {
            // Use sample data when backend is unavailable
            let filtered = SAMPLE_HOTELS;
            const city = searchParams.get('city');
            if (city) {
                filtered = SAMPLE_HOTELS.filter(h =>
                    h.hotel.city.toLowerCase().includes(city.toLowerCase()) ||
                    h.hotel.name.toLowerCase().includes(city.toLowerCase())
                );
            }
            setHotels(filtered.length > 0 ? filtered : SAMPLE_HOTELS);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?city=${searchCity}`);
    };

    return (
        <div className="search-page" id="search-page">
            <div className="search-page-header">
                <div className="container">
                    <form className="inline-search glass-card" onSubmit={handleSearch}>
                        <FiMapPin className="inline-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by city or hotel name..."
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            className="inline-search-input"
                            id="inline-search-input"
                        />
                        <button type="submit" className="btn btn-primary" id="inline-search-btn">
                            <FiSearch size={16} />
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="container">
                <div className="search-meta">
                    <h1 className="search-title">
                        {searchParams.get('city')
                            ? `Hotels in ${searchParams.get('city')}`
                            : 'All Available Hotels'}
                    </h1>
                    <span className="search-count">{hotels.length} properties found</span>
                </div>

                {loading ? (
                    <div className="search-loading">
                        <FiLoader className="search-loader-icon" size={32} />
                        <p>Searching for the best stays...</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="search-empty">
                        <p>No hotels found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="hotels-grid">
                        {hotels.map((item, index) => {
                            const hotel = item.hotel || item;
                            const price = item.price || 0;
                            return (
                                <div
                                    key={hotel.id || index}
                                    className="hotel-card glass-card"
                                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                    id={`hotel-card-${hotel.id}`}
                                >
                                    <div className="hotel-card-image">
                                        <img
                                            src={hotel.photos?.[0] || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop`}
                                            alt={hotel.name}
                                            loading="lazy"
                                        />
                                        <div className="hotel-card-badge">
                                            <FiStar size={12} />
                                            <span>4.8</span>
                                        </div>
                                    </div>
                                    <div className="hotel-card-content">
                                        <div className="hotel-card-header">
                                            <h3 className="hotel-card-name">{hotel.name}</h3>
                                            <div className="hotel-card-location">
                                                <FiMapPin size={14} />
                                                <span>{hotel.city}</span>
                                            </div>
                                        </div>
                                        {hotel.amenities && (
                                            <div className="hotel-card-amenities">
                                                {(hotel.amenities || []).slice(0, 3).map((a, i) => (
                                                    <span key={i} className="amenity-tag">{a}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="hotel-card-footer">
                                            <div className="hotel-card-price">
                                                <span className="price-amount">₹{price.toLocaleString()}</span>
                                                <span className="price-label">/night</span>
                                            </div>
                                            <button className="btn btn-primary btn-sm">
                                                View <FiArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
