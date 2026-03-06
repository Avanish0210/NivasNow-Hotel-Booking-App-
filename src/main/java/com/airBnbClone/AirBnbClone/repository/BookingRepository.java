package com.airBnbClone.AirBnbClone.repository;

import com.airBnbClone.AirBnbClone.Dto.BookingDto;
import com.airBnbClone.AirBnbClone.entity.Booking;
import com.airBnbClone.AirBnbClone.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByPaymentSessionId(String sessionId);

    List<Booking> findByHotel(Hotel hotel);
}
