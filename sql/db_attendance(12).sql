-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2024 at 01:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_attendance`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attendance`
--

CREATE TABLE `tbl_attendance` (
  `attendance_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `status` enum('present','absent','late') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_attendance`
--

INSERT INTO `tbl_attendance` (`attendance_id`, `employee_id`, `site_id`, `date`, `check_in_time`, `check_out_time`, `status`) VALUES
(7, 2, 1, '2024-10-07', '08:05:00', '17:00:00', 'present'),
(8, 3, 2, '2024-10-07', '08:35:00', '17:30:00', 'late'),
(9, 2, 1, '2024-10-08', '08:00:00', '17:05:00', 'present'),
(10, 3, 2, '2024-10-08', '09:10:00', '17:00:00', 'late'),
(11, 2, 3, '2024-10-09', '08:00:00', '16:00:00', 'present'),
(15, 11, 6, '2024-10-16', '08:15:00', '17:05:00', 'present');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_department`
--

CREATE TABLE `tbl_department` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_department`
--

INSERT INTO `tbl_department` (`department_id`, `department_name`) VALUES
(1, 'HR'),
(2, 'Admin'),
(3, 'Construction Worker'),
(4, 'Project Manager'),
(5, 'Safety Officer'),
(6, 'Engineer'),
(7, 'Accountant');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employee`
--

CREATE TABLE `tbl_employee` (
  `employee_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `date_of_hire` date DEFAULT curdate(),
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_employee`
--

INSERT INTO `tbl_employee` (`employee_id`, `first_name`, `last_name`, `date_of_hire`, `email`, `phone_number`, `username`, `password`, `status`, `department_id`) VALUES
(2, 'Admin', 'User', '2024-10-06', 'admin@example.com', '1234567890', 'admin', '123', 'active', 2),
(3, 'A', 'a', '2024-10-07', 'a@gmail.com', '09', '12', '$2y$10$m.bL.WR3dY2wN.n/PaY0FOJMdUBaMixBUOt4ntEfTc/Sd0ZVQOmUC', 'active', 2),
(4, 'Hello', 'World', '2024-10-10', 'hello@gmail.com', '123121212121212', 'helloworld', '$2y$10$EWL5tthoZcS48UZpwsulwegXDIjYVJ7/mFQr8qhPB51ekZjjHykQ2', 'active', 1),
(5, 'Jesse', 'Morcillos', '2024-10-10', 'serot@gmail.com', '09012312312312', 'jesse', '$2y$10$LC9EaEKKSnsPkd.NBFO9r.GKF4/LpJ8Z9Kz/aONgGJROdIjBN3abi', 'active', 7),
(6, 'Clyde', 'Parol', '2024-10-10', 'helloworld@gmail.com', '090904949403', 'clydeparol', '$2y$10$Lk099mF7WioWvXOx0XrYU.qZSQtMFl7g/6s3tku3oZqm67LVAu8Zu', 'active', 3),
(8, 'Admin', 'Dashboard', '2024-10-10', 'admin@gmail.com', '090909090909', 'admin1', '$2y$10$nY32fqZT23lVS6IYcXugYu0sBe6NQTA3sxaLOdTjTYxBPf4VsWB0a', 'active', 2),
(9, 'Kud', 'Os', '2024-10-12', 'kudos@gmail.com', '09090909090909', 'kudos', '$2y$10$7tnVPyeCe2xBXHT67S3lqeu7JPH1xfM95K8.MXJYFY1lJXkAKB3MS', 'active', 4),
(10, 'Mic Test', 'Test Mic', '2024-10-14', 'mic@gmail.com', '090909090090', 'mictest', '$2y$10$DuOjMAw1w7yxGyzuF4w3G./1om3pZxS8aQkTGPzJQyooxu5HAoaFG', 'active', 3),
(11, 'John', 'Doe', '2024-10-16', 'john.doe@example.com', NULL, 'johndoe', '123', 'active', 3),
(12, 'Mark', 'Wellington', '2024-10-18', 'mark@gmail.com', '09090909090909', 'mark', '$2y$10$NhZy7he/vfO/X8cevy0.T.oaMswsL9f4hMqf3NbiFZf3qalYOIEoq', 'active', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_leave`
--

CREATE TABLE `tbl_leave` (
  `leave_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `leave_type` enum('sick','vacation','maternity','paternity','emergency','others') NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','approved','declined') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_shifts`
--

CREATE TABLE `tbl_shifts` (
  `shift_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `shift_date` date NOT NULL,
  `shift_start_time` time NOT NULL,
  `shift_end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_shifts`
--

INSERT INTO `tbl_shifts` (`shift_id`, `employee_id`, `site_id`, `shift_date`, `shift_start_time`, `shift_end_time`) VALUES
(1, 2, 1, '2024-10-07', '08:00:00', '17:00:00'),
(2, 3, 2, '2024-10-07', '09:00:00', '18:00:00'),
(3, 2, 1, '2024-10-08', '08:00:00', '17:00:00'),
(4, 3, 2, '2024-10-08', '09:00:00', '18:00:00'),
(5, 5, 1, '2024-10-13', '01:00:00', '17:00:00'),
(6, 4, 2, '2024-10-13', '01:00:00', '02:00:00'),
(7, 9, 5, '2024-10-30', '01:00:00', '02:00:00'),
(8, 8, 1, '0001-01-02', '01:02:00', '12:02:00'),
(11, 11, 6, '2024-10-16', '08:00:00', '17:00:00'),
(12, 6, 7, '2024-10-16', '08:00:00', '12:00:00'),
(13, 12, 8, '2024-10-18', '21:09:00', '22:00:00'),
(14, 10, 8, '2024-10-18', '22:20:00', '22:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_site`
--

CREATE TABLE `tbl_site` (
  `site_id` int(11) NOT NULL,
  `site_name` varchar(255) NOT NULL,
  `site_location` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_site`
--

INSERT INTO `tbl_site` (`site_id`, `site_name`, `site_location`, `status`) VALUES
(1, 'Construction Site A', '123 Main Street, City A', 'active'),
(2, 'Construction Site B', '456 Oak Avenue, City B', 'active'),
(3, 'Construction Site C', '789 Pine Road, City C', 'active'),
(4, 'a', 'b', 'active'),
(5, 'Construction D', 'Hello City', 'active'),
(6, 'Project Ayala 1', 'Cagayan de Oro City', 'active'),
(7, 'Construction Site E', 'Philippines', 'active'),
(8, 'Mountain View', 'Philippines', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_attendance`
--
ALTER TABLE `tbl_attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `site_id` (`site_id`);

--
-- Indexes for table `tbl_department`
--
ALTER TABLE `tbl_department`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `tbl_employee`
--
ALTER TABLE `tbl_employee`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `tbl_leave`
--
ALTER TABLE `tbl_leave`
  ADD PRIMARY KEY (`leave_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `tbl_shifts`
--
ALTER TABLE `tbl_shifts`
  ADD PRIMARY KEY (`shift_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `site_id` (`site_id`);

--
-- Indexes for table `tbl_site`
--
ALTER TABLE `tbl_site`
  ADD PRIMARY KEY (`site_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_attendance`
--
ALTER TABLE `tbl_attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tbl_department`
--
ALTER TABLE `tbl_department`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_employee`
--
ALTER TABLE `tbl_employee`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_leave`
--
ALTER TABLE `tbl_leave`
  MODIFY `leave_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_shifts`
--
ALTER TABLE `tbl_shifts`
  MODIFY `shift_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tbl_site`
--
ALTER TABLE `tbl_site`
  MODIFY `site_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_attendance`
--
ALTER TABLE `tbl_attendance`
  ADD CONSTRAINT `tbl_attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `tbl_employee` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_attendance_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `tbl_site` (`site_id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_employee`
--
ALTER TABLE `tbl_employee`
  ADD CONSTRAINT `tbl_employee_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `tbl_department` (`department_id`) ON DELETE SET NULL;

--
-- Constraints for table `tbl_leave`
--
ALTER TABLE `tbl_leave`
  ADD CONSTRAINT `tbl_leave_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `tbl_employee` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_shifts`
--
ALTER TABLE `tbl_shifts`
  ADD CONSTRAINT `tbl_shifts_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `tbl_employee` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_shifts_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `tbl_site` (`site_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
