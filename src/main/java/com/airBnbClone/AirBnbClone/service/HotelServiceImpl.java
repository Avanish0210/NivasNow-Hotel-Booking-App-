package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.Dto.HotelDto;
import com.airBnbClone.AirBnbClone.Dto.HotelInfoDto;
import com.airBnbClone.AirBnbClone.Dto.RoomDto;
import com.airBnbClone.AirBnbClone.entity.Hotel;
import com.airBnbClone.AirBnbClone.entity.Room;
import com.airBnbClone.AirBnbClone.entity.User;
import com.airBnbClone.AirBnbClone.exception.ResourceNotFoundException;
import com.airBnbClone.AirBnbClone.exception.UnAuthorizedException;
import com.airBnbClone.AirBnbClone.repository.HotelRepository;
import com.airBnbClone.AirBnbClone.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor // it creates constructor all req
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final InventoryService inventoryService;
    private final ModelMapper modelMapper;

    @Override
    public HotelDto createNewHotel(HotelDto hotelDto){
        log.info("createNewHotel");
        Hotel hotel = modelMapper.map(hotelDto, Hotel.class);
        hotel.setActive(false);
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        hotel.setOwner(user);
        hotel = hotelRepository.save(hotel);
        log.info("Hotel created successfully");
        return modelMapper.map(hotel , HotelDto.class);
    }

    @Override
    public HotelDto getHotelById(Long id) {
        log.info("Getting the hotel with ID: {}", id);
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.equals(hotel.getOwner())) {
            throw new UnAuthorizedException("This user does not own this hotel with id: "+id);
        }
        return modelMapper.map(hotel, HotelDto.class);
    }

    @Override
    public HotelDto updateHotelById(Long id, HotelDto hotelDto) {
        log.info("Updating the hotel with ID: {}", id);
        Hotel existing = hotelRepository.findById(id).orElseThrow(() ->new  ResourceNotFoundException("Not found"));
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.equals(existing.getOwner())) {
            throw new UnAuthorizedException("This user does not own this hotel with id: "+id);
        }
        modelMapper.map(hotelDto , existing);
        existing.setId(id);
        existing = hotelRepository.save(existing);
        return modelMapper.map(existing, HotelDto.class);
    }

    public void isExist(Long hotelId) {
        boolean exist = hotelRepository.existsById(hotelId);
        if(!exist){
            throw new ResourceNotFoundException("Not found");
        }
    }
    @Override
    @Transactional
    public void deleteHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.equals(hotel.getOwner())) {
            throw new UnAuthorizedException("This user does not own this hotel with id: "+id);
        }
        for(Room room : hotel.getRooms()){
            inventoryService.deleteAllInventories(room);
            roomRepository.deleteById(room.getId());
        }
        log.info("Hotel deleted successfully");
        hotelRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void activeHotel(Long hotelId) {
        log.info("Activating the hotel with ID: {}", hotelId);
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.equals(hotel.getOwner())) {
            throw new UnAuthorizedException("This user does not own this hotel with id: "+hotelId);
        }

        hotel.setActive(true);

        for(Room room : hotel.getRooms()){
            inventoryService.initializeRoomForAYear(room);
        }

    }

    @Override
    public HotelInfoDto getHotelInfoById(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new ResourceNotFoundException("Not found"));
        List<RoomDto> rooms = hotel.getRooms()
                .stream()
                .map((elements)-> modelMapper.map(elements , RoomDto.class))
                .toList();
        return new HotelInfoDto(modelMapper.map(hotel , HotelDto.class) , rooms);
    }

}
