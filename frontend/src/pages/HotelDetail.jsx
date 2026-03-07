import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelBrowseAPI } from '../services/api';
import RoomScene from '../components/RoomScene';
import { FiMapPin, FiPhone, FiMail, FiStar, FiUsers, FiWifi, FiCoffee, FiDroplet, FiArrowRight } from 'react-icons/fi';
import './HotelDetail.css';

const SAMPLE_HOTEL = {
    hotel: {
        id: 1,
        name: 'The Grand Palace Hotel',
        city: 'Mumbai',
        photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=500&fit=crop',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop',
        ],
        amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Restaurant', 'Bar', 'Gym', 'Airport Shuttle', 'Room Service'],
        contactInfo: { address: '123 Marine Drive, Mumbai', phoneNumber: '+91 98765 43210', email: 'info@grandpalace.com', location: 'Mumbai, Maharashtra' },
        active: true,
    },
    rooms: [
        { id: 1, type: 'Standard', basePrice: 3500, photos: [], amenities: ['WiFi', 'AC', 'TV'], totalCount: 20, capacity: 2 },
        { id: 2, type: 'Deluxe', basePrice: 5500, photos: [], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], totalCount: 10, capacity: 2 },
        { id: 3, type: 'Suite', basePrice: 9500, photos: [], amenities: ['WiFi', 'AC', 'TV', 'Living Area', 'Jacuzzi', 'Butler'], totalCount: 5, capacity: 4 },
        { id: 4, type: 'Premium', basePrice: 7000, photos: [], amenities: ['WiFi', 'AC', 'TV', 'Sea View', 'Lounge'], totalCount: 8, capacity: 3 },
    ],
};

const AMENITY_ICONS = {
    'Free WiFi': <FiWifi />,
    'WiFi': <FiWifi />,
    'Restaurant': <FiCoffee />,
    'Swimming Pool': <FiDroplet />,
};

export default function HotelDetail() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [hotelInfo, setHotelInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePhoto, setActivePhoto] = useState(0);

    useEffect(() => {
        fetchHotelInfo();
    }, [hotelId]);

    const fetchHotelInfo = async () => {
        setLoading(true);
        try {
            const { data } = await hotelBrowseAPI.getHotelInfo(hotelId);
            setHotelInfo(data);
        } catch (err) {
            setHotelInfo(SAMPLE_HOTEL);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="hotel-detail-page">
                <div className="container">
                    <div className="hotel-loading">
                        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
                        <div className="skeleton" style={{ width: '60%', height: '32px', marginTop: '24px' }} />
                        <div className="skeleton" style={{ width: '40%', height: '20px', marginTop: '12px' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!hotelInfo) return null;

    const { hotel, rooms } = hotelInfo;

    return (
        <div className="hotel-detail-page" id="hotel-detail-page">
            <div className="container">
                {/* Photo Gallery */}
                <section className="hotel-gallery animate-fade-in" id="hotel-gallery">
                    <div className="gallery-main">
                        <img
                            src={hotel.photos?.[activePhoto] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop'}
                            alt={hotel.name}
                        />
                    </div>
                    {hotel.photos && hotel.photos.length > 1 && (
                        <div className="gallery-thumbs">
                            {hotel.photos.map((photo, i) => (
                                <button
                                    key={i}
                                    className={`gallery-thumb ${i === activePhoto ? 'active' : ''}`}
                                    onClick={() => setActivePhoto(i)}
                                >
                                    <img src={photo} alt={`${hotel.name} ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Hotel Info */}
                <section className="hotel-info-section animate-fade-in-up">
                    <div className="hotel-info-main">
                        <div className="hotel-info-header">
                            <div>
                                <h1 className="hotel-detail-name">{hotel.name}</h1>
                                <div className="hotel-detail-location">
                                    <FiMapPin size={16} />
                                    <span>{hotel.contactInfo?.address || hotel.city}</span>
                                </div>
                            </div>
                            <div className="hotel-rating-badge">
                                <FiStar size={16} />
                                <span>4.8</span>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="hotel-amenities-section">
                            <h2 className="sub-section-title">Amenities</h2>
                            <div className="amenities-grid">
                                {(hotel.amenities || []).map((amenity, i) => (
                                    <div key={i} className="amenity-item">
                                        <span className="amenity-icon">{AMENITY_ICONS[amenity] || <FiStar size={14} />}</span>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        {hotel.contactInfo && (
                            <div className="hotel-contact-section">
                                <h2 className="sub-section-title">Contact</h2>
                                <div className="contact-items">
                                    {hotel.contactInfo.phoneNumber && (
                                        <div className="contact-item">
                                            <FiPhone size={16} />
                                            <span>{hotel.contactInfo.phoneNumber}</span>
                                        </div>
                                    )}
                                    {hotel.contactInfo.email && (
                                        <div className="contact-item">
                                            <FiMail size={16} />
                                            <span>{hotel.contactInfo.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Rooms with 3D Previews */}
                <section className="rooms-section" id="rooms-section">
                    <h2 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>Available Rooms</h2>
                    <div className="rooms-grid">
                        {(rooms || []).map((room, i) => (
                            <div
                                key={room.id || i}
                                className="room-card glass-card animate-fade-in-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                                id={`room-card-${room.id}`}
                            >
                                <div className="room-3d-preview">
                                    <RoomScene roomType={room.type} />
                                </div>
                                <div className="room-card-content">
                                    <div className="room-type-badge">{room.type}</div>
                                    <div className="room-details">
                                        <div className="room-capacity">
                                            <FiUsers size={14} />
                                            <span>Up to {room.capacity} guests</span>
                                        </div>
                                        <div className="room-amenities-mini">
                                            {(room.amenities || []).slice(0, 3).map((a, j) => (
                                                <span key={j} className="amenity-tag">{a}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="room-card-footer">
                                        <div className="room-price">
                                            <span className="price-amount">₹{room.basePrice?.toLocaleString()}</span>
                                            <span className="price-label">/night</span>
                                        </div>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate(`/booking/${hotel.id}/${room.id}`)}
                                            id={`book-room-${room.id}`}
                                        >
                                            Book Now <FiArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
