package ru.sdmitriy612;

import jakarta.annotation.PostConstruct;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import jakarta.inject.Named;
import jakarta.enterprise.context.ApplicationScoped;

@Named
@ApplicationScoped
public class ClockBean implements Serializable {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
    private String currentTime;

    @PostConstruct
    public void init() {
        updateTime();
    }

    public void updateTime() {
        currentTime = LocalDateTime.now().format(FORMATTER);
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }
}
