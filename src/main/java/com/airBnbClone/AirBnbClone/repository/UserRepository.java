package com.airBnbClone.AirBnbClone.repository;

import com.airBnbClone.AirBnbClone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
