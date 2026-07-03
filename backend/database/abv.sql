-- ============================================================
-- NEOXWEB — FULL DATABASE (abv.sql)
-- File: backend/database/abv.sql
--
-- Import: phpMyAdmin → Import → abv.sql
--     OR: http://localhost/time/backend/install.php
--
-- Admin login:
--   Username : admin
--   Password : admin123  (bcrypt hash in database)
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexura_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE nexura_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS mail_messages;
DROP TABLE IF EXISTS microsoft_connections;
DROP TABLE IF EXISTS social_login_log;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS site_stats;
DROP TABLE IF EXISTS dashboard_stats;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NULL COMMENT 'bcrypt hash; NULL for social-only',
    avatar_url VARCHAR(500) NULL,
    google_id VARCHAR(255) NULL,
    facebook_id VARCHAR(255) NULL,
    instagram_id VARCHAR(255) NULL,
    github_id VARCHAR(255) NULL,
    linkedin_id VARCHAR(255) NULL,
    auth_provider VARCHAR(30) NOT NULL DEFAULT 'email',
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_google (google_id),
    UNIQUE KEY uq_users_facebook (facebook_id),
    UNIQUE KEY uq_users_instagram (instagram_id),
    UNIQUE KEY uq_users_github (github_id),
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active),
    INDEX idx_users_provider (auth_provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_session_token (session_token),
    INDEX idx_session_user (user_id),
    INDEX idx_session_expires (expires_at),
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_messages_read (is_read),
    INDEX idx_messages_created (created_at),
    INDEX idx_messages_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(100) NOT NULL,
    login_provider ENUM('email', 'google', 'facebook', 'instagram', 'github', 'linkedin', 'admin') NOT NULL DEFAULT 'email',
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    login_type ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    status ENUM('success', 'failed') NOT NULL DEFAULT 'success',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_user (user_id),
    INDEX idx_login_email (email),
    INDEX idx_login_created (created_at),
    CONSTRAINT fk_login_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type ENUM('signup', 'login', 'logout', 'message', 'oauth_link', 'oauth_unlink') NOT NULL,
    user_id INT NULL,
    reference_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    meta JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_user (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_activity_created (created_at),
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE social_login_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    provider ENUM('google', 'facebook', 'instagram', 'github', 'linkedin') NOT NULL,
    provider_user_id VARCHAR(255) NULL,
    email VARCHAR(100) NULL,
    action ENUM('signup', 'login', 'failed') NOT NULL DEFAULT 'login',
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    error_message VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_social_user (user_id),
    INDEX idx_social_provider (provider),
    CONSTRAINT fk_social_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(80) NOT NULL,
    stat_value VARCHAR(50) NOT NULL DEFAULT '0',
    stat_label VARCHAR(150) NOT NULL,
    page_slug VARCHAR(80) NOT NULL DEFAULT 'global',
    sort_order INT NOT NULL DEFAULT 0,
    is_computed TINYINT(1) NOT NULL DEFAULT 0,
    compute_type VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_site_stats_key (stat_key),
    INDEX idx_site_stats_page (page_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dashboard_stats (
    stat_key VARCHAR(50) NOT NULL PRIMARY KEY,
    stat_value BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(255) NULL,
    slug VARCHAR(150) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_services_slug (slug),
    INDEX idx_services_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NULL,
    setting_group VARCHAR(50) NOT NULL DEFAULT 'general',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_settings_key (setting_key),
    INDEX idx_settings_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE microsoft_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    microsoft_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NULL,
    access_token_enc TEXT NOT NULL,
    refresh_token_enc TEXT NULL,
    token_expires_at DATETIME NULL,
    scopes TEXT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_sync_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_ms_user (user_id),
    CONSTRAINT fk_ms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mail_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    connection_id INT NOT NULL,
    graph_message_id VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NULL,
    from_name VARCHAR(255) NULL,
    from_email VARCHAR(255) NULL,
    to_recipients TEXT NULL,
    body_preview TEXT NULL,
    body_html MEDIUMTEXT NULL,
    body_text MEDIUMTEXT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    has_attachments TINYINT(1) NOT NULL DEFAULT 0,
    received_at DATETIME NULL,
    synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_graph_msg (connection_id, graph_message_id),
    CONSTRAINT fk_mail_connection FOREIGN KEY (connection_id) REFERENCES microsoft_connections(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin: username admin | password admin123
-- (install.php re-hashes admin123 on every install for reliability)
INSERT INTO users (username, name, email, password, role, is_active, auth_provider, email_verified) VALUES
('admin', 'Admin', 'admin@neoxweb.com', '$2y$10$j.UiuQW5Clh66L/pEg35b.nnlEB004LvobhhzIr4ZozF.35NRBpbK', 'admin', 1, 'email', 1)
ON DUPLICATE KEY UPDATE role = 'admin', is_active = 1;

INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'NEOXWEB', 'general'),
('site_tagline', 'Web Development & Digital Marketing Pakistan', 'general'),
('contact_email', 'supportneoxweb@gmail.com', 'contact'),
('contact_phone', '+92 314 066 6734', 'contact'),
('contact_address', 'Lahore, Pakistan', 'contact'),
('contact_response_time', 'Within 1 business day', 'contact'),
('whatsapp_number', '923140666734', 'contact'),
('support_coverage', '24/7', 'general'),
('maintenance_mode', '0', 'system'),
('oauth_redirect_uri', 'http://localhost/time/project/oauth-callback.html', 'oauth');

INSERT INTO dashboard_stats (stat_key, stat_value) VALUES
('total_users', 1),
('total_messages', 0),
('total_logins', 0);

INSERT INTO services (name, description, icon, slug, is_active) VALUES
('Web Development', 'Custom websites and web applications', 'fa-code', 'web-development', 1),
('SEO', 'Search engine optimization', 'fa-search', 'seo', 1),
('Digital Marketing', 'Social media and paid advertising', 'fa-bullhorn', 'digital-marketing', 1),
('Graphic Design', 'Branding and creative design', 'fa-palette', 'graphic-design', 1),
('Video Editing', 'Professional video production', 'fa-video', 'video-editing', 1);

INSERT INTO site_stats (stat_key, stat_value, stat_label, page_slug, sort_order, is_computed, compute_type) VALUES
('home_products', '0', 'Digital products launched', 'home', 1, 1, 'services_count'),
('home_clients', '0', 'Registered clients', 'home', 2, 1, 'clients_count'),
('home_support', '24/7', 'Support', 'home', 3, 0, NULL),
('global_services', '0', 'Active services', 'global', 1, 1, 'services_count'),
('global_clients', '0', 'Registered clients', 'global', 2, 1, 'clients_count'),
('global_messages', '0', 'Client inquiries', 'global', 3, 1, 'messages_count');

SELECT 'OK — abv.sql installed. Login: admin / admin123' AS result;
