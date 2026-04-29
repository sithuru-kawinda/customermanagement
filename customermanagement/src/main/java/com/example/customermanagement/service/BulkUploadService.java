package com.example.customermanagement.service;

import com.example.customermanagement.model.Customer;
import com.example.customermanagement.repository.CustomerRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class BulkUploadService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Value("${bulk.upload.batch-size:500}")
    private int batchSize;
    
    @Async
    @Transactional
    public String processBulkUpload(MultipartFile file) {
        try {
            List<Customer> customers = parseExcelFile(file);
            
            AtomicInteger successCount = new AtomicInteger(0);
            AtomicInteger failureCount = new AtomicInteger(0);
            List<String> errors = new ArrayList<>();
            
            // Process in batches to optimize memory
            for (int i = 0; i < customers.size(); i += batchSize) {
                int end = Math.min(i + batchSize, customers.size());
                List<Customer> batch = customers.subList(i, end);
                
                // Filter out duplicates before saving
                List<Customer> validCustomers = new ArrayList<>();
                for (Customer customer : batch) {
                    if (!customerRepository.existsByNicNumber(customer.getNicNumber())) {
                        validCustomers.add(customer);
                    } else {
                        failureCount.incrementAndGet();
                        errors.add("Duplicate NIC: " + customer.getNicNumber());
                    }
                }
                
                if (!validCustomers.isEmpty()) {
                    customerRepository.saveAll(validCustomers);
                    successCount.addAndGet(validCustomers.size());
                }
            }
            
            return String.format("Bulk upload completed. Success: %d, Failed: %d. Errors: %s", 
                    successCount.get(), failureCount.get(), errors);
                    
        } catch (Exception e) {
            throw new RuntimeException("Failed to process bulk upload: " + e.getMessage());
        }
    }
    
    private List<Customer> parseExcelFile(MultipartFile file) throws Exception {
        List<Customer> customers = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter dataFormatter = new DataFormatter();
            
            // Skip header row
            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);
                if (row == null) continue;
                
                try {
                    Customer customer = new Customer();
                    
                    // Name (required)
                    String name = getCellValueAsString(row.getCell(0), dataFormatter);
                    if (name == null || name.trim().isEmpty()) {
                        continue; // Skip rows without name
                    }
                    customer.setName(name.trim());
                    
                    // Date of Birth (required)
                    String dobStr = getCellValueAsString(row.getCell(1), dataFormatter);
                    if (dobStr != null && !dobStr.isEmpty()) {
                        customer.setDateOfBirth(LocalDate.parse(dobStr.trim(), dateFormatter));
                    } else {
                        continue; // Skip rows without DOB
                    }
                    
                    // NIC Number (required)
                    String nic = getCellValueAsString(row.getCell(2), dataFormatter);
                    if (nic == null || nic.trim().isEmpty()) {
                        continue;
                    }
                    customer.setNicNumber(nic.trim());
                    
                    // Mobile Numbers (optional) - comma separated
                    String mobiles = getCellValueAsString(row.getCell(3), dataFormatter);
                    if (mobiles != null && !mobiles.isEmpty()) {
                        List<String> mobileList = new ArrayList<>();
                        for (String mobile : mobiles.split(",")) {
                            if (!mobile.trim().isEmpty()) {
                                mobileList.add(mobile.trim());
                            }
                        }
                        customer.setMobileNumbers(mobileList);
                    }
                    
                    customers.add(customer);
                    
                } catch (Exception e) {
                    // Log error but continue processing
                    System.err.println("Error processing row " + (rowNum + 1) + ": " + e.getMessage());
                }
            }
        }
        
        return customers;
    }
    
    private String getCellValueAsString(Cell cell, DataFormatter dataFormatter) {
        if (cell == null) return null;
        return dataFormatter.formatCellValue(cell);
    }
}