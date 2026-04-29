package com.example.customermanagement.service;

import com.example.customermanagement.dto.*;
import com.example.customermanagement.model.*;
import com.example.customermanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private AddressRepository addressRepository;
    
    @Autowired
    private BulkUploadService bulkUploadService;
    
    @Override
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        // Check if NIC already exists
        if (customerRepository.existsByNicNumber(customerDTO.getNicNumber())) {
            throw new RuntimeException("Customer with NIC " + customerDTO.getNicNumber() + " already exists");
        }
        
        Customer customer = convertToEntity(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return convertToDTO(savedCustomer);
    }
    
    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + id));
        
        // Update basic fields
        customer.setName(customerDTO.getName());
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setMobileNumbers(customerDTO.getMobileNumbers());
        
        // Update addresses
        customer.getAddresses().clear();
        if (customerDTO.getAddresses() != null) {
            customerDTO.getAddresses().forEach(addressDTO -> {
                Address address = new Address();
                address.setAddressLine1(addressDTO.getAddressLine1());
                address.setAddressLine2(addressDTO.getAddressLine2());
                address.setCity(addressDTO.getCity());
                address.setCountry(addressDTO.getCountry());
                address.setCustomer(customer);
                customer.getAddresses().add(address);
            });
        }
        
        // Update family members
        customer.getFamilyMembers().clear();
        if (customerDTO.getFamilyMembers() != null) {
            customerDTO.getFamilyMembers().forEach(memberDTO -> {
                FamilyMember member = new FamilyMember();
                member.setCustomerId(memberDTO.getCustomerId());
                member.setName(memberDTO.getName());
                member.setRelationship(memberDTO.getRelationship());
                member.setNicNumber(memberDTO.getNicNumber());
                member.setCustomer(customer);
                customer.getFamilyMembers().add(member);
            });
        }
        
        Customer updatedCustomer = customerRepository.save(customer);
        return convertToDTO(updatedCustomer);
    }
    
    @Override
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findByIdWithAddresses(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + id));
        return convertToDTO(customer);
    }
    
    @Override
    public Page<CustomerDTO> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(this::convertToDTO);
    }
    
    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new EntityNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
    
    @Override
    public Page<CustomerDTO> searchCustomers(String keyword, Pageable pageable) {
        return customerRepository.searchCustomers(keyword, pageable)
                .map(this::convertToDTO);
    }
    
    @Override
    public String bulkUploadCustomers(MultipartFile file) {
        return bulkUploadService.processBulkUpload(file);
    }
    
    private Customer convertToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setNicNumber(dto.getNicNumber());
        customer.setMobileNumbers(dto.getMobileNumbers() != null ? dto.getMobileNumbers() : new ArrayList<>());
        
        if (dto.getAddresses() != null) {
            dto.getAddresses().forEach(addressDTO -> {
                Address address = new Address();
                address.setAddressLine1(addressDTO.getAddressLine1());
                address.setAddressLine2(addressDTO.getAddressLine2());
                address.setCity(addressDTO.getCity());
                address.setCountry(addressDTO.getCountry());
                address.setCustomer(customer);
                customer.getAddresses().add(address);
            });
        }
        
        if (dto.getFamilyMembers() != null) {
            dto.getFamilyMembers().forEach(memberDTO -> {
                FamilyMember member = new FamilyMember();
                member.setCustomerId(memberDTO.getCustomerId());
                member.setName(memberDTO.getName());
                member.setRelationship(memberDTO.getRelationship());
                member.setNicNumber(memberDTO.getNicNumber());
                member.setCustomer(customer);
                customer.getFamilyMembers().add(member);
            });
        }
        
        return customer;
    }
    
    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setNicNumber(customer.getNicNumber());
        dto.setMobileNumbers(customer.getMobileNumbers());
        
        if (customer.getAddresses() != null) {
            List<AddressDTO> addressDTOs = customer.getAddresses().stream()
                    .map(address -> {
                        AddressDTO addressDTO = new AddressDTO();
                        addressDTO.setId(address.getId());
                        addressDTO.setAddressLine1(address.getAddressLine1());
                        addressDTO.setAddressLine2(address.getAddressLine2());
                        addressDTO.setCity(address.getCity());
                        addressDTO.setCountry(address.getCountry());
                        return addressDTO;
                    })
                    .collect(Collectors.toList());
            dto.setAddresses(addressDTOs);
        }
        
        if (customer.getFamilyMembers() != null) {
            List<FamilyMemberDTO> memberDTOs = customer.getFamilyMembers().stream()
                    .map(member -> {
                        FamilyMemberDTO memberDTO = new FamilyMemberDTO();
                        memberDTO.setId(member.getId());
                        memberDTO.setCustomerId(member.getCustomerId());
                        memberDTO.setName(member.getName());
                        memberDTO.setRelationship(member.getRelationship());
                        memberDTO.setNicNumber(member.getNicNumber());
                        return memberDTO;
                    })
                    .collect(Collectors.toList());
            dto.setFamilyMembers(memberDTOs);
        }
        
        return dto;
    }
}