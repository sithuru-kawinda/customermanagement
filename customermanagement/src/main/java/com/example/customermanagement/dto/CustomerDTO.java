package com.example.customermanagement.dto;

import javax.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public class CustomerDTO {
    
    private Long id;
    
    @NotBlank(message = "Name is mandatory")
    private String name;
    
    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "NIC number is mandatory")
    private String nicNumber;
    
    private List<String> mobileNumbers;
    private List<AddressDTO> addresses;
    private List<FamilyMemberDTO> familyMembers;
    
    // Constructors
    public CustomerDTO() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getNicNumber() { return nicNumber; }
    public void setNicNumber(String nicNumber) { this.nicNumber = nicNumber; }
    
    public List<String> getMobileNumbers() { return mobileNumbers; }
    public void setMobileNumbers(List<String> mobileNumbers) { this.mobileNumbers = mobileNumbers; }
    
    public List<AddressDTO> getAddresses() { return addresses; }
    public void setAddresses(List<AddressDTO> addresses) { this.addresses = addresses; }
    
    public List<FamilyMemberDTO> getFamilyMembers() { return familyMembers; }
    public void setFamilyMembers(List<FamilyMemberDTO> familyMembers) { this.familyMembers = familyMembers; }
}