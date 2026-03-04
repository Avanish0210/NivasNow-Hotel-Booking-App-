package com.airBnbClone.AirBnbClone.controller;

import com.airBnbClone.AirBnbClone.Dto.LoginDto;
import com.airBnbClone.AirBnbClone.Dto.LoginResponseDto;
import com.airBnbClone.AirBnbClone.Dto.SignUpDto;
import com.airBnbClone.AirBnbClone.Dto.UserDto;
import com.airBnbClone.AirBnbClone.service.AuthService;
import com.airBnbClone.AirBnbClone.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signup(@RequestBody SignUpDto signUpDto) {
        return new ResponseEntity<>(authService.signup(signUpDto) , HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginDto loginDto , HttpServletRequest request , HttpServletResponse response) {
        String[] tokens = authService.login(loginDto);

        Cookie cookie = new Cookie("refreshToken", tokens[1]);
        cookie.setHttpOnly(true);

        response.addCookie(cookie);
        return ResponseEntity.ok(new LoginResponseDto(tokens[0]));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refresh(HttpServletRequest request) {
        String refreshToken = Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() -> new AuthenticationServiceException("Invalid refreshToken"));
        String accessToken = authService.refresh(refreshToken);

        return ResponseEntity.ok(new LoginResponseDto(accessToken));

    }
}
