package com.airBnbClone.AirBnbClone.controller;

import com.airBnbClone.AirBnbClone.Dto.HotelDto;
import com.airBnbClone.AirBnbClone.Dto.HotelInfoDto;
import com.airBnbClone.AirBnbClone.Dto.HotelPriceDto;
import com.airBnbClone.AirBnbClone.Dto.HotelSearchRequest;
import com.airBnbClone.AirBnbClone.service.HotelService;
import com.airBnbClone.AirBnbClone.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelBrowseController {
    private final InventoryService inventoryService;
    private final HotelService hotelService;

    @GetMapping("/search")
    public ResponseEntity<Page<HotelPriceDto>> searchHotel(@RequestBody HotelSearchRequest hotelSearchRequest){
        var page = inventoryService.searchHotels(hotelSearchRequest);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{hotelId}/info")
    public ResponseEntity<HotelInfoDto> getHotelInfo(@PathVariable Long hotelId){
        return ResponseEntity.ok(hotelService.getHotelInfoById(hotelId));
    }

}
