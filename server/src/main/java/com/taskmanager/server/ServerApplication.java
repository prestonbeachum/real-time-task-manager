package com.taskmanager.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import java.util.Arrays;


@SpringBootApplication
@EnableScheduling
public class ServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	public CommandLineRunner debugBeans(ApplicationContext ctx) {
		return args -> {
			System.out.println("All loaded beans:");
			Arrays.stream(ctx.getBeanDefinitionNames())
					.filter(name -> name.toLowerCase().contains("reminder"))
					.forEach(System.out::println);
		};
	}

}

