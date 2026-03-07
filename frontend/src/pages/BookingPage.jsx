import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiUsers, FiCreditCard, FiCheck, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import './BookingPage.css';

export default function BookingPage() {
    const { hotelId, roomId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [step, setStep] = useState(1); // 1: dates, 2: guests, 3: payment
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [dateForm, setDateForm] = useState({
        checkInDate: '',
        checkOutDate: '',
        roomsCount: 1,
    });

    const [guests, setGuests] = useState([{ name: '', gender: 'MALE', age: 25 }]);

    const handleInitBooking = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await bookingAPI.init({
                hotelId: parseInt(hotelId),
                roomId: parseInt(roomId),
                checkInDate: dateForm.checkInDate,
                checkOutDate: dateForm.checkOutDate,
                roomsCount: dateForm.roomsCount,
            });
            setBooking(data);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddGuests = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await bookingAPI.addGuests(booking.id, guests);
            setBooking(data);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add guests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await bookingAPI.initiatePayment(booking.id);
            if (data.sessionUrl) {
                window.location.href = data.sessionUrl;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment initialization failed.');
        } finally {
            setLoading(false);
        }
    };

    const addGuest = () => {
        setGuests([...guests, { name: '', gender: 'MALE', age: 25 }]);
    };

    const removeGuest = (index) => {
        if (guests.length > 1) {
            setGuests(guests.filter((_, i) => i !== index));
        }
    };

    const updateGuest = (index, field, value) => {
        const updated = [...guests];
        updated[index] = { ...updated[index], [field]: value };
        setGuests(updated);
    };

    return (
        <div className="booking-page" id="booking-page">
            <div className="container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft size={18} />
                    <span>Back</span>
                </button>

                <h1 className="booking-title">Book Your Stay</h1>

                {/* Steps Indicator */}
                <div className="steps-indicator">
                    {[
                        { num: 1, label: 'Dates', icon: <FiCalendar /> },
                        { num: 2, label: 'Guests', icon: <FiUsers /> },
                        { num: 3, label: 'Payment', icon: <FiCreditCard /> },
                    ].map((s) => (
                        <div key={s.num} className={`step-item ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
                            <div className="step-circle">
                                {step > s.num ? <FiCheck size={16} /> : s.icon}
                            </div>
                            <span className="step-label">{s.label}</span>
                            {s.num < 3 && <div className="step-line" />}
                        </div>
                    ))}
                </div>

                {error && <div className="auth-error" style={{ maxWidth: '600px', margin: '0 auto var(--space-6)' }}>{error}</div>}

                <div className="booking-content">
                    {/* Step 1: Date Selection */}
                    {step === 1 && (
                        <form className="booking-form glass-card animate-fade-in-up" onSubmit={handleInitBooking} id="booking-dates-form">
                            <h2 className="form-section-title">Select Your Dates</h2>
                            <div className="booking-form-grid">
                                <div className="form-group">
                                    <label className="form-label">Check-in Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={dateForm.checkInDate}
                                        onChange={(e) => setDateForm({ ...dateForm, checkInDate: e.target.value })}
                                        required
                                        id="booking-checkin"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Check-out Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={dateForm.checkOutDate}
                                        onChange={(e) => setDateForm({ ...dateForm, checkOutDate: e.target.value })}
                                        required
                                        id="booking-checkout"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Number of Rooms</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        className="form-input"
                                        value={dateForm.roomsCount}
                                        onChange={(e) => setDateForm({ ...dateForm, roomsCount: parseInt(e.target.value) })}
                                        required
                                        id="booking-rooms"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="booking-dates-submit">
                                {loading ? <span className="loading-spinner" /> : 'Continue to Guests'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Guest Details */}
                    {step === 2 && (
                        <form className="booking-form glass-card animate-fade-in-up" onSubmit={handleAddGuests} id="booking-guests-form">
                            <h2 className="form-section-title">Guest Details</h2>
                            {guests.map((guest, i) => (
                                <div key={i} className="guest-row">
                                    <div className="guest-header">
                                        <span className="guest-number">Guest {i + 1}</span>
                                        {guests.length > 1 && (
                                            <button type="button" className="guest-remove" onClick={() => removeGuest(i)}>
                                                <FiTrash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="guest-fields">
                                        <div className="form-group">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Full name"
                                                value={guest.name}
                                                onChange={(e) => updateGuest(i, 'name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Gender</label>
                                            <select
                                                className="form-input"
                                                value={guest.gender}
                                                onChange={(e) => updateGuest(i, 'gender', e.target.value)}
                                            >
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Age</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="120"
                                                className="form-input"
                                                value={guest.age}
                                                onChange={(e) => updateGuest(i, 'age', parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary" onClick={addGuest} id="add-guest-btn">
                                <FiPlus size={16} />
                                Add Guest
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="booking-guests-submit">
                                {loading ? <span className="loading-spinner" /> : 'Continue to Payment'}
                            </button>
                        </form>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && booking && (
                        <div className="booking-form glass-card animate-fade-in-up" id="booking-payment">
                            <h2 className="form-section-title">Booking Summary</h2>
                            <div className="booking-summary">
                                <div className="summary-row">
                                    <span>Booking ID</span>
                                    <span>#{booking.id}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Check-in</span>
                                    <span>{booking.checkInDate}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Check-out</span>
                                    <span>{booking.checkOutDate}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Rooms</span>
                                    <span>{booking.roomsCount}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Status</span>
                                    <span className="status-badge">{booking.bookingStatus}</span>
                                </div>
                                {booking.amount && (
                                    <div className="summary-row total">
                                        <span>Total Amount</span>
                                        <span className="price-amount">₹{booking.amount?.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={handlePayment} disabled={loading} id="pay-btn">
                                {loading ? <span className="loading-spinner" /> : (
                                    <>
                                        <FiCreditCard size={18} />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
