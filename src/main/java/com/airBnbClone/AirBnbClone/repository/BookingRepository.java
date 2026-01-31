package com.airBnbClone.AirBnbClone.repository;

import com.airBnbClone.AirBnbClone.Dto.BookingDto;
import com.airBnbClone.AirBnbClone.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
