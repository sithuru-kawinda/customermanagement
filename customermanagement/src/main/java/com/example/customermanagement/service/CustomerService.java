package com.example.customermanagement.service;

import com.example.customermanagement.dto.CustomerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface CustomerService {
    CustomerDTO createCustomer(CustomerDTO customerDTO);
    CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);
    CustomerDTO getCustomerById(Long id);
    Page<CustomerDTO> getAllCustomers(Pageable pageable);
    void deleteCustomer(Long id);
    Page<CustomerDTO> searchCustomers(String keyword, Pageable pageable);
    String bulkUploadCustomers(MultipartFile file);
}