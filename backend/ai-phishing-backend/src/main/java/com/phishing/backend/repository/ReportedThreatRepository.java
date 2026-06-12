package com.phishing.backend.repository;

import com.phishing.backend.entity.ReportedThreat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportedThreatRepository extends JpaRepository<ReportedThreat, Long> {

    List<ReportedThreat> findAllByOrderByReportedAtDesc();

    @Query("SELECT COUNT(r) > 0 FROM ReportedThreat r WHERE r.threatValue = :threatValue")
    boolean existsByThreatValue(@Param("threatValue") String threatValue);
}