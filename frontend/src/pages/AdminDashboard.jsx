import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hotelAdminAPI, roomAdminAPI } from '../services/api';
import { FiPlus, FiTrash2, FiEdit, FiEye, FiCheck, FiX, FiHome, FiGrid, FiList } from 'react-icons/fi';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hotels');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [showRoomModal, setShowRoomModal] = useState(false);

    const [hotelForm, setHotelForm] = useState({
        name: '', city: '', amenities: '', contactInfo: { address: '', phoneNumber: '', email: '', location: '' }
    });

    const [roomForm, setRoomForm] = useState({
        type: '', basePrice: 0, amenities: '', totalCount: 1, capacity: 2
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchHotels();
    }, [isAuthenticated]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const { data } = await hotelAdminAPI.getAll();
            setHotels(data || []);
        } catch (err) {
            // Sample data for demo
            setHotels([
                { id: 1, name: 'The Grand Palace', city: 'Mumbai', active: true, amenities: ['WiFi', 'Pool'] },
                { id: 2, name: 'Ocean View Resort', city: 'Goa', active: false, amenities: ['Beach', 'Bar'] },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async (hotelId) => {
        try {
            const { data } = await roomAdminAPI.getAll(hotelId);
            setRooms(data || []);
        } catch {
            setRooms([
                { id: 1, type: 'Standard', basePrice: 3500, totalCount: 20, capacity: 2 },
                { id: 2, type: 'Deluxe', basePrice: 5500, totalCount: 10, capacity: 2 },
            ]);
        }
    };

    const handleCreateHotel = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...hotelForm,
                amenities: hotelForm.amenities.split(',').map(a => a.trim()).filter(Boolean),
            };
            await hotelAdminAPI.create(payload);
            setShowCreateModal(false);
            setHotelForm({ name: '', city: '', amenities: '', contactInfo: { address: '', phoneNumber: '', email: '', location: '' } });
            fetchHotels();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create hotel');
        }
    };

    const handleDeleteHotel = async (hotelId) => {
        if (!confirm('Are you sure you want to delete this hotel?')) return;
        try {
            await hotelAdminAPI.delete(hotelId);
            fetchHotels();
        } catch (err) {
            alert('Failed to delete hotel');
        }
    };

    const handleActivateHotel = async (hotelId) => {
        try {
            await hotelAdminAPI.activate(hotelId);
            fetchHotels();
        } catch (err) {
            alert('Failed to activate hotel');
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...roomForm,
                amenities: roomForm.amenities.split(',').map(a => a.trim()).filter(Boolean),
            };
            await roomAdminAPI.create(selectedHotel.id, payload);
            setShowRoomModal(false);
            setRoomForm({ type: '', basePrice: 0, amenities: '', totalCount: 1, capacity: 2 });
            fetchRooms(selectedHotel.id);
        } catch (err) {
            alert('Failed to create room');
        }
    };

    const handleViewRooms = (hotel) => {
        setSelectedHotel(hotel);
        fetchRooms(hotel.id);
        setActiveTab('rooms');
    };

    return (
        <div className="admin-page" id="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1 className="admin-title">Hotel Manager Dashboard</h1>
                    <p className="admin-subtitle">Manage your hotels, rooms, and bookings</p>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'hotels' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hotels')}
                        id="tab-hotels"
                    >
                        <FiHome size={16} />
                        Hotels
                    </button>
                    {selectedHotel && (
                        <button
                            className={`admin-tab ${activeTab === 'rooms' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rooms')}
                            id="tab-rooms"
                        >
                            <FiGrid size={16} />
                            Rooms - {selectedHotel.name}
                        </button>
                    )}
                </div>

                {/* Hotels Tab */}
                {activeTab === 'hotels' && (
                    <div className="admin-content animate-fade-in">
                        <div className="admin-toolbar">
                            <span className="admin-count">{hotels.length} hotels</span>
                            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} id="create-hotel-btn">
                                <FiPlus size={16} />
                                Add Hotel
                            </button>
                        </div>

                        <div className="admin-table-wrap glass-card">
                            <table className="admin-table" id="hotels-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>City</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotels.map((hotel) => (
                                        <tr key={hotel.id}>
                                            <td className="td-id">#{hotel.id}</td>
                                            <td className="td-name">{hotel.name}</td>
                                            <td>{hotel.city}</td>
                                            <td>
                                                <span className={`status-pill ${hotel.active ? 'active' : 'inactive'}`}>
                                                    {hotel.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="action-btn view" onClick={() => handleViewRooms(hotel)} title="View Rooms">
                                                        <FiEye size={14} />
                                                    </button>
                                                    {!hotel.active && (
                                                        <button className="action-btn activate" onClick={() => handleActivateHotel(hotel.id)} title="Activate">
                                                            <FiCheck size={14} />
                                                        </button>
                                                    )}
                                                    <button className="action-btn delete" onClick={() => handleDeleteHotel(hotel.id)} title="Delete">
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Rooms Tab */}
                {activeTab === 'rooms' && selectedHotel && (
                    <div className="admin-content animate-fade-in">
                        <div className="admin-toolbar">
                            <span className="admin-count">{rooms.length} rooms in {selectedHotel.name}</span>
                            <button className="btn btn-primary" onClick={() => setShowRoomModal(true)} id="create-room-btn">
                                <FiPlus size={16} />
                                Add Room
                            </button>
                        </div>

                        <div className="rooms-admin-grid">
                            {rooms.map((room) => (
                                <div key={room.id} className="room-admin-card glass-card" id={`admin-room-${room.id}`}>
                                    <div className="room-admin-header">
                                        <span className="room-type-badge">{room.type}</span>
                                        <span className="room-admin-price">₹{room.basePrice?.toLocaleString()}/night</span>
                                    </div>
                                    <div className="room-admin-details">
                                        <div className="room-admin-stat">
                                            <span className="stat-label">Total Rooms</span>
                                            <span className="stat-value">{room.totalCount}</span>
                                        </div>
                                        <div className="room-admin-stat">
                                            <span className="stat-label">Capacity</span>
                                            <span className="stat-value">{room.capacity} guests</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Hotel Modal */}
                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal glass-card animate-fade-in-up" onClick={(e) => e.stopPropagation()} id="create-hotel-modal">
                            <div className="modal-header">
                                <h2>Create New Hotel</h2>
                                <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                                    <FiX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateHotel} className="modal-form">
                                <div className="form-group">
                                    <label className="form-label">Hotel Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={hotelForm.name}
                                        onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={hotelForm.city}
                                        onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Amenities (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="WiFi, Pool, Spa"
                                        value={hotelForm.amenities}
                                        onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={hotelForm.contactInfo.address}
                                        onChange={(e) => setHotelForm({ ...hotelForm, contactInfo: { ...hotelForm.contactInfo, address: e.target.value } })}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={hotelForm.contactInfo.phoneNumber}
                                            onChange={(e) => setHotelForm({ ...hotelForm, contactInfo: { ...hotelForm.contactInfo, phoneNumber: e.target.value } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={hotelForm.contactInfo.email}
                                            onChange={(e) => setHotelForm({ ...hotelForm, contactInfo: { ...hotelForm.contactInfo, email: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                    Create Hotel
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Create Room Modal */}
                {showRoomModal && (
                    <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
                        <div className="modal glass-card animate-fade-in-up" onClick={(e) => e.stopPropagation()} id="create-room-modal">
                            <div className="modal-header">
                                <h2>Add Room to {selectedHotel?.name}</h2>
                                <button className="modal-close" onClick={() => setShowRoomModal(false)}>
                                    <FiX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateRoom} className="modal-form">
                                <div className="form-group">
                                    <label className="form-label">Room Type</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., Standard, Deluxe, Suite"
                                        value={roomForm.type}
                                        onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Base Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={roomForm.basePrice}
                                            onChange={(e) => setRoomForm({ ...roomForm, basePrice: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Total Count</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-input"
                                            value={roomForm.totalCount}
                                            onChange={(e) => setRoomForm({ ...roomForm, totalCount: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Capacity (guests)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-input"
                                        value={roomForm.capacity}
                                        onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Amenities (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="WiFi, AC, TV, Mini Bar"
                                        value={roomForm.amenities}
                                        onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                    Add Room
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
