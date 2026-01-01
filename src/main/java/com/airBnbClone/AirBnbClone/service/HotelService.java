package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.Dto.HotelDto;

public interface HotelService {

    HotelDto createNewHotel(HotelDto hotelDto);
    HotelDto getHotelById(Long id);

    HotelDto updateHotelById(Long id , HotelDto hotelDto);

    void deleteHotelById(Long id);
    void activeHotel(Long hotelId);
}
