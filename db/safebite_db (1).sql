-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 21, 2025 at 08:12 AM
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
(137, 11, 'Updated expiry date for food item ID 3 to 2025-09-22', '2025-09-21 04:47:35');

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
(1, NULL, 11, 1, 'ML Prediction: Tomato may be unsafe (50% probability)', 'High', 'ml_prediction', 1, 50.00, NULL, 1, 70.00, NULL, 0, NULL, NULL, '2025-09-21 04:47:34');

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
(1, 11, 'Performance Issue', 'High', 'slow and lags', 'Mark Laurence', 'marktiktok525@gmail.com', 5, 'Positive', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-09-21 03:49:54', '2025-09-21 03:49:54');

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
(1, 'Tomato', 'Vegetables', '2025-09-22', 13, 11, 'analyzed', '2025-09-21 04:47:31', '2025-09-21 04:47:31', '2025-09-21 06:07:09'),
(2, 'Tomato', 'Vegetables', '2025-09-22', 14, 11, 'analyzed', '2025-09-21 04:47:31', '2025-09-21 04:47:31', '2025-09-21 04:47:35'),
(3, 'Tomato', 'Vegetables', '2025-09-22', 15, 11, 'analyzed', '2025-09-21 04:47:31', '2025-09-21 04:47:31', '2025-09-21 04:47:35');

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
(1, 11, 1, 'Tomato', 'Vegetables', 30.20, 83.00, 57.00, 50.00, 'unsafe', 70.00, '1.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-09-21T04:47:34.296Z\",\"model_type\":\"smart_training_db\",\"source_details\":{\"centroids\":{\"unsafe\":{\"t\":30.2,\"h\":83,\"g\":57,\"n\":1}}}}', '[\"Refrigerate immediately\",\"Monitor gas levels closely\",\"Inspect for mold or discoloration\"]', 1, NULL, NULL, '2025-09-21 04:47:34');

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
(1, 'Tomato', 'Vegetables', 30.20, 83.00, 57.00, 'unsafe', NULL, '{\"ai_analysis\":true,\"confidence\":\"65\",\"storage_conditions\":{\"temperature\":30.200000762939453,\"humidity\":83,\"gas_level\":57,\"timestamp\":\"2025-09-21T04:47:34.275Z\"},\"timestamp\":\"2025-09-21T04:47:34.280Z\"}', 'expert', 0.95, '2025-09-21 04:47:34', '2025-09-21 04:47:34');

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
(1, 13, 30.2, '°C', '2025-09-21 04:47:30'),
(2, 14, 83, '%', '2025-09-21 04:47:30'),
(3, 15, 57, 'ppm', '2025-09-21 04:47:30');

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
(1011, 'Temperature', NULL, 1, '2025-09-17 11:52:37', '2025-09-17 11:52:37');

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
(45, 11, '7f7e131e032c33c0bb2a5f68640d69f47b86ca265b5b09f84f4794de6222d3d8', '2025-09-27 20:41:44', '2025-09-21 04:41:44');

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
(26, 'mark', 'User', 'Mark23', 'marklaurencecaringal7@gmail.com', NULL, 'Admin', 'active', '$2b$10$N93mwQPUZx1flvIayMh1ZuYEVZN.E09zfiS0E/J80hGqS1SvntJF2', '2025-07-09 05:56:06', '2025-08-17 12:50:22', NULL, NULL, 4),
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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `food_scan_sessions`
--
ALTER TABLE `food_scan_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ml_models`
--
ALTER TABLE `ml_models`
  MODIFY `model_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ml_predictions`
--
ALTER TABLE `ml_predictions`
  MODIFY `prediction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ml_training_data`
--
ALTER TABLE `ml_training_data`
  MODIFY `training_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `readings`
--
ALTER TABLE `readings`
  MODIFY `reading_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sensor`
--
ALTER TABLE `sensor`
  MODIFY `sensor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1013;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

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