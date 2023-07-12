-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2023 at 12:59 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doctor_patient_appointment_calendar`
--
CREATE DATABASE IF NOT EXISTS `doctor_patient_appointment_calendar` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `doctor_patient_appointment_calendar`;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `AppointmentID` int(20) NOT NULL,
  `PatientID` int(9) NOT NULL,
  `MedicalSpecialistID` int(9) NOT NULL,
  `TreatmentID` int(40) NOT NULL,
  `StartTime` datetime NOT NULL,
  `EndingTime` datetime NOT NULL,
  `Date` datetime NOT NULL,
  `isPayedFor` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalspecialists`
--

CREATE TABLE `medicalspecialists` (
  `ID` int(9) NOT NULL,
  `MedicalLicense` int(11) NOT NULL,
  `Specialization` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paitents`
--

CREATE TABLE `paitents` (
  `ID` int(9) NOT NULL,
  `MedicalStatus` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `treatments`
--

CREATE TABLE `treatments` (
  `TreatmentID` int(20) NOT NULL,
  `TreatmentName` varchar(20) NOT NULL,
  `Duration` time NOT NULL,
  `Price` double NOT NULL,
  `TreatmentType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(9) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(40) NOT NULL,
  `LastName` varchar(40) NOT NULL,
  `Email` varchar(40) NOT NULL,
  `Mobile` varchar(10) NOT NULL,
  `Languages` enum('Hebrew','Russian','English','Arabic') NOT NULL,
  `CreationDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `EmailVerificationToken` varchar(255) DEFAULT NULL,
  `UserType` enum('Patient','Medical Specialist') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD KEY `MedicalSpecialistID` (`MedicalSpecialistID`),
  ADD KEY `PatientID` (`PatientID`),
  ADD KEY `TreatmentID` (`TreatmentID`);

--
-- Indexes for table `medicalspecialists`
--
ALTER TABLE `medicalspecialists`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paitents`
--
ALTER TABLE `paitents`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `treatments`
--
ALTER TABLE `treatments`
  ADD PRIMARY KEY (`TreatmentID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`MedicalSpecialistID`) REFERENCES `medicalspecialists` (`ID`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`PatientID`) REFERENCES `paitents` (`ID`),
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`TreatmentID`) REFERENCES `treatments` (`TreatmentID`);

--
-- Constraints for table `medicalspecialists`
--
ALTER TABLE `medicalspecialists`
  ADD CONSTRAINT `medicalspecialists_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `users` (`ID`);

--
-- Constraints for table `paitents`
--
ALTER TABLE `paitents`
  ADD CONSTRAINT `paitents_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `users` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
