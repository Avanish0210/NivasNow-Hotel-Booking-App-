package com.airBnbClone.AirBnbClone.repository;

import com.airBnbClone.AirBnbClone.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

public interface RoomRepository extends JpaRepository<Room,Long> {
}
