-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-pluyaud.alwaysdata.net
-- Generation Time: Jan 24, 2022 at 06:18 PM
-- Server version: 10.6.5-MariaDB
-- PHP Version: 7.4.19
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;
--
-- Database: `pluyaud_projet`
--
-- --------------------------------------------------------
--
-- Table structure for table `Comments`
--
CREATE TABLE `Comments` (
  `id` int(11) NOT NULL,
  `contentCom` text DEFAULT NULL,
  `attachmentCom` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PostId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Table structure for table `Posts`
--
CREATE TABLE `Posts` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Table structure for table `Users`
--
CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `job` varchar(255) DEFAULT NULL,
  `isadmin` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Indexes for dumped tables
--
--
-- Indexes for table `Comments`
--
ALTER TABLE `Comments`
ADD PRIMARY KEY (`id`),
  ADD KEY `PostId` (`PostId`),
  ADD KEY `UserId` (`UserId`);
--
-- Indexes for table `Posts`
--
ALTER TABLE `Posts`
ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);
--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);
--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `Comments`
--
ALTER TABLE `Comments`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 103;
--
-- AUTO_INCREMENT for table `Posts`
--
ALTER TABLE `Posts`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 92;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 92;
--
-- Constraints for dumped tables
--
--
-- Constraints for table `Comments`
--
ALTER TABLE `Comments`
ADD CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`PostId`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Constraints for table `Posts`
--
ALTER TABLE `Posts`
ADD CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;