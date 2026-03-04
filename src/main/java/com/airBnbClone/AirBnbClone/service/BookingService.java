package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.Dto.BookingDto;
import com.airBnbClone.AirBnbClone.Dto.BookingRequest;
import com.airBnbClone.AirBnbClone.Dto.GuestDto;
import com.stripe.model.Event;

import java.util.List;

public interface BookingService {

    BookingDto initialiseBooking(BookingRequest bookingRequest);

    BookingDto addGuests(Long bookingId, List<GuestDto> guestDtoList);

    String initiatePayments(Long bookingId);

    void capturePayment(Event event);

    void cancelBooking(Long bookingId);
}
