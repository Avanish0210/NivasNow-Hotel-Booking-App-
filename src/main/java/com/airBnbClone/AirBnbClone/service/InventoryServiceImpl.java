package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.Dto.HotelDto;
import com.airBnbClone.AirBnbClone.Dto.HotelPriceDto;
import com.airBnbClone.AirBnbClone.Dto.HotelSearchRequest;
import com.airBnbClone.AirBnbClone.entity.Hotel;
import com.airBnbClone.AirBnbClone.entity.Inventory;
import com.airBnbClone.AirBnbClone.entity.Room;
import com.airBnbClone.AirBnbClone.repository.HotelMinPriceRepository;
import com.airBnbClone.AirBnbClone.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {
    private final ModelMapper modelMapper;
    private final InventoryRepository inventoryRepository;
    private final HotelMinPriceRepository hotelMinPriceRepository;

    @Override
    public void initializeRoomForAYear(Room room) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusYears(1);
        for (; !today.isAfter(endDate); today = today.plusDays(1)) {
            Inventory inventory = Inventory.builder()
                    .hotel(room.getHotel())
                    .room(room)
                    .bookedCount(0)
                    .city(room.getHotel().getCity())
                    .date(today)
                    .price(room.getBasePrice())
                    .surgeFactor(BigDecimal.ONE)
                    .totalCount(room.getTotalCount())
                    .reservedCount(0)
                    .closed(false)
                    .build();
            inventoryRepository.save(inventory);

        }

    }

    @Override
    public void deleteAllInventories(Room room) {
        inventoryRepository.deleteByRoom(room);
    }

    @Override
    public Page<HotelPriceDto> searchHotels(HotelSearchRequest hotelSearchRequest) {
        log.info("searchHotels");
        Pageable pageable = PageRequest.of(hotelSearchRequest.getPage(), hotelSearchRequest.getSize());

        LocalDate startDate = hotelSearchRequest.getStartDate() != null ? hotelSearchRequest.getStartDate()
                : LocalDate.now();
        LocalDate endDate = hotelSearchRequest.getEndDate() != null ? hotelSearchRequest.getEndDate()
                : startDate.plusDays(1);
        if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
            endDate = startDate.plusDays(1);
        }
        long dateCount = ChronoUnit.DAYS.between(startDate, endDate);

        String city = hotelSearchRequest.getCity() != null ? hotelSearchRequest.getCity().trim() : "";
        Integer roomsCount = hotelSearchRequest.getRoomsCount() != null ? hotelSearchRequest.getRoomsCount() : 1;

        Page<HotelPriceDto> hotelPage = hotelMinPriceRepository.findHotelsWithAvailableInventory(city,
                startDate, endDate, roomsCount,
                dateCount, pageable);
        log.info("Hotels found on availability");

        return hotelPage;
    }
}
