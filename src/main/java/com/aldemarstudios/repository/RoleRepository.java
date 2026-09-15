package com.aldemarstudios.repository;

import com.aldemarstudios.model.Role;
import com.aldemarstudios.model.Role.NomeRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByNome(NomeRole nome);
}