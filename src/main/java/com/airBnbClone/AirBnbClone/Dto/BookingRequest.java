package com.airBnbClone.AirBnbClone.Dto;


import lombok.Data;
import java.time.LocalDate;


@Data
public class BookingRequest {
    private Long roomId;
    private Long hotelId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer roomsCount;


}
