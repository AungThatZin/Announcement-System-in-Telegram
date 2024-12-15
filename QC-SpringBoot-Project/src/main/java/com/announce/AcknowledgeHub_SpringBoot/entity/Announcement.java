package com.announce.AcknowledgeHub_SpringBoot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "announcement")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Prevent Hibernate lazy-loading issues
public class Announcement {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     @Column(name = "id")
     private int id;

     @Column(name = "title")
     private String title;

     @Column(name = "content")
     private String content;

     @Column(name = "created_at", updatable = false, nullable = false)
     private LocalDateTime createdAt;

     @Lob
     @Column(name = "document")
     private byte[] document;

     @Column(name = "document_name")
     private String documentName;

     @Column(name = "sent")
     private int sent;

     @Column(name = "scheduled_date")
     private LocalDateTime scheduledDate;

     @Column(name = "cloudUrl")
     private String cloudUrl;

     @Column(name = "fileExtension")
     private String fileExtension;

     @Column(name = "public_id")
     private String publicId;

     @Column(name = "resource_type")
     private String resourceType;

     @ManyToMany(fetch = FetchType.EAGER)
     @JoinTable(
             name = "announcement_group",
             joinColumns = @JoinColumn(name = "announcement_id"),
             inverseJoinColumns = @JoinColumn(name = "group_id")
     )
     private List<Group> groups = new ArrayList<>();

     @OneToMany(fetch = FetchType.EAGER, mappedBy = "announcement", cascade = CascadeType.ALL, orphanRemoval = true)
     @JsonIgnore // Prevent circular reference during serialization
     private List<AnnouncementReadStatus> staffMembers = new ArrayList<>();

     @ManyToOne(fetch = FetchType.EAGER) // Ensure eager fetching
     @JoinColumn(name = "user_id")
     private User user; // Removed @JsonIgnore to include user info

     @Transient
     private double readProgress;

     @PrePersist
     protected void onCreate() {
          this.createdAt = LocalDateTime.now();
     }
}
