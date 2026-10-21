package com.peakfit;

import com.peakfit.config.GymConfigProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/** Inicia la API y registra las propiedades de configuración del gimnasio. */
@SpringBootApplication
@EnableConfigurationProperties(GymConfigProperties.class)
public class PeakFitApplication {

    /** Punto de entrada que arranca el contexto de Spring Boot. */
    public static void main(String[] args) {
        SpringApplication.run(PeakFitApplication.class, args);
    }
}
