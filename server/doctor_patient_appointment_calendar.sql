-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2023 at 08:17 PM
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
  `Specialization` enum('Family Doctor','Pediatrician','Orthopedics','Physiotherapy','Hydrotherapy','Occupational Therapy','Urology','Psychology','Otorhinolaryngology') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `medicalspecialists`
--

INSERT INTO `medicalspecialists` (`ID`, `MedicalLicense`, `Specialization`) VALUES
(123456784, 111115, 'Urology'),
(123456785, 111114, 'Otorhinolaryngology'),
(123456786, 111112, 'Pediatrician'),
(123456787, 111113, 'Orthopedics'),
(123456788, 111111, 'Family Doctor'),
(123456789, 111111, 'Family Doctor');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `ID` int(9) NOT NULL,
  `MedicalStatus` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`ID`, `MedicalStatus`) VALUES
(111111111, 'Ok'),
(111111112, 'Ok'),
(315821207, 'Ok');

-- --------------------------------------------------------

--
-- Table structure for table `specialisthours`
--

CREATE TABLE `specialisthours` (
  `SpecialistHourID` int(11) NOT NULL,
  `MedicalSpecialistID` int(11) NOT NULL,
  `DayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Type` enum('Working Hour','Break') DEFAULT NULL
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
  `TreatmentType` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `treatments`
--

INSERT INTO `treatments` (`TreatmentID`, `TreatmentName`, `Duration`, `Price`, `TreatmentType`) VALUES
(111111, 'Family Doctor', '00:20:00', 100, NULL),
(111112, 'Pediatrician', '00:20:00', 100, NULL),
(111113, 'Orthopedics', '00:30:00', 100, NULL),
(111114, 'Otorhinolaryngology', '00:20:00', 100, NULL),
(111115, 'Urology', '00:30:00', 100, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(9) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(40) NOT NULL,
  `LastName` varchar(40) NOT NULL,
  `Email` varchar(400) NOT NULL,
  `Mobile` varchar(10) NOT NULL,
  `Languages` enum('Hebrew','Russian','English','Arabic') NOT NULL,
  `CreationDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UserType` enum('Patient','Medical Specialist') NOT NULL,
  `isUserVerified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `Password`, `FirstName`, `LastName`, `Email`, `Mobile`, `Languages`, `CreationDate`, `UserType`, `isUserVerified`) VALUES
(111111111, '$2b$10$r2/5um5a8tqKmnyerGTPmeIbd9.mKPbfLKeFcn5JYNS38yXvwziqS', 'Dima', 'Kandiba', 'doctorpatientappointmentcalend+DimaKan@gmail.com', '0521111111', 'Russian', '2023-08-23 18:56:33', 'Patient', 1),
(111111112, '$2b$10$cjy1NBaIU4RocBglQey.HOKbOj8zRrlQLn95t6/SeDq09ljcr92DO', 'Sergey', 'Petrov', 'doctorpatientappointmentcalend+SerP@gmail.com', '0541111111', 'Russian', '2023-08-24 03:55:10', 'Patient', 1),
(123456784, '$2b$10$68Ge6K5uNDv/Hu8EvNM6pOa7Ub/.Lrr1HerNI9Rn.tbN1lWYuGkoC', 'Mark', 'Fridman', 'doctorpatientappointmentcalend+MarkFr@gmail.com', '0542222222', 'Hebrew', '2023-08-31 02:36:21', 'Medical Specialist', 1),
(123456785, '$2b$10$FBzoz9PuBPAx7ew.T9I1..3VYOUSIXUXU8kzTxWFBnSFJT9WK8ep2', 'Ilya', 'Grushko', 'doctorpatientappointmentcalend+IlyaG@gmail.com', '0522222222', 'Russian', '2023-08-31 02:36:07', 'Medical Specialist', 1),
(123456786, '$2b$10$ZtpWxt71FQBSAC.mwGYjLuuGvYJ8X4.Cm/kMYzFPFScBUdTgSti6u', 'Miriam', 'Strakovsky', 'doctorpatientappointmentcalend+MiriamS@gmail.com', '0503333333', 'Russian', '2023-08-31 02:35:50', 'Medical Specialist', 1),
(123456787, '$2b$10$BNv.lH6XIWKsnDrwSva0I.A865bYlLlFbeqVlEQ452VFZ5dNcqE.W', 'Micael', 'Israeli', 'doctorpatientappointmentcalend+michaelI23@gmail.com', '0551111111', 'Hebrew', '2023-08-31 01:43:05', 'Medical Specialist', 1),
(123456788, '$2b$10$q3URiNuV.KEOlZ6DQaArKOLTVrQd9YXphDV5FpRNIXTzzSiNyeqL2', 'Lilian', 'Shefer', 'doctorpatientappointmentcalend+LilianShefer@gmail.com', '0502222222', 'Hebrew', '2023-08-31 01:29:53', 'Medical Specialist', 1),
(123456789, '$2b$10$crT6GXij0LPI7NkJ02PF9.vie4u.tgBNx6VQVE9GBvq3omAjFZKEi', 'Mordechai', 'Alperine', 'doctorpatientappointmentcalend+MordechaiAl@gmail.com', '0501111111', 'Hebrew', '2023-08-24 04:12:43', 'Medical Specialist', 1),
(315821207, '$2b$10$eykWv1kpU8cDfI59on/FGewL0h3PL9.vC9GZ0F7Ve6KXwtqrPX8w2', 'David', 'Jedwabsky', 'djedwabsky@gmail.com', '0507746116', 'Hebrew', '2023-09-02 02:52:42', 'Patient', 1);

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
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `specialisthours`
--
ALTER TABLE `specialisthours`
  ADD PRIMARY KEY (`SpecialistHourID`),
  ADD KEY `MedicalSpecialistID` (`MedicalSpecialistID`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `specialisthours`
--
ALTER TABLE `specialisthours`
  MODIFY `SpecialistHourID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`MedicalSpecialistID`) REFERENCES `medicalspecialists` (`ID`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`PatientID`) REFERENCES `patients` (`ID`),
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`TreatmentID`) REFERENCES `treatments` (`TreatmentID`);

--
-- Constraints for table `medicalspecialists`
--
ALTER TABLE `medicalspecialists`
  ADD CONSTRAINT `medicalspecialists_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `users` (`ID`);

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `users` (`ID`);

--
-- Constraints for table `specialisthours`
--
ALTER TABLE `specialisthours`
  ADD CONSTRAINT `specialisthours_ibfk_1` FOREIGN KEY (`MedicalSpecialistID`) REFERENCES `medicalspecialists` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
