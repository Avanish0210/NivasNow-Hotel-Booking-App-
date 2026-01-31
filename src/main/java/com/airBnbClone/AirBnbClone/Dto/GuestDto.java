package com.airBnbClone.AirBnbClone.Dto;

import com.airBnbClone.AirBnbClone.entity.User;
import com.airBnbClone.AirBnbClone.entity.enums.Gender;
import lombok.Data;

@Data
public class GuestDto {
    private Long id;
    private Long userId;
    private String name;
    private Gender gender;
    private Integer age;
}
