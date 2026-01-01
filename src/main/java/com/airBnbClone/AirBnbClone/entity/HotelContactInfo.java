package com.airBnbClone.AirBnbClone.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class HotelContactInfo { // this is not an entity
    private String address;
    private String phoneNumber;
    private String email;
    private String location;
}
