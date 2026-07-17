package com.obhdashboard.middleware.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileRequestDto {

    @NotBlank(message = "First Name is required")
    @Size(min = 1, max = 50, message = "First Name must be between 1 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    @Size(min = 1, max = 50, message = "Last Name must be between 1 and 50 characters")
    private String lastName;

    @NotBlank(message = "Company Name is required")
    private String companyName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Login ID is required")
    @Size(min = 4, max = 30, message = "Login ID must be between 4 and 30 characters")
    private String loginId;
}
