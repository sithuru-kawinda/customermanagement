package com.example.customermanagement.controller;

import com.example.customermanagement.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/master-data")
@CrossOrigin(origins = "http://localhost:3000")
public class MasterDataController {
    
    @GetMapping("/cities")
    public ApiResponse getCities() {
        List<String> cities = Arrays.asList(
            "Colombo", "Kandy", "Galle", "Negombo", "Jaffna",
            "Nuwara Eliya", "Batticaloa", "Trincomalee", "Anuradhapura",
            "Polonnaruwa", "Ratnapura", "Badulla", "Kurunegala"
        );
        return new ApiResponse(true, "Cities retrieved successfully", cities);
    }
    
    @GetMapping("/countries")
    public ApiResponse getCountries() {
        List<String> countries = Arrays.asList(
            "Sri Lanka", "USA", "UK", "Canada", "Australia",
            "India", "China", "Japan", "Germany", "France"
        );
        return new ApiResponse(true, "Countries retrieved successfully", countries);
    }
}