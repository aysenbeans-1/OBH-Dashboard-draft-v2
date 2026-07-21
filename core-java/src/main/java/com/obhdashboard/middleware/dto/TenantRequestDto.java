package com.obhdashboard.middleware.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TenantRequestDto {

    @NotBlank(message = "CP Code is required")
    @Pattern(regexp = "^CP-[A-Z0-9]+-\\d+$", message = "CP Code must follow the pattern 'CP-COMPANYNAME-ID' (e.g. CP-DBS-01)")
    private String cpCode;

    @NotBlank(message = "Company Name is required")
    @Size(min = 2, max = 100, message = "Company Name must be between 2 and 100 characters")
    private String companyName;

    @NotBlank(message = "Short Code is required")
    @Pattern(regexp = "^\\d{3,6}$", message = "Short Code must be a 3 to 6 digit number")
    private String shortCode;

    @NotBlank(message = "Application ID is required")
    @Size(min = 3, max = 50, message = "Application ID must be between 3 and 50 characters")
    private String applicationId;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
    private String password;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;
}
