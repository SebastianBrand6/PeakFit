package com.peakfit.config;

import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** Carga y valida los límites de capacidad y niveles de ocupación del gimnasio. */
@Validated
@ConfigurationProperties(prefix = "peakfit.gym")
public class GymConfigProperties {

    /** Aforo máximo permitido; su valor predeterminado es 100 personas. */
    @Min(1)
    private int maxCapacity = 100;

    /** Porcentaje a partir del cual la ocupación se considera moderada. */
    @Min(1)
    @Max(100)
    private int moderateThresholdPercent = 50;

    /** Porcentaje a partir del cual la ocupación se considera alta. */
    @Min(1)
    @Max(100)
    private int highThresholdPercent = 80;

    /** Porcentaje a partir del cual la ocupación se considera crítica. */
    @Min(1)
    @Max(100)
    private int criticalThresholdPercent = 95;

    @PostConstruct
    public void validateThresholds() {
        if (moderateThresholdPercent >= highThresholdPercent) {
            throw new IllegalStateException("El umbral moderado debe ser menor que el alto.");
        }
        if (highThresholdPercent >= criticalThresholdPercent) {
            throw new IllegalStateException("El umbral alto debe ser menor que el crítico.");
        }
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public int getModerateThresholdPercent() {
        return moderateThresholdPercent;
    }

    public void setModerateThresholdPercent(int moderateThresholdPercent) {
        this.moderateThresholdPercent = moderateThresholdPercent;
    }

    public int getHighThresholdPercent() {
        return highThresholdPercent;
    }

    public void setHighThresholdPercent(int highThresholdPercent) {
        this.highThresholdPercent = highThresholdPercent;
    }

    public int getCriticalThresholdPercent() {
        return criticalThresholdPercent;
    }

    public void setCriticalThresholdPercent(int criticalThresholdPercent) {
        this.criticalThresholdPercent = criticalThresholdPercent;
    }
}
