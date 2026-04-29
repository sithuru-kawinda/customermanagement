package com.example.customermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class CustomermanagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomermanagementApplication.class, args);
		System.out.println("Customer Management System Started Successfully!");
	}

}
