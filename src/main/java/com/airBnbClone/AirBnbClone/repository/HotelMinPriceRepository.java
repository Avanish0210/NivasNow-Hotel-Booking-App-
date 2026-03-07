package com.airBnbClone.AirBnbClone.repository;

import com.airBnbClone.AirBnbClone.Dto.HotelPriceDto;
import com.airBnbClone.AirBnbClone.entity.Hotel;
import com.airBnbClone.AirBnbClone.entity.HotelMinPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface HotelMinPriceRepository extends JpaRepository<HotelMinPrice, Long> {

    @Query("""
             SELECT new com.airBnbClone.AirBnbClone.Dto.HotelPriceDto(i.hotel, AVG(i.price))
             FROM HotelMinPrice i
             WHERE (:city = '' OR LOWER(i.hotel.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(i.hotel.name) LIKE LOWER(CONCAT('%', :city, '%')))
                 AND i.date BETWEEN :startDate AND :endDate
                 AND i.hotel.active = true
            GROUP BY i.hotel
            """)
    Page<HotelPriceDto> findHotelsWithAvailableInventory(@Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("roomsCount") Integer roomsCount,
            @Param("dateCount") Long dateCount,
            Pageable pageable);

    Optional<HotelMinPrice> findByHotelAndDate(Hotel hotel, LocalDate date);
}
