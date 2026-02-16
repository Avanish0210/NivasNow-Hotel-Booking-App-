package com.airBnbClone.AirBnbClone.service;

import com.airBnbClone.AirBnbClone.Dto.LoginDto;
import com.airBnbClone.AirBnbClone.Dto.LoginResponseDto;
import com.airBnbClone.AirBnbClone.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    public LoginResponseDto login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail() , loginDto.getPassword())
        );
        User user = (User) authentication.getPrincipal();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new LoginResponseDto(user.getId() , accessToken , refreshToken);
    }

    public LoginResponseDto refresh(String refreshToken) {
        Long userId = jwtService.generateUserIdFromToken(refreshToken);
        User user = userService.getUserById(userId);
        String accessToken = jwtService.generateAccessToken(user);

        return new LoginResponseDto(user.getId() , accessToken , refreshToken);
    }

}
