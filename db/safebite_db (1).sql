-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 29, 2025 at 02:55 PM
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
(1, 26, 'Updated: User (32)', '2025-09-25 14:33:07'),
(2, 26, 'Updated: User (32)', '2025-09-25 14:42:24'),
(3, 26, 'Updated: User (32)', '2025-09-25 14:43:35'),
(4, 26, 'Updated: User (32)', '2025-09-25 15:02:55'),
(5, 26, 'Updated: User (32)', '2025-09-25 15:10:03'),
(6, 26, 'Updated: User (markjackcaringal)', '2025-09-25 15:24:00'),
(7, 26, 'User logged out', '2025-09-25 15:24:12'),
(8, 26, 'Admin logged in successfully', '2025-09-25 15:24:29'),
(9, 26, 'Updated: User (markjackcaringal)', '2025-09-25 15:24:54'),
(10, 26, 'Updated: User status to inactive (markjackcaringal)', '2025-09-25 15:29:04'),
(11, 26, 'Admin profile updated', '2025-09-25 15:36:27'),
(12, 26, 'Admin profile updated', '2025-09-25 15:36:34'),
(13, 11, 'User logged in successfully', '2025-09-28 03:05:58'),
(14, 11, 'User logged in successfully', '2025-09-28 03:11:42'),
(15, 11, 'User logged in successfully', '2025-09-28 03:20:32'),
(16, 11, 'User logged out successfully', '2025-09-28 03:20:37'),
(17, 11, 'User logged in successfully', '2025-09-28 03:27:14'),
(18, 11, 'User logged out successfully', '2025-09-28 03:27:36'),
(19, 11, 'User logged in successfully', '2025-09-28 03:29:35'),
(20, 11, 'User logged out successfully', '2025-09-28 03:30:18'),
(21, 11, 'User logged in successfully', '2025-09-28 03:30:38'),
(22, 11, 'User logged in successfully', '2025-09-28 03:33:38'),
(23, 11, 'User logged in successfully', '2025-09-28 03:39:44'),
(24, 11, 'User logged in successfully', '2025-09-28 03:43:01'),
(25, 11, 'User logged in successfully', '2025-09-28 03:43:15'),
(26, 11, 'User logged in successfully', '2025-09-28 03:53:50'),
(27, 11, 'User logged in successfully', '2025-09-28 03:58:44'),
(28, 11, 'User logged in successfully', '2025-09-28 04:02:13'),
(29, 11, 'User logged in successfully', '2025-09-28 04:04:29'),
(30, 11, 'User logged in successfully', '2025-09-28 04:23:54'),
(31, 11, 'User logged in successfully', '2025-09-28 04:40:40'),
(32, 11, 'User logged in successfully', '2025-09-28 04:48:35'),
(33, 11, 'User logged in successfully', '2025-09-28 05:26:22'),
(34, 11, 'User logged in successfully', '2025-09-28 05:26:25'),
(35, 11, 'User logged in successfully', '2025-09-28 05:30:16'),
(36, 11, 'User logged in successfully', '2025-09-28 05:30:20'),
(37, 11, 'User logged in successfully', '2025-09-28 05:39:42'),
(38, 11, 'User logged in successfully', '2025-09-28 05:44:04'),
(39, 11, 'User logged in successfully', '2025-09-28 05:50:16'),
(40, 11, 'User logged in successfully', '2025-09-28 05:55:52'),
(41, 11, 'User logged in successfully', '2025-09-28 06:19:07'),
(42, 11, 'AI analysis performed for Apple', '2025-09-28 09:59:02'),
(43, 11, 'AI chat conversation', '2025-09-28 09:59:33'),
(44, 11, 'AI chat conversation', '2025-09-28 15:10:09'),
(45, 11, 'User logged out successfully', '2025-09-28 15:14:47'),
(46, 26, 'Admin logged in successfully', '2025-09-28 15:15:05');

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
(4, 11, 'General Feedback', 'Low', 'slow and not acurate\n', 'Mark Laurence', 'marktiktok525@gmail.com', 3, 'Neutral', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-09-22 00:22:57', '2025-09-22 00:22:57'),
(5, 11, 'General Feedback', 'Low', 'HI', 'Mark Laurence', 'marktiktok525@gmail.com', NULL, 'Negative', 'Active', NULL, NULL, NULL, NULL, NULL, '2025-09-25 08:04:30', '2025-09-25 08:04:30');

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
(104, 11, 'scan_1758675697420_xar6f0', 'cancelled', 0, 0, '2025-09-24 01:01:37', '2025-09-24 01:01:51', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-24T01:01:37.357Z\"}'),
(105, 11, 'scan_1758787563949_njg4sk', 'cancelled', 0, 0, '2025-09-25 08:06:03', '2025-09-25 08:11:03', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:06:03.913Z\"}'),
(106, 11, 'scan_1758787563949_mmsd5c', 'cancelled', 0, 0, '2025-09-25 08:06:03', '2025-09-25 08:11:03', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:06:03.916Z\"}'),
(107, 11, 'scan_1758787563949_xsdw7w', 'cancelled', 0, 0, '2025-09-25 08:06:03', '2025-09-25 08:11:03', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:06:03.917Z\"}'),
(108, 11, 'scan_1758787563950_ebfpgw', 'cancelled', 0, 0, '2025-09-25 08:06:03', '2025-09-25 08:11:03', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:06:03.918Z\"}'),
(109, 11, 'scan_1758789693691_q7emkn', 'completed', 0, 0, '2025-09-25 08:41:33', '2025-09-25 08:41:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:41:33.675Z\"}'),
(110, 11, 'scan_1758789693715_l7e69j', 'completed', 0, 0, '2025-09-25 08:41:33', '2025-09-25 08:41:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:41:33.677Z\"}'),
(111, 11, 'scan_1758789693737_r8890i', 'completed', 0, 0, '2025-09-25 08:41:33', '2025-09-25 08:41:33', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:41:33.679Z\"}'),
(112, 11, 'scan_1758789693761_kdcxq7', 'completed', 0, 0, '2025-09-25 08:41:33', '2025-09-28 07:02:39', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-25T08:41:33.681Z\"}'),
(113, 11, 'scan_1759042959548_1uwg5u', 'cancelled', 0, 0, '2025-09-28 07:02:39', '2025-09-28 07:02:44', '{\"frontend_initiated\":true,\"timestamp\":\"2025-09-28T07:02:39.491Z\",\"source\":\"food_selection\"}');

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
(13, 'Sayote', 'Vegetables', 10.00, 85.00, 30.00, 'safe', NULL, NULL, 'manual', 0.95, '2025-09-23 15:25:28', '2025-09-23 15:25:28'),
(14, 'Carrot', 'Vegetable', 20.00, 20.00, 20.00, 'unsafe', NULL, NULL, 'user_feedback', 0.95, '2025-09-25 09:10:34', '2025-09-25 09:10:34'),
(15, 'Celery', 'Vegetable', 22.00, 22.00, 22.00, 'caution', NULL, NULL, 'manual', 0.95, '2025-09-25 09:55:42', '2025-09-25 09:55:42'),
(16, 'Garlic', 'Vegetables', 12.00, 56.00, 5.00, 'caution', NULL, NULL, 'expert', 0.95, '2025-09-25 10:00:21', '2025-09-25 10:00:21'),
(17, 'Garlic', 'Vegetable', 12.00, 70.00, 12.00, 'caution', NULL, NULL, 'manual', 0.95, '2025-09-25 10:09:02', '2025-09-25 10:09:02'),
(18, 'Garlic', 'Vegetables', 1.00, 12.00, 12.00, 'unsafe', NULL, NULL, 'expert', 0.97, '2025-09-25 10:18:19', '2025-09-25 10:18:19'),
(19, 'Garlic', 'Vegetable', 12.00, 12.00, 12.00, 'caution', NULL, NULL, 'manual', 0.96, '2025-09-25 10:24:04', '2025-09-25 10:24:04'),
(20, 'Carrot', 'Vegetable', 20.00, 98.00, 20.00, 'unsafe', NULL, NULL, 'expert', 0.95, '2025-09-25 10:27:55', '2025-09-25 10:27:55'),
(21, 'Carrot', 'Vegetable', 12.00, 12.00, 12.00, 'unsafe', NULL, NULL, 'manual', 0.95, '2025-09-25 10:29:44', '2025-09-25 10:29:44'),
(22, 'Carrot', 'Vegetable', 2.00, 2.00, 2.00, 'unsafe', NULL, NULL, 'expert', 0.95, '2025-09-25 10:33:07', '2025-09-25 10:33:07');

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
(11, 'Mark', 'Laurence', 'Mark', 'marktiktok525@gmail.com', '09999999999', 'User', 'active', '$2b$10$lr.Qtvu1ML2FyxojlXReC.PDu.f1cUcBBePOUSVwv05zKITn0uXP.', '2025-07-03 15:39:36', '2025-09-25 08:31:49', NULL, NULL, NULL),
(22, 'mark', 'caringal', 'ybaha', 'marklaurencecaringal1@gmail.com', '09848705548', 'User', 'active', '$2b$10$E5UDZC47ReShfI3t.HqrteQSg2pVWUL3On1s6DxhNtR5EjllVQ1h6', '2025-07-14 02:32:59', '2025-08-17 12:50:22', NULL, NULL, 2),
(23, 'ee', 'User', 'ee', 'ee@gmail.com', NULL, 'User', 'active', '$2b$10$0nlymAoDDwtoP1c3Mb47ceX0kQkQ7cRzs9j562e6b70Tej9uHnHVS', '2025-07-14 01:21:46', '2025-08-17 12:50:22', NULL, NULL, 3),
(26, 'marks', 'User', 'Mark23', 'marklaurencecaringal7@gmail.com', '09888727372', 'Admin', 'active', '$2b$10$N93mwQPUZx1flvIayMh1ZuYEVZN.E09zfiS0E/J80hGqS1SvntJF2', '2025-07-09 05:56:06', '2025-09-25 15:36:27', NULL, NULL, 4),
(30, 'mark', 'baa', 'abna', 'hahah@gmail.com', '098558758668', 'User', 'active', '$2b$10$fXQKRY.ung923C23Rq7cL.DmAT94N01TF8p2NsFkdgs7a0ngPo3CS', '2025-07-20 12:37:39', '2025-08-17 12:50:22', NULL, NULL, 5),
(31, 'Mark', 'Laurence', 'Markll', 'benzoncarl010@gmail.com', '0998484484', 'User', 'active', '$2b$10$9pJqr6UQIVU7qhIhJBcKDONXwMAxsDpWgMlMrK8p9HmZ9CRudzGTS', '2025-07-28 05:07:03', '2025-08-17 12:50:22', NULL, NULL, 1),
(32, 'Mark', 'jack Caringal', 'markjackcaringal', 'jack@gmail.com', NULL, 'User', 'inactive', '$2b$12$OwdbTRSEX5VBFF8c19k6kuHhCA8ON6jFIQN.HdNuA7dPuA/bCjkK6', '2025-09-25 10:51:25', '2025-09-25 15:29:04', NULL, NULL, 1);

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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `food_scan_sessions`
--
ALTER TABLE `food_scan_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `ml_models`
--
ALTER TABLE `ml_models`
  MODIFY `model_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ml_predictions`
--
ALTER TABLE `ml_predictions`
  MODIFY `prediction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `ml_training_data`
--
ALTER TABLE `ml_training_data`
  MODIFY `training_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `testertypes`
--
ALTER TABLE `testertypes`
  MODIFY `TesterTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
