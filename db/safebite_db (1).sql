-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2025 at 03:28 AM
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
-- Database: `safebite`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action`, `timestamp`) VALUES
(1, 11, 'User logged out', '2025-09-17 01:21:09'),
(2, 11, 'User logged in successfully', '2025-09-17 01:21:13'),
(3, 11, 'AI analysis performed for banana', '2025-09-17 01:28:46'),
(4, 11, 'AI analysis performed for banana', '2025-09-17 01:28:48'),
(5, 11, 'Updated expiry date for food item ID 1 to 2025-09-17', '2025-09-17 01:28:48'),
(6, 11, 'Updated expiry date for food item ID 2 to 2025-09-17', '2025-09-17 01:28:48'),
(7, 11, 'Updated expiry date for food item ID 3 to 2025-09-17', '2025-09-17 01:28:48'),
(8, 11, 'AI analysis performed for banana', '2025-09-17 01:29:35'),
(9, 11, 'AI analysis performed for banana', '2025-09-17 01:29:37'),
(10, 11, 'Updated expiry date for food item ID 1 to 2025-09-17', '2025-09-17 01:29:37'),
(11, 11, 'Updated expiry date for food item ID 2 to 2025-09-17', '2025-09-17 01:29:37'),
(12, 11, 'Updated expiry date for food item ID 3 to 2025-09-17', '2025-09-17 01:29:37'),
(13, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 01:30:05'),
(14, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 01:30:05'),
(15, 11, 'AI analysis performed for sayote', '2025-09-17 01:31:07'),
(16, 11, 'AI analysis performed for sayote', '2025-09-17 01:31:09'),
(17, 11, 'Updated expiry date for food item ID 4 to 2025-09-18', '2025-09-17 01:31:09'),
(18, 11, 'Updated expiry date for food item ID 5 to 2025-09-18', '2025-09-17 01:31:09'),
(19, 11, 'Updated expiry date for food item ID 6 to 2025-09-18', '2025-09-17 01:31:09'),
(20, 11, 'AI analysis performed for sayote', '2025-09-17 01:31:55'),
(21, 11, 'AI analysis performed for sayote', '2025-09-17 01:31:56'),
(22, 11, 'Updated expiry date for food item ID 4 to 2025-09-18', '2025-09-17 01:31:56'),
(23, 11, 'Updated expiry date for food item ID 5 to 2025-09-18', '2025-09-17 01:31:56'),
(24, 11, 'Updated expiry date for food item ID 6 to 2025-09-18', '2025-09-17 01:31:56'),
(25, 11, 'AI analysis performed for Chayote', '2025-09-17 01:32:57'),
(26, 11, 'AI analysis performed for Chayote', '2025-09-17 01:32:58'),
(27, 11, 'Updated expiry date for food item ID 7 to 2025-09-18', '2025-09-17 01:32:59'),
(28, 11, 'Updated expiry date for food item ID 8 to 2025-09-18', '2025-09-17 01:32:59'),
(29, 11, 'Updated expiry date for food item ID 9 to 2025-09-18', '2025-09-17 01:32:59'),
(30, 11, 'ML prediction performed for Chayote (unsafe)', '2025-09-17 01:43:31'),
(31, 11, 'ML prediction performed for Chayote (unsafe)', '2025-09-17 01:43:31'),
(32, 11, 'ML prediction performed for Chayote (unsafe)', '2025-09-17 01:43:31'),
(33, 11, 'ML prediction performed for Chayote (unsafe)', '2025-09-17 01:43:31'),
(34, 11, 'ML prediction performed for Chayote (unsafe)', '2025-09-17 01:43:31'),
(35, 11, 'AI analysis performed for banana', '2025-09-17 02:15:41'),
(36, 11, 'AI analysis performed for banana', '2025-09-17 02:15:43'),
(37, 11, 'Updated expiry date for food item ID 1 to 2025-09-17', '2025-09-17 02:15:43'),
(38, 11, 'Updated expiry date for food item ID 2 to 2025-09-17', '2025-09-17 02:15:43'),
(39, 11, 'Updated expiry date for food item ID 3 to 2025-09-17', '2025-09-17 02:15:43'),
(40, 11, 'AI analysis performed for banana', '2025-09-17 02:16:24'),
(41, 11, 'AI analysis performed for banana', '2025-09-17 02:16:25'),
(42, 11, 'Updated expiry date for food item ID 1 to 2025-09-17', '2025-09-17 02:16:25'),
(43, 11, 'Updated expiry date for food item ID 2 to 2025-09-17', '2025-09-17 02:16:25'),
(44, 11, 'Updated expiry date for food item ID 3 to 2025-09-17', '2025-09-17 02:16:25'),
(45, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 02:17:22'),
(46, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 02:17:23'),
(47, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 02:17:23'),
(48, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 02:17:23'),
(49, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 02:17:23'),
(50, 11, 'ML prediction performed for banana (unsafe)', '2025-09-17 02:17:24'),
(51, 11, 'AI analysis performed for ampalaya', '2025-09-17 02:18:43'),
(52, 11, 'AI analysis performed for ampalaya', '2025-09-17 02:18:45'),
(53, 11, 'Updated expiry date for food item ID 10 to 2025-09-17', '2025-09-17 02:18:45'),
(54, 11, 'Updated expiry date for food item ID 11 to 2025-09-17', '2025-09-17 02:18:45'),
(55, 11, 'Updated expiry date for food item ID 12 to 2025-09-17', '2025-09-17 02:18:45'),
(56, 11, 'AI analysis performed for amplaya', '2025-09-17 02:20:16'),
(57, 11, 'AI analysis performed for amplaya', '2025-09-17 02:20:18'),
(58, 11, 'Updated expiry date for food item ID 13 to 2025-09-17', '2025-09-17 02:20:18'),
(59, 11, 'Updated expiry date for food item ID 14 to 2025-09-17', '2025-09-17 02:20:18'),
(60, 11, 'Updated expiry date for food item ID 15 to 2025-09-17', '2025-09-17 02:20:18'),
(61, 11, 'User logged out', '2025-09-17 02:21:29'),
(62, 26, 'Admin logged in successfully', '2025-09-17 02:21:43'),
(63, 26, 'Admin generated top spoiling foods report', '2025-09-17 02:22:43'),
(64, 26, 'Admin logged in successfully', '2025-09-17 04:39:11'),
(65, 26, 'User logged out', '2025-09-17 04:39:37'),
(66, 26, 'Admin logged in successfully', '2025-09-17 04:39:41'),
(67, 26, 'Admin logged in successfully', '2025-09-17 05:25:02'),
(68, 26, 'Admin logged in successfully', '2025-09-17 07:59:33'),
(69, 26, 'Admin generated top spoiling foods report', '2025-09-17 12:49:26'),
(70, 26, 'Admin generated new users report', '2025-09-17 12:55:12'),
(71, 26, 'Admin logged in successfully', '2025-09-17 16:48:45'),
(72, 26, 'User logged in successfully', '2025-09-19 02:08:55'),
(73, 26, 'User logged out', '2025-09-19 02:09:20'),
(74, 26, 'Admin logged in successfully', '2025-09-19 02:09:30'),
(75, 26, 'User logged out', '2025-09-19 02:11:08'),
(76, 11, 'User logged in successfully', '2025-09-19 02:11:18'),
(77, 11, 'User logged out', '2025-09-19 02:21:46'),
(78, 26, 'Admin logged in successfully', '2025-09-19 02:21:51'),
(79, 26, 'User logged out', '2025-09-19 02:36:26'),
(80, 11, 'User logged in successfully', '2025-09-19 02:36:34'),
(81, 11, 'ML prediction performed for ampalaya (unsafe)', '2025-09-19 02:37:36'),
(82, 11, 'ML prediction performed for ampalaya (unsafe)', '2025-09-19 02:37:36'),
(83, 11, 'User logged in successfully', '2025-09-19 03:30:02'),
(84, 11, 'User logged out', '2025-09-19 03:30:12'),
(85, 26, 'Admin logged in successfully', '2025-09-19 03:30:38'),
(86, 26, 'User logged out', '2025-09-19 03:50:55'),
(87, 11, 'User logged in successfully', '2025-09-19 03:51:01'),
(88, 11, 'User logged out', '2025-09-19 05:51:02'),
(89, 11, 'User logged in successfully', '2025-09-19 05:51:50'),
(90, 11, 'User logged out', '2025-09-19 06:04:36'),
(91, 11, 'User logged in successfully', '2025-09-19 06:08:42'),
(92, 11, 'User logged in successfully', '2025-09-20 01:01:52'),
(93, 11, 'User logged in successfully', '2025-09-20 03:48:43'),
(94, 11, 'AI analysis performed for amplaya', '2025-09-20 03:48:52'),
(95, 11, 'AI analysis performed for banana', '2025-09-20 03:51:13'),
(96, 11, 'AI analysis performed for banana', '2025-09-20 03:51:14'),
(97, 11, 'Updated expiry date for food item ID 1 to 2025-09-20', '2025-09-20 03:51:15'),
(98, 11, 'Updated expiry date for food item ID 2 to 2025-09-20', '2025-09-20 03:51:15'),
(99, 11, 'Updated expiry date for food item ID 3 to 2025-09-20', '2025-09-20 03:51:15'),
(100, 11, 'User logged in successfully', '2025-09-20 05:26:38'),
(101, 11, 'User logged in successfully', '2025-09-20 05:29:38'),
(102, 11, 'User logged in successfully', '2025-09-20 05:32:19'),
(103, 11, 'User logged in successfully', '2025-09-20 05:36:12'),
(104, 11, 'User logged out', '2025-09-20 05:41:47'),
(105, 11, 'User logged in successfully', '2025-09-20 05:41:51'),
(106, 11, 'User logged in successfully', '2025-09-20 09:45:21'),
(107, 11, 'AI analysis performed for BANANA', '2025-09-20 09:46:34'),
(108, 11, 'AI analysis performed for BANANA', '2025-09-20 09:46:35'),
(109, 11, 'Updated expiry date for food item ID 1 to 2025-09-21', '2025-09-20 09:46:35'),
(110, 11, 'Updated expiry date for food item ID 2 to 2025-09-21', '2025-09-20 09:46:35'),
(111, 11, 'Updated expiry date for food item ID 3 to 2025-09-21', '2025-09-20 09:46:35'),
(112, 11, 'AI analysis performed for AMPALAYA', '2025-09-20 09:57:05'),
(113, 11, 'AI analysis performed for AMPALAYA', '2025-09-20 09:57:07'),
(114, 11, 'Updated expiry date for food item ID 4 to 2025-09-21', '2025-09-20 09:57:07'),
(115, 11, 'Updated expiry date for food item ID 5 to 2025-09-21', '2025-09-20 09:57:07'),
(116, 11, 'Updated expiry date for food item ID 6 to 2025-09-21', '2025-09-20 09:57:07'),
(117, 11, 'AI analysis performed for Tomato', '2025-09-20 15:42:35'),
(118, 11, 'AI analysis performed for Tomato', '2025-09-20 15:42:36'),
(119, 11, 'Updated expiry date for food item ID 7 to 2025-09-23', '2025-09-20 15:42:36'),
(120, 11, 'Updated expiry date for food item ID 8 to 2025-09-23', '2025-09-20 15:42:36'),
(121, 11, 'Updated expiry date for food item ID 9 to 2025-09-23', '2025-09-20 15:42:36'),
(122, 11, 'User logged in successfully', '2025-09-20 17:48:04'),
(123, 11, 'User logged in successfully', '2025-09-21 02:38:31'),
(124, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:51:58'),
(125, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:51:58'),
(126, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:51:59'),
(127, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:51:59'),
(128, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:51:59'),
(129, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:51:59'),
(130, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:52:00'),
(131, 11, 'ML prediction performed for Tomato (caution)', '2025-09-21 03:52:01'),
(132, 11, 'User logged in successfully', '2025-09-21 04:41:44'),
(133, 11, 'AI analysis performed for Tomato', '2025-09-21 04:47:34'),
(134, 11, 'AI analysis performed for Tomato', '2025-09-21 04:47:35'),
(135, 11, 'Updated expiry date for food item ID 1 to 2025-09-22', '2025-09-21 04:47:35'),
(136, 11, 'Updated expiry date for food item ID 2 to 2025-09-22', '2025-09-21 04:47:35'),
(137, 11, 'Updated expiry date for food item ID 3 to 2025-09-22', '2025-09-21 04:47:35'),
(138, 11, 'User logged in successfully', '2025-09-21 07:25:09'),
(139, 11, 'ML prediction performed for Tomato (unsafe)', '2025-09-21 07:55:00'),
(140, 11, 'ML prediction performed for Tomato (unsafe)', '2025-09-21 07:55:01'),
(141, 11, 'AI analysis performed for Tomato', '2025-09-21 07:55:37'),
(142, 11, 'AI analysis performed for Tomato', '2025-09-21 07:55:39'),
(143, 11, 'Updated expiry date for food item ID 1 to 2025-09-22', '2025-09-21 07:55:39'),
(144, 11, 'Updated expiry date for food item ID 2 to 2025-09-22', '2025-09-21 07:55:39'),
(145, 11, 'Updated expiry date for food item ID 3 to 2025-09-22', '2025-09-21 07:55:39'),
(146, 11, 'AI analysis performed for Banana', '2025-09-21 08:02:36'),
(147, 11, 'AI analysis performed for Banana', '2025-09-21 08:02:38'),
(148, 11, 'Updated expiry date for food item ID 1 to 2025-09-22', '2025-09-21 08:02:38'),
(149, 11, 'Updated expiry date for food item ID 2 to 2025-09-22', '2025-09-21 08:02:38'),
(150, 11, 'Updated expiry date for food item ID 3 to 2025-09-22', '2025-09-21 08:02:38'),
(151, 11, 'AI analysis performed for Banana', '2025-09-21 08:11:30'),
(152, 11, 'AI analysis performed for Banana', '2025-09-21 08:11:32'),
(153, 11, 'Updated expiry date for food item ID 1 to 2025-09-22', '2025-09-21 08:11:32'),
(154, 11, 'Updated expiry date for food item ID 2 to 2025-09-22', '2025-09-21 08:11:32'),
(155, 11, 'Updated expiry date for food item ID 3 to 2025-09-22', '2025-09-21 08:11:32'),
(156, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:12:55'),
(157, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:12:55'),
(158, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:12:55'),
(159, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:13:54'),
(160, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:13:54'),
(161, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:13:54'),
(162, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:17:10'),
(163, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:17:10'),
(164, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:17:10'),
(165, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:17:10'),
(166, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:17:10'),
(167, 11, 'AI analysis performed for Banana', '2025-09-21 08:21:36'),
(168, 11, 'AI analysis performed for Banana', '2025-09-21 08:21:37'),
(169, 11, 'Updated expiry date for food item ID 1 to 2025-09-22', '2025-09-21 08:21:37'),
(170, 11, 'Updated expiry date for food item ID 2 to 2025-09-22', '2025-09-21 08:21:37'),
(171, 11, 'Updated expiry date for food item ID 3 to 2025-09-22', '2025-09-21 08:21:37'),
(172, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:21:55'),
(173, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:21:55'),
(174, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:21:58'),
(175, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:21:58'),
(176, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:25:55'),
(177, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:25:55'),
(178, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:27:53'),
(179, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:27:53'),
(180, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:27:53'),
(181, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:30:16'),
(182, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:30:16'),
(183, 11, 'AI analysis performed for Apple', '2025-09-21 08:30:56'),
(184, 11, 'AI analysis performed for Apple', '2025-09-21 08:30:57'),
(185, 11, 'Updated expiry date for food item ID 4 to 2025-09-22', '2025-09-21 08:30:57'),
(186, 11, 'Updated expiry date for food item ID 5 to 2025-09-22', '2025-09-21 08:30:57'),
(187, 11, 'Updated expiry date for food item ID 6 to 2025-09-22', '2025-09-21 08:30:57'),
(188, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-21 08:46:26'),
(189, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-21 08:46:27'),
(190, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-21 08:50:27'),
(191, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-21 08:50:28'),
(192, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-21 08:53:09'),
(193, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-21 08:57:28'),
(194, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-21 08:58:49'),
(195, 11, 'User logged in successfully', '2025-09-21 13:48:30'),
(196, 11, 'AI analysis performed for Apple', '2025-09-21 15:36:57'),
(197, 11, 'User logged in successfully', '2025-09-21 15:47:26'),
(198, 11, 'User logged in successfully', '2025-09-21 23:12:07'),
(199, 11, 'Added food item: mango', '2025-09-21 23:20:09'),
(200, 11, 'AI analysis performed for Banana', '2025-09-22 01:05:12'),
(201, 11, 'AI analysis performed for Banana', '2025-09-22 01:05:13'),
(202, 11, 'Updated expiry date for food item ID 1 to 2025-09-23', '2025-09-22 01:05:13'),
(203, 11, 'Updated expiry date for food item ID 2 to 2025-09-23', '2025-09-22 01:05:13'),
(204, 11, 'Updated expiry date for food item ID 3 to 2025-09-23', '2025-09-22 01:05:13'),
(205, 11, 'User logged in successfully', '2025-09-22 01:13:28'),
(206, 11, 'AI analysis performed for Apple', '2025-09-22 02:41:39'),
(207, 11, 'AI analysis performed for Apple', '2025-09-22 02:41:40'),
(208, 11, 'Updated expiry date for food item ID 5 to 2025-09-22', '2025-09-22 02:41:41'),
(209, 11, 'Updated expiry date for food item ID 6 to 2025-09-22', '2025-09-22 02:41:41'),
(210, 11, 'Updated expiry date for food item ID 4 to 2025-09-22', '2025-09-22 02:41:41'),
(211, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-22 05:35:47'),
(212, 11, 'AI analysis performed for Grape', '2025-09-22 05:40:25'),
(213, 11, 'AI analysis performed for Grape', '2025-09-22 05:40:26'),
(214, 11, 'Updated expiry date for food item ID 7 to 2025-09-23', '2025-09-22 05:40:26'),
(215, 11, 'Updated expiry date for food item ID 8 to 2025-09-23', '2025-09-22 05:40:26'),
(216, 11, 'Updated expiry date for food item ID 9 to 2025-09-23', '2025-09-22 05:40:26'),
(217, 11, 'User logged in successfully', '2025-09-22 13:20:43'),
(218, 11, 'ML prediction performed for Grape (unsafe)', '2025-09-22 13:57:01'),
(219, 11, 'AI analysis performed for Banana', '2025-09-22 14:06:59'),
(220, 11, 'AI analysis performed for Banana', '2025-09-22 14:07:01'),
(221, 11, 'Updated expiry date for food item ID 1 to 2025-09-23', '2025-09-22 14:07:01'),
(222, 11, 'Updated expiry date for food item ID 2 to 2025-09-23', '2025-09-22 14:07:01'),
(223, 11, 'Updated expiry date for food item ID 3 to 2025-09-23', '2025-09-22 14:07:01'),
(224, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:07:35'),
(225, 11, 'User logged in successfully', '2025-09-22 14:18:03'),
(226, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:19:49'),
(227, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:23:34'),
(228, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:25:11'),
(229, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:30:20'),
(230, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:33:43'),
(231, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:39:00'),
(232, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:44:24'),
(233, 11, 'Created High alert: SmartSense: Banana is UNSAFE', '2025-09-22 14:44:24'),
(234, 11, 'AI analysis performed for Apple', '2025-09-22 14:52:28'),
(235, 11, 'Created High alert: SmartSense: Apple is UNSAFE', '2025-09-22 14:52:28'),
(236, 11, 'AI analysis performed for Apple', '2025-09-22 14:52:29'),
(237, 11, 'Updated expiry date for food item ID 6 to 2025-09-23', '2025-09-22 14:52:29'),
(238, 11, 'Updated expiry date for food item ID 4 to 2025-09-23', '2025-09-22 14:52:29'),
(239, 11, 'Updated expiry date for food item ID 5 to 2025-09-23', '2025-09-22 14:52:29'),
(240, 11, 'ML prediction performed for Apple (unsafe)', '2025-09-22 14:53:36'),
(241, 11, 'Created High alert: SmartSense: Apple is UNSAFE', '2025-09-22 14:53:36'),
(242, 11, 'ML prediction performed for Banana (unsafe)', '2025-09-22 14:58:46'),
(243, 11, 'Created High alert: SmartSense: Banana is UNSAFE', '2025-09-22 14:58:46'),
(244, 11, 'AI analysis performed for Orange', '2025-09-22 15:13:05'),
(245, 11, 'Created High alert: SmartSense: Orange is UNSAFE', '2025-09-22 15:13:05'),
(246, 11, 'AI analysis performed for Orange', '2025-09-22 15:13:07'),
(247, 11, 'Updated expiry date for food item ID 7 to 2025-09-23', '2025-09-22 15:13:07'),
(248, 11, 'Updated expiry date for food item ID 8 to 2025-09-23', '2025-09-22 15:13:07'),
(249, 11, 'Updated expiry date for food item ID 9 to 2025-09-23', '2025-09-22 15:13:07'),
(250, 11, 'AI analysis performed for Eggplant', '2025-09-22 15:18:36'),
(251, 11, 'Created High alert: SmartSense: Eggplant is UNSAFE', '2025-09-22 15:18:36'),
(252, 11, 'AI analysis performed for Eggplant', '2025-09-22 15:18:37'),
(253, 11, 'Updated expiry date for food item ID 10 to 2025-09-23', '2025-09-22 15:18:37'),
(254, 11, 'Updated expiry date for food item ID 11 to 2025-09-23', '2025-09-22 15:18:37'),
(255, 11, 'Updated expiry date for food item ID 12 to 2025-09-23', '2025-09-22 15:18:37'),
(256, 11, 'AI analysis performed for Sayote', '2025-09-22 15:28:17'),
(257, 11, 'Created High alert: SmartSense: Sayote is UNSAFE', '2025-09-22 15:28:18'),
(258, 11, 'AI analysis performed for Sayote', '2025-09-22 15:28:19'),
(259, 11, 'Updated expiry date for food item ID 13 to 2025-09-23', '2025-09-22 15:28:19'),
(260, 11, 'Updated expiry date for food item ID 14 to 2025-09-23', '2025-09-22 15:28:19'),
(261, 11, 'Updated expiry date for food item ID 15 to 2025-09-23', '2025-09-22 15:28:19'),
(262, 11, 'AI analysis performed for Cabbage', '2025-09-22 15:32:18'),
(263, 11, 'Created High alert: SmartSense: Cabbage is UNSAFE', '2025-09-22 15:32:18'),
(264, 11, 'AI analysis performed for Cabbage', '2025-09-22 15:32:19'),
(265, 11, 'Updated expiry date for food item ID 16 to 2025-09-23', '2025-09-22 15:32:19'),
(266, 11, 'Updated expiry date for food item ID 17 to 2025-09-23', '2025-09-22 15:32:19'),
(267, 11, 'Updated expiry date for food item ID 18 to 2025-09-23', '2025-09-22 15:32:19'),
(268, 11, 'AI analysis performed for Grape', '2025-09-22 15:39:27'),
(269, 11, 'Created High alert: SmartSense: Grape is UNSAFE', '2025-09-22 15:39:27'),
(270, 11, 'AI analysis performed for Grape', '2025-09-22 15:39:29'),
(271, 11, 'Updated expiry date for food item ID 19 to 2025-09-23', '2025-09-22 15:39:29'),
(272, 11, 'Updated expiry date for food item ID 20 to 2025-09-23', '2025-09-22 15:39:29'),
(273, 11, 'Updated expiry date for food item ID 21 to 2025-09-23', '2025-09-22 15:39:29'),
(274, 11, 'AI analysis performed for Blue Berry', '2025-09-22 15:44:36'),
(275, 11, 'Created High alert: SmartSense: Blue Berry is UNSAFE', '2025-09-22 15:44:36'),
(276, 11, 'AI analysis performed for Blue Berry', '2025-09-22 15:44:37'),
(277, 11, 'Updated expiry date for food item ID 22 to 2025-09-23', '2025-09-22 15:44:37'),
(278, 11, 'Updated expiry date for food item ID 23 to 2025-09-23', '2025-09-22 15:44:37'),
(279, 11, 'Updated expiry date for food item ID 24 to 2025-09-23', '2025-09-22 15:44:37'),
(280, 11, 'ML prediction performed for Blue Berry (unsafe)', '2025-09-22 15:45:37'),
(281, 11, 'Created High alert: SmartSense: Blue Berry is UNSAFE', '2025-09-22 15:45:37'),
(282, 11, 'AI analysis performed for Garlic', '2025-09-22 15:56:52'),
(283, 11, 'Created High alert: SmartSense: Garlic is UNSAFE', '2025-09-22 15:56:52'),
(284, 11, 'AI analysis performed for Garlic', '2025-09-22 15:56:54'),
(285, 11, 'Updated expiry date for food item ID 25 to 2025-09-25', '2025-09-22 15:56:54'),
(286, 11, 'Updated expiry date for food item ID 26 to 2025-09-25', '2025-09-22 15:56:54'),
(287, 11, 'Updated expiry date for food item ID 27 to 2025-09-25', '2025-09-22 15:56:54'),
(288, 11, 'AI analysis performed for Mango', '2025-09-22 16:02:39'),
(289, 11, 'Created High alert: SmartSense: Mango is UNSAFE', '2025-09-22 16:02:39'),
(290, 11, 'AI analysis performed for Mango', '2025-09-22 16:02:41'),
(291, 11, 'Updated expiry date for food item ID 28 to 2025-09-23', '2025-09-22 16:02:41'),
(292, 11, 'Updated expiry date for food item ID 29 to 2025-09-23', '2025-09-22 16:02:41'),
(293, 11, 'Updated expiry date for food item ID 30 to 2025-09-23', '2025-09-22 16:02:41'),
(294, 11, 'AI analysis performed for Onion', '2025-09-22 16:11:15'),
(295, 11, 'Created High alert: SmartSense: Onion is UNSAFE', '2025-09-22 16:11:15'),
(296, 11, 'AI analysis performed for Onion', '2025-09-22 16:11:17'),
(297, 11, 'Updated expiry date for food item ID 31 to 2025-09-26', '2025-09-22 16:11:17'),
(298, 11, 'Updated expiry date for food item ID 32 to 2025-09-26', '2025-09-22 16:11:17'),
(299, 11, 'Updated expiry date for food item ID 33 to 2025-09-26', '2025-09-22 16:11:17'),
(300, 11, 'User logged in successfully', '2025-09-22 23:23:25'),
(301, 11, 'User logged in successfully', '2025-09-22 23:36:34'),
(302, 11, 'Resolved alert ID: 2', '2025-09-23 00:17:44'),
(303, 11, 'AI analysis performed for Ponkan', '2025-09-23 00:49:36'),
(304, 11, 'Created High alert: SmartSense: Ponkan is UNSAFE', '2025-09-23 00:49:36'),
(305, 11, 'AI analysis performed for Ponkan', '2025-09-23 00:49:38'),
(306, 11, 'Updated expiry date for food item ID 35 to 2025-09-23', '2025-09-23 00:49:38'),
(307, 11, 'Updated expiry date for food item ID 36 to 2025-09-23', '2025-09-23 00:49:38'),
(308, 11, 'Updated expiry date for food item ID 34 to 2025-09-23', '2025-09-23 00:49:38'),
(309, 11, 'Resolved alert ID: 16', '2025-09-23 00:51:32'),
(310, 11, 'ML prediction performed for Ponkan (unsafe)', '2025-09-23 01:04:15'),
(311, 11, 'Created High alert: SmartSense: Ponkan is UNSAFE', '2025-09-23 01:04:15'),
(312, 11, 'ML prediction performed for Ponkan (unsafe)', '2025-09-23 01:27:29'),
(313, 11, 'Created High alert: SmartSense: Ponkan is UNSAFE', '2025-09-23 01:27:29'),
(314, 11, 'ML prediction performed for Ponkan (unsafe)', '2025-09-23 01:32:39'),
(315, 11, 'Created High alert: SmartSense: Ponkan is UNSAFE', '2025-09-23 01:32:39'),
(316, 11, 'Resolved alert ID: 21', '2025-09-23 01:33:07'),
(317, 11, 'Resolved alert ID: 22', '2025-09-23 01:33:08'),
(318, 11, 'Resolved alert ID: 19', '2025-09-23 01:33:08'),
(319, 11, 'Resolved alert ID: 20', '2025-09-23 01:33:09'),
(320, 11, 'Resolved alert ID: 17', '2025-09-23 01:33:09'),
(321, 11, 'Resolved alert ID: 18', '2025-09-23 01:33:10'),
(322, 11, 'User logged out', '2025-09-23 01:51:56'),
(323, 11, 'User logged in successfully', '2025-09-23 01:52:00'),
(324, 11, 'User logged out', '2025-09-23 02:33:31'),
(325, 11, 'User logged out', '2025-09-23 04:05:29'),
(326, 11, 'User logged out', '2025-09-23 04:34:22'),
(327, 11, 'User logged in successfully', '2025-09-23 04:39:51'),
(328, 11, 'User logged out', '2025-09-23 04:42:29'),
(329, 11, 'User logged out', '2025-09-23 04:42:29'),
(330, 11, 'User logged in successfully', '2025-09-23 04:45:04'),
(331, 11, 'User logged out', '2025-09-23 04:45:07'),
(332, 11, 'User logged out', '2025-09-23 04:45:07'),
(333, 11, 'User logged in successfully', '2025-09-23 04:45:10'),
(334, 11, 'User logged out', '2025-09-23 04:45:19'),
(335, 11, 'User logged out', '2025-09-23 04:45:19'),
(336, 26, 'Admin logged in successfully', '2025-09-23 04:45:43'),
(337, 26, 'Admin generated new users report', '2025-09-23 04:48:47'),
(338, 26, 'Admin generated top spoiling foods report', '2025-09-23 04:48:53'),
(339, 26, 'Admin generated top spoiling foods report', '2025-09-23 04:48:58'),
(340, 26, 'Admin generated most used sensor report', '2025-09-23 04:49:15'),
(341, 26, 'Admin generated most used sensor report', '2025-09-23 04:49:46'),
(342, 26, 'Admin generated new users report', '2025-09-23 04:50:00'),
(343, 26, 'Admin generated new users report', '2025-09-23 04:50:05'),
(344, 26, 'Admin generated new users report', '2025-09-23 04:50:08'),
(345, 26, 'Admin logged in successfully', '2025-09-23 05:38:46'),
(346, 26, 'Admin generated new users report', '2025-09-23 08:23:40'),
(347, 26, 'Admin generated new users report', '2025-09-23 08:23:48'),
(348, 26, 'Admin generated new users report', '2025-09-23 08:23:54'),
(349, 26, 'Admin generated new users report', '2025-09-23 08:23:57'),
(350, 26, 'Admin generated new users report', '2025-09-23 08:24:01'),
(351, 26, 'Admin generated new users report', '2025-09-23 08:24:04'),
(352, 26, 'Admin generated new users report', '2025-09-23 08:24:07'),
(353, 26, 'Admin generated new users report', '2025-09-23 08:24:09'),
(354, 26, 'Admin generated top spoiling foods report', '2025-09-23 08:24:15'),
(355, 26, 'Admin generated top spoiling foods report', '2025-09-23 08:24:25'),
(356, 26, 'Admin generated top spoiling foods report', '2025-09-23 08:24:37'),
(357, 26, 'Admin generated top spoiling foods report', '2025-09-23 08:24:47'),
(358, 26, 'Admin generated top spoiling foods report', '2025-09-23 08:24:53'),
(359, 26, 'Admin generated most used sensor report', '2025-09-23 08:24:57'),
(360, 26, 'Admin generated most used sensor report', '2025-09-23 08:26:57'),
(361, 26, 'Admin logged in successfully', '2025-09-23 09:13:51'),
(362, 26, 'Admin generated new users report', '2025-09-23 09:18:35'),
(363, 26, 'Admin generated new users report', '2025-09-23 09:18:39'),
(364, 26, 'Admin generated new users report', '2025-09-23 09:18:42'),
(365, 26, 'Admin generated new users report', '2025-09-23 09:18:45'),
(366, 26, 'Admin generated new users report', '2025-09-23 09:18:55'),
(367, 26, 'Admin generated new users report', '2025-09-23 09:19:00'),
(368, 26, 'Admin generated new users report', '2025-09-23 09:36:00'),
(369, 26, 'Admin generated new users report', '2025-09-23 09:36:05'),
(370, 26, 'Admin generated new users report', '2025-09-23 09:36:08'),
(371, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:41:16'),
(372, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:41:27'),
(373, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:44:24'),
(374, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:44:28'),
(375, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:45:16'),
(376, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:45:40'),
(377, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:45:41'),
(378, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:45:43'),
(379, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:45:45'),
(380, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:53:15'),
(381, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:53:17'),
(382, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:53:23'),
(383, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:53:24'),
(384, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:53:26'),
(385, 26, 'Admin generated top spoiling foods report', '2025-09-23 09:53:34'),
(386, 26, 'Admin generated new users report', '2025-09-23 13:11:50'),
(387, 26, 'Admin generated top spoiling foods report', '2025-09-23 13:11:52'),
(388, 26, 'Admin viewed user 23 details', '2025-09-23 14:41:33'),
(389, 26, 'Admin logged in successfully', '2025-09-23 15:37:56'),
(390, 26, 'Admin generated new users report', '2025-09-23 16:50:05'),
(391, 26, 'Admin generated new users report', '2025-09-23 16:58:56'),
(392, 26, 'Admin generated top spoiling foods report', '2025-09-23 16:59:05'),
(393, 26, 'Admin generated new users report', '2025-09-23 17:08:27'),
(394, 26, 'User logged out', '2025-09-23 17:42:50'),
(395, 11, 'User logged in successfully', '2025-09-23 17:42:58'),
(396, 11, 'User logged out', '2025-09-23 17:43:10'),
(397, 11, 'User logged out', '2025-09-23 17:43:10'),
(398, 26, 'Admin logged in successfully', '2025-09-23 17:43:13'),
(399, 26, 'User logged out', '2025-09-23 17:49:37'),
(400, 11, 'User logged in successfully', '2025-09-23 17:49:41'),
(401, 11, 'User logged in successfully', '2025-09-23 23:49:02'),
(402, 11, 'User logged out', '2025-09-23 23:49:10'),
(403, 11, 'User logged out', '2025-09-23 23:49:10'),
(404, 26, 'Admin logged in successfully', '2025-09-23 23:49:27'),
(405, 26, 'User logged out', '2025-09-24 00:37:59'),
(406, 11, 'User logged in successfully', '2025-09-24 00:38:01'),
(407, 11, 'User logged out', '2025-09-24 00:40:11'),
(408, 11, 'User logged out', '2025-09-24 00:40:11'),
(409, 11, 'User logged in successfully', '2025-09-24 00:40:14'),
(410, 11, 'ML prediction performed for Ponkan (unsafe)', '2025-09-24 00:40:37'),
(411, 11, 'Created High alert: SmartSense: Ponkan is UNSAFE', '2025-09-24 00:40:37'),
(412, 11, 'User logged out', '2025-09-24 00:40:56'),
(413, 11, 'User logged out', '2025-09-24 00:40:56'),
(414, 26, 'Admin logged in successfully', '2025-09-24 00:41:00'),
(415, 26, 'User logged out', '2025-09-24 00:59:48'),
(416, 11, 'User logged in successfully', '2025-09-24 00:59:51'),
(417, 11, 'ML prediction performed for Ponkan (unsafe)', '2025-09-24 01:01:51'),
(418, 11, 'Created High alert: SmartSense: Ponkan is UNSAFE', '2025-09-24 01:01:51'),
(419, 11, 'User logged out', '2025-09-24 01:02:20'),
(420, 11, 'User logged out', '2025-09-24 01:02:20'),
(421, 26, 'Admin logged in successfully', '2025-09-24 01:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `alert_id` int(11) NOT NULL,
  `sensor_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `alert_level` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `alert_type` enum('sensor','spoilage','ml_prediction','system') DEFAULT 'sensor',
  `ml_prediction_id` int(11) DEFAULT NULL,
  `spoilage_probability` decimal(5,2) DEFAULT NULL COMMENT 'ML spoilage probability 0-100',
  `recommended_action` text DEFAULT NULL,
  `is_ml_generated` tinyint(1) DEFAULT 0,
  `confidence_score` decimal(5,2) DEFAULT NULL COMMENT 'ML confidence 0-100',
  `alert_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional ML prediction data' CHECK (json_valid(`alert_data`)),
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `resolved_by` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alerts`
--

INSERT INTO `alerts` (`alert_id`, `sensor_id`, `user_id`, `food_id`, `message`, `alert_level`, `alert_type`, `ml_prediction_id`, `spoilage_probability`, `recommended_action`, `is_ml_generated`, `confidence_score`, `alert_data`, `is_resolved`, `resolved_at`, `resolved_by`, `timestamp`) VALUES
(1, NULL, 11, 1, 'ML Prediction: Banana may be unsafe (50% probability)', 'High', 'ml_prediction', 1, 50.00, NULL, 1, 85.00, NULL, 1, '2025-09-23 00:17:27', 11, '2025-09-22 14:06:59'),
(2, NULL, 11, NULL, 'SmartSense: Banana is UNSAFE', 'High', '', NULL, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-22T14:44:24.082Z\"}', 1, '2025-09-23 00:17:44', 11, '2025-09-22 14:44:24'),
(3, NULL, 11, NULL, 'SmartSense: Apple is UNSAFE', 'High', '', NULL, 95.00, 'Discard immediately and sanitize storage area.', 0, 95.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T22:52:24.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":91,\"unit\":\"%\",\"timestamp\":\"2025-09-22T22:52:24.000Z\",\"status\":\"online\"},\"gas\":{\"value\":60,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T22:52:24.000Z\",\"status\":\"online\"}},\"spoilage_score\":95,\"timestamp\":\"2025-09-22T14:52:28.374Z\"}', 1, '2025-09-23 00:16:30', 11, '2025-09-22 14:52:28'),
(4, NULL, 11, NULL, 'SmartSense: Apple is UNSAFE', 'High', '', NULL, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-22T14:53:36.839Z\"}', 1, '2025-09-23 00:16:00', 11, '2025-09-22 14:53:36'),
(5, NULL, 11, NULL, 'SmartSense: Banana is UNSAFE', 'High', '', NULL, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-22T14:58:46.826Z\"}', 1, '2025-09-23 00:14:04', 11, '2025-09-22 14:58:46'),
(6, NULL, 11, NULL, 'SmartSense: Orange is UNSAFE', 'High', '', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T23:13:01.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":91,\"unit\":\"%\",\"timestamp\":\"2025-09-22T23:13:01.000Z\",\"status\":\"online\"},\"gas\":{\"value\":63,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T23:13:01.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T15:13:05.522Z\"}', 1, '2025-09-23 00:13:47', 11, '2025-09-22 15:13:05'),
(7, NULL, 11, NULL, 'SmartSense: Eggplant is UNSAFE', 'High', '', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.5,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T23:18:32.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":91,\"unit\":\"%\",\"timestamp\":\"2025-09-22T23:18:32.000Z\",\"status\":\"online\"},\"gas\":{\"value\":68,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T23:18:32.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T15:18:36.211Z\"}', 1, '2025-09-23 00:10:03', 11, '2025-09-22 15:18:36'),
(8, 13, 11, NULL, 'SmartSense: Sayote is UNSAFE', 'High', '', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.5,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T23:28:13.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":90.69999694824219,\"unit\":\"%\",\"timestamp\":\"2025-09-22T23:28:13.000Z\",\"status\":\"online\"},\"gas\":{\"value\":73,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T23:28:13.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T15:28:17.924Z\"}', 1, '2025-09-23 00:09:56', 11, '2025-09-22 15:28:18'),
(9, 13, 11, NULL, 'SmartSense: Cabbage is UNSAFE', 'High', '', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.5,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T23:32:14.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":90.5,\"unit\":\"%\",\"timestamp\":\"2025-09-22T23:32:14.000Z\",\"status\":\"online\"},\"gas\":{\"value\":74,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T23:32:14.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T15:32:18.022Z\"}', 1, '2025-09-22 23:53:43', 11, '2025-09-22 15:32:18'),
(10, NULL, 11, NULL, 'SmartSense: Grape is UNSAFE', 'High', '', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T23:39:24.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":88.19999694824219,\"unit\":\"%\",\"timestamp\":\"2025-09-22T23:39:24.000Z\",\"status\":\"online\"},\"gas\":{\"value\":65,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T23:39:24.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T15:39:27.821Z\"}', 1, '2025-09-22 23:23:38', 11, '2025-09-22 15:39:27'),
(11, NULL, 11, NULL, 'SmartSense: Blue Berry is UNSAFE', 'High', '', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T23:44:33.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":88.0999984741211,\"unit\":\"%\",\"timestamp\":\"2025-09-22T23:44:33.000Z\",\"status\":\"online\"},\"gas\":{\"value\":63,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T23:44:33.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T15:44:36.358Z\"}', 1, '2025-09-22 23:23:45', 11, '2025-09-22 15:44:36'),
(12, NULL, 11, 22, 'SmartSense: Blue Berry is UNSAFE', 'High', '', 19, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-22T15:45:37.458Z\"}', 1, '2025-09-22 23:23:33', 11, '2025-09-22 15:45:37'),
(13, NULL, 11, NULL, 'SmartSense: Garlic is UNSAFE', 'High', '', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.299999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-09-22T23:56:48.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":87.69999694824219,\"unit\":\"%\",\"timestamp\":\"2025-09-22T23:56:48.000Z\",\"status\":\"online\"},\"gas\":{\"value\":61,\"unit\":\"ppm\",\"timestamp\":\"2025-09-22T23:56:48.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T15:56:52.461Z\"}', 1, '2025-09-22 23:23:36', 11, '2025-09-22 15:56:52'),
(14, NULL, 11, NULL, 'SmartSense: Mango is UNSAFE', 'High', 'sensor', NULL, 95.00, 'Discard immediately and sanitize storage area.', 0, 95.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-09-23T00:02:36.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":87.80000305175781,\"unit\":\"%\",\"timestamp\":\"2025-09-23T00:02:36.000Z\",\"status\":\"online\"},\"gas\":{\"value\":60,\"unit\":\"ppm\",\"timestamp\":\"2025-09-23T00:02:36.000Z\",\"status\":\"online\"}},\"spoilage_score\":95,\"timestamp\":\"2025-09-22T16:02:39.782Z\"}', 1, '2025-09-22 23:23:37', 11, '2025-09-22 16:02:39'),
(15, NULL, 11, 31, 'SmartSense: Onion is UNSAFE', 'High', 'sensor', NULL, 100.00, 'Discard immediately and sanitize storage area.', 0, 100.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.299999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-09-23T00:11:10.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":87.5,\"unit\":\"%\",\"timestamp\":\"2025-09-23T00:11:10.000Z\",\"status\":\"online\"},\"gas\":{\"value\":63,\"unit\":\"ppm\",\"timestamp\":\"2025-09-23T00:11:10.000Z\",\"status\":\"online\"}},\"spoilage_score\":100,\"timestamp\":\"2025-09-22T16:11:15.161Z\"}', 1, '2025-09-22 16:12:32', 11, '2025-09-22 16:11:15'),
(16, NULL, 11, 36, 'SmartSense: Ponkan is UNSAFE', 'High', 'sensor', NULL, 95.00, 'Discard immediately and sanitize storage area.', 0, 95.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.299999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-09-23T08:49:33.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":87.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-09-23T08:49:33.000Z\",\"status\":\"online\"},\"gas\":{\"value\":58,\"unit\":\"ppm\",\"timestamp\":\"2025-09-23T08:49:33.000Z\",\"status\":\"online\"}},\"spoilage_score\":95,\"timestamp\":\"2025-09-23T00:49:36.542Z\"}', 1, '2025-09-23 00:51:32', 11, '2025-09-23 00:49:36'),
(17, NULL, 11, 34, 'ML Prediction: Ponkan may be unsafe (50% probability)', 'High', 'ml_prediction', 24, 50.00, 'Discard immediately and sanitize storage area.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":28.399999618530273,\"humidity\":85.30000305175781,\"gas_level\":25},\"prediction_id\":24,\"recommendations\":{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\"]},\"timestamp\":\"2025-09-23T01:04:15.007Z\"}', 1, '2025-09-23 01:33:09', 11, '2025-09-23 01:04:15'),
(18, NULL, 11, 34, 'SmartSense: Ponkan is UNSAFE', 'High', 'sensor', 24, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-23T01:04:15.024Z\"}', 1, '2025-09-23 01:33:10', 11, '2025-09-23 01:04:15'),
(19, NULL, 11, 35, 'ML Prediction: Ponkan may be unsafe (50% probability)', 'High', 'ml_prediction', 25, 50.00, 'Discard immediately and sanitize storage area.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":28.600000381469727,\"humidity\":85.5999984741211,\"gas_level\":33},\"prediction_id\":25,\"recommendations\":{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]},\"timestamp\":\"2025-09-23T01:27:29.419Z\"}', 1, '2025-09-23 01:33:08', 11, '2025-09-23 01:27:29'),
(20, NULL, 11, 35, 'SmartSense: Ponkan is UNSAFE', 'High', 'sensor', 25, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-23T01:27:29.451Z\"}', 1, '2025-09-23 01:33:09', 11, '2025-09-23 01:27:29'),
(21, NULL, 11, 35, 'ML Prediction: Ponkan may be unsafe (50% probability)', 'High', 'ml_prediction', 26, 50.00, 'Discard immediately and sanitize storage area.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":28.600000381469727,\"humidity\":85.30000305175781,\"gas_level\":33},\"prediction_id\":26,\"recommendations\":{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]},\"timestamp\":\"2025-09-23T01:32:39.342Z\"}', 1, '2025-09-23 01:33:07', 11, '2025-09-23 01:32:39'),
(22, NULL, 11, 35, 'SmartSense: Ponkan is UNSAFE', 'High', 'sensor', 26, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-23T01:32:39.361Z\"}', 1, '2025-09-23 01:33:08', 11, '2025-09-23 01:32:39'),
(23, NULL, 11, 34, 'ML Prediction: Ponkan may be unsafe (50% probability)', 'High', 'ml_prediction', 27, 50.00, 'Discard immediately and sanitize storage area.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":25.100000381469727,\"humidity\":89.5,\"gas_level\":75},\"prediction_id\":27,\"recommendations\":{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]},\"timestamp\":\"2025-09-24T00:40:37.782Z\"}', 0, NULL, NULL, '2025-09-24 00:40:37'),
(24, NULL, 11, 34, 'SmartSense: Ponkan is UNSAFE', 'High', 'sensor', 27, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-24T00:40:37.811Z\"}', 0, NULL, NULL, '2025-09-24 00:40:37'),
(25, NULL, 11, 34, 'ML Prediction: Ponkan may be unsafe (50% probability)', 'High', 'ml_prediction', 28, 50.00, 'Discard immediately and sanitize storage area.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":26.100000381469727,\"humidity\":83.5,\"gas_level\":46},\"prediction_id\":28,\"recommendations\":{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]},\"timestamp\":\"2025-09-24T01:01:51.030Z\"}', 0, NULL, NULL, '2025-09-24 01:01:51'),
(26, NULL, 11, 34, 'SmartSense: Ponkan is UNSAFE', 'High', 'sensor', 28, 50.00, 'Discard immediately and sanitize storage area.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-09-24T01:01:51.044Z\"}', 0, NULL, NULL, '2025-09-24 01:01:51');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `feedback_type` enum('General Feedback','Device Issue','System Bug','Sensor Problem','App Crash','Performance Issue','Other') DEFAULT 'General Feedback',
  `priority` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `feedback_text` text NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(150) DEFAULT NULL,
  `star_rating` int(11) DEFAULT NULL,
  `sentiment` enum('Positive','Negative','Neutral') DEFAULT NULL,
  `status` enum('Active','Resolved','Archived') DEFAULT 'Active',
  `admin_notes` text DEFAULT NULL,
  `response_text` text DEFAULT NULL,
  `response_date` timestamp NULL DEFAULT NULL,
  `resolved_by` int(11) DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`feedback_id`, `user_id`, `feedback_type`, `priority`, `feedback_text`, `customer_name`, `customer_email`, `star_rating`, `sentiment`, `status`, `admin_notes`, `response_text`, `response_date`, `resolved_by`, `resolved_at`, `created_at`, `updated_at`) VALUES
(1, 11, 'Performance Issue', 'High', 'slow and lags', 'Mark Laurence', 'marktiktok525@gmail.com', 5, 'Positive', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-09-21 03:49:54', '2025-09-21 03:49:54'),
(2, 11, 'Device Issue', 'Low', 'my device is not working\n', 'Mark Laurence', 'marktiktok525@gmail.com', 5, 'Positive', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-09-21 23:58:24', '2025-09-21 23:58:24'),
(3, 11, 'Device Issue', 'Low', 'slow ', 'Mark Laurence', 'marktiktok525@gmail.com', NULL, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-09-22 00:16:07', '2025-09-22 00:16:07'),
(4, 11, 'General Feedback', 'Low', 'slow and not acurate\n', 'Mark Laurence', 'marktiktok525@gmail.com', 3, 'Neutral', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-09-22 00:22:57', '2025-09-22 00:22:57');

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `food_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `sensor_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `scan_status` enum('pending','scanned','analyzed','completed') DEFAULT 'pending',
  `scan_timestamp` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`food_id`, `name`, `category`, `expiration_date`, `sensor_id`, `user_id`, `scan_status`, `scan_timestamp`, `created_at`, `updated_at`) VALUES
(1, 'Banana', 'Fruits', '2025-09-22', 13, 11, 'analyzed', '2025-09-22 06:06:59', '2025-09-22 14:06:56', '2025-09-22 14:30:20'),
(2, 'Banana', 'Fruits', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 14:06:56', '2025-09-22 14:06:56', '2025-09-22 14:07:01'),
(3, 'Banana', 'Fruits', '2025-09-22', 15, 11, 'analyzed', '2025-09-22 14:06:56', '2025-09-22 14:06:56', '2025-09-22 14:58:46'),
(4, 'Apple', 'Fruits', '2025-09-22', 13, 11, 'analyzed', '2025-09-22 14:52:25', '2025-09-22 14:52:25', '2025-09-22 14:53:36'),
(5, 'Apple', 'Fruits', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 14:52:25', '2025-09-22 14:52:25', '2025-09-22 14:52:29'),
(6, 'Apple', 'Fruits', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 06:52:28', '2025-09-22 14:52:25', '2025-09-22 14:52:29'),
(7, 'Orange', 'Fruits', '2025-09-23', 13, 11, 'analyzed', '2025-09-22 07:13:05', '2025-09-22 15:13:02', '2025-09-22 15:13:07'),
(8, 'Orange', 'Fruits', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 15:13:02', '2025-09-22 15:13:02', '2025-09-22 15:13:07'),
(9, 'Orange', 'Fruits', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 15:13:02', '2025-09-22 15:13:02', '2025-09-22 15:13:07'),
(10, 'Eggplant', 'Vegetables', '2025-09-23', 13, 11, 'analyzed', '2025-09-22 07:18:36', '2025-09-22 15:18:33', '2025-09-22 15:18:37'),
(11, 'Eggplant', 'Vegetables', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 15:18:33', '2025-09-22 15:18:33', '2025-09-22 15:18:37'),
(12, 'Eggplant', 'Vegetables', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 15:18:33', '2025-09-22 15:18:33', '2025-09-22 15:18:37'),
(13, 'Sayote', 'Vegetables', '2025-09-23', 13, 11, 'analyzed', '2025-09-22 07:28:18', '2025-09-22 15:28:15', '2025-09-22 15:28:19'),
(14, 'Sayote', 'Vegetables', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 15:28:15', '2025-09-22 15:28:15', '2025-09-22 15:28:19'),
(15, 'Sayote', 'Vegetables', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 15:28:15', '2025-09-22 15:28:15', '2025-09-22 15:28:19'),
(16, 'Cabbage', 'Vegetables', '2025-09-23', 13, 11, 'analyzed', '2025-09-22 07:32:18', '2025-09-22 15:32:16', '2025-09-22 15:32:19'),
(17, 'Cabbage', 'Vegetables', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 15:32:16', '2025-09-22 15:32:16', '2025-09-22 15:32:19'),
(18, 'Cabbage', 'Vegetables', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 15:32:16', '2025-09-22 15:32:16', '2025-09-22 15:32:19'),
(19, 'Grape', 'Fruits', '2025-09-23', 13, 11, 'analyzed', '2025-09-22 07:39:27', '2025-09-22 15:39:25', '2025-09-22 15:39:29'),
(20, 'Grape', 'Fruits', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 15:39:25', '2025-09-22 15:39:25', '2025-09-22 15:39:29'),
(21, 'Grape', 'Fruits', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 15:39:25', '2025-09-22 15:39:25', '2025-09-22 15:39:29'),
(22, 'Blue Berry', 'Fruits', '2025-09-22', 13, 11, 'analyzed', '2025-09-22 07:44:36', '2025-09-22 15:44:33', '2025-09-22 15:45:37'),
(23, 'Blue Berry', 'Fruits', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 15:44:33', '2025-09-22 15:44:33', '2025-09-22 15:44:37'),
(24, 'Blue Berry', 'Fruits', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 15:44:33', '2025-09-22 15:44:33', '2025-09-22 15:44:37'),
(25, 'Garlic', 'Vegetables', '2025-09-25', 13, 11, 'analyzed', '2025-09-22 07:56:52', '2025-09-22 15:56:50', '2025-09-22 15:56:54'),
(26, 'Garlic', 'Vegetables', '2025-09-25', 14, 11, 'analyzed', '2025-09-22 15:56:50', '2025-09-22 15:56:50', '2025-09-22 15:56:54'),
(27, 'Garlic', 'Vegetables', '2025-09-25', 15, 11, 'analyzed', '2025-09-22 15:56:50', '2025-09-22 15:56:50', '2025-09-22 15:56:54'),
(28, 'Mango', 'Fruits', '2025-09-23', 13, 11, 'analyzed', '2025-09-22 08:02:39', '2025-09-22 16:02:37', '2025-09-22 16:02:39'),
(29, 'Mango', 'Fruits', '2025-09-23', 14, 11, 'analyzed', '2025-09-22 16:02:37', '2025-09-22 16:02:37', '2025-09-22 16:02:41'),
(30, 'Mango', 'Fruits', '2025-09-23', 15, 11, 'analyzed', '2025-09-22 16:02:37', '2025-09-22 16:02:37', '2025-09-22 16:02:41'),
(31, 'Onion', 'Vegetables', '2025-09-26', 13, 11, 'analyzed', '2025-09-22 08:11:15', '2025-09-22 16:11:13', '2025-09-22 16:11:17'),
(32, 'Onion', 'Vegetables', '2025-09-26', 14, 11, 'analyzed', '2025-09-22 16:11:13', '2025-09-22 16:11:13', '2025-09-22 16:11:17'),
(33, 'Onion', 'Vegetables', '2025-09-26', 15, 11, 'analyzed', '2025-09-22 16:11:13', '2025-09-22 16:11:13', '2025-09-22 16:11:17'),
(34, 'Ponkan', 'Fruits', '2025-09-24', 13, 11, 'analyzed', '2025-09-22 16:49:36', '2025-09-23 00:49:35', '2025-09-24 01:01:51'),
(35, 'Ponkan', 'Fruits', '2025-09-23', 14, 11, 'analyzed', '2025-09-23 00:49:35', '2025-09-23 00:49:35', '2025-09-23 01:32:39'),
(36, 'Ponkan', 'Fruits', '2025-09-23', 15, 11, 'analyzed', '2025-09-23 00:49:35', '2025-09-23 00:49:35', '2025-09-23 00:49:38');

-- --------------------------------------------------------

--
-- Table structure for table `food_scan_sessions`
--

CREATE TABLE `food_scan_sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  `food_items_count` int(11) DEFAULT 0,
  `ml_predictions_count` int(11) DEFAULT 0,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `session_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Session metadata' CHECK (json_valid(`session_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_scan_sessions`
--

INSERT INTO `food_scan_sessions` (`session_id`, `user_id`, `session_token`, `status`, `food_items_count`, `ml_predictions_count`, `started_at`, `completed_at`, `session_data`) VALUES
(1, 11, 'scan_1758550006948_klfcts', 'completed', 0, 0, '2025-09-22 14:06:46', '2025-09-22 14:07:01', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:06:46.943Z\",\"source\":\"food_selection\"}'),
(2, 11, 'scan_1758550038906_02ucft', 'completed', 0, 0, '2025-09-22 14:07:18', '2025-09-22 14:07:18', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:07:18.901Z\"}'),
(3, 11, 'scan_1758550038918_wa3pde', 'completed', 0, 0, '2025-09-22 14:07:18', '2025-09-22 14:07:18', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:07:18.903Z\"}'),
(4, 11, 'scan_1758550038931_0mmq21', 'completed', 0, 0, '2025-09-22 14:07:18', '2025-09-22 14:07:18', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:07:18.903Z\"}'),
(5, 11, 'scan_1758550038940_7kn0hn', 'completed', 0, 0, '2025-09-22 14:07:18', '2025-09-22 14:07:18', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:07:18.904Z\"}'),
(6, 11, 'scan_1758550038953_metkov', 'completed', 0, 0, '2025-09-22 14:07:18', '2025-09-22 14:08:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:07:18.904Z\"}'),
(7, 11, 'scan_1758550101676_3cqmkg', 'completed', 0, 0, '2025-09-22 14:08:21', '2025-09-22 14:08:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:08:21.670Z\"}'),
(8, 11, 'scan_1758550101677_4vkien', 'completed', 0, 0, '2025-09-22 14:08:21', '2025-09-22 14:08:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:08:21.671Z\"}'),
(9, 11, 'scan_1758550101687_klxc0w', 'completed', 0, 0, '2025-09-22 14:08:21', '2025-09-22 14:08:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:08:21.672Z\"}'),
(10, 11, 'scan_1758550101694_nhk4sn', 'completed', 0, 0, '2025-09-22 14:08:21', '2025-09-22 14:08:23', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:08:21.672Z\"}'),
(11, 11, 'scan_1758550772663_lecsda', 'completed', 0, 0, '2025-09-22 14:19:32', '2025-09-22 14:23:18', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:19:32.651Z\"}'),
(12, 11, 'scan_1758550772663_pgrd0u', 'completed', 0, 0, '2025-09-22 14:19:32', '2025-09-22 14:19:49', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:19:32.652Z\"}'),
(13, 11, 'scan_1758550772663_v32pz0', 'completed', 0, 0, '2025-09-22 14:19:32', '2025-09-22 14:23:18', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:19:32.652Z\"}'),
(14, 11, 'scan_1758550772663_qdf9yr', 'completed', 0, 0, '2025-09-22 14:19:32', '2025-09-22 14:23:18', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:19:32.652Z\"}'),
(15, 11, 'scan_1758550998436_xctquo', 'completed', 0, 0, '2025-09-22 14:23:18', '2025-09-22 14:24:55', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:23:18.416Z\"}'),
(16, 11, 'scan_1758550998441_9gqlzt', 'completed', 0, 0, '2025-09-22 14:23:18', '2025-09-22 14:23:34', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:23:18.416Z\"}'),
(17, 11, 'scan_1758550998442_sq2mlz', 'completed', 0, 0, '2025-09-22 14:23:18', '2025-09-22 14:24:55', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:23:18.416Z\"}'),
(18, 11, 'scan_1758550998442_wrdj7i', 'completed', 0, 0, '2025-09-22 14:23:18', '2025-09-22 14:24:55', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:23:18.417Z\"}'),
(19, 11, 'scan_1758551095804_im96cb', 'completed', 0, 0, '2025-09-22 14:24:55', '2025-09-22 14:30:04', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:24:55.778Z\"}'),
(20, 11, 'scan_1758551095810_2l90bm', 'completed', 0, 0, '2025-09-22 14:24:55', '2025-09-22 14:25:12', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:24:55.778Z\"}'),
(21, 11, 'scan_1758551095811_11efs7', 'completed', 0, 0, '2025-09-22 14:24:55', '2025-09-22 14:30:04', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:24:55.778Z\"}'),
(22, 11, 'scan_1758551095811_6li67p', 'completed', 0, 0, '2025-09-22 14:24:55', '2025-09-22 14:30:04', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:24:55.779Z\"}'),
(23, 11, 'scan_1758551404776_uomd2h', 'completed', 0, 0, '2025-09-22 14:30:04', '2025-09-22 14:33:30', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:30:04.746Z\"}'),
(24, 11, 'scan_1758551404782_uuudhf', 'completed', 0, 0, '2025-09-22 14:30:04', '2025-09-22 14:30:20', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:30:04.746Z\"}'),
(25, 11, 'scan_1758551404783_fqt4en', 'completed', 0, 0, '2025-09-22 14:30:04', '2025-09-22 14:33:30', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:30:04.747Z\"}'),
(26, 11, 'scan_1758551404783_4kkl9w', 'completed', 0, 0, '2025-09-22 14:30:04', '2025-09-22 14:33:30', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:30:04.748Z\"}'),
(27, 11, 'scan_1758551610782_djc404', 'completed', 0, 0, '2025-09-22 14:33:30', '2025-09-22 14:38:45', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:33:30.732Z\"}'),
(28, 11, 'scan_1758551610790_c3p003', 'completed', 0, 0, '2025-09-22 14:33:30', '2025-09-22 14:33:43', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:33:30.733Z\"}'),
(29, 11, 'scan_1758551610791_1ajfh7', 'completed', 0, 0, '2025-09-22 14:33:30', '2025-09-22 14:38:45', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:33:30.733Z\"}'),
(30, 11, 'scan_1758551610792_kp58yk', 'completed', 0, 0, '2025-09-22 14:33:30', '2025-09-22 14:38:45', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:33:30.735Z\"}'),
(31, 11, 'scan_1758551925559_m28t6o', 'completed', 0, 0, '2025-09-22 14:38:45', '2025-09-22 14:44:10', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:38:45.531Z\"}'),
(32, 11, 'scan_1758551925561_ej276z', 'completed', 0, 0, '2025-09-22 14:38:45', '2025-09-22 14:39:00', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:38:45.532Z\"}'),
(33, 11, 'scan_1758551925562_v7b378', 'completed', 0, 0, '2025-09-22 14:38:45', '2025-09-22 14:44:10', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:38:45.533Z\"}'),
(34, 11, 'scan_1758551925562_hf4h8i', 'completed', 0, 0, '2025-09-22 14:38:45', '2025-09-22 14:44:10', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:38:45.535Z\"}'),
(35, 11, 'scan_1758552250219_igpfxr', 'completed', 0, 0, '2025-09-22 14:44:10', '2025-09-22 14:52:15', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:44:10.176Z\"}'),
(36, 11, 'scan_1758552250223_24bg5e', 'completed', 0, 0, '2025-09-22 14:44:10', '2025-09-22 14:44:24', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:44:10.177Z\"}'),
(37, 11, 'scan_1758552250224_dy2iod', 'completed', 0, 0, '2025-09-22 14:44:10', '2025-09-22 14:52:15', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:44:10.177Z\"}'),
(38, 11, 'scan_1758552250225_m6p1ny', 'completed', 0, 0, '2025-09-22 14:44:10', '2025-09-22 14:52:15', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:44:10.179Z\"}'),
(39, 11, 'scan_1758552735907_ngvwey', 'completed', 0, 0, '2025-09-22 14:52:15', '2025-09-22 14:52:29', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:52:15.891Z\",\"source\":\"food_selection\"}'),
(40, 11, 'scan_1758552801798_zfj2t6', 'completed', 0, 0, '2025-09-22 14:53:21', '2025-09-22 14:53:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:53:21.795Z\"}'),
(41, 11, 'scan_1758552801799_sgcgfm', 'completed', 0, 0, '2025-09-22 14:53:21', '2025-09-22 14:53:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:53:21.796Z\"}'),
(42, 11, 'scan_1758552801799_zpazbr', 'completed', 0, 0, '2025-09-22 14:53:21', '2025-09-22 14:53:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:53:21.796Z\"}'),
(43, 11, 'scan_1758552801809_uc15mn', 'completed', 0, 0, '2025-09-22 14:53:21', '2025-09-22 14:58:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:53:21.796Z\"}'),
(44, 11, 'scan_1758552801812_v3tya7', 'completed', 0, 0, '2025-09-22 14:53:21', '2025-09-22 14:58:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:53:21.797Z\"}'),
(45, 11, 'scan_1758553113732_0i1trr', 'completed', 0, 0, '2025-09-22 14:58:33', '2025-09-22 14:58:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:58:33.725Z\"}'),
(46, 11, 'scan_1758553113733_ynouc6', 'completed', 0, 0, '2025-09-22 14:58:33', '2025-09-22 14:58:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:58:33.725Z\"}'),
(47, 11, 'scan_1758553113734_0qcoph', 'completed', 0, 0, '2025-09-22 14:58:33', '2025-09-22 14:58:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:58:33.727Z\"}'),
(48, 11, 'scan_1758553113746_h6yx9u', 'completed', 0, 0, '2025-09-22 14:58:33', '2025-09-22 15:12:53', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T14:58:33.728Z\"}'),
(49, 11, 'scan_1758553973458_cw7i3p', 'completed', 0, 0, '2025-09-22 15:12:53', '2025-09-22 15:13:07', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:12:53.439Z\",\"source\":\"food_selection\"}'),
(50, 11, 'scan_1758554301190_0gwui7', 'completed', 0, 0, '2025-09-22 15:18:21', '2025-09-22 15:18:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:18:21.181Z\",\"source\":\"food_selection\"}'),
(51, 11, 'scan_1758554883643_if50vp', 'completed', 0, 0, '2025-09-22 15:28:03', '2025-09-22 15:28:19', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:28:03.626Z\",\"source\":\"food_selection\"}'),
(52, 11, 'scan_1758555126952_sn1sx3', 'completed', 0, 0, '2025-09-22 15:32:06', '2025-09-22 15:32:19', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:32:06.944Z\",\"source\":\"food_selection\"}'),
(53, 11, 'scan_1758555533470_151ysl', 'completed', 0, 0, '2025-09-22 15:38:53', '2025-09-22 15:38:53', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:38:53.456Z\"}'),
(54, 11, 'scan_1758555533471_7ouurc', 'completed', 0, 0, '2025-09-22 15:38:53', '2025-09-22 15:38:53', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:38:53.457Z\"}'),
(55, 11, 'scan_1758555533471_2xqnsp', 'completed', 0, 0, '2025-09-22 15:38:53', '2025-09-22 15:38:53', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:38:53.457Z\"}'),
(56, 11, 'scan_1758555533471_mjnpxc', 'completed', 0, 0, '2025-09-22 15:38:53', '2025-09-22 15:38:53', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:38:53.457Z\"}'),
(57, 11, 'scan_1758555533489_d70vxt', 'completed', 0, 0, '2025-09-22 15:38:53', '2025-09-22 15:39:16', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:38:53.458Z\"}'),
(58, 11, 'scan_1758555533492_d8e3a6', 'completed', 0, 0, '2025-09-22 15:38:53', '2025-09-22 15:38:56', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:38:53.459Z\"}'),
(59, 11, 'scan_1758555556082_47xvbi', 'completed', 0, 0, '2025-09-22 15:39:16', '2025-09-22 15:39:29', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:39:16.071Z\",\"source\":\"food_selection\"}'),
(60, 11, 'scan_1758555864789_42orhf', 'completed', 0, 0, '2025-09-22 15:44:24', '2025-09-22 15:44:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:44:24.783Z\",\"source\":\"food_selection\"}'),
(61, 11, 'scan_1758555921219_pvx51s', 'completed', 0, 0, '2025-09-22 15:45:21', '2025-09-22 15:45:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:45:21.216Z\"}'),
(62, 11, 'scan_1758555921220_9xy9sz', 'completed', 0, 0, '2025-09-22 15:45:21', '2025-09-22 15:45:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:45:21.216Z\"}'),
(63, 11, 'scan_1758555921220_jufasa', 'completed', 0, 0, '2025-09-22 15:45:21', '2025-09-22 15:45:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:45:21.217Z\"}'),
(64, 11, 'scan_1758555921228_78si78', 'completed', 0, 0, '2025-09-22 15:45:21', '2025-09-22 15:45:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:45:21.218Z\"}'),
(65, 11, 'scan_1758555921240_ob72pp', 'completed', 0, 0, '2025-09-22 15:45:21', '2025-09-22 15:56:38', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:45:21.219Z\"}'),
(66, 11, 'scan_1758556598584_iy1k14', 'completed', 0, 0, '2025-09-22 15:56:38', '2025-09-22 15:56:53', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T15:56:38.570Z\",\"source\":\"food_selection\"}'),
(67, 11, 'scan_1758556947909_ta6o61', 'completed', 0, 0, '2025-09-22 16:02:27', '2025-09-22 16:02:41', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T16:02:27.901Z\",\"source\":\"food_selection\"}'),
(68, 11, 'scan_1758557461169_9rz7k1', 'completed', 0, 0, '2025-09-22 16:11:01', '2025-09-22 16:11:16', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-22T16:11:01.160Z\",\"source\":\"food_selection\"}'),
(69, 11, 'scan_1758588565889_23hy7h', 'completed', 0, 0, '2025-09-23 00:49:25', '2025-09-23 00:49:38', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T00:49:25.882Z\",\"source\":\"food_selection\"}'),
(70, 11, 'scan_1758588624922_cq6gyh', 'cancelled', 0, 0, '2025-09-23 00:50:24', '2025-09-23 00:50:29', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T00:50:24.917Z\",\"source\":\"food_selection\"}'),
(71, 11, 'scan_1758589440449_npjwuz', 'completed', 0, 0, '2025-09-23 01:04:00', '2025-09-23 01:04:00', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:04:00.443Z\"}'),
(72, 11, 'scan_1758589440450_yr31r0', 'completed', 0, 0, '2025-09-23 01:04:00', '2025-09-23 01:04:00', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:04:00.444Z\"}'),
(73, 11, 'scan_1758589440464_5zsrqb', 'completed', 0, 0, '2025-09-23 01:04:00', '2025-09-23 01:04:00', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:04:00.445Z\"}'),
(74, 11, 'scan_1758589440474_pppcet', 'completed', 0, 0, '2025-09-23 01:04:00', '2025-09-23 01:14:32', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:04:00.446Z\"}'),
(75, 11, 'scan_1758589440476_i5h6fg', 'completed', 0, 0, '2025-09-23 01:04:00', '2025-09-23 01:14:32', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:04:00.447Z\"}'),
(76, 11, 'scan_1758590072958_2xvea8', 'completed', 0, 0, '2025-09-23 01:14:32', '2025-09-23 01:14:32', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:14:32.949Z\"}'),
(77, 11, 'scan_1758590072959_49ziqd', 'completed', 0, 0, '2025-09-23 01:14:32', '2025-09-23 01:14:32', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:14:32.950Z\"}'),
(78, 11, 'scan_1758590072959_ytj74f', 'completed', 0, 0, '2025-09-23 01:14:32', '2025-09-23 01:14:32', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:14:32.951Z\"}'),
(79, 11, 'scan_1758590072959_o2rltv', 'completed', 0, 0, '2025-09-23 01:14:32', '2025-09-23 01:14:32', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:14:32.951Z\"}'),
(80, 11, 'scan_1758590072975_qwqvtm', 'completed', 0, 0, '2025-09-23 01:14:32', '2025-09-23 01:14:42', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:14:32.953Z\"}'),
(81, 11, 'scan_1758590833982_jc29z7', 'completed', 0, 0, '2025-09-23 01:27:13', '2025-09-23 01:27:13', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:27:13.977Z\"}'),
(82, 11, 'scan_1758590833984_g162im', 'completed', 0, 0, '2025-09-23 01:27:13', '2025-09-23 01:27:13', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:27:13.978Z\"}'),
(83, 11, 'scan_1758590833993_7sco5o', 'cancelled', 0, 0, '2025-09-23 01:27:13', '2025-09-23 01:27:29', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:27:13.980Z\"}'),
(84, 11, 'scan_1758590833998_ktwbb5', 'cancelled', 0, 0, '2025-09-23 01:27:14', '2025-09-23 01:27:29', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:27:13.982Z\"}'),
(85, 11, 'scan_1758591144208_mj7the', 'cancelled', 0, 0, '2025-09-23 01:32:24', '2025-09-23 01:37:25', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:32:24.205Z\"}'),
(86, 11, 'scan_1758591144209_ius5po', 'completed', 0, 0, '2025-09-23 01:32:24', '2025-09-23 01:32:39', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:32:24.205Z\"}'),
(87, 11, 'scan_1758591144209_p161s1', 'cancelled', 0, 0, '2025-09-23 01:32:24', '2025-09-23 01:37:25', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:32:24.206Z\"}'),
(88, 11, 'scan_1758591144209_jlsgf8', 'cancelled', 0, 0, '2025-09-23 01:32:24', '2025-09-23 01:37:25', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-23T01:32:24.206Z\"}'),
(89, 11, 'scan_1758674420285_66jz7f', 'completed', 0, 0, '2025-09-24 00:40:20', '2025-09-24 00:59:55', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:40:20.275Z\"}'),
(90, 11, 'scan_1758674420286_dykqym', 'completed', 0, 0, '2025-09-24 00:40:20', '2025-09-24 00:40:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:40:20.276Z\"}'),
(91, 11, 'scan_1758674420286_fb2rr4', 'completed', 0, 0, '2025-09-24 00:40:20', '2025-09-24 00:59:55', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:40:20.276Z\"}'),
(92, 11, 'scan_1758674420287_t08wk2', 'completed', 0, 0, '2025-09-24 00:40:20', '2025-09-24 00:59:55', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:40:20.276Z\"}'),
(93, 11, 'scan_1758675595154_trs05b', 'completed', 0, 0, '2025-09-24 00:59:55', '2025-09-24 01:00:45', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:59:55.130Z\"}'),
(94, 11, 'scan_1758675595156_rd6e4x', 'completed', 0, 0, '2025-09-24 00:59:55', '2025-09-24 01:00:45', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:59:55.131Z\"}'),
(95, 11, 'scan_1758675595157_t12tzu', 'completed', 0, 0, '2025-09-24 00:59:55', '2025-09-24 01:00:45', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:59:55.132Z\"}'),
(96, 11, 'scan_1758675595157_ol34a6', 'completed', 0, 0, '2025-09-24 00:59:55', '2025-09-24 01:00:45', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T00:59:55.133Z\"}'),
(97, 11, 'scan_1758675645880_jxp29g', 'completed', 0, 0, '2025-09-24 01:00:45', '2025-09-24 01:01:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:00:45.863Z\"}'),
(98, 11, 'scan_1758675645881_lfflkl', 'completed', 0, 0, '2025-09-24 01:00:45', '2025-09-24 01:01:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:00:45.865Z\"}'),
(99, 11, 'scan_1758675645882_m8wd7e', 'completed', 0, 0, '2025-09-24 01:00:45', '2025-09-24 01:01:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:00:45.867Z\"}'),
(100, 11, 'scan_1758675645883_az35kf', 'completed', 0, 0, '2025-09-24 01:00:45', '2025-09-24 01:01:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:00:45.868Z\"}'),
(101, 11, 'scan_1758675697367_bbmabu', 'completed', 0, 0, '2025-09-24 01:01:37', '2025-09-24 01:01:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:01:37.354Z\"}'),
(102, 11, 'scan_1758675697386_ic8x84', 'completed', 0, 0, '2025-09-24 01:01:37', '2025-09-24 01:01:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:01:37.355Z\"}'),
(103, 11, 'scan_1758675697404_qsrmwv', 'completed', 0, 0, '2025-09-24 01:01:37', '2025-09-24 01:01:37', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:01:37.355Z\"}'),
(104, 11, 'scan_1758675697420_xar6f0', 'cancelled', 0, 0, '2025-09-24 01:01:37', '2025-09-24 01:01:51', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:01:37.357Z\"}');

-- --------------------------------------------------------

--
-- Table structure for table `ml_models`
--

CREATE TABLE `ml_models` (
  `model_id` int(11) NOT NULL,
  `model_name` varchar(100) NOT NULL,
  `model_version` varchar(50) NOT NULL,
  `model_type` enum('tensorflow','pytorch','sklearn','custom') DEFAULT 'tensorflow',
  `model_path` varchar(255) NOT NULL,
  `training_data_count` int(11) DEFAULT 0,
  `accuracy_score` decimal(5,4) DEFAULT NULL,
  `precision_score` decimal(5,4) DEFAULT NULL,
  `recall_score` decimal(5,4) DEFAULT NULL,
  `f1_score` decimal(5,4) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_trained` timestamp NULL DEFAULT NULL,
  `performance_metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`performance_metrics`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ml_predictions`
--

CREATE TABLE `ml_predictions` (
  `prediction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `food_id` int(11) DEFAULT NULL,
  `food_name` varchar(100) NOT NULL,
  `food_category` varchar(50) DEFAULT NULL,
  `temperature` decimal(8,2) NOT NULL,
  `humidity` decimal(8,2) NOT NULL,
  `gas_level` decimal(8,2) NOT NULL,
  `spoilage_probability` decimal(5,2) NOT NULL COMMENT '0-100 probability of spoilage',
  `spoilage_status` enum('safe','caution','unsafe') NOT NULL,
  `confidence_score` decimal(5,2) NOT NULL COMMENT 'ML model confidence 0-100',
  `model_version` varchar(50) DEFAULT '1.0',
  `prediction_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Raw ML model output' CHECK (json_valid(`prediction_data`)),
  `recommendations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ML generated recommendations' CHECK (json_valid(`recommendations`)),
  `is_training_data` tinyint(1) DEFAULT 0 COMMENT 'Flag for training dataset',
  `actual_outcome` enum('safe','caution','unsafe') DEFAULT NULL COMMENT 'Actual result for training',
  `feedback_score` int(11) DEFAULT NULL COMMENT 'User feedback 1-5',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ml_predictions`
--

INSERT INTO `ml_predictions` (`prediction_id`, `user_id`, `food_id`, `food_name`, `food_category`, `temperature`, `humidity`, `gas_level`, `spoilage_probability`, `spoilage_status`, `confidence_score`, `model_version`, `prediction_data`, `recommendations`, `is_training_data`, `actual_outcome`, `feedback_score`, `created_at`) VALUES
(1, 11, 1, 'Banana', 'Fruits', 28.30, 89.30, 52.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T14:06:59.340Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.3,\"h\":89.3,\"g\":52,\"n\":1}}}}', '[\"Refrigerate immediately to slow down ripening and spoilage.\",\"Monitor gas levels closely.\",\"Inspect for bruises or discoloration; discard if present.\"]', 1, NULL, NULL, '2025-09-22 14:06:59'),
(2, 11, 1, 'Banana', 'Fruits', 28.30, 89.30, 58.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.299999237060547,\"humidity\":89.30000305175781,\"gas_level\":58,\"avg_temperature\":28.299999237060547,\"avg_humidity\":89.30000305175781,\"avg_gas_level\":58,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":40,\"caution_max\":60,\"unsafe_max\":100},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one data point).  The thresholds are based on general knowledge of fruit storage and spoilage.  Higher temperatures and humidity promote microbial growth, leading to spoilage.  Increased gas levels (e.g., ethylene) indicate ripening and potential spoilage.  A larger and more varied dataset is crucial for accurate threshold determination.  The low confidence reflects the inadequacy of the training data.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one data point).  The thresholds are based on general knowledge of fruit storage and spoilage.  Higher temperatures and humidity promote microbial growth, leading to spoilage.  Increased gas levels (e.g., ethylene) indicate ripening and potential spoilage.  A larger and more varied dataset is crucial for accurate threshold determination.  The low confidence reflects the inadequacy of the training data.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:07:35'),
(3, 11, 1, 'Banana', 'Fruits', 28.30, 89.80, 57.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.299999237060547,\"humidity\":89.80000305175781,\"gas_level\":57,\"avg_temperature\":28.299999237060547,\"avg_humidity\":89.80000305175781,\"avg_gas_level\":57,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":40,\"caution_max\":60,\"unsafe_max\":100},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one sample), offering no variance in measurements.  Therefore, the thresholds are based on general knowledge of fruit storage and spoilage.  High confidence cannot be assigned due to data insufficiency.  Further data collection with varied temperature, humidity, and gas levels across different stages of fruit ripening and spoilage is crucial for accurate threshold determination.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one sample), offering no variance in measurements.  Therefore, the thresholds are based on general knowledge of fruit storage and spoilage.  High confidence cannot be assigned due to data insufficiency.  Further data collection with varied temperature, humidity, and gas levels across different stages of fruit ripening and spoilage is crucial for accurate threshold determination.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:19:49'),
(4, 11, 1, 'Banana', 'Fruits', 28.30, 89.50, 57.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.299999237060547,\"humidity\":89.5,\"gas_level\":57,\"avg_temperature\":28.299999237060547,\"avg_humidity\":89.5,\"avg_gas_level\":57,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":40,\"caution_max\":60,\"unsafe_max\":100},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one data point) and lacks variability, making it impossible to reliably determine optimal thresholds.  The thresholds provided are based on general knowledge of fruit storage and spoilage.  Higher confidence would require a much larger and more diverse dataset reflecting various stages of fruit ripening and spoilage under different conditions.  The confidence level is low due to the data limitations.  These thresholds should be considered preliminary and require significant further data analysis for validation.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one data point) and lacks variability, making it impossible to reliably determine optimal thresholds.  The thresholds provided are based on general knowledge of fruit storage and spoilage.  Higher confidence would require a much larger and more diverse dataset reflecting various stages of fruit ripening and spoilage under different conditions.  The confidence level is low due to the data limitations.  These thresholds should be considered preliminary and require significant further data analysis for validation.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:23:34'),
(5, 11, 1, 'Banana', 'Fruits', 28.40, 89.80, 66.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":89.80000305175781,\"gas_level\":66,\"avg_temperature\":28.399999618530273,\"avg_humidity\":89.80000305175781,\"avg_gas_level\":66,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":20,\"caution_max\":40,\"unsafe_max\":60},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one sample), offering no variability.  The thresholds are therefore based on general knowledge of fruit storage and spoilage.  Lower confidence reflects the lack of data to support these specific values.  Further data is crucial for accurate threshold determination.  These values represent typical ranges for optimal fruit storage, early spoilage indicators, and advanced spoilage, respectively.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one sample), offering no variability.  The thresholds are therefore based on general knowledge of fruit storage and spoilage.  Lower confidence reflects the lack of data to support these specific values.  Further data is crucial for accurate threshold determination.  These values represent typical ranges for optimal fruit storage, early spoilage indicators, and advanced spoilage, respectively.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:25:11'),
(6, 11, 1, 'Banana', 'Fruits', 28.40, 90.00, 62.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":90,\"gas_level\":62,\"avg_temperature\":28.399999618530273,\"avg_humidity\":90,\"avg_gas_level\":62,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":40,\"caution_max\":60,\"unsafe_max\":100},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one sample).  The thresholds are based on general knowledge of fruit storage and spoilage.  Higher temperatures and humidity promote microbial growth and ethylene production, leading to spoilage.  Gas levels (likely ethylene) increase significantly as fruit ripens and spoils.  The low confidence reflects the lack of data; a robust model requires significantly more diverse data points representing various stages of fruit ripening and spoilage under different conditions.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one sample).  The thresholds are based on general knowledge of fruit storage and spoilage.  Higher temperatures and humidity promote microbial growth and ethylene production, leading to spoilage.  Gas levels (likely ethylene) increase significantly as fruit ripens and spoils.  The low confidence reflects the lack of data; a robust model requires significantly more diverse data points representing various stages of fruit ripening and spoilage under different conditions.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:30:20'),
(7, 11, 3, 'Banana', 'Fruits', 28.40, 89.70, 61.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":89.69999694824219,\"gas_level\":61,\"avg_temperature\":28.399999618530273,\"avg_humidity\":89.69999694824219,\"avg_gas_level\":61,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":40,\"caution_max\":60,\"unsafe_max\":80},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one sample).  The thresholds are based on general knowledge of fruit storage and spoilage.  High confidence cannot be assigned due to insufficient data.  Further data collection is crucial for accurate threshold determination.  These thresholds represent typical ranges for optimal fruit storage, early spoilage indicators, and advanced spoilage, respectively.  The gas level threshold is particularly uncertain without knowing the specific gas being measured.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one sample).  The thresholds are based on general knowledge of fruit storage and spoilage.  High confidence cannot be assigned due to insufficient data.  Further data collection is crucial for accurate threshold determination.  These thresholds represent typical ranges for optimal fruit storage, early spoilage indicators, and advanced spoilage, respectively.  The gas level threshold is particularly uncertain without knowing the specific gas being measured.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:33:43'),
(8, 11, 3, 'Banana', 'Fruits', 28.40, 89.70, 59.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":89.69999694824219,\"gas_level\":59,\"avg_temperature\":28.399999618530273,\"avg_humidity\":89.69999694824219,\"avg_gas_level\":59,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":40,\"caution_max\":60,\"unsafe_max\":100},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one sample), offering no variability to base statistical thresholds on.  The thresholds provided are based on general knowledge of fruit storage conditions.  A larger, more varied dataset is crucial for accurate threshold determination.  The low confidence reflects the inadequacy of the training data.  The temperature range is based on typical refrigeration and room temperature for fruit storage.  Humidity is set to allow for some fluctuation while avoiding excessive moisture.  Gas level thresholds are estimates based on the production of ethylene and other spoilage gases.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one sample), offering no variability to base statistical thresholds on.  The thresholds provided are based on general knowledge of fruit storage conditions.  A larger, more varied dataset is crucial for accurate threshold determination.  The low confidence reflects the inadequacy of the training data.  The temperature range is based on typical refrigeration and room temperature for fruit storage.  Humidity is set to allow for some fluctuation while avoiding excessive moisture.  Gas level thresholds are estimates based on the production of ethylene and other spoilage gases.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:39:00'),
(9, 11, 3, 'Banana', 'Fruits', 28.40, 90.30, 73.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":90.30000305175781,\"gas_level\":73,\"avg_temperature\":28.399999618530273,\"avg_humidity\":90.30000305175781,\"avg_gas_level\":73,\"training_data_count\":1,\"ai_thresholds\":{\"temperature\":{\"safe_max\":25,\"caution_max\":28,\"unsafe_max\":30,\"safe_min\":0},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":85},\"gas_level\":{\"safe_max\":40,\"caution_max\":60,\"unsafe_max\":100},\"confidence\":20,\"reasoning\":\"The provided dataset is extremely limited (only one sample).  The thresholds are based on general knowledge of fruit storage and spoilage.  Optimal temperature for many fruits is below 25°C.  High humidity can promote mold growth, while elevated gas levels (ethylene, for example) indicate ripening and potential spoilage.  The low confidence reflects the lack of data; more samples are needed for reliable threshold determination.\"},\"ai_confidence\":20,\"ai_reasoning\":\"The provided dataset is extremely limited (only one sample).  The thresholds are based on general knowledge of fruit storage and spoilage.  Optimal temperature for many fruits is below 25°C.  High humidity can promote mold growth, while elevated gas levels (ethylene, for example) indicate ripening and potential spoilage.  The low confidence reflects the lack of data; more samples are needed for reliable threshold determination.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:44:24'),
(10, 11, 6, 'Apple', 'Fruits', 28.40, 91.00, 60.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T14:52:28.401Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.35,\"h\":90.15,\"g\":56,\"n\":2}}}}', '[\"Refrigerate immediately\",\"Monitor gas levels closely\",\"Discard if mold or off-odors are present\"]', 1, NULL, NULL, '2025-09-22 14:52:28'),
(11, 11, 4, 'Apple', 'Fruits', 28.40, 90.90, 62.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":90.9000015258789,\"gas_level\":62,\"avg_temperature\":28.399999618530273,\"avg_humidity\":90.9000015258789,\"avg_gas_level\":62,\"training_data_count\":2,\"ai_thresholds\":{\"temperature\":{\"safe_max\":28.5,\"caution_max\":29,\"unsafe_max\":29.5,\"safe_min\":28},\"humidity\":{\"safe_max\":91,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":89},\"gas_level\":{\"safe_max\":58,\"caution_max\":62,\"unsafe_max\":70},\"confidence\":30,\"reasoning\":\"The confidence is low (30%) due to the extremely limited training data (only 2 samples).  The thresholds are based on general knowledge of fruit spoilage and the provided statistics.  Temperature thresholds are relatively tight given the narrow range in the data.  Humidity and gas levels have wider thresholds to account for potential variations.  More data is crucial for accurate and reliable threshold determination.\"},\"ai_confidence\":30,\"ai_reasoning\":\"The confidence is low (30%) due to the extremely limited training data (only 2 samples).  The thresholds are based on general knowledge of fruit spoilage and the provided statistics.  Temperature thresholds are relatively tight given the narrow range in the data.  Humidity and gas levels have wider thresholds to account for potential variations.  More data is crucial for accurate and reliable threshold determination.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:53:36'),
(12, 11, 3, 'Banana', 'Fruits', 28.40, 90.70, 60.00, 50.00, 'unsafe', 75.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":90.69999694824219,\"gas_level\":60,\"avg_temperature\":28.399999618530273,\"avg_humidity\":90.69999694824219,\"avg_gas_level\":60,\"training_data_count\":2,\"ai_thresholds\":{\"temperature\":{\"safe_max\":28.5,\"caution_max\":29,\"unsafe_max\":29.5,\"safe_min\":28},\"humidity\":{\"safe_max\":91,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":89},\"gas_level\":{\"safe_max\":58,\"caution_max\":62,\"unsafe_max\":70},\"confidence\":30,\"reasoning\":\"The confidence is low (30%) due to the extremely limited training data (only 2 samples).  The thresholds are based on general knowledge of fruit spoilage and the provided statistics.  Temperature thresholds are relatively tight given the narrow range in the data.  Humidity and gas levels have wider thresholds to account for potential variations.  More data is crucial for accurate and reliable threshold determination.\"},\"ai_confidence\":30,\"ai_reasoning\":\"The confidence is low (30%) due to the extremely limited training data (only 2 samples).  The thresholds are based on general knowledge of fruit spoilage and the provided statistics.  Temperature thresholds are relatively tight given the narrow range in the data.  Humidity and gas levels have wider thresholds to account for potential variations.  More data is crucial for accurate and reliable threshold determination.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 14:58:46'),
(13, 11, 7, 'Orange', 'Fruits', 28.40, 91.00, 63.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T15:13:05.560Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.366666666666664,\"h\":90.43333333333334,\"g\":58.333333333333336,\"n\":3}}}}', '[\"Refrigerate immediately\",\"Discard if mold or off-odors are present\",\"Avoid consumption if showing signs of spoilage\"]', 1, NULL, NULL, '2025-09-22 15:13:05'),
(14, 11, 10, 'Eggplant', 'Vegetables', 28.50, 91.00, 68.00, 82.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T15:18:36.252Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.5,\"h\":91,\"g\":68,\"n\":1}}}}', '[\"Refrigerate immediately\",\"Discard if any signs of softening, discoloration, or unusual odor are present\",\"Avoid consumption if more than 12 hours have passed since the reading\"]', 1, NULL, NULL, '2025-09-22 15:18:36'),
(15, 11, 13, 'Sayote', 'Vegetables', 28.50, 90.70, 73.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T15:28:18.135Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.5,\"h\":90.85,\"g\":70.5,\"n\":2}}}}', '[\"Refrigerate immediately to slow spoilage.\",\"Discard if any signs of decay are present.\",\"Avoid consumption if off-odors are detected.\"]', 1, NULL, NULL, '2025-09-22 15:28:18'),
(16, 11, 16, 'Cabbage', 'Vegetables', 28.50, 90.50, 74.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T15:32:18.064Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.5,\"h\":90.73333333333333,\"g\":71.66666666666667,\"n\":3}}}}', '[\"Refrigerate immediately below 4°C\",\"Discard if any signs of slime, discoloration, or foul odor are present\",\"Avoid consuming if significant softening is observed\"]', 1, NULL, NULL, '2025-09-22 15:32:18'),
(17, 11, 19, 'Grape', 'Fruits', 28.40, 88.20, 65.00, 50.00, 'unsafe', 70.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T15:39:27.844Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.374999999999996,\"h\":89.875,\"g\":60,\"n\":4}}}}', '[\"Refrigerate immediately to slow spoilage\",\"Monitor gas levels closely\",\"Inspect grapes for mold or discoloration\"]', 1, NULL, NULL, '2025-09-22 15:39:27'),
(18, 11, 22, 'Blue Berry', 'Fruits', 28.40, 88.10, 63.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T15:44:36.390Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.380000000000003,\"h\":89.52000000000001,\"g\":60.6,\"n\":5}}}}', '[\"Refrigerate immediately\",\"Discard if mold or off-odors are present\",\"Avoid consumption if texture is significantly altered\"]', 1, NULL, NULL, '2025-09-22 15:44:36'),
(19, 11, 22, 'Blue Berry', 'Fruits', 28.40, 87.70, 65.00, 50.00, 'unsafe', 76.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":87.69999694824219,\"gas_level\":65,\"avg_temperature\":28.399999618530273,\"avg_humidity\":87.69999694824219,\"avg_gas_level\":65,\"training_data_count\":5,\"ai_thresholds\":{\"temperature\":{\"safe_max\":28.5,\"caution_max\":29,\"unsafe_max\":29.5,\"safe_min\":28},\"humidity\":{\"safe_max\":90,\"caution_max\":92,\"unsafe_max\":95,\"safe_min\":88},\"gas_level\":{\"safe_max\":60,\"caution_max\":65,\"unsafe_max\":70},\"confidence\":60,\"reasoning\":\"The provided dataset is extremely limited (only 5 samples), resulting in low confidence.  The thresholds are based on general knowledge of fruit spoilage and a slight expansion around the observed means and standard deviations.  Temperature and humidity are crucial for fruit preservation; higher temperatures and humidity promote microbial growth.  Increased gas levels (ethylene, for example) indicate ripening and eventual spoilage.  More data is needed to establish robust and reliable thresholds.\"},\"ai_confidence\":60,\"ai_reasoning\":\"The provided dataset is extremely limited (only 5 samples), resulting in low confidence.  The thresholds are based on general knowledge of fruit spoilage and a slight expansion around the observed means and standard deviations.  Temperature and humidity are crucial for fruit preservation; higher temperatures and humidity promote microbial growth.  Increased gas levels (ethylene, for example) indicate ripening and eventual spoilage.  More data is needed to establish robust and reliable thresholds.\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-22 15:45:37'),
(20, 11, 25, 'Garlic', 'Vegetables', 28.30, 87.70, 61.00, 50.00, 'unsafe', 70.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T15:56:52.613Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.45,\"h\":89.975,\"g\":69,\"n\":4}}}}', '[\"Store garlic in a cool, dry, and well-ventilated area\",\"Monitor temperature and humidity closely\",\"Consider refrigeration to extend shelf life\"]', 1, NULL, NULL, '2025-09-22 15:56:52'),
(21, 11, 28, 'Mango', 'Fruits', 28.40, 87.80, 60.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T16:02:39.843Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.383333333333336,\"h\":89.23333333333333,\"g\":60.5,\"n\":6}}}}', '[\"Refrigerate immediately to slow down spoilage.\",\"Monitor gas levels closely.\",\"Inspect for mold or discoloration; discard if present.\"]', 1, NULL, NULL, '2025-09-22 16:02:39'),
(22, 11, 31, 'Onion', 'Vegetables', 28.30, 87.50, 63.00, 50.00, 'unsafe', 71.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-22T16:11:15.374Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.419999999999998,\"h\":89.47999999999999,\"g\":67.8,\"n\":5}}}}', '[\"Increase ventilation to reduce humidity\",\"Monitor temperature closely\",\"Consider refrigeration if conditions worsen\"]', 1, NULL, NULL, '2025-09-22 16:11:15'),
(23, 11, 34, 'Ponkan', 'Fruits', 28.30, 87.90, 58.00, 50.00, 'unsafe', 85.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-23T00:49:36.566Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":28.371428571428574,\"h\":89.04285714285713,\"g\":60.142857142857146,\"n\":7}}}}', '[\"Refrigerate immediately\",\"Monitor closely for mold or off-odors\",\"Discard if any signs of spoilage are detected\"]', 1, NULL, NULL, '2025-09-23 00:49:36'),
(24, 11, 34, 'Ponkan', 'Fruits', 28.40, 85.30, 25.00, 50.00, 'unsafe', 76.00, '1.0', '{\"temperature\":28.399999618530273,\"humidity\":85.30000305175781,\"gas_level\":25,\"avg_temperature\":28.399999618530273,\"avg_humidity\":85.30000305175781,\"avg_gas_level\":25,\"training_data_count\":7,\"ai_thresholds\":{\"temperature\":{\"safe_max\":4,\"caution_max\":7,\"unsafe_max\":10,\"safe_min\":0},\"humidity\":{\"safe_max\":85,\"caution_max\":90,\"unsafe_max\":95,\"safe_min\":40},\"gas_level\":{\"safe_max\":15,\"caution_max\":30,\"unsafe_max\":50},\"confidence\":50,\"reasoning\":\"Default thresholds used as fallback\"},\"ai_confidence\":50,\"ai_reasoning\":\"Default thresholds used as fallback\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\"]}', 1, NULL, NULL, '2025-09-23 01:04:14'),
(25, 11, 35, 'Ponkan', 'Fruits', 28.60, 85.60, 33.00, 50.00, 'unsafe', 76.00, '1.0', '{\"temperature\":28.600000381469727,\"humidity\":85.5999984741211,\"gas_level\":33,\"avg_temperature\":28.600000381469727,\"avg_humidity\":85.5999984741211,\"avg_gas_level\":33,\"training_data_count\":7,\"ai_thresholds\":{\"temperature\":{\"safe_max\":4,\"caution_max\":7,\"unsafe_max\":10,\"safe_min\":0},\"humidity\":{\"safe_max\":85,\"caution_max\":90,\"unsafe_max\":95,\"safe_min\":40},\"gas_level\":{\"safe_max\":15,\"caution_max\":30,\"unsafe_max\":50},\"confidence\":50,\"reasoning\":\"Default thresholds used as fallback\"},\"ai_confidence\":50,\"ai_reasoning\":\"Default thresholds used as fallback\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-23 01:27:29'),
(26, 11, 35, 'Ponkan', 'Fruits', 28.60, 85.30, 33.00, 50.00, 'unsafe', 76.00, '1.0', '{\"temperature\":28.600000381469727,\"humidity\":85.30000305175781,\"gas_level\":33,\"avg_temperature\":28.600000381469727,\"avg_humidity\":85.30000305175781,\"avg_gas_level\":33,\"training_data_count\":7,\"ai_thresholds\":{\"temperature\":{\"safe_max\":4,\"caution_max\":7,\"unsafe_max\":10,\"safe_min\":0},\"humidity\":{\"safe_max\":85,\"caution_max\":90,\"unsafe_max\":95,\"safe_min\":40},\"gas_level\":{\"safe_max\":15,\"caution_max\":30,\"unsafe_max\":50},\"confidence\":50,\"reasoning\":\"Default thresholds used as fallback\"},\"ai_confidence\":50,\"ai_reasoning\":\"Default thresholds used as fallback\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-23 01:32:39'),
(27, 11, 34, 'Ponkan', 'Fruits', 25.10, 89.50, 75.00, 50.00, 'unsafe', 76.00, '1.0', '{\"temperature\":25.100000381469727,\"humidity\":89.5,\"gas_level\":75,\"avg_temperature\":25.100000381469727,\"avg_humidity\":89.5,\"avg_gas_level\":75,\"training_data_count\":7,\"ai_thresholds\":{\"temperature\":{\"safe_max\":4,\"caution_max\":7,\"unsafe_max\":10,\"safe_min\":0},\"humidity\":{\"safe_max\":85,\"caution_max\":90,\"unsafe_max\":95,\"safe_min\":40},\"gas_level\":{\"safe_max\":15,\"caution_max\":30,\"unsafe_max\":50},\"confidence\":50,\"reasoning\":\"Default thresholds used as fallback\"},\"ai_confidence\":50,\"ai_reasoning\":\"Default thresholds used as fallback\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-24 00:40:37'),
(28, 11, 34, 'Ponkan', 'Fruits', 26.10, 83.50, 46.00, 50.00, 'unsafe', 76.00, '1.0', '{\"temperature\":26.100000381469727,\"humidity\":83.5,\"gas_level\":46,\"avg_temperature\":26.100000381469727,\"avg_humidity\":83.5,\"avg_gas_level\":46,\"training_data_count\":7,\"ai_thresholds\":{\"temperature\":{\"safe_max\":4,\"caution_max\":7,\"unsafe_max\":10,\"safe_min\":0},\"humidity\":{\"safe_max\":85,\"caution_max\":90,\"unsafe_max\":95,\"safe_min\":40},\"gas_level\":{\"safe_max\":15,\"caution_max\":30,\"unsafe_max\":50},\"confidence\":50,\"reasoning\":\"Default thresholds used as fallback\"},\"ai_confidence\":50,\"ai_reasoning\":\"Default thresholds used as fallback\"}', '{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]}', 1, NULL, NULL, '2025-09-24 01:01:51');

-- --------------------------------------------------------

--
-- Table structure for table `ml_training_data`
--

CREATE TABLE `ml_training_data` (
  `training_id` int(11) NOT NULL,
  `food_name` varchar(100) NOT NULL,
  `food_category` varchar(50) NOT NULL,
  `temperature` decimal(8,2) NOT NULL,
  `humidity` decimal(8,2) NOT NULL,
  `gas_level` decimal(8,2) NOT NULL,
  `actual_spoilage_status` enum('safe','caution','unsafe') NOT NULL,
  `storage_duration_hours` int(11) DEFAULT NULL,
  `environmental_factors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional environmental data' CHECK (json_valid(`environmental_factors`)),
  `data_source` enum('manual','sensor','user_feedback','expert') DEFAULT 'sensor',
  `quality_score` decimal(3,2) DEFAULT 1.00 COMMENT 'Data quality 0-1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ml_training_data`
--

INSERT INTO `ml_training_data` (`training_id`, `food_name`, `food_category`, `temperature`, `humidity`, `gas_level`, `actual_spoilage_status`, `storage_duration_hours`, `environmental_factors`, `data_source`, `quality_score`, `created_at`, `updated_at`) VALUES
(1, 'Banana', 'Fruits', 28.30, 89.30, 52.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.299999237060547,\"humidity\":89.30000305175781,\"gas_level\":52,\"timestamp\":\"2025-09-22T14:06:59.318Z\"},\"timestamp\":\"2025-09-22T14:06:59.324Z\"}', 'expert', 0.95, '2025-09-22 14:06:59', '2025-09-22 14:06:59'),
(2, 'Apple', 'Fruits', 28.40, 91.00, 60.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.399999618530273,\"humidity\":91,\"gas_level\":60,\"timestamp\":\"2025-09-22T14:52:28.387Z\"},\"timestamp\":\"2025-09-22T14:52:28.388Z\"}', 'expert', 0.95, '2025-09-22 14:52:28', '2025-09-22 14:52:28'),
(3, 'Orange', 'Fruits', 28.40, 91.00, 63.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.399999618530273,\"humidity\":91,\"gas_level\":63,\"timestamp\":\"2025-09-22T15:13:05.542Z\"},\"timestamp\":\"2025-09-22T15:13:05.547Z\"}', 'expert', 0.95, '2025-09-22 15:13:05', '2025-09-22 15:13:05'),
(4, 'Eggplant', 'Vegetables', 28.50, 91.00, 68.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.5,\"humidity\":91,\"gas_level\":68,\"timestamp\":\"2025-09-22T15:18:36.230Z\"},\"timestamp\":\"2025-09-22T15:18:36.236Z\"}', 'expert', 0.95, '2025-09-22 15:18:36', '2025-09-22 15:18:36'),
(5, 'Sayote', 'Vegetables', 28.50, 90.70, 73.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.5,\"humidity\":90.69999694824219,\"gas_level\":73,\"timestamp\":\"2025-09-22T15:28:18.062Z\"},\"timestamp\":\"2025-09-22T15:28:18.110Z\"}', 'expert', 0.95, '2025-09-22 15:28:18', '2025-09-22 15:28:18'),
(6, 'Cabbage', 'Vegetables', 28.50, 90.50, 74.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.5,\"humidity\":90.5,\"gas_level\":74,\"timestamp\":\"2025-09-22T15:32:18.036Z\"},\"timestamp\":\"2025-09-22T15:32:18.042Z\"}', 'expert', 0.95, '2025-09-22 15:32:18', '2025-09-22 15:32:18'),
(7, 'Grape', 'Fruits', 28.40, 88.20, 65.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"65\",\"storage_conditions\":{\"temperature\":28.399999618530273,\"humidity\":88.19999694824219,\"gas_level\":65,\"timestamp\":\"2025-09-22T15:39:27.831Z\"},\"timestamp\":\"2025-09-22T15:39:27.832Z\"}', 'expert', 0.95, '2025-09-22 15:39:27', '2025-09-22 15:39:27'),
(8, 'Blue Berry', 'Fruits', 28.40, 88.10, 63.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.399999618530273,\"humidity\":88.0999984741211,\"gas_level\":63,\"timestamp\":\"2025-09-22T15:44:36.371Z\"},\"timestamp\":\"2025-09-22T15:44:36.374Z\"}', 'expert', 0.95, '2025-09-22 15:44:36', '2025-09-22 15:44:36'),
(9, 'Garlic', 'Vegetables', 28.30, 87.70, 61.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"65\",\"storage_conditions\":{\"temperature\":28.299999237060547,\"humidity\":87.69999694824219,\"gas_level\":61,\"timestamp\":\"2025-09-22T15:56:52.552Z\"},\"timestamp\":\"2025-09-22T15:56:52.581Z\"}', 'expert', 0.95, '2025-09-22 15:56:52', '2025-09-22 15:56:52'),
(10, 'Mango', 'Fruits', 28.40, 87.80, 60.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.399999618530273,\"humidity\":87.80000305175781,\"gas_level\":60,\"timestamp\":\"2025-09-22T16:02:39.818Z\"},\"timestamp\":\"2025-09-22T16:02:39.831Z\"}', 'expert', 0.95, '2025-09-22 16:02:39', '2025-09-22 16:02:39'),
(11, 'Onion', 'Vegetables', 28.30, 87.50, 63.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"65\",\"storage_conditions\":{\"temperature\":28.299999237060547,\"humidity\":87.5,\"gas_level\":63,\"timestamp\":\"2025-09-22T16:11:15.217Z\"},\"timestamp\":\"2025-09-22T16:11:15.260Z\"}', 'expert', 0.95, '2025-09-22 16:11:15', '2025-09-22 16:11:15'),
(12, 'Ponkan', 'Fruits', 28.30, 87.90, 58.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"85\",\"storage_conditions\":{\"temperature\":28.299999237060547,\"humidity\":87.9000015258789,\"gas_level\":58,\"timestamp\":\"2025-09-23T00:49:36.554Z\"},\"timestamp\":\"2025-09-23T00:49:36.556Z\"}', 'expert', 0.95, '2025-09-23 00:49:36', '2025-09-23 00:49:36'),
(13, 'Sayote', 'Vegetables', 10.00, 85.00, 30.00, 'safe', NULL, NULL, 'manual', 0.95, '2025-09-23 15:25:28', '2025-09-23 15:25:28');

-- --------------------------------------------------------

--
-- Table structure for table `readings`
--

CREATE TABLE `readings` (
  `reading_id` int(11) NOT NULL,
  `sensor_id` int(11) DEFAULT NULL,
  `value` float NOT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `readings`
--

INSERT INTO `readings` (`reading_id`, `sensor_id`, `value`, `unit`, `timestamp`) VALUES
(1, 13, 28.3, '°C', '2025-09-22 14:06:54'),
(2, 14, 89.3, '%', '2025-09-22 14:06:54'),
(3, 15, 52, 'ppm', '2025-09-22 14:06:54'),
(4, 13, 28.3, '°C', '2025-09-22 14:07:30'),
(5, 14, 89.3, '%', '2025-09-22 14:07:30'),
(6, 15, 58, 'ppm', '2025-09-22 14:07:30'),
(7, 13, 28.3, '°C', '2025-09-22 14:19:44'),
(8, 14, 89.8, '%', '2025-09-22 14:19:44'),
(9, 15, 57, 'ppm', '2025-09-22 14:19:44'),
(10, 13, 28.3, '°C', '2025-09-22 14:23:29'),
(11, 14, 89.5, '%', '2025-09-22 14:23:29'),
(12, 15, 57, 'ppm', '2025-09-22 14:23:29'),
(13, 13, 28.4, '°C', '2025-09-22 14:25:06'),
(14, 14, 89.8, '%', '2025-09-22 14:25:06'),
(15, 15, 66, 'ppm', '2025-09-22 14:25:06'),
(16, 13, 28.4, '°C', '2025-09-22 14:30:16'),
(17, 14, 90, '%', '2025-09-22 14:30:16'),
(18, 15, 62, 'ppm', '2025-09-22 14:30:16'),
(19, 13, 28.4, '°C', '2025-09-22 14:33:40'),
(20, 14, 89.7, '%', '2025-09-22 14:33:40'),
(21, 15, 61, 'ppm', '2025-09-22 14:33:40'),
(22, 13, 28.4, '°C', '2025-09-22 14:38:56'),
(23, 14, 89.7, '%', '2025-09-22 14:38:56'),
(24, 15, 59, 'ppm', '2025-09-22 14:38:56'),
(25, 13, 28.4, '°C', '2025-09-22 14:44:20'),
(26, 14, 90.3, '%', '2025-09-22 14:44:20'),
(27, 15, 73, 'ppm', '2025-09-22 14:44:20'),
(28, 13, 28.4, '°C', '2025-09-22 14:52:24'),
(29, 14, 91, '%', '2025-09-22 14:52:24'),
(30, 15, 60, 'ppm', '2025-09-22 14:52:24'),
(31, 13, 28.4, '°C', '2025-09-22 14:53:32'),
(32, 14, 90.9, '%', '2025-09-22 14:53:32'),
(33, 15, 62, 'ppm', '2025-09-22 14:53:32'),
(34, 13, 28.4, '°C', '2025-09-22 14:58:44'),
(35, 14, 90.7, '%', '2025-09-22 14:58:44'),
(36, 15, 60, 'ppm', '2025-09-22 14:58:44'),
(37, 13, 28.4, '°C', '2025-09-22 15:13:01'),
(38, 14, 91, '%', '2025-09-22 15:13:01'),
(39, 15, 63, 'ppm', '2025-09-22 15:13:01'),
(40, 13, 28.5, '°C', '2025-09-22 15:18:32'),
(41, 14, 91, '%', '2025-09-22 15:18:32'),
(42, 15, 68, 'ppm', '2025-09-22 15:18:32'),
(43, 13, 28.5, '°C', '2025-09-22 15:28:13'),
(44, 14, 90.7, '%', '2025-09-22 15:28:13'),
(45, 15, 73, 'ppm', '2025-09-22 15:28:13'),
(46, 13, 28.5, '°C', '2025-09-22 15:32:14'),
(47, 14, 90.5, '%', '2025-09-22 15:32:14'),
(48, 15, 74, 'ppm', '2025-09-22 15:32:14'),
(49, 13, 28.4, '°C', '2025-09-22 15:39:24'),
(50, 14, 88.2, '%', '2025-09-22 15:39:24'),
(51, 15, 65, 'ppm', '2025-09-22 15:39:24'),
(52, 13, 28.4, '°C', '2025-09-22 15:44:33'),
(53, 14, 88.1, '%', '2025-09-22 15:44:33'),
(54, 15, 63, 'ppm', '2025-09-22 15:44:33'),
(55, 13, 28.4, '°C', '2025-09-22 15:45:33'),
(56, 14, 87.7, '%', '2025-09-22 15:45:33'),
(57, 15, 65, 'ppm', '2025-09-22 15:45:33'),
(58, 13, 28.3, '°C', '2025-09-22 15:56:48'),
(59, 14, 87.7, '%', '2025-09-22 15:56:48'),
(60, 15, 61, 'ppm', '2025-09-22 15:56:48'),
(61, 13, 28.4, '°C', '2025-09-22 16:02:36'),
(62, 14, 87.8, '%', '2025-09-22 16:02:36'),
(63, 15, 60, 'ppm', '2025-09-22 16:02:36'),
(64, 13, 28.3, '°C', '2025-09-22 16:11:10'),
(65, 14, 87.5, '%', '2025-09-22 16:11:10'),
(66, 15, 63, 'ppm', '2025-09-22 16:11:10'),
(67, 13, 28.3, '°C', '2025-09-23 00:49:33'),
(68, 14, 87.9, '%', '2025-09-23 00:49:33'),
(69, 15, 58, 'ppm', '2025-09-23 00:49:33'),
(70, 13, 28.4, '°C', '2025-09-23 01:04:11'),
(71, 14, 85.3, '%', '2025-09-23 01:04:11'),
(72, 15, 25, 'ppm', '2025-09-23 01:04:11'),
(73, 13, 28.4, '°C', '2025-09-23 01:13:01'),
(74, 14, 86.3, '%', '2025-09-23 01:13:01'),
(75, 15, 26, 'ppm', '2025-09-23 01:13:01'),
(76, 13, 28.4, '°C', '2025-09-23 01:13:32'),
(77, 14, 86.4, '%', '2025-09-23 01:13:32'),
(78, 15, 26, 'ppm', '2025-09-23 01:13:32'),
(79, 13, 28.6, '°C', '2025-09-23 01:27:25'),
(80, 14, 85.6, '%', '2025-09-23 01:27:25'),
(81, 15, 33, 'ppm', '2025-09-23 01:27:25'),
(82, 13, 28.6, '°C', '2025-09-23 01:32:35'),
(83, 14, 85.3, '%', '2025-09-23 01:32:35'),
(84, 15, 33, 'ppm', '2025-09-23 01:32:35'),
(85, 13, 28.6, '°C', '2025-09-23 01:32:55'),
(86, 14, 85.3, '%', '2025-09-23 01:32:55'),
(87, 15, 34, 'ppm', '2025-09-23 01:32:55'),
(88, 13, 25.1, '°C', '2025-09-24 00:40:33'),
(89, 14, 89.5, '%', '2025-09-24 00:40:33'),
(90, 15, 75, 'ppm', '2025-09-24 00:40:33'),
(97, 13, 26.1, '°C', '2025-09-24 01:01:48'),
(98, 14, 83.5, '%', '2025-09-24 01:01:48'),
(99, 15, 46, 'ppm', '2025-09-24 01:01:48');

-- --------------------------------------------------------

--
-- Table structure for table `sensor`
--

CREATE TABLE `sensor` (
  `sensor_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensor`
--

INSERT INTO `sensor` (`sensor_id`, `type`, `user_id`, `is_active`, `created_at`, `updated_at`) VALUES
(13, 'Temperature', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(14, 'Humidity', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(15, 'Gas', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(101, 'Temperature', 22, 1, '2025-07-24 06:32:41', '2025-07-24 06:32:41'),
(102, 'Humidity', 22, 1, '2025-07-24 06:32:41', '2025-07-24 06:32:41'),
(103, 'Gas', 22, 1, '2025-07-24 06:32:41', '2025-07-24 06:32:41'),
(1692, 'Humidity', 23, 1, '2025-09-23 13:06:09', '2025-09-23 13:06:09'),
(3019, 'Gas', 23, 1, '2025-09-23 13:06:09', '2025-09-23 13:06:09'),
(9537, 'Temperature', 23, 1, '2025-09-23 13:06:09', '2025-09-23 13:06:09');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `user_id`, `session_token`, `expires_at`, `created_at`) VALUES
(1, 11, '53df0cf24c6901abdcf85f020c79a77bb59785467ba835d832cee522bf864782', '2025-09-20 19:35:03', '2025-09-14 03:35:03'),
(2, 11, 'ab4df145726453e8440a1374b337a1c10c2bd908f4c3ce751eb99d0ace6c2da3', '2025-09-20 22:33:15', '2025-09-14 06:33:15'),
(3, 11, '178a1d473ad1939fd11673a79c4be39ccf109edbc49a2fb75456a4248476f15c', '2025-09-21 17:09:25', '2025-09-15 01:09:25'),
(4, 11, 'c74a0b78c802d8489b1153ea417810aec805178529b4428f75e2a782e375c01f', '2025-09-21 17:18:37', '2025-09-15 01:18:37'),
(5, 11, '444703c6a4d7930c2c45cd56a5edbf6abfcdcec4a4e4c81a3c7f328c52f9c1c4', '2025-09-21 17:54:52', '2025-09-15 01:54:52'),
(6, 11, 'af1aa1bd078c3d83b7777819271998f4b629a5daa0986850e806adf88e2097f1', '2025-09-21 21:07:50', '2025-09-15 03:07:50'),
(7, 11, '1e489245390010dfa10752faef2741bc862ce0fa00f88602fa7874c44696d2b4', '2025-09-21 19:54:43', '2025-09-15 03:54:43'),
(8, 11, '967081cc18428add9eb0e9f37cd2842bb3e708a744e6e19338490ce7ac58771f', '2025-09-22 07:10:37', '2025-09-15 15:10:37'),
(9, 11, '2bf0cc5ff5c51a2b731501b5e77fc4801274e3b12c884873fa54991f895c8f59', '2025-09-22 10:06:14', '2025-09-15 16:06:14'),
(10, 11, '1565ca41308b1843092ec96dedd70a19a15ff67652cc135bcebea46a3e1cd1bf', '2025-09-22 08:18:12', '2025-09-15 16:18:12'),
(11, 11, '96ee946679e42308d021f234bea811a6dc5e9b14adba195becd02cd9d4ad5668', '2025-09-22 16:34:49', '2025-09-16 00:34:49'),
(12, 11, '2ffc897046001ff5d0269efbfbb4aca4221f5658d1087d41cbe1e37d265559ca', '2025-09-22 19:58:40', '2025-09-16 03:58:40'),
(13, 11, '937280a84e4294230a3ae6152500357c9175254f88ba49b4a6953ee23f5ef3be', '2025-09-22 22:42:28', '2025-09-16 06:42:28'),
(14, 11, 'aa0710bf3c6f6caf1966192f9a0928c686a67a7862f2a9bc4064242a50d8e0c1', '2025-09-22 23:10:24', '2025-09-16 07:10:24'),
(15, 11, 'c92a605a423dff07c1c67f887d97c04e5e9d44c7d94b24ae33928a1d7ff9c7b0', '2025-09-23 07:36:10', '2025-09-16 15:36:10'),
(16, 11, 'f21b8da14378c09eca990f9235c60be372011b6a8d521dadc6ab45e78ca8e673', '2025-09-23 16:18:18', '2025-09-17 00:18:18'),
(17, 11, 'e9114958e34f9deb817cdb54a261e539d2915610808e6b3170990cf2aac39201', '2025-09-23 16:19:39', '2025-09-17 00:19:39'),
(18, 11, '727209192d302b1161450aae859b90d3dcf26be42faa63870eccb9970b962f8d', '2025-09-23 17:21:13', '2025-09-17 01:21:13'),
(19, 26, '30a6b281026102fe7e8b942cd0691a234101bb2fb107da0e7f640c8ddb8f6d55', '2025-09-23 18:21:43', '2025-09-17 02:21:43'),
(20, 26, 'cf1c76c744146a3e1adb0fe55c47e116991c4795664568d1059ddc964f3847f8', '2025-09-23 20:39:11', '2025-09-17 04:39:11'),
(21, 26, '3285f9448afdcbb108f57e48e6cad933013a7ca5f31ab4abf2f7f070f4ddd131', '2025-09-23 20:39:41', '2025-09-17 04:39:41'),
(22, 26, '1ee6e94ade5a7d17740187ff1bed675e0f54c7b2dc675ab7422a56fb8ac07589', '2025-09-23 21:25:02', '2025-09-17 05:25:02'),
(23, 26, '60a1f65b6b3b9bb93df84920d8bfddefce0680334cedd8a9e85989c1d25d5b0b', '2025-09-23 23:59:33', '2025-09-17 07:59:33'),
(24, 26, 'ffbe8952db06de6a9a28c40d227dcc08540c0df7fc64b1617a3ab1778c0b2efc', '2025-09-24 08:48:45', '2025-09-17 16:48:45'),
(25, 26, '23b4590fea7ae4b9f333c06a36cbb10a833d42cd888d1c6f84a24d4d5141d6ba', '2025-09-25 18:08:55', '2025-09-19 02:08:55'),
(26, 26, '28a2b8795e93e8d4ff1a3653c921817d0a5dfe79e339ba40e0b434066282b684', '2025-09-25 18:09:30', '2025-09-19 02:09:30'),
(27, 11, 'e99bb03fd0c57868c51d2fac2d42dc9a853dda7f7f3c59aad082510965d7e3ca', '2025-09-25 18:11:18', '2025-09-19 02:11:18'),
(28, 26, '35e0c2be7f7af26eaaba7b49f7ccc2997ac25f51507e8cb6ba1ec68c5c7a9227', '2025-09-25 18:21:51', '2025-09-19 02:21:51'),
(29, 11, '685de05d9ee0fefd9b82f4e63812422b5d2d778c24ed9379133520b4759b1c32', '2025-09-25 18:36:34', '2025-09-19 02:36:34'),
(30, 11, 'f07d0c970f6cecfc85e89b32cf527d8813c79dca3bea7cb95ec1cc12b11c9953', '2025-09-25 19:30:02', '2025-09-19 03:30:02'),
(31, 26, 'c7d6b3e9254c3e75c0a06aba971954fc2304d66a3b3513bdc4378e084d88c28f', '2025-09-25 19:30:38', '2025-09-19 03:30:38'),
(32, 11, 'fb682b9b781534371cb8b56f0d244dc936fb65be0a6b6754841d3b83062e1679', '2025-09-25 19:51:01', '2025-09-19 03:51:01'),
(33, 11, '3f0dc315d30a8f9a076fcabd76c55692b2a303bed73c3a9522783ce5e1bec2aa', '2025-09-25 21:51:50', '2025-09-19 05:51:50'),
(34, 11, 'a25624af4c567b3cc537b9908efaa0b91013574f36eea94a937bbec56a0b0e5a', '2025-09-25 22:08:42', '2025-09-19 06:08:42'),
(35, 11, '3a321faff1f7a69ef2a3ac8dbc2c8a140bf6a095ca745b31672bc620c46d3d1c', '2025-09-26 17:01:51', '2025-09-20 01:01:51'),
(36, 11, 'f9cb12ec6e402914ae66ce59295f5ecbc8ff0cfea11529446a5030dbc2c1cd0b', '2025-09-26 19:48:43', '2025-09-20 03:48:43'),
(37, 11, '8ce747f822c85b9e9cb3d269cb671dd455cd80e0bbe106752210e1c942f41a87', '2025-09-26 21:26:38', '2025-09-20 05:26:38'),
(38, 11, '6d2560aed8b96d7a03575df07e1b2c4faf4a476c343584ea35ecbf6d645f74b9', '2025-09-26 21:29:37', '2025-09-20 05:29:37'),
(39, 11, 'f0ad1c3d8fcbf9d75fcea67d262482493454bdf12561a30ca0665918cd8a3065', '2025-09-26 21:32:19', '2025-09-20 05:32:19'),
(40, 11, '1a0585fec144af80874cb072b42d4d01362a49134fc4e642c27b8f8074014ca1', '2025-09-26 21:36:12', '2025-09-20 05:36:12'),
(41, 11, 'ef3e63e44170e6cc919addb75d8a610c3e3ff59de59a5bc01675022176289051', '2025-09-26 21:41:51', '2025-09-20 05:41:51'),
(42, 11, 'a59cbb60daeb588ba006a86f9f8a701fd42543f408ab4542ced8d880f8fa416c', '2025-09-27 01:45:21', '2025-09-20 09:45:21'),
(43, 11, '1d96d188f71de0ef3f2b21c63861fbc310a98595a6d170dc9308617b55d408a7', '2025-09-27 09:48:04', '2025-09-20 17:48:04'),
(44, 11, '7a5da5f65e6f0b0cfaa38ec61aac6d7035e25153ba85cf5338fa0004cc345d16', '2025-09-27 18:38:31', '2025-09-21 02:38:31'),
(45, 11, '7f7e131e032c33c0bb2a5f68640d69f47b86ca265b5b09f84f4794de6222d3d8', '2025-09-27 20:41:44', '2025-09-21 04:41:44'),
(46, 11, '0880a8cbd0524b4f6b3aa68735dd9df69ee0c5b6b3805c7832e43a8dc8dc124f', '2025-09-27 23:25:09', '2025-09-21 07:25:09'),
(47, 11, '5bf049097d1a3fdc5e62d0eb50c576e2881855da83739c8c838bd936798b403f', '2025-09-28 05:48:30', '2025-09-21 13:48:30'),
(48, 11, 'e49d8c85501d0700e99c891e5a44919b7687cbdd99ab5a064715f28e4ce3af23', '2025-09-28 07:47:26', '2025-09-21 15:47:26'),
(49, 11, 'b563ed2f00d3e13723aa878099fef19b57d2beb35b0d8021c2574efbf6ab1e07', '2025-09-28 15:12:07', '2025-09-21 23:12:07'),
(50, 11, '2ad47175149ace66bc30b869af81c5a7916327b335c11a50b88c1b2b1cf68752', '2025-09-28 17:13:28', '2025-09-22 01:13:28'),
(51, 11, '5224e9947ab6bdbbce58f138003c7f45c2fea8fbcb4410ecd294b9d190fe210c', '2025-09-29 05:20:43', '2025-09-22 13:20:43'),
(52, 11, '1754cf31ecd5bd612e19177b032cacbd5c8b0e85c8e74d54617aa5efcfecdc4e', '2025-09-29 06:18:03', '2025-09-22 14:18:03'),
(53, 11, '87062335c67578be99417c4d091c14c59b362777768857c956add31c70c3dd2d', '2025-09-29 15:23:25', '2025-09-22 23:23:25'),
(54, 11, '89d59dd225a34c7108eeb553648485c00a93c7571b3765ce28fbb9c52ffcdef2', '2025-09-29 15:36:34', '2025-09-22 23:36:34'),
(55, 11, '3ed34d1500006314fe858c497657d837fd97636b0f6ddaba7c3b167586e029a9', '2025-09-29 17:52:00', '2025-09-23 01:52:00'),
(56, 11, 'dbba28193417bb442837c0eda0de1a934076951f157ccd6508287a2def309167', '2025-09-29 20:39:51', '2025-09-23 04:39:51'),
(57, 11, 'e418a52c7ef02412234215b26ad6e6107bcd508ab57fa2dc4a8805f262498391', '2025-09-29 20:45:04', '2025-09-23 04:45:04'),
(58, 11, '6c76859eb730a256d22ee4c6f63e50f0f30cf278d28c938329397121173a6d8b', '2025-09-29 20:45:10', '2025-09-23 04:45:10'),
(59, 26, '1d590f2c505413b669c045214630040cf5e3ab8785862671ec302a5c144008dc', '2025-09-29 20:45:43', '2025-09-23 04:45:43'),
(60, 26, '29ab8b4e59ae1828fd1c9e97063a5db4c2bdba423c0cc8b6faaaacba5f8fa5d3', '2025-09-29 21:38:46', '2025-09-23 05:38:46'),
(61, 26, '4e1c250881a7a6f568af45e2517d11d477900a14b3b2449b44eb845f84665149', '2025-09-30 01:13:51', '2025-09-23 09:13:51'),
(62, 26, 'b2430812c83b9c8ed47302c1185c25285ea748606c5569a2292b87f36e730bf1', '2025-09-30 07:37:56', '2025-09-23 15:37:56'),
(63, 11, 'c563ea8b5afea531c27daf50da5459db9e26467684140ddac246a6e261089364', '2025-09-30 09:42:57', '2025-09-23 17:42:57'),
(64, 26, '3a0d9f0dfbc6145521799272c378fdebecf762c3be5778a56d85860636df5a81', '2025-09-30 09:43:13', '2025-09-23 17:43:13'),
(65, 11, '86267ad98a0b6a7088ba2b48cdae1d9fce5d206728093efd85107ff6d9d621d7', '2025-09-30 09:49:41', '2025-09-23 17:49:41'),
(66, 11, '3467326c57cbc9273590989b95ebd751670b2a6f296546f64e154ac941974438', '2025-09-30 15:49:02', '2025-09-23 23:49:02'),
(67, 26, '9fc7a0ba86d039e96b09bc7f4bca35b10ff84a9956a0930ff192a20982695378', '2025-09-30 15:49:27', '2025-09-23 23:49:27'),
(68, 11, 'fad0d6c3b7468b476825d6fe402774ab7decf2e077a7d65de2595c15671f3045', '2025-09-30 16:38:01', '2025-09-24 00:38:01'),
(69, 11, 'a59fbba072a9100d9d1ef99039f0e48435eef2cb81a42f87d0c01c217eb855cc', '2025-09-30 16:40:14', '2025-09-24 00:40:14'),
(70, 26, 'a04ec308a0885c0abd529ae9382f0d3b194639d4b04afbb16cf1a79e4564ccc4', '2025-09-30 16:41:00', '2025-09-24 00:41:00'),
(71, 11, 'ecc9cacd1b70447ed03cd37299e7775488aecc6492deeae83a94639ee7147a62', '2025-09-30 16:59:51', '2025-09-24 00:59:51'),
(72, 26, 'db8fc1835da971d0615f9fbe58cb6f14b81cb68f66c55032ad47f422ed8fa7f8', '2025-09-30 17:02:24', '2025-09-24 01:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `testertypes`
--

CREATE TABLE `testertypes` (
  `TesterTypeID` int(11) NOT NULL,
  `TesterTypeName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testertypes`
--

INSERT INTO `testertypes` (`TesterTypeID`, `TesterTypeName`) VALUES
(1, 'Personal Tester'),
(2, 'Canteen Tester'),
(3, 'Restaurant Tester'),
(4, 'Cafeteria Tester'),
(5, 'Catering Tester');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `role` enum('User','Admin') DEFAULT 'User',
  `account_status` enum('active','inactive') DEFAULT 'active',
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_otp` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `tester_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `email`, `contact_number`, `role`, `account_status`, `password_hash`, `created_at`, `updated_at`, `reset_otp`, `otp_expiry`, `tester_type_id`) VALUES
(11, 'Mark', 'Laurence', 'Mark', 'marktiktok525@gmail.com', '09999999999', 'User', 'active', '$2b$10$lr.Qtvu1ML2FyxojlXReC.PDu.f1cUcBBePOUSVwv05zKITn0uXP.', '2025-07-03 15:39:36', '2025-09-01 11:52:23', NULL, NULL, 1),
(22, 'mark', 'caringal', 'ybaha', 'marklaurencecaringal1@gmail.com', '09848705548', 'User', 'active', '$2b$10$E5UDZC47ReShfI3t.HqrteQSg2pVWUL3On1s6DxhNtR5EjllVQ1h6', '2025-07-14 02:32:59', '2025-08-17 12:50:22', NULL, NULL, 2),
(23, 'ee', 'User', 'ee', 'ee@gmail.com', NULL, 'User', 'active', '$2b$10$0nlymAoDDwtoP1c3Mb47ceX0kQkQ7cRzs9j562e6b70Tej9uHnHVS', '2025-07-14 01:21:46', '2025-08-17 12:50:22', NULL, NULL, 3),
(26, 'mark', 'User', 'Mark23', 'marklaurencecaringal7@gmail.com', '09888727372', 'Admin', 'active', '$2b$10$N93mwQPUZx1flvIayMh1ZuYEVZN.E09zfiS0E/J80hGqS1SvntJF2', '2025-07-09 05:56:06', '2025-08-17 12:50:22', NULL, NULL, 4),
(30, 'mark', 'baa', 'abna', 'hahah@gmail.com', '098558758668', 'User', 'active', '$2b$10$fXQKRY.ung923C23Rq7cL.DmAT94N01TF8p2NsFkdgs7a0ngPo3CS', '2025-07-20 12:37:39', '2025-08-17 12:50:22', NULL, NULL, 5),
(31, 'Mark', 'Laurence', 'Markll', 'benzoncarl010@gmail.com', '0998484484', 'User', 'active', '$2b$10$9pJqr6UQIVU7qhIhJBcKDONXwMAxsDpWgMlMrK8p9HmZ9CRudzGTS', '2025-07-28 05:07:03', '2025-08-17 12:50:22', NULL, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `sensor_id` (`sensor_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `food_id` (`food_id`),
  ADD KEY `alert_type` (`alert_type`),
  ADD KEY `is_ml_generated` (`is_ml_generated`),
  ADD KEY `is_resolved` (`is_resolved`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`food_id`),
  ADD KEY `sensor_id` (`sensor_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `scan_status` (`scan_status`);

--
-- Indexes for table `food_scan_sessions`
--
ALTER TABLE `food_scan_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `status` (`status`),
  ADD KEY `started_at` (`started_at`);

--
-- Indexes for table `ml_models`
--
ALTER TABLE `ml_models`
  ADD PRIMARY KEY (`model_id`),
  ADD UNIQUE KEY `model_version` (`model_name`,`model_version`),
  ADD KEY `is_active` (`is_active`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `ml_predictions`
--
ALTER TABLE `ml_predictions`
  ADD PRIMARY KEY (`prediction_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `food_id` (`food_id`),
  ADD KEY `spoilage_status` (`spoilage_status`),
  ADD KEY `is_training_data` (`is_training_data`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `ml_training_data`
--
ALTER TABLE `ml_training_data`
  ADD PRIMARY KEY (`training_id`),
  ADD KEY `food_category` (`food_category`),
  ADD KEY `actual_spoilage_status` (`actual_spoilage_status`),
  ADD KEY `data_source` (`data_source`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `readings`
--
ALTER TABLE `readings`
  ADD PRIMARY KEY (`reading_id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Indexes for table `sensor`
--
ALTER TABLE `sensor`
  ADD PRIMARY KEY (`sensor_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `testertypes`
--
ALTER TABLE `testertypes`
  ADD PRIMARY KEY (`TesterTypeID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=422;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `food_scan_sessions`
--
ALTER TABLE `food_scan_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `ml_models`
--
ALTER TABLE `ml_models`
  MODIFY `model_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ml_predictions`
--
ALTER TABLE `ml_predictions`
  MODIFY `prediction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `ml_training_data`
--
ALTER TABLE `ml_training_data`
  MODIFY `training_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `readings`
--
ALTER TABLE `readings`
  MODIFY `reading_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `sensor`
--
ALTER TABLE `sensor`
  MODIFY `sensor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9538;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `testertypes`
--
ALTER TABLE `testertypes`
  MODIFY `TesterTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`sensor_id`),
  ADD CONSTRAINT `alerts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `alerts_ibfk_3` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`sensor_id`),
  ADD CONSTRAINT `food_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `food_scan_sessions`
--
ALTER TABLE `food_scan_sessions`
  ADD CONSTRAINT `food_scan_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ml_predictions`
--
ALTER TABLE `ml_predictions`
  ADD CONSTRAINT `ml_predictions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `ml_predictions_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `readings`
--
ALTER TABLE `readings`
  ADD CONSTRAINT `readings_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`sensor_id`);

--
-- Constraints for table `sensor`
--
ALTER TABLE `sensor`
  ADD CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
