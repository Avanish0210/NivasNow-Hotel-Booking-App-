package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.Dto.LoginDto;
import com.airBnbClone.AirBnbClone.Dto.SignUpDto;
import com.airBnbClone.AirBnbClone.Dto.UserDto;
import com.airBnbClone.AirBnbClone.entity.User;
import com.airBnbClone.AirBnbClone.entity.enums.Role;
import com.airBnbClone.AirBnbClone.exception.ResourceNotFoundException;
import com.airBnbClone.AirBnbClone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto signup(SignUpDto signUpDto) {
        User user = userRepository.findByEmail(signUpDto.getEmail()).orElse(null);
        if(user !=null){
            throw new RuntimeException("User already exists");
        }
        User toBeCreated = modelMapper.map(signUpDto , User.class);
        toBeCreated.setRoles(Set.of(Role.HOTEL_MANAGER));
        toBeCreated.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
        toBeCreated = userRepository.save(toBeCreated);

        return modelMapper.map(toBeCreated, UserDto.class);
    }

    public String[] login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail() , loginDto.getPassword())
        );
        User user = (User) authentication.getPrincipal();
        String[] arr = new String[2];
        arr[0] = jwtService.generateAccessToken(user);
        arr[1] = jwtService.generateRefreshToken(user);

        return arr;
    }

    public String refresh(String refreshToken) {
        Long userId = jwtService.generateUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User not found"));

        return jwtService.generateAccessToken(user);
    }

}
