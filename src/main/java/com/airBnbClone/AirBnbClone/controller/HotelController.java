package com.airBnbClone.AirBnbClone.controller;

import com.airBnbClone.AirBnbClone.Dto.HotelDto;
import com.airBnbClone.AirBnbClone.service.HotelService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/hotels")
@Slf4j
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    public ResponseEntity<HotelDto> createNewHotel(@RequestBody HotelDto hotelDto){
        log.info("Hotel creation Attempted");
        HotelDto hotel = hotelService.createNewHotel(hotelDto);
        return new ResponseEntity<>(hotel, HttpStatus.CREATED);
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<HotelDto> getHotelById(@PathVariable Long hotelId){
        HotelDto hotelDto = hotelService.getHotelById(hotelId);
        return ResponseEntity.ok(hotelDto);
    }

    @PutMapping
    public ResponseEntity<HotelDto> updateHotelById(@PathVariable Long hotelId , @RequestBody HotelDto hotelDto){
        HotelDto updatedHotelDto = hotelService.updateHotelById(hotelId ,  hotelDto);
        return ResponseEntity.ok(updatedHotelDto);
    }

    @DeleteMapping("/{hotelId}")
    public ResponseEntity<Void> deleteHotelById(@PathVariable Long hotelId){
        hotelService.deleteHotelById(hotelId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{hotelId}")
    public ResponseEntity<Void> activeHotel(@PathVariable Long hotelId){
        hotelService.activeHotel(hotelId);
        return ResponseEntity.noContent().build();
    }

}
