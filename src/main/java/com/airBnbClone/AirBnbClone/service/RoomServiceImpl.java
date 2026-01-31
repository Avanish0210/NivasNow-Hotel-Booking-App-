package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.Dto.RoomDto;
import com.airBnbClone.AirBnbClone.entity.Hotel;
import com.airBnbClone.AirBnbClone.entity.Room;
import com.airBnbClone.AirBnbClone.exception.ResourceNotFoundException;
import com.airBnbClone.AirBnbClone.repository.HotelRepository;
import com.airBnbClone.AirBnbClone.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;
    private final InventoryService inventoryService;
    private final HotelRepository hotelRepository;

    @Override
    public RoomDto createNewRoom(Long hotelId, RoomDto roomDto) {
        log.info("Room creation started");
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        log.info("hotel id found");
        Room room = modelMapper.map(roomDto, Room.class);
        log.info("room id found and mapped to dto");
        room.setHotel(hotel);
        log.info("Set to hotel");
        Room saveRoom = roomRepository.save(room);
        log.info("Room created");
        if (hotel.getActive()) {
            inventoryService.initializeRoomForAYear(room);
        }
        return modelMapper.map(saveRoom, RoomDto.class);
    }

    @Override
    public List<RoomDto> getAllRoomsInHotel(Long hotelId) {
        log.info("Getting all rooms in hotel with ID: {}", hotelId);
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        return hotel.getRooms()
                .stream()
                .map(element -> modelMapper.map(element, RoomDto.class))
                .collect(Collectors.toList());

    }

    @Override
    public RoomDto getRoomById(Long roomId) {
        log.info("Getting the room with ID: {}", roomId);
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        return modelMapper.map(room, RoomDto.class);
    }

    public void isExistHotel(Long hotelId) {
        boolean exist = hotelRepository.existsById(hotelId);
        if (!exist) {
            throw new ResourceNotFoundException("Not found");
        }
    }

    public void isExistRoom(Long roomId) {
        boolean exist = roomRepository.existsById(roomId);
        if (!exist) {
            throw new ResourceNotFoundException("Not found");
        }
    }

    @Transactional
    @Override
    public void deleteRoomById(Long roomId) {
        log.info("Deleting the room with ID: {}", roomId);
        Room room = roomRepository
                .findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));
        inventoryService.deleteAllInventories(room);
        roomRepository.deleteById(roomId);
        log.info("Room deleted");
    }
}
