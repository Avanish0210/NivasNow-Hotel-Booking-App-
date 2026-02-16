package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.entity.Hotel;
import com.airBnbClone.AirBnbClone.entity.Inventory;
import com.airBnbClone.AirBnbClone.repository.HotelMinPriceRepository;
import com.airBnbClone.AirBnbClone.repository.HotelRepository;
import com.airBnbClone.AirBnbClone.repository.InventoryRepository;
import com.airBnbClone.AirBnbClone.strategy.PricingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PricingUpdateService {

    private final HotelRepository hotelRepository;
    private final InventoryRepository inventoryRepository;
    private final HotelMinPriceRepository hotelMinPriceRepository;
    private final PricingService pricingService;

    // scheduler to update the inventory and HotelMinPrice tables every hour
    public void updatePrice(){
        int page = 0;
        int batchSize = 100;

        while(true){
            Page<Hotel> hotelPage = hotelRepository.findAll(PageRequest.of(page,batchSize));

            if(hotelPage.isEmpty()){
                break;
            }

            hotelPage.getContent().forEach(this::updateHotelPrice);
            page++;
        }

    }

    private void updateHotelPrice(Hotel hotel){
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusYears(1);

        List<Inventory> inventoryList = inventoryRepository.findByHotelAndDateBetween(hotel , startDate, endDate );
        updateInventoryPrice(inventoryList);
        updateHotelMinPrice(hotel , inventoryList , startDate , endDate);

    }

    private void updateHotelMinPrice(Hotel hotel, List<Inventory> inventoryList, LocalDate startDate, LocalDate endDate) {
        //compute minimum price per day for the hotel

    }

    private void updateInventoryPrice(List<Inventory> inventoryList){
        inventoryList.forEach(inventory -> {
            BigDecimal dynamicPrice = pricingService.calculateDynamicPricing(inventory);
            inventory.setPrice(dynamicPrice);
        });
        inventoryRepository.saveAll(inventoryList);

    }




}
