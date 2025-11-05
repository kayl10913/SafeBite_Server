-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2025 at 12:31 PM
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
(1, 11, 'User logged out successfully', '2025-10-22 01:18:07'),
(2, 11, 'User logged in successfully', '2025-10-22 13:13:26'),
(3, 11, 'AI analysis performed for Banana', '2025-10-22 13:13:51'),
(4, 11, 'AI analysis performed for Banana', '2025-10-22 13:13:56'),
(5, 11, 'Updated expiry date for food item ID 1 to 2025-10-24', '2025-10-22 13:13:56'),
(6, 11, 'Updated expiry date for food item ID 2 to 2025-10-24', '2025-10-22 13:13:56'),
(7, 11, 'Updated expiry date for food item ID 3 to 2025-10-24', '2025-10-22 13:13:56'),
(8, 11, 'User logged in successfully', '2025-10-23 11:33:43'),
(9, 11, 'AI analysis performed for Banana', '2025-10-23 11:34:17'),
(10, 11, 'AI analysis performed for Banana', '2025-10-23 11:34:21'),
(11, 11, 'Updated expiry date for food item ID 2 to 2025-10-25', '2025-10-23 11:34:21'),
(12, 11, 'Updated expiry date for food item ID 3 to 2025-10-25', '2025-10-23 11:34:21'),
(13, 11, 'Updated expiry date for food item ID 1 to 2025-10-25', '2025-10-23 11:34:21'),
(14, 11, 'User logged in successfully', '2025-10-24 12:07:58'),
(15, 11, 'AI analysis performed for Banana', '2025-10-24 12:08:33'),
(16, 11, 'AI analysis performed for Banana', '2025-10-24 12:08:36'),
(17, 11, 'Updated expiry date for food item ID 1 to 2025-10-26', '2025-10-24 12:08:36'),
(18, 11, 'Updated expiry date for food item ID 2 to 2025-10-26', '2025-10-24 12:08:36'),
(19, 11, 'Updated expiry date for food item ID 3 to 2025-10-26', '2025-10-24 12:08:36'),
(20, 11, 'User logged in successfully', '2025-10-25 05:16:02'),
(21, 11, 'User logged out successfully', '2025-10-25 05:16:26'),
(22, 11, 'User logged in successfully', '2025-10-25 05:16:37'),
(23, 11, 'User logged out successfully', '2025-10-25 05:18:02'),
(24, 11, 'User logged in successfully', '2025-10-25 05:18:14'),
(25, 11, 'AI analysis performed for Banana', '2025-10-25 05:22:45'),
(26, 11, 'AI analysis performed for Banana', '2025-10-25 05:22:49'),
(27, 11, 'Updated expiry date for food item ID 1 to 2025-10-27', '2025-10-25 05:22:49'),
(28, 11, 'Updated expiry date for food item ID 2 to 2025-10-27', '2025-10-25 05:22:49'),
(29, 11, 'Updated expiry date for food item ID 3 to 2025-10-27', '2025-10-25 05:22:49'),
(30, 11, 'ML prediction performed for Banana (caution)', '2025-10-25 05:25:54'),
(31, 11, 'Created Medium alert: ML Prediction: Banana is CAUTION (50% probability)', '2025-10-25 05:25:54'),
(32, 11, 'User logged in successfully', '2025-10-26 07:21:25'),
(33, 11, 'AI analysis performed for Banana', '2025-10-26 07:22:05'),
(34, 11, 'AI analysis performed for Banana', '2025-10-26 07:22:08'),
(35, 11, 'Updated expiry date for food item ID 1 to 2025-10-28', '2025-10-26 07:22:08'),
(36, 11, 'Updated expiry date for food item ID 2 to 2025-10-28', '2025-10-26 07:22:08'),
(37, 11, 'Updated expiry date for food item ID 3 to 2025-10-28', '2025-10-26 07:22:08'),
(38, 11, 'AI analysis performed for Banana', '2025-10-26 07:26:26'),
(39, 11, 'AI analysis performed for Banana', '2025-10-26 07:26:28'),
(40, 11, 'Updated expiry date for food item ID 3 to 2025-10-28', '2025-10-26 07:26:28'),
(41, 11, 'Updated expiry date for food item ID 1 to 2025-10-28', '2025-10-26 07:26:28'),
(42, 11, 'Updated expiry date for food item ID 2 to 2025-10-28', '2025-10-26 07:26:28'),
(43, 11, 'User logged out successfully', '2025-10-26 07:27:00'),
(44, 26, 'Admin logged in successfully', '2025-10-28 01:23:05'),
(45, 26, 'Updated Training Data (ID: 6)', '2025-10-28 01:39:04'),
(46, 26, 'Updated Training Data (ID: 6)', '2025-10-28 01:43:38'),
(47, 26, 'Updated Training Data (ID: 6)', '2025-10-28 01:49:35'),
(48, 26, 'Updated Training Data (ID: 6)', '2025-10-28 02:46:10'),
(49, 26, 'Updated Training Data (ID: 6)', '2025-10-28 04:48:55'),
(50, 26, 'Updated Training Data (ID: 6)', '2025-10-28 04:55:37'),
(51, 26, 'Admin logged in successfully', '2025-11-01 00:34:06'),
(52, 26, 'Updated Training Data (ID: 6)', '2025-11-01 00:49:20'),
(53, 26, 'Updated Training Data (ID: 6)', '2025-11-01 01:05:06'),
(54, 26, 'Updated Training Data (ID: 6)', '2025-11-01 01:11:30'),
(55, 26, 'Updated Training Data (ID: 6)', '2025-11-01 01:17:48'),
(56, 26, 'Updated Training Data (ID: 6)', '2025-11-01 01:21:44'),
(57, 26, 'Updated Training Data (ID: 6)', '2025-11-01 01:27:16'),
(58, 26, 'Admin logged in successfully', '2025-11-02 00:16:14'),
(59, 26, 'User logged out successfully', '2025-11-02 00:24:41'),
(60, 11, 'User logged in successfully', '2025-11-02 00:24:56'),
(61, 11, 'User logged out successfully', '2025-11-02 02:22:35'),
(62, 11, 'User logged in successfully', '2025-11-03 10:44:44');

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
(1, NULL, 11, 3, 'SmartSense: Patatas is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":27.600000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:00:10.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.69999694824219,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:00:10.000Z\",\"status\":\"online\"},\"gas\":{\"value\":60,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:00:10.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:00:13.008Z\"}', 0, NULL, NULL, '2025-10-09 01:00:13'),
(2, NULL, 11, 3, 'SmartSense: Patatas is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":27.700000762939453,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:03:39.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.5999984741211,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:03:39.000Z\",\"status\":\"online\"},\"gas\":{\"value\":47,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:03:39.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:03:42.805Z\"}', 0, NULL, NULL, '2025-10-09 01:03:42'),
(3, NULL, 11, 1, 'SmartSense: Patatas is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":27.799999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:12:20.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:12:20.000Z\",\"status\":\"online\"},\"gas\":{\"value\":49,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:12:20.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:12:23.371Z\"}', 0, NULL, NULL, '2025-10-09 01:12:23'),
(4, NULL, 11, 1, 'SmartSense: Patatas is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":27.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:16:37.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:16:37.000Z\",\"status\":\"online\"},\"gas\":{\"value\":46,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:16:37.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:16:41.636Z\"}', 0, NULL, NULL, '2025-10-09 01:16:41'),
(5, NULL, 11, 1, 'ML Prediction: Patatas may be unsafe (72% probability)', 'High', 'ml_prediction', 5, 72.00, 'Discard immediately and sanitize storage area.', 1, 75.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":27.899999618530273,\"humidity\":82.69999694824219,\"gas_level\":48},\"prediction_id\":5,\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\"},\"recommendations\":{\"main\":\"Food is likely spoiled. Do not consume.\",\"details\":[\"Dispose of immediately\",\"Check other food items in storage\",\"Clean storage area thoroughly\",\"Review storage conditions\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]},\"timestamp\":\"2025-10-09T01:17:13.334Z\"}', 0, NULL, NULL, '2025-10-09 01:17:13'),
(6, NULL, 11, 1, 'SmartSense: Patatas is UNSAFE', 'High', 'sensor', 5, 72.00, 'Discard immediately and sanitize storage area.', 0, 72.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-10-09T01:17:13.352Z\"}', 0, NULL, NULL, '2025-10-09 01:17:13'),
(7, NULL, 11, 1, 'SmartSense: Patatas is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:21:53.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:21:53.000Z\",\"status\":\"online\"},\"gas\":{\"value\":46,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:21:53.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:21:57.595Z\"}', 0, NULL, NULL, '2025-10-09 01:21:57'),
(8, NULL, 11, 6, 'SmartSense: Potato is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:22:21.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:22:21.000Z\",\"status\":\"online\"},\"gas\":{\"value\":47,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:22:21.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:22:25.175Z\"}', 0, NULL, NULL, '2025-10-09 01:22:25'),
(9, NULL, 11, 6, 'SmartSense: Potato is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:23:07.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:23:07.000Z\",\"status\":\"online\"},\"gas\":{\"value\":47,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:23:07.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:23:11.245Z\"}', 0, NULL, NULL, '2025-10-09 01:23:11'),
(10, NULL, 11, 4, 'ML Prediction: Potato may be caution (50% probability)', 'Medium', 'ml_prediction', 9, 50.00, 'Consume soon or improve storage conditions.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":28,\"humidity\":83.0999984741211,\"gas_level\":72},\"prediction_id\":9,\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\"},\"recommendations\":{\"main\":\"Food shows signs of deterioration. Consume soon.\",\"details\":[\"Use within 24 hours\",\"Check for visible signs of spoilage\",\"Consider cooking thoroughly before consumption\",\"Monitor temperature and humidity\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]},\"timestamp\":\"2025-10-09T01:25:19.688Z\"}', 0, NULL, NULL, '2025-10-09 01:25:19'),
(11, NULL, 11, 4, 'SmartSense: Potato is CAUTION', 'Medium', 'sensor', 9, 50.00, 'Consume soon or improve storage conditions.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-10-09T01:25:19.712Z\"}', 0, NULL, NULL, '2025-10-09 01:25:19'),
(12, NULL, 11, 9, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.100000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:35:00.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.30000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:35:00.000Z\",\"status\":\"online\"},\"gas\":{\"value\":65,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:35:00.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:35:03.845Z\"}', 0, NULL, NULL, '2025-10-09 01:35:03'),
(13, NULL, 11, 8, 'ML Prediction: Carrot may be caution (50% probability)', 'Medium', 'ml_prediction', 11, 50.00, 'Consume soon or improve storage conditions.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":28.100000381469727,\"humidity\":83.4000015258789,\"gas_level\":49},\"prediction_id\":11,\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\"},\"recommendations\":{\"main\":\"Food shows signs of deterioration. Consume soon.\",\"details\":[\"Use within 24 hours\",\"Check for visible signs of spoilage\",\"Consider cooking thoroughly before consumption\",\"Monitor temperature and humidity\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\",\"High gas levels detected - check for spoilage\"]},\"timestamp\":\"2025-10-09T01:37:55.357Z\"}', 0, NULL, NULL, '2025-10-09 01:37:55'),
(14, NULL, 11, 8, 'SmartSense: Carrot is CAUTION', 'Medium', 'sensor', 11, 50.00, 'Consume soon or improve storage conditions.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-10-09T01:37:55.373Z\"}', 0, NULL, NULL, '2025-10-09 01:37:55'),
(15, NULL, 11, 8, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.299999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T09:58:26.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.5999984741211,\"unit\":\"%\",\"timestamp\":\"2025-10-09T09:58:26.000Z\",\"status\":\"online\"},\"gas\":{\"value\":42,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T09:58:26.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T01:58:30.246Z\"}', 0, NULL, NULL, '2025-10-09 01:58:30'),
(16, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.299999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:00:51.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.5,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:00:51.000Z\",\"status\":\"online\"},\"gas\":{\"value\":42,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:00:51.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:00:55.671Z\"}', 0, NULL, NULL, '2025-10-09 02:00:55'),
(17, NULL, 11, 8, 'ML Prediction: Carrot may be caution (50% probability)', 'Medium', 'ml_prediction', 14, 50.00, 'Consume soon or improve storage conditions.', 1, 76.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":28.299999237060547,\"humidity\":83.5,\"gas_level\":40},\"prediction_id\":14,\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\"},\"recommendations\":{\"main\":\"Food shows signs of deterioration. Consume soon.\",\"details\":[\"Use within 24 hours\",\"Check for visible signs of spoilage\",\"Consider cooking thoroughly before consumption\",\"Monitor temperature and humidity\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\"]},\"timestamp\":\"2025-10-09T02:01:39.417Z\"}', 0, NULL, NULL, '2025-10-09 02:01:39'),
(18, NULL, 11, 8, 'SmartSense: Carrot is CAUTION', 'Medium', 'sensor', 14, 50.00, 'Consume soon or improve storage conditions.', 0, 50.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"timestamp\":\"2025-10-09T02:01:39.429Z\"}', 0, NULL, NULL, '2025-10-09 02:01:39'),
(19, NULL, 11, 8, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.299999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:04:55.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.4000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:04:55.000Z\",\"status\":\"online\"},\"gas\":{\"value\":40,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:04:55.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:05:00.127Z\"}', 0, NULL, NULL, '2025-10-09 02:05:00'),
(20, NULL, 11, 12, 'SmartSense: Banana is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:08:02.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.4000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:08:02.000Z\",\"status\":\"online\"},\"gas\":{\"value\":50,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:08:02.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:08:06.151Z\"}', 0, NULL, NULL, '2025-10-09 02:08:06'),
(21, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:13:32.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.30000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:13:32.000Z\",\"status\":\"online\"},\"gas\":{\"value\":40,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:13:32.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:13:36.199Z\"}', 0, NULL, NULL, '2025-10-09 02:13:36'),
(22, NULL, 11, 9, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.5,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:18:40.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.4000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:18:40.000Z\",\"status\":\"online\"},\"gas\":{\"value\":38,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:18:40.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:18:44.859Z\"}', 0, NULL, NULL, '2025-10-09 02:18:44'),
(23, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.5,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:20:33.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.4000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:20:33.000Z\",\"status\":\"online\"},\"gas\":{\"value\":41,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:20:33.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:20:37.511Z\"}', 0, NULL, NULL, '2025-10-09 02:20:37'),
(24, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.600000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:24:31.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.30000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:24:31.000Z\",\"status\":\"online\"},\"gas\":{\"value\":35,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:24:31.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:24:34.741Z\"}', 0, NULL, NULL, '2025-10-09 02:24:34'),
(25, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.600000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:31:14.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":83.0999984741211,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:31:14.000Z\",\"status\":\"online\"},\"gas\":{\"value\":34,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:31:14.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:31:17.618Z\"}', 0, NULL, NULL, '2025-10-09 02:31:17'),
(26, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.799999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:39:00.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:39:00.000Z\",\"status\":\"online\"},\"gas\":{\"value\":42,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:39:00.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:39:03.176Z\"}', 0, NULL, NULL, '2025-10-09 02:39:03'),
(27, NULL, 11, 15, 'SmartSense: Garlic is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.799999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:41:24.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:41:24.000Z\",\"status\":\"online\"},\"gas\":{\"value\":34,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:41:24.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:41:28.746Z\"}', 0, NULL, NULL, '2025-10-09 02:41:28'),
(28, NULL, 11, 18, 'SmartSense: Onion is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":28.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:44:03.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.69999694824219,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:44:03.000Z\",\"status\":\"online\"},\"gas\":{\"value\":35,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:44:03.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:44:07.659Z\"}', 0, NULL, NULL, '2025-10-09 02:44:07'),
(29, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.100000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:55:25.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.5999984741211,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:55:25.000Z\",\"status\":\"online\"},\"gas\":{\"value\":35,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:55:25.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:55:31.717Z\"}', 0, NULL, NULL, '2025-10-09 02:55:31'),
(30, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.100000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T10:58:14.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.30000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T10:58:14.000Z\",\"status\":\"online\"},\"gas\":{\"value\":32,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T10:58:14.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T02:58:17.925Z\"}', 0, NULL, NULL, '2025-10-09 02:58:17'),
(31, NULL, 11, 21, 'SmartSense: Pork is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.200000762939453,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:03:48.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.0999984741211,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:03:48.000Z\",\"status\":\"online\"},\"gas\":{\"value\":34,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:03:48.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:03:52.298Z\"}', 0, NULL, NULL, '2025-10-09 03:03:52'),
(32, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.299999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:09:42.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:09:42.000Z\",\"status\":\"online\"},\"gas\":{\"value\":36,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:09:42.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:09:46.786Z\"}', 0, NULL, NULL, '2025-10-09 03:09:46'),
(33, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.399999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:12:09.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:12:09.000Z\",\"status\":\"online\"},\"gas\":{\"value\":35,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:12:09.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:12:15.382Z\"}', 0, NULL, NULL, '2025-10-09 03:12:15'),
(34, NULL, 11, 24, 'SmartSense: Chicken is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.5,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:18:17.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:18:17.000Z\",\"status\":\"online\"},\"gas\":{\"value\":34,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:18:17.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:18:21.675Z\"}', 0, NULL, NULL, '2025-10-09 03:18:21'),
(35, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.600000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:24:17.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":81.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:24:17.000Z\",\"status\":\"online\"},\"gas\":{\"value\":36,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:24:17.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:24:21.648Z\"}', 0, NULL, NULL, '2025-10-09 03:24:21'),
(36, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.600000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:25:15.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":81.9000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:25:15.000Z\",\"status\":\"online\"},\"gas\":{\"value\":35,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:25:15.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:25:19.115Z\"}', 0, NULL, NULL, '2025-10-09 03:25:19'),
(37, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.600000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:31:09.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":81.80000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:31:09.000Z\",\"status\":\"online\"},\"gas\":{\"value\":36,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:31:09.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:31:13.409Z\"}', 0, NULL, NULL, '2025-10-09 03:31:13'),
(38, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.799999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T11:50:42.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":81.80000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T11:50:42.000Z\",\"status\":\"online\"},\"gas\":{\"value\":39,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T11:50:42.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T03:50:45.321Z\"}', 0, NULL, NULL, '2025-10-09 03:50:45'),
(39, NULL, 11, 27, 'SmartSense: Cabbage is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:00:15.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":81.69999694824219,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:00:15.000Z\",\"status\":\"online\"},\"gas\":{\"value\":37,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:00:15.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T04:00:19.729Z\"}', 1, '2025-10-09 04:30:52', 11, '2025-10-09 04:00:19'),
(40, NULL, 11, 26, 'SmartSense: Cabbage is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:04:42.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":81.69999694824219,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:04:42.000Z\",\"status\":\"online\"},\"gas\":{\"value\":36,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:04:42.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T04:04:46.493Z\"}', 1, '2025-10-09 04:27:23', 11, '2025-10-09 04:04:46'),
(41, NULL, 11, 7, 'SmartSense: Carrot is UNSAFE', 'High', 'sensor', NULL, 30.00, 'Discard immediately and sanitize storage area.', 0, 30.00, '{\"source\":\"smartsense_scanner\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:15:53.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.5999984741211,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:15:53.000Z\",\"status\":\"online\"},\"gas\":{\"value\":40,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:15:53.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"timestamp\":\"2025-10-09T04:15:56.706Z\"}', 1, '2025-10-09 04:27:20', 11, '2025-10-09 04:15:56'),
(42, NULL, 11, 25, 'ML Prediction: Cabbage is UNSAFE (30% probability)', 'High', 'ml_prediction', NULL, 30.00, 'Discard immediately and sanitize storage area.', 1, 30.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:30:00.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.5999984741211,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:30:00.000Z\",\"status\":\"online\"},\"gas\":{\"value\":40,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:30:00.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"confidence_score\":30,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T04:30:04.248Z\"}', 1, '2025-10-09 04:30:49', 11, '2025-10-09 04:30:04'),
(43, NULL, 11, 25, 'ML Prediction: Cabbage is UNSAFE (30% probability)', 'High', 'ml_prediction', NULL, 30.00, 'Discard immediately and sanitize storage area.', 1, 30.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:31:13.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.5,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:31:13.000Z\",\"status\":\"online\"},\"gas\":{\"value\":42,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:31:13.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"confidence_score\":30,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T04:31:16.871Z\"}', 0, NULL, NULL, '2025-10-09 04:31:16'),
(44, NULL, 11, 25, 'ML Prediction: Cabbage may be caution (50% probability)', 'Medium', 'ml_prediction', 40, 50.00, 'Consume soon or improve storage conditions.', 1, 78.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":29.899999618530273,\"humidity\":82.4000015258789,\"gas_level\":45},\"prediction_id\":40,\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\"},\"recommendations\":{\"main\":\"Food is safe to consume. Continue monitoring.\",\"details\":[\"Maintain current storage conditions\",\"Check again in 24-48 hours\",\"Store at optimal temperature (4°C)\",\"Environmental conditions are poor - improve storage conditions\",\"High humidity detected for general. Use dehumidifier or store in drier location.\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\"]},\"timestamp\":\"2025-10-09T04:35:29.769Z\"}', 0, NULL, NULL, '2025-10-09 04:35:29'),
(45, NULL, 11, 25, 'ML Prediction: Cabbage is CAUTION (50% probability)', 'Medium', 'ml_prediction', 40, 50.00, 'Consume soon or improve storage conditions.', 1, 50.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"spoilage_score\":50,\"confidence_score\":78,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T04:35:29.781Z\"}', 0, NULL, NULL, '2025-10-09 04:35:29'),
(46, NULL, 11, 28, 'ML Prediction: Tomato is UNSAFE (30% probability)', 'High', 'ml_prediction', NULL, 30.00, 'Discard immediately and sanitize storage area.', 1, 30.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":29.899999618530273,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:36:40.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.30000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:36:40.000Z\",\"status\":\"online\"},\"gas\":{\"value\":44,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:36:40.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"confidence_score\":30,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T04:36:45.161Z\"}', 0, NULL, NULL, '2025-10-09 04:36:45'),
(47, NULL, 11, 28, 'ML Prediction: Tomato is UNSAFE (30% probability)', 'High', 'ml_prediction', NULL, 30.00, 'Discard immediately and sanitize storage area.', 1, 30.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":30,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:39:54.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82.4000015258789,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:39:54.000Z\",\"status\":\"online\"},\"gas\":{\"value\":44,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:39:54.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"confidence_score\":30,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T04:39:57.786Z\"}', 0, NULL, NULL, '2025-10-09 04:39:57'),
(48, NULL, 11, 25, 'ML Prediction: Cabbage is UNSAFE (30% probability)', 'High', 'ml_prediction', NULL, 30.00, 'Discard immediately and sanitize storage area.', 1, 30.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":30,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:45:20.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:45:20.000Z\",\"status\":\"online\"},\"gas\":{\"value\":44,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:45:21.000Z\",\"status\":\"online\"}},\"spoilage_score\":30,\"confidence_score\":30,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T04:45:24.612Z\"}', 0, NULL, NULL, '2025-10-09 04:45:24'),
(49, NULL, 11, 28, 'ML Prediction: Tomato is UNSAFE (95% probability)', 'High', 'ml_prediction', NULL, 95.00, 'Discard immediately and sanitize storage area.', 1, 95.00, '{\"source\":\"ml_prediction\",\"condition\":\"unsafe\",\"sensor_readings\":{\"temperature\":{\"value\":30.100000381469727,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T12:49:37.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":82,\"unit\":\"%\",\"timestamp\":\"2025-10-09T12:49:37.000Z\",\"status\":\"online\"},\"gas\":{\"value\":865,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T12:49:38.000Z\",\"status\":\"online\"}},\"spoilage_score\":95,\"confidence_score\":95,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T04:49:42.538Z\"}', 0, NULL, NULL, '2025-10-09 04:49:42'),
(50, NULL, 11, 25, 'ML Prediction: Cabbage is CAUTION (75% probability)', 'Medium', 'ml_prediction', NULL, 75.00, 'Consume soon or improve storage conditions.', 1, 75.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":{\"value\":29.799999237060547,\"unit\":\"°C\",\"timestamp\":\"2025-10-09T13:02:41.000Z\",\"status\":\"online\"},\"humidity\":{\"value\":81.80000305175781,\"unit\":\"%\",\"timestamp\":\"2025-10-09T13:02:41.000Z\",\"status\":\"online\"},\"gas\":{\"value\":299,\"unit\":\"ppm\",\"timestamp\":\"2025-10-09T13:02:41.000Z\",\"status\":\"online\"}},\"spoilage_score\":75,\"confidence_score\":75,\"ml_model\":\"default\",\"timestamp\":\"2025-10-09T05:02:46.434Z\"}', 0, NULL, NULL, '2025-10-09 05:02:46'),
(51, NULL, 11, 1, 'ML Prediction: Banana may be caution (50% probability)', 'Medium', 'ml_prediction', 5, 50.00, 'Consume soon or improve storage conditions.', 1, 75.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":29.299999237060547,\"humidity\":88.80000305175781,\"gas_level\":22},\"prediction_id\":5,\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\"},\"recommendations\":{\"main\":\"Food is safe to consume. Continue monitoring.\",\"details\":[\"Maintain current storage conditions\",\"Check again in 24-48 hours\",\"Store at optimal temperature (4°C)\",\"Environmental conditions are poor - improve storage conditions\",\"High humidity detected for fruits. Use dehumidifier or store in drier location.\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\"]},\"timestamp\":\"2025-10-25T05:25:54.190Z\"}', 0, NULL, NULL, '2025-10-25 05:25:54'),
(52, NULL, 11, 1, 'ML Prediction: Banana is CAUTION (50% probability)', 'Medium', 'ml_prediction', 5, 50.00, 'Consume soon or improve storage conditions.', 1, 50.00, '{\"source\":\"ml_prediction\",\"condition\":\"caution\",\"sensor_readings\":{\"temperature\":null,\"humidity\":null,\"gas_level\":null},\"spoilage_score\":50,\"confidence_score\":75,\"ml_model\":\"default\",\"timestamp\":\"2025-10-25T05:25:54.250Z\"}', 0, NULL, NULL, '2025-10-25 05:25:54');

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
(1, 11, 'General Feedback', 'Low', 'FSG', 'Mark Laurence', 'marktiktok525@gmail.com', 2, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 15:44:31', '2025-10-08 15:44:31'),
(2, 11, 'Device Issue', 'Low', '12', 'Mark Laurence', 'marktiktok525@gmail.com', 1, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 15:45:50', '2025-10-08 15:45:50'),
(3, 11, 'General Feedback', 'Low', '123', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 15:46:41', '2025-10-08 15:48:06'),
(4, 11, 'General Feedback', 'Low', 'EW34', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 15:50:42', '2025-10-08 16:13:31'),
(13, 11, 'Device Issue', 'Low', 'gl;ig;ik', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 16:37:46', '2025-10-08 16:37:46'),
(14, 11, 'Device Issue', 'Low', 'kkjjh', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 16:40:06', '2025-10-08 16:40:06'),
(15, 11, 'Sensor Problem', 'Low', 'jhgjkhk', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 16:41:42', '2025-10-08 16:41:42'),
(16, 11, 'Device Issue', 'Low', 'iohpj', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 16:43:56', '2025-10-08 16:43:56'),
(17, 11, 'Device Issue', 'Medium', 'hgkj', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 16:46:19', '2025-10-08 16:46:19'),
(18, 11, 'General Feedback', 'Medium', 'ukigkkh', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 16:48:43', '2025-10-08 16:48:43'),
(19, 11, 'Device Issue', 'Low', 'erwerw', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-10-08 16:50:03', '2025-10-08 16:50:03'),
(20, 11, 'General Feedback', 'Medium', 'eweq', 'Mark Laurence', 'marktiktok525@gmail.com', 0, 'Negative', 'Active', NULL, 'yes\n', '2025-10-10 01:26:56', 1, NULL, '2025-10-08 16:51:18', '2025-10-10 01:26:56');

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `food_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
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

INSERT INTO `food_items` (`food_id`, `name`, `category`, `sensor_id`, `user_id`, `scan_status`, `scan_timestamp`, `created_at`, `updated_at`) VALUES
(1, 'Banana', 'Fruits', 13, 11, 'analyzed', '2025-10-25 23:22:05', '2025-10-22 13:13:47', '2025-10-26 07:22:08'),
(2, 'Banana', 'Fruits', 14, 11, 'analyzed', '2025-10-22 13:13:47', '2025-10-22 13:13:47', '2025-10-26 07:22:08'),
(3, 'Banana', 'Fruits', 15, 11, 'analyzed', '2025-10-25 23:26:26', '2025-10-22 13:13:47', '2025-10-26 07:26:28');

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
(1, 11, 'scan_1761138818541_gy4un5', 'completed', 0, 0, '2025-10-22 13:13:38', '2025-10-22 13:13:56', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-22T13:13:38.527Z\",\"source\":\"food_selection\"}'),
(2, 11, 'scan_1761219245112_59fbak', 'completed', 0, 0, '2025-10-23 11:34:05', '2025-10-23 11:34:21', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-23T11:34:05.100Z\",\"source\":\"food_selection\"}'),
(3, 11, 'scan_1761307700832_9zmery', 'completed', 0, 0, '2025-10-24 12:08:20', '2025-10-24 12:08:36', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-24T12:08:20.822Z\",\"source\":\"food_selection\"}'),
(4, 11, 'scan_1761369527569_y8vn4z', 'completed', 0, 0, '2025-10-25 05:18:47', '2025-10-25 05:19:17', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:18:47.549Z\",\"source\":\"food_selection\"}'),
(5, 11, 'scan_1761369623810_zo6ynb', 'cancelled', 0, 0, '2025-10-25 05:20:23', '2025-10-25 05:20:39', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:20:23.801Z\",\"source\":\"food_selection\"}'),
(6, 11, 'scan_1761369749982_jzqmd3', 'completed', 0, 0, '2025-10-25 05:22:29', '2025-10-25 05:22:49', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:22:29.975Z\",\"source\":\"food_selection\"}'),
(7, 11, 'scan_1761369926305_aoyijz', 'completed', 0, 0, '2025-10-25 05:25:26', '2025-10-25 05:25:26', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:25:26.297Z\"}'),
(8, 11, 'scan_1761369926305_gsdm7v', 'completed', 0, 0, '2025-10-25 05:25:26', '2025-10-25 05:25:26', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:25:26.298Z\"}'),
(9, 11, 'scan_1761369926305_tklvs3', 'completed', 0, 0, '2025-10-25 05:25:26', '2025-10-25 05:25:26', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:25:26.295Z\"}'),
(10, 11, 'scan_1761369926308_5fe0ib', 'completed', 0, 0, '2025-10-25 05:25:26', '2025-10-25 05:25:26', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:25:26.299Z\"}'),
(11, 11, 'scan_1761369926333_u38f3h', 'cancelled', 0, 0, '2025-10-25 05:25:26', '2025-10-25 05:25:54', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:25:26.300Z\"}'),
(12, 11, 'scan_1761369926334_0k5x29', 'cancelled', 0, 0, '2025-10-25 05:25:26', '2025-10-25 05:25:54', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-25T05:25:26.300Z\"}'),
(13, 11, 'scan_1761463308049_irniv5', 'completed', 0, 0, '2025-10-26 07:21:48', '2025-10-26 07:22:08', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-26T07:21:48.032Z\",\"source\":\"food_selection\"}'),
(14, 11, 'scan_1761463574444_tuyvyd', 'completed', 0, 0, '2025-10-26 07:26:14', '2025-10-26 07:26:28', '{\"frontend_initiated\":true,\"timestamp\":\"2025-10-26T07:26:14.439Z\",\"source\":\"food_selection\"}');

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

--
-- Dumping data for table `ml_models`
--

INSERT INTO `ml_models` (`model_id`, `model_name`, `model_version`, `model_type`, `model_path`, `training_data_count`, `accuracy_score`, `precision_score`, `recall_score`, `f1_score`, `is_active`, `created_at`, `last_trained`, `performance_metrics`) VALUES
(1, 'spoilage_classifier', '1.0.0', 'tensorflow', '/models/spoilage/1.0.0/', 0, NULL, NULL, NULL, NULL, 1, '2025-09-29 12:54:43', NULL, '{\"notes\": \"initial version\"}');

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
  `expiration_date` date DEFAULT NULL,
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

INSERT INTO `ml_predictions` (`prediction_id`, `user_id`, `food_id`, `food_name`, `food_category`, `expiration_date`, `temperature`, `humidity`, `gas_level`, `spoilage_probability`, `spoilage_status`, `confidence_score`, `model_version`, `prediction_data`, `recommendations`, `is_training_data`, `actual_outcome`, `feedback_score`, `created_at`) VALUES
(1, 11, 3, 'Banana', 'Fruits', '2025-10-28', -127.50, 83.90, 64.00, 20.00, 'safe', 90.00, '1.0.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-10-22T13:13:51.583Z\",\"model_type\":\"smart_training_db\",\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\",\"path\":\"/models/spoilage/1.0.0/\"},\"source_details\":{\"centroids\":{\"safe\":{\"t\":-127.5,\"h\":83.9,\"g\":64,\"n\":1}}}}', '{\"main\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\",\"details\":[\"Monitor gas levels closely\",\"Check for visible signs of spoilage\",\"Verify sensor readings are accurate\"]}', 1, NULL, NULL, '2025-10-22 13:13:51'),
(2, 11, 1, 'Banana', 'Fruits', '2025-10-28', 30.80, 97.00, 28.00, 20.00, 'safe', 90.00, '1.0.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-10-23T11:34:18.008Z\",\"model_type\":\"smart_training_db\",\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\",\"path\":\"/models/spoilage/1.0.0/\"},\"source_details\":{\"centroids\":{\"safe\":{\"t\":-48.35,\"h\":90.45,\"g\":46,\"n\":2}}}}', '{\"main\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\",\"details\":[\"Monitor gas levels closely\",\"Check for visible signs of spoilage\",\"Verify sensor readings are accurate\"]}', 1, NULL, NULL, '2025-10-23 11:34:18'),
(3, 11, 3, 'Banana', 'Fruits', '2025-10-28', 22.10, 94.00, 47.00, 20.00, 'safe', 90.00, '1.0.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-10-24T12:08:33.318Z\",\"model_type\":\"smart_training_db\",\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\",\"path\":\"/models/spoilage/1.0.0/\"},\"source_details\":{\"centroids\":{\"safe\":{\"t\":-24.866666666666664,\"h\":91.63333333333333,\"g\":46.333333333333336,\"n\":3}}}}', '{\"main\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\",\"details\":[\"Monitor gas levels closely\",\"Check for visible signs of spoilage\",\"Verify sensor readings are accurate\"]}', 1, NULL, NULL, '2025-10-24 12:08:33'),
(4, 11, 1, 'Banana', 'Fruits', '2025-10-28', 29.30, 88.70, 24.00, 20.00, 'safe', 90.00, '1.0.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-10-25T05:22:45.831Z\",\"model_type\":\"smart_training_db\",\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\",\"path\":\"/models/spoilage/1.0.0/\"},\"source_details\":{\"centroids\":{\"safe\":{\"t\":-11.325,\"h\":90.9,\"g\":40.75,\"n\":4}}}}', '{\"main\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\",\"details\":[\"Monitor gas levels closely\",\"Check for visible signs of spoilage\",\"Verify sensor readings are accurate\"]}', 1, NULL, NULL, '2025-10-25 05:22:45'),
(5, 11, 1, 'Banana', 'Fruits', '2025-10-28', 29.30, 88.80, 22.00, 50.00, 'caution', 75.00, '1.0.0', '{\"temperature\":29.299999237060547,\"humidity\":88.80000305175781,\"gas_level\":22,\"avg_temperature\":29.299999237060547,\"avg_humidity\":88.80000305175781,\"avg_gas_level\":22,\"training_data_count\":4,\"ai_thresholds\":{\"temperature\":{\"safe_max\":30,\"caution_max\":35,\"unsafe_max\":40,\"safe_min\":15},\"humidity\":{\"safe_max\":70,\"caution_max\":80,\"unsafe_max\":90,\"safe_min\":30},\"gas_level\":{\"safe_max\":199,\"caution_max\":399,\"unsafe_max\":500},\"confidence\":50,\"reasoning\":\"Default thresholds based on room temperature (15-30°C), normal humidity (30-70%), and gas emission levels\"},\"ai_confidence\":50,\"ai_reasoning\":\"Default thresholds based on room temperature (15-30°C), normal humidity (30-70%), and gas emission levels\",\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\",\"path\":\"/models/spoilage/1.0.0/\"}}', '{\"main\":\"Food is safe to consume. Continue monitoring.\",\"details\":[\"Maintain current storage conditions\",\"Check again in 24-48 hours\",\"Store at optimal temperature (4°C)\",\"Environmental conditions are poor - improve storage conditions\",\"High humidity detected for fruits. Use dehumidifier or store in drier location.\",\"Temperature too high - refrigerate immediately\",\"Humidity too high - improve ventilation\"]}', 1, NULL, NULL, '2025-10-25 05:25:54'),
(6, 11, 1, 'Banana', 'Fruits', '2025-10-28', 28.00, 89.80, 24.00, 20.00, 'safe', 90.00, '1.0.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-10-26T07:22:05.482Z\",\"model_type\":\"smart_training_db\",\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\",\"path\":\"/models/spoilage/1.0.0/\"},\"source_details\":{\"centroids\":{\"safe\":{\"t\":-3.4599999999999995,\"h\":90.67999999999999,\"g\":37.4,\"n\":5}}}}', '{\"main\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\",\"details\":[\"Monitor gas levels closely\",\"Check for visible signs of spoilage\",\"Verify sensor readings are accurate\"]}', 1, NULL, NULL, '2025-10-26 07:22:05'),
(7, 11, 3, 'Banana', 'Fruits', '2025-10-28', 28.30, 90.80, 42.00, 20.00, 'safe', 90.00, '1.0.0', '{\"ai_analysis\":true,\"timestamp\":\"2025-10-26T07:26:26.404Z\",\"model_type\":\"smart_training_db\",\"model\":{\"name\":\"spoilage_classifier\",\"version\":\"1.0.0\",\"type\":\"tensorflow\",\"path\":\"/models/spoilage/1.0.0/\"},\"source_details\":{\"centroids\":{\"safe\":{\"t\":1.8333333333333333,\"h\":90.7,\"g\":38.166666666666664,\"n\":6}}}}', '{\"main\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\",\"details\":[\"Monitor gas levels closely\",\"Check for visible signs of spoilage\",\"Verify sensor readings are accurate\"]}', 1, NULL, NULL, '2025-10-26 07:26:26');

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
(1, 'Banana', 'Fruits', -127.50, 83.90, 64.00, 'safe', NULL, '{\"ai_analysis\":true,\"confidence\":20,\"storage_conditions\":{\"temperature\":-127.5,\"humidity\":83.9000015258789,\"gas_level\":64,\"timestamp\":\"2025-10-22T13:13:51.437Z\"},\"gas_emission_analysis\":{\"risk_level\":\"low\",\"status\":\"safe\",\"probability\":20,\"recommendation\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\"},\"provided_status\":\"safe\",\"gas_emission_override\":true,\"timestamp\":\"2025-10-22T13:13:51.452Z\"}', 'expert', 0.95, '2025-10-22 13:13:51', '2025-10-22 13:13:51'),
(2, 'Banana', 'Fruits', 30.80, 97.00, 28.00, 'safe', NULL, '{\"ai_analysis\":true,\"confidence\":20,\"storage_conditions\":{\"temperature\":30.799999237060547,\"humidity\":97,\"gas_level\":28,\"timestamp\":\"2025-10-23T11:34:17.895Z\"},\"gas_emission_analysis\":{\"risk_level\":\"low\",\"status\":\"safe\",\"probability\":20,\"recommendation\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\"},\"provided_status\":\"safe\",\"gas_emission_override\":true,\"timestamp\":\"2025-10-23T11:34:17.909Z\"}', 'expert', 0.95, '2025-10-23 11:34:17', '2025-10-23 11:34:17'),
(3, 'Banana', 'Fruits', 22.10, 94.00, 47.00, 'safe', NULL, '{\"ai_analysis\":true,\"confidence\":20,\"storage_conditions\":{\"temperature\":22.100000381469727,\"humidity\":94,\"gas_level\":47,\"timestamp\":\"2025-10-24T12:08:33.227Z\"},\"gas_emission_analysis\":{\"risk_level\":\"low\",\"status\":\"safe\",\"probability\":20,\"recommendation\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\"},\"provided_status\":\"safe\",\"gas_emission_override\":true,\"timestamp\":\"2025-10-24T12:08:33.236Z\"}', 'expert', 0.95, '2025-10-24 12:08:33', '2025-10-24 12:08:33'),
(4, 'Banana', 'Fruits', 29.30, 88.70, 24.00, 'safe', NULL, '{\"ai_analysis\":true,\"confidence\":20,\"storage_conditions\":{\"temperature\":29.299999237060547,\"humidity\":88.69999694824219,\"gas_level\":24,\"timestamp\":\"2025-10-25T05:22:45.725Z\"},\"gas_emission_analysis\":{\"risk_level\":\"low\",\"status\":\"safe\",\"probability\":20,\"recommendation\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\"},\"provided_status\":\"safe\",\"gas_emission_override\":true,\"timestamp\":\"2025-10-25T05:22:45.738Z\"}', 'expert', 0.95, '2025-10-25 05:22:45', '2025-10-25 05:22:45'),
(5, 'Banana', 'Fruits', 28.00, 89.80, 24.00, 'safe', NULL, '{\"ai_analysis\":true,\"confidence\":20,\"storage_conditions\":{\"temperature\":28,\"humidity\":89.80000305175781,\"gas_level\":24,\"timestamp\":\"2025-10-26T07:22:05.212Z\"},\"gas_emission_analysis\":{\"risk_level\":\"low\",\"status\":\"safe\",\"probability\":20,\"recommendation\":\"Low Risk: Fresh/Safe (0-199 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.\"},\"provided_status\":\"safe\",\"gas_emission_override\":true,\"timestamp\":\"2025-10-26T07:22:05.273Z\"}', 'expert', 0.95, '2025-10-26 07:22:05', '2025-10-26 07:22:05'),
(6, 'Banana', 'Fruits', 28.30, 90.80, 42.00, 'caution', NULL, '{\"storage_location\":\"box container\",\"gas_emission_analysis\":{\"risk_level\":\"medium\",\"status\":\"caution\",\"probability\":20,\"recommendation\":\"Exercise caution. Inspect thoroughly before consuming. May have minor spoilage signs.\"},\"storage_conditions\":{\"temperature\":28.3,\"humidity\":90.8,\"gas_level\":42,\"timestamp\":\"2025-11-01T01:27:16.922Z\"},\"ai_analysis\":true,\"confidence\":20,\"provided_status\":\"caution\",\"gas_emission_override\":true,\"timestamp\":\"2025-11-01T01:27:16.922Z\"}', 'user_feedback', 0.95, '2025-10-26 07:26:26', '2025-11-01 01:27:16');

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
(1, 13, -127.5, '°C', '2025-10-22 13:13:46'),
(2, 14, 83.9, '%', '2025-10-22 13:13:46'),
(3, 15, 64, 'ppm', '2025-10-22 13:13:46'),
(4, 13, 30.8, '°C', '2025-10-23 11:34:13'),
(5, 14, 97, '%', '2025-10-23 11:34:13'),
(6, 15, 28, 'ppm', '2025-10-23 11:34:13'),
(7, 13, 22.1, '°C', '2025-10-24 12:08:29'),
(8, 14, 94, '%', '2025-10-24 12:08:29'),
(9, 15, 47, 'ppm', '2025-10-24 12:08:29'),
(10, 13, 29.3, '°C', '2025-10-25 05:22:39'),
(11, 14, 88.7, '%', '2025-10-25 05:22:39'),
(12, 15, 24, 'ppm', '2025-10-25 05:22:39'),
(13, 13, 29.3, '°C', '2025-10-25 05:25:46'),
(14, 14, 88.8, '%', '2025-10-25 05:25:46'),
(15, 15, 22, 'ppm', '2025-10-25 05:25:46'),
(16, 13, 28, '°C', '2025-10-26 07:21:58'),
(17, 14, 89.8, '%', '2025-10-26 07:21:58'),
(18, 15, 24, 'ppm', '2025-10-26 07:21:58'),
(19, 13, 28.3, '°C', '2025-10-26 07:26:22'),
(20, 14, 90.8, '%', '2025-10-26 07:26:22'),
(21, 15, 42, 'ppm', '2025-10-26 07:26:22');

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
(13, 'Temperature', 11, 1, '2025-07-03 15:39:24', '2025-10-07 01:33:48'),
(14, 'Humidity', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(15, 'Gas', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(101, 'Temperature', 22, 1, '2025-07-24 06:32:41', '2025-10-07 02:48:20'),
(102, 'Humidity', 22, 1, '2025-07-24 06:32:41', '2025-10-07 02:48:20'),
(103, 'Gas', 22, 1, '2025-07-24 06:32:41', '2025-10-07 02:48:20'),
(1692, 'Humidity', 23, 1, '2025-09-23 13:06:09', '2025-10-07 03:43:01'),
(3019, 'Gas', 23, 1, '2025-09-23 13:06:09', '2025-10-07 03:43:01'),
(9537, 'Temperature', 23, 1, '2025-09-23 13:06:09', '2025-10-07 03:43:01');

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
(1, 11, '79dbc76d663c8c4167ede0e7a2adedf37b3f268ce349708034a66cfb972d8556', '2025-10-15 07:27:11', '2025-10-08 15:27:11'),
(2, 11, '10cad84c2b489a09c253691ff9c0d8433b8ed2ff3cfd5fe0830d43647508c427', '2025-10-15 08:06:34', '2025-10-08 16:06:34'),
(3, 11, 'a74d7210d804eb43928988456937c99cbd494962db02d4af523effca8f9f15fa', '2025-10-15 08:53:47', '2025-10-08 16:53:47'),
(4, 11, '0d3751b86c99685ecf7581087aab90921f52ffa315027f4add81bb1c68383360', '2025-10-15 15:05:17', '2025-10-08 23:05:17'),
(5, 11, 'f207aaed974bd0d532d2f6d41dd4d44027eae407fdf8e1de883e489b22bb1741', '2025-10-15 15:06:25', '2025-10-08 23:06:25'),
(6, 11, '0923bd38e531def347fdb105f4fb1d59e330ff66cf37442d90c06bf2f8733a97', '2025-10-15 16:37:08', '2025-10-09 00:37:08'),
(7, 26, '7015ca74a09b26937b4fd185d1b40a52f9ebe47fc9a0789103a01660ba09ebbe', '2025-10-15 17:14:37', '2025-10-09 01:14:37'),
(8, 11, '3d00259bc0e538fe50cf9af79088e614dae36bd2e49d4eb7ed31e68998a4527a', '2025-10-15 17:15:48', '2025-10-09 01:15:48'),
(9, 11, '195a3abafb2498f082713eda26f1fb7257c01695b1e39ab0a345953749cbbd69', '2025-10-15 21:18:48', '2025-10-09 05:18:48'),
(10, 11, '2f52f7f3444bf8e5f538b15de08b8df25fba8626428e9de6d7420472bcef0b61', '2025-10-16 17:02:19', '2025-10-10 01:02:19'),
(11, 26, '78241054114a31d968983ff8a226fada12044f4df5c71967857caba11e703b5b', '2025-10-16 17:05:47', '2025-10-10 01:05:47'),
(12, 11, 'b85a07c8cc78ef4fdb33503bf8c41861da16e2b219265cfae02426d5b3a31f5b', '2025-10-16 19:40:59', '2025-10-10 03:40:59'),
(13, 26, 'c1c2901ebc3ab905eb2dae558caade37f8e083076c6f1e7ca2726707b5ea0356', '2025-10-16 19:41:57', '2025-10-10 03:41:57'),
(14, 11, '6b9637cf53e2609eb0f545c1f1e0e834711dd3bc53f53e4384e8b9315f18fb25', '2025-10-16 19:52:19', '2025-10-10 03:52:19'),
(15, 11, 'd38ca0f47a252f0aaee3cba70466d2772b83e37446dcf302e464f8351797a479', '2025-10-29 05:13:26', '2025-10-22 13:13:26'),
(16, 11, '5c284ba64997d229f8ac9341bcc3437d0c218f83b3a24e7157ea517c99d7abd3', '2025-10-30 03:33:42', '2025-10-23 11:33:42'),
(17, 11, 'ebcd0afae7b16fb0b9f1d9e61dbc4b268f4ef8dee22862e8db825db1a11a7d97', '2025-10-31 04:07:58', '2025-10-24 12:07:58'),
(18, 11, '8159bad00f43f55bff17831ad6ee17fe34ce4bb48b348fe2f6aceb8853db49d5', '2025-10-31 21:16:02', '2025-10-25 05:16:02'),
(19, 11, '837e2a9b9ceb71f746b27cf6dac00b3a986975f2bea57d55e548d6b421b120ef', '2025-10-31 21:16:37', '2025-10-25 05:16:37'),
(20, 11, '92d03d74107b9f72188a2cf1a290a4c9c774d1ae202f47d52daf55df14341c50', '2025-10-31 21:18:14', '2025-10-25 05:18:14'),
(21, 11, '6d0203972d7fc7068fd76996ff124d08d9270c28896c6069e687edb3506bbe0b', '2025-11-01 23:21:25', '2025-10-26 07:21:25'),
(22, 26, 'e0b1146d2cfb0b4f418e137a5b2a90a3bbb7d175adab3660277d6dbe5c582e74', '2025-11-03 17:23:05', '2025-10-28 01:23:05'),
(23, 26, '525d7701eb3dedf5069fa9ea50e72d6b91c2b4984434aeae985a3f52f92a3943', '2025-11-07 16:34:06', '2025-11-01 00:34:06'),
(24, 26, '8549c3d3ca69c2b443937e07800721271fff1722c0faf00408da246a4963cfd0', '2025-11-08 16:16:14', '2025-11-02 00:16:14'),
(25, 11, 'a7600c6500efda9a8286c164bbc2298567071045ce15a9c160020bce270053dc', '2025-11-08 16:24:56', '2025-11-02 00:24:56'),
(26, 11, 'efe054a068343be38114fbb575344e9bbd3a6ab55aafd09228d4eb6ca2c9fa4d', '2025-11-10 02:44:44', '2025-11-03 10:44:44');

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
(11, 'Mark', 'Laurence', 'Marks', 'marktiktok525@gmail.com', '09999999999', 'User', 'active', '$2b$10$lr.Qtvu1ML2FyxojlXReC.PDu.f1cUcBBePOUSVwv05zKITn0uXP.', '2025-07-03 15:39:36', '2025-10-06 13:19:14', NULL, NULL, 1),
(22, 'mark', 'caringal', 'ybaha', 'marklaurencecaringal1@gmail.com', '09848705548', 'User', 'active', '$2b$10$E5UDZC47ReShfI3t.HqrteQSg2pVWUL3On1s6DxhNtR5EjllVQ1h6', '2025-07-14 02:32:59', '2025-08-17 12:50:22', NULL, NULL, 2),
(23, 'ee', 'User', 'ee', 'ee@gmail.com', NULL, 'User', 'active', '$2b$10$0nlymAoDDwtoP1c3Mb47ceX0kQkQ7cRzs9j562e6b70Tej9uHnHVS', '2025-07-14 01:21:46', '2025-08-17 12:50:22', NULL, NULL, 3),
(26, 'marks', 'User', 'Mark23', 'marklaurencecaringal7@gmail.com', '09888727372', 'Admin', 'active', '$2b$10$N93mwQPUZx1flvIayMh1ZuYEVZN.E09zfiS0E/J80hGqS1SvntJF2', '2025-07-09 05:56:06', '2025-09-25 15:36:27', NULL, NULL, 4),
(30, 'mark', 'baa', 'abna', 'hahah@gmail.com', '098558758668', 'User', 'active', '$2b$10$fXQKRY.ung923C23Rq7cL.DmAT94N01TF8p2NsFkdgs7a0ngPo3CS', '2025-07-20 12:37:39', '2025-08-17 12:50:22', NULL, NULL, 5),
(31, 'Mark', 'Laurence', 'Markll', 'benzoncarl010@gmail.com', '0998484484', 'User', 'active', '$2b$10$9pJqr6UQIVU7qhIhJBcKDONXwMAxsDpWgMlMrK8p9HmZ9CRudzGTS', '2025-07-28 05:07:03', '2025-08-17 12:50:22', NULL, NULL, 1),
(32, 'Mark', 'jack Caringal', 'markjackcaringal', 'jack@gmail.com', NULL, 'User', 'inactive', '$2b$12$OwdbTRSEX5VBFF8c19k6kuHhCA8ON6jFIQN.HdNuA7dPuA/bCjkK6', '2025-09-25 10:51:25', '2025-10-07 07:04:37', NULL, NULL, 1),
(33, 'Mark', 'Laurencea Caringal', 'marklaurenceacaringal', 'jack1@gmail.com', NULL, 'User', 'active', '$2b$12$6zL9USyAPLEh3Q1H8ySHd.xloO9W9T/Ivb8AZVU3COWapALHHXcAa', '2025-10-10 03:15:54', '2025-10-10 03:24:34', NULL, NULL, 2),
(34, 'Mark', 'Laurence Caringal', 'marklaurencecaringal', 'kdh@gmail.com', NULL, 'User', 'active', '$2b$12$uNUHSfu.FLIBHSY0uHrp3uBsUFJRD3TZP24PBSlLRMOa1rgbyEr1.', '2025-10-10 03:38:28', '2025-10-10 03:48:05', NULL, NULL, 1);

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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `food_scan_sessions`
--
ALTER TABLE `food_scan_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `ml_models`
--
ALTER TABLE `ml_models`
  MODIFY `model_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ml_predictions`
--
ALTER TABLE `ml_predictions`
  MODIFY `prediction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ml_training_data`
--
ALTER TABLE `ml_training_data`
  MODIFY `training_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `readings`
--
ALTER TABLE `readings`
  MODIFY `reading_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `sensor`
--
ALTER TABLE `sensor`
  MODIFY `sensor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9538;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `testertypes`
--
ALTER TABLE `testertypes`
  MODIFY `TesterTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
