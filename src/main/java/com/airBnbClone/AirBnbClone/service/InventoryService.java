package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.entity.Room;

public interface InventoryService {
    void initializeRoomForAYear(Room room);

    void deleteFutureInventories(Room room);
}
