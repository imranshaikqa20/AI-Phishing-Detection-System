package com.phishing.backend.repository;

import com.phishing.backend.entity.BlockedDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BlockedDomainRepository extends JpaRepository<BlockedDomain, Long> {

    @Query("SELECT COUNT(b) > 0 FROM BlockedDomain b WHERE b.domainOrIp = :domainOrIp")
    boolean existsByDomainOrIp(@Param("domainOrIp") String domainOrIp);

    @Query("SELECT b FROM BlockedDomain b WHERE b.domainOrIp = :domainOrIp")
    Optional<BlockedDomain> findByDomainOrIp(@Param("domainOrIp") String domainOrIp);
}