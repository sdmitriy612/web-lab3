package ru.sdmitriy612.database;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "results")
public class Point {
    @Id
    @GeneratedValue
    int id;
    @Column(nullable = false)
    float x;
    @Column(nullable = false)
    float y;
    @Column(nullable = false)
    float r;
    @Column(nullable = false)
    boolean hit;
    @Column(nullable = false)
    private LocalDateTime localDateTime;

    public Point(float x, float y, float r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.localDateTime = LocalDateTime.now();
    }

    public Point() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public float getR() {
        return r;
    }

    public void setR(float r) {
        this.r = r;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public String getFormattedTime() {
        return localDateTime.format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
    }
}
