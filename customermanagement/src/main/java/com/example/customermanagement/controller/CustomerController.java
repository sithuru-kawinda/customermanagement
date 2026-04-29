package com.example.customermanagement.controller;

import com.example.customermanagement.dto.ApiResponse;
import com.example.customermanagement.dto.CustomerDTO;
import com.example.customermanagement.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        CustomerDTO created = customerService.createCustomer(customerDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Customer created successfully", created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCustomer(@PathVariable Long id, 
                                                       @Valid @RequestBody CustomerDTO customerDTO) {
        CustomerDTO updated = customerService.updateCustomer(id, customerDTO);
        return ResponseEntity.ok(new ApiResponse(true, "Customer updated successfully", updated));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCustomerById(@PathVariable Long id) {
        CustomerDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Customer retrieved successfully", customer));
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<CustomerDTO> customersPage = customerService.getAllCustomers(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", customersPage.getContent());
        response.put("totalPages", customersPage.getTotalPages());
        response.put("totalElements", customersPage.getTotalElements());
        response.put("size", customersPage.getSize());
        response.put("number", customersPage.getNumber());
        response.put("first", customersPage.isFirst());
        response.put("last", customersPage.isLast());
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(new ApiResponse(true, "Customer deleted successfully", null));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchCustomers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomerDTO> customersPage = customerService.searchCustomers(keyword, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", customersPage.getContent());
        response.put("totalPages", customersPage.getTotalPages());
        response.put("totalElements", customersPage.getTotalElements());
        response.put("size", customersPage.getSize());
        response.put("number", customersPage.getNumber());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/bulk-upload")
    public ResponseEntity<ApiResponse> bulkUploadCustomers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Please select a file to upload", null));
        }
        
        String result = customerService.bulkUploadCustomers(file);
        return ResponseEntity.ok(new ApiResponse(true, result, null));
    }
}