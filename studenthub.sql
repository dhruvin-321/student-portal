-- ============================================================================
-- StudentHub - University Campus & Academic Management System
-- Database Schema & Realistic Seed Data Dump
-- Engine: MySQL 8.0 / MariaDB 10.4+ (Compatible with XAMPP phpMyAdmin)
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Generated for: StudentHub Portal v2.5
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

CREATE DATABASE IF NOT EXISTS `studenthub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `studenthub`;

-- ----------------------------------------------------------------------------
-- Table: roles
-- Defines user authorization levels (Admin, Faculty, Student)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(32) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES
(1, 'Admin', 'Super administrator with full privileges to manage records, users, and audit logs'),
(2, 'Faculty', 'Department professors and instructors managing courses, grades, and attendance'),
(3, 'Student', 'Enrolled university student accessing events, course catalogs, and inquiries');

-- ----------------------------------------------------------------------------
-- Table: users
-- Core authentication table with password hashing (bcrypt), roles & status
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` INT UNSIGNED NOT NULL,
  `username` VARCHAR(64) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(128) NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active',
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Passwords:
-- admin@campus.edu / Admin@123 (bcrypt: $2y$10$fWJ0hZp9.N0K.W4tHq7vEuXq5Rz0Vd2oZ9A.qW.jM4Z1K3L2N6W8C)
-- professor@campus.edu / Prof@123 (bcrypt: $2y$10$wT8hJn7m6.V5z2e.Yq4qEuX1rVz3Td8oA9B.pW.kM5Y2L4M3O7X9D)
-- aarav.sharma@campus.edu / Student@123 (bcrypt: $2y$10$8L0vB4tHq7vEuXq5Rz0Vd2oZ9A.qW.jM4Z1K3L2N6W8CfWJ0hZp9.N)
INSERT INTO `users` (`id`, `role_id`, `username`, `email`, `password_hash`, `full_name`, `avatar_url`, `status`, `last_login`) VALUES
(1, 1, 'admin', 'admin@campus.edu', '$2y$10$fWJ0hZp9.N0K.W4tHq7vEuXq5Rz0Vd2oZ9A.qW.jM4Z1K3L2N6W8C', 'System Administrator', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', 'Active', '2026-10-28 09:30:00'),
(2, 2, 'dr_kulkarni', 'rajesh.kulkarni@campus.edu', '$2y$10$wT8hJn7m6.V5z2e.Yq4qEuX1rVz3Td8oA9B.pW.kM5Y2L4M3O7X9D', 'Dr. Rajesh Kulkarni', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', 'Active', '2026-10-27 14:15:00'),
(3, 3, 'aarav_sharma', 'aarav.sharma@campus.edu', '$2y$10$8L0vB4tHq7vEuXq5Rz0Vd2oZ9A.qW.jM4Z1K3L2N6W8CfWJ0hZp9.N', 'Aarav Sharma', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120', 'Active', '2026-10-29 10:45:00'),
(4, 3, 'diya_patel', 'diya.patel@campus.edu', '$2y$10$8L0vB4tHq7vEuXq5Rz0Vd2oZ9A.qW.jM4Z1K3L2N6W8CfWJ0hZp9.N', 'Diya Patel', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120', 'Active', '2026-10-26 16:20:00');

-- ----------------------------------------------------------------------------
-- Table: departments
-- Academic departments offering degree programs
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(16) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `head_of_dept` VARCHAR(128) NOT NULL,
  `building` VARCHAR(64) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_departments_code` (`code`),
  UNIQUE KEY `uk_departments_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `departments` (`id`, `code`, `name`, `head_of_dept`, `building`) VALUES
(1, 'CSE', 'Computer Science', 'Dr. Rajesh Kulkarni', 'Alan Turing Block'),
(2, 'IT', 'Information Technology', 'Dr. Meena Iyer', 'Ada Lovelace Hall'),
(3, 'ECE', 'Electronics', 'Dr. Vikram Sen', 'Tesla Research Wing'),
(4, 'ME', 'Mechanical', 'Dr. Anil Deshmukh', 'Newton Engineering Complex'),
(5, 'CE', 'Civil', 'Dr. Sunita Reddy', 'Visvesvaraya Hall');

-- ----------------------------------------------------------------------------
-- Table: students
-- Primary student directory with GPA, academic status, and contacts
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `roll_no` VARCHAR(32) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `phone` VARCHAR(16) NOT NULL,
  `department_id` INT UNSIGNED NOT NULL,
  `semester` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `gpa` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Active', 'Graduated', 'Probation', 'Suspended') NOT NULL DEFAULT 'Active',
  `enrolled_date` DATE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_students_roll_no` (`roll_no`),
  UNIQUE KEY `uk_students_email` (`email`),
  KEY `idx_students_department` (`department_id`),
  KEY `idx_students_status` (`status`),
  CONSTRAINT `fk_students_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `students` (`id`, `user_id`, `roll_no`, `name`, `email`, `phone`, `department_id`, `semester`, `gpa`, `status`, `enrolled_date`) VALUES
(101, 3, 'CS-2023-01', 'Aarav Sharma', 'aarav.sharma@campus.edu', '9876501234', 1, 6, 3.92, 'Active', '2023-08-01'),
(102, 4, 'IT-2023-14', 'Diya Patel', 'diya.patel@campus.edu', '9876502345', 2, 6, 3.85, 'Active', '2023-08-01'),
(103, NULL, 'EC-2022-09', 'Rohan Mehta', 'rohan.mehta@campus.edu', '9876503456', 3, 8, 3.68, 'Graduated', '2022-08-01'),
(104, NULL, 'CS-2024-22', 'Ananya Verma', 'ananya.verma@campus.edu', '9876504567', 1, 4, 3.95, 'Active', '2024-08-01'),
(105, NULL, 'ME-2023-40', 'Siddharth Joshi', 'siddharth.joshi@campus.edu', '9876505678', 4, 6, 3.42, 'Active', '2023-08-01'),
(106, NULL, 'CE-2022-05', 'Ishita Rao', 'ishita.rao@campus.edu', '9876506789', 5, 8, 3.75, 'Graduated', '2022-08-01'),
(107, NULL, 'IT-2024-03', 'Kabir Das', 'kabir.das@campus.edu', '9876507890', 2, 4, 2.85, 'Probation', '2024-08-01'),
(108, NULL, 'CS-2023-19', 'Neha Kulkarni', 'neha.kulkarni@campus.edu', '9876508901', 1, 6, 3.88, 'Active', '2023-08-01'),
(109, NULL, 'EC-2023-31', 'Aditya Nair', 'aditya.nair@campus.edu', '9876509012', 3, 6, 3.55, 'Active', '2023-08-01'),
(110, NULL, 'ME-2024-11', 'Tanvi Singhania', 'tanvi.singhania@campus.edu', '9876510123', 4, 4, 3.64, 'Active', '2024-08-01'),
(111, NULL, 'CE-2023-18', 'Karan Malhotra', 'karan.malhotra@campus.edu', '9876511234', 5, 6, 3.30, 'Active', '2023-08-01'),
(112, NULL, 'CS-2022-44', 'Pooja Hegde', 'pooja.hegde@campus.edu', '9876512345', 1, 8, 3.98, 'Graduated', '2022-08-01'),
(113, NULL, 'IT-2023-28', 'Varun Kapoor', 'varun.kapoor@campus.edu', '9876513456', 2, 6, 3.10, 'Active', '2023-08-01'),
(114, NULL, 'EC-2024-07', 'Rhea Chawla', 'rhea.chawla@campus.edu', '9876514567', 3, 4, 3.72, 'Active', '2024-08-01'),
(115, NULL, 'CS-2024-55', 'Manish Bansal', 'manish.bansal@campus.edu', '9876515678', 1, 4, 2.92, 'Probation', '2024-08-01');

-- ----------------------------------------------------------------------------
-- Table: courses
-- Academic courses catalog
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(16) NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `department_id` INT UNSIGNED NOT NULL,
  `credits` TINYINT UNSIGNED NOT NULL DEFAULT 3,
  `semester` TINYINT UNSIGNED NOT NULL,
  `instructor` VARCHAR(128) NOT NULL,
  `capacity` SMALLINT UNSIGNED NOT NULL DEFAULT 60,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_courses_code` (`code`),
  KEY `idx_courses_department` (`department_id`),
  CONSTRAINT `fk_courses_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `courses` (`id`, `code`, `title`, `department_id`, `credits`, `semester`, `instructor`, `capacity`, `description`) VALUES
(1, 'CS301', 'Design & Analysis of Algorithms', 1, 4, 5, 'Dr. Rajesh Kulkarni', 60, 'Asymptotic notations, divide-and-conquer, dynamic programming, greedy algorithms, NP-completeness.'),
(2, 'CS304', 'Database Management Systems', 1, 4, 5, 'Prof. Arvind Swamy', 60, 'Relational models, SQL, normalization, concurrency control, transaction ACID properties, indexing.'),
(3, 'IT302', 'Cloud Computing Architecture', 2, 3, 6, 'Dr. Meena Iyer', 50, 'Virtualization, microservices, Docker containers, Kubernetes orchestration, AWS/Azure serverless.'),
(4, 'IT305', 'Web Application Frameworks', 2, 4, 5, 'Prof. Shalini Roy', 55, 'Modern full-stack web engineering with REST APIs, responsive CSS3, modular JavaScript, PHP & SQL.'),
(5, 'EC303', 'Digital Signal Processing', 3, 4, 6, 'Dr. Vikram Sen', 45, 'Discrete-time signals, Z-transform, FFT algorithms, digital filter design, MATLAB simulations.'),
(6, 'ME302', 'Thermodynamics & Heat Transfer', 4, 4, 5, 'Dr. Anil Deshmukh', 50, 'Laws of thermodynamics, refrigeration cycles, conduction, convection, and radiation analysis.'),
(7, 'CE301', 'Structural Mechanics', 5, 4, 5, 'Dr. Sunita Reddy', 45, 'Shear force, bending moment, stress analysis in trusses, deflection theorems, Euler buckling.');

-- ----------------------------------------------------------------------------
-- Table: events
-- Campus technical, academic, and cultural events
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `category` ENUM('Workshop', 'Hackathon', 'Conference', 'Seminar', 'Cultural') NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL DEFAULT '10:00:00',
  `location` VARCHAR(128) NOT NULL,
  `attendees` INT UNSIGNED NOT NULL DEFAULT 0,
  `capacity` INT UNSIGNED NOT NULL DEFAULT 200,
  `status` ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
  `organizer` VARCHAR(128) NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_events_category` (`category`),
  KEY `idx_events_status` (`status`),
  KEY `idx_events_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` (`id`, `title`, `category`, `date`, `time`, `location`, `attendees`, `capacity`, `status`, `organizer`, `description`) VALUES
(1, 'AI & Machine Learning Bootcamp', 'Workshop', '2026-11-05', '09:30:00', 'Auditorium A', 180, 250, 'Upcoming', 'AI Research Lab', 'Hands-on workshop exploring deep learning architectures, PyTorch models, and real-world AI deployment.'),
(2, 'National Hackathon: CodeSprint 2026', 'Hackathon', '2026-11-12', '10:00:00', 'Innovation Lab', 350, 400, 'Upcoming', 'Coding Club', '36-hour non-stop hackathon building scalable fintech, edtech, and sustainability solutions with cash prizes.'),
(3, 'Cybersecurity & Ethical Hacking Summit', 'Conference', '2026-10-20', '11:00:00', 'Seminar Hall 2', 210, 250, 'Ongoing', 'Infosec Student Chapter', 'Keynotes from industry infosec leaders covering zero-trust security and threat mitigation.'),
(4, 'Cloud Computing with AWS & Azure', 'Workshop', '2026-09-15', '14:00:00', 'Computer Lab 4', 95, 100, 'Completed', 'Cloud Computing Club', 'Comprehensive guide to microservices, serverless computing, and Kubernetes deployment on cloud platforms.'),
(5, 'Annual Tech Fiesta: Spectrum 2026', 'Cultural', '2026-12-01', '17:00:00', 'University Grounds', 1200, 1500, 'Upcoming', 'Student Council', 'Flagship cultural and tech fest with robotics competitions, coding battles, and live musical performances.'),
(6, 'Web3 & Blockchain Decentralized Future', 'Seminar', '2026-10-18', '15:30:00', 'Hall C', 140, 180, 'Ongoing', 'FinTech Society', 'Demystifying smart contracts, Ethereum tooling, and decentralized finance architectures.'),
(7, 'Robotics & Embedded IoT Expo', 'Workshop', '2026-11-20', '10:30:00', 'Robotics Wing', 160, 200, 'Upcoming', 'Robotics Club', 'Live demos of autonomous drones, ROS2 robotics frameworks, and ESP32 industrial sensor nodes.'),
(8, 'Global Research Symposium on Green Energy', 'Conference', '2026-08-25', '09:00:00', 'Main Auditorium', 275, 300, 'Completed', 'Dept. of Electrical & Civil', 'International conference showcasing breakthroughs in solar photovoltaics and battery storage systems.');

-- ----------------------------------------------------------------------------
-- Table: event_registrations
-- Student RSVPs and confirmed event tickets
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `event_registrations`;
CREATE TABLE `event_registrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` INT UNSIGNED NOT NULL,
  `student_name` VARCHAR(128) NOT NULL,
  `student_email` VARCHAR(128) NOT NULL,
  `roll_no` VARCHAR(32) NOT NULL,
  `ticket_code` VARCHAR(32) NOT NULL,
  `registration_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Confirmed', 'Attended', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reg_ticket` (`ticket_code`),
  UNIQUE KEY `uk_event_student` (`event_id`, `student_email`),
  KEY `idx_reg_event` (`event_id`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_registrations` (`id`, `event_id`, `student_name`, `student_email`, `roll_no`, `ticket_code`, `status`) VALUES
(1, 1, 'Aarav Sharma', 'aarav.sharma@campus.edu', 'CS-2023-01', 'TCK-AI26-8941', 'Confirmed'),
(2, 2, 'Diya Patel', 'diya.patel@campus.edu', 'IT-2023-14', 'TCK-CS26-3209', 'Confirmed'),
(3, 2, 'Ananya Verma', 'ananya.verma@campus.edu', 'CS-2024-22', 'TCK-CS26-4412', 'Confirmed'),
(4, 3, 'Rohan Mehta', 'rohan.mehta@campus.edu', 'EC-2022-09', 'TCK-CY26-1180', 'Attended');

-- ----------------------------------------------------------------------------
-- Table: faqs
-- Knowledge base questions, answers, view metrics, and helpful votes
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` ENUM('Admissions', 'Academics', 'Campus Life', 'Placements', 'Examinations') NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `helpful_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `date_updated` DATE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_faqs_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `views`, `helpful_count`, `date_updated`) VALUES
(201, 'Campus Life', 'How do I register for campus hackathons and workshops?', 'You can register directly from the Events portal by clicking on the event card and submitting your student roll number and team details before the registration deadline.', 1420, 380, '2026-10-01'),
(202, 'Academics', 'What is the minimum attendance requirement to appear for semester end exams?', 'Students must maintain a minimum of 75% overall attendance in each registered course to be eligible for final semester examinations as mandated by university regulations.', 2890, 740, '2026-09-15'),
(203, 'Admissions', 'What documents are required during undergraduate admission verification?', 'You need your original 10th and 12th marksheets, transfer certificate, migration certificate, government ID proof (Aadhaar/Passport), and 4 passport-size photographs.', 3100, 920, '2026-08-10'),
(204, 'Placements', 'How does the on-campus placement eligibility criteria work?', 'Generally, students must maintain a CGPA of 7.0 or higher with zero active backlogs to participate in Tier-1 and Tier-2 placement recruitment drives.', 4120, 1150, '2026-10-05'),
(205, 'Examinations', 'How can I apply for re-evaluation or scrutiny of my exam answer script?', 'Submit the re-evaluation application form through the student examination portal within 10 days of results declaration along with the prescribed scrutiny fee per subject.', 1890, 460, '2026-09-28'),
(206, 'Admissions', 'Are merit-based scholarships available for continuing engineering students?', 'Yes, merit scholarships covering up to 50% of tuition fees are awarded to the top 3 rank holders in each engineering department at the end of each academic year.', 2210, 630, '2026-07-22'),
(207, 'Academics', 'How can I issue books and access IEEE journals from the Central Library?', 'Present your student smart card at the circulation desk to borrow up to 4 books. Digital IEEE and ACM portals can be accessed via campus Wi-Fi or student VPN.', 1640, 510, '2026-09-02'),
(208, 'Placements', 'Does the college provide internship support for pre-final year students?', 'Yes, the Corporate Relations Cell organizes summer internship placement drives for 6th-semester students starting from December every year.', 2980, 890, '2026-10-12');

-- ----------------------------------------------------------------------------
-- Table: inquiries
-- Integrated from Practical 7 student registration and inquiry submissions
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `inquiries`;
CREATE TABLE `inquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `phone` VARCHAR(16) NOT NULL,
  `course` VARCHAR(64) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT '127.0.0.1',
  `status` ENUM('New', 'In Review', 'Resolved') NOT NULL DEFAULT 'New',
  `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inquiries_email` (`email`),
  KEY `idx_inquiries_course` (`course`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `inquiries` (`id`, `name`, `email`, `phone`, `course`, `message`, `status`, `submitted_at`) VALUES
(1, 'Rahul Patel', 'rahul.patel@gmail.com', '9876543210', 'Computer Science', 'Interested in joining the competitive programming club and advanced algorithm lab.', 'Resolved', '2026-10-17 10:00:00'),
(2, 'Sneha Sharma', 'sneha.sharma@gmail.com', '9823456789', 'Information Technology', 'Looking for practical project guidance regarding cloud computing certification.', 'In Review', '2026-10-17 11:15:30'),
(3, 'Vikram Deshmukh', 'vikram.deshmukh@gmail.com', '9890123456', 'Mechanical', 'Inquiry regarding Formula Student electric racecar workshop prerequisites.', 'New', '2026-10-22 14:40:10'),
(4, 'Anjali Menon', 'anjali.menon@gmail.com', '9812345670', 'Civil', 'Requesting syllabus details for earthquake resistant structural design course.', 'New', '2026-10-25 16:05:45');

-- ----------------------------------------------------------------------------
-- Table: audit_logs
-- Security and event tracking audit trail
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(64) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_user` (`user_id`),
  KEY `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `details`) VALUES
(1, 1, 'SYSTEM_INIT', 'Database schema initialized and seed records successfully migrated.'),
(2, 1, 'AUTH_LOGIN', 'Administrator logged in from authenticated workstation.'),
(3, 3, 'EVENT_REGISTER', 'Student Aarav Sharma registered for event ID 1 (AI & Machine Learning Bootcamp).');

-- ----------------------------------------------------------------------------
-- Useful Stored Views for Reporting & Analytics
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS `v_student_academic_summary`;
CREATE VIEW `v_student_academic_summary` AS
SELECT 
  s.id,
  s.roll_no,
  s.name,
  s.email,
  s.phone,
  d.name AS department_name,
  d.code AS department_code,
  s.semester,
  s.gpa,
  s.status,
  s.enrolled_date
FROM `students` s
INNER JOIN `departments` d ON s.department_id = d.id;

DROP VIEW IF EXISTS `v_upcoming_events`;
CREATE VIEW `v_upcoming_events` AS
SELECT 
  e.id,
  e.title,
  e.category,
  e.date,
  e.time,
  e.location,
  e.attendees,
  e.capacity,
  ROUND((e.attendees / e.capacity) * 100, 1) AS occupancy_pct,
  e.status,
  e.organizer
FROM `events` e
WHERE e.status IN ('Upcoming', 'Ongoing')
ORDER BY e.date ASC;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- End of StudentHub SQL Database Dump
-- ============================================================================
