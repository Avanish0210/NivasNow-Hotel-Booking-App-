package com.airBnbClone.AirBnbClone.repository;

import com.airBnbClone.AirBnbClone.entity.Inventory;
import com.airBnbClone.AirBnbClone.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

import java.time.LocalDate;

public interface InventoryRepository extends JpaRepository<Inventory,Long> {

    void deleteByDateAfterAndRoom(LocalDate date, Room room);

}
