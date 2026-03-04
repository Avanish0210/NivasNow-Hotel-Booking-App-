package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.entity.Booking;

public interface CheckoutService {
    String getCheckoutSession(Booking booking, String successUrl , String failureUrl);
}
