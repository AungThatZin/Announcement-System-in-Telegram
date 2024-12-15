package com.announce.AcknowledgeHub_SpringBoot.repository;

import com.announce.AcknowledgeHub_SpringBoot.entity.RequestAnnounce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RequestAnnounceRepository extends JpaRepository<RequestAnnounce, Integer> {

    @Query("SELECT ra.title, ra.content, u.name FROM RequestAnnounce ra JOIN User u ON ra.user_id = u.id")
    List<Object[]> findAnnouncementsWithUsernames();
}