-- Create ML Predictions Table
-- This table stores machine learning-based food spoilage predictions

CREATE TABLE IF NOT EXISTS `ml_predictions` (
  `prediction_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `food_name` varchar(255) DEFAULT NULL,
  `food_type_id` int(11) DEFAULT NULL,
  `temperature` decimal(5,2) NOT NULL,
  `humidity` decimal(5,2) NOT NULL,
  `gas_level` decimal(8,2) NOT NULL,
  `spoilage_probability` decimal(5,4) NOT NULL COMMENT 'Probability from 0.0 to 1.0',
  `spoilage_status` enum('LOW_SPOILAGE_RISK','MODERATE_SPOILAGE_RISK','HIGH_SPOILAGE_RISK') NOT NULL,
  `confidence_level` enum('Low','Medium','High') NOT NULL,
  `recommendations` json DEFAULT NULL COMMENT 'Array of recommendation strings',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`prediction_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_food_type_id` (`food_type_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_spoilage_status` (`spoilage_status`),
  CONSTRAINT `fk_ml_predictions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ml_predictions_food_type_id` FOREIGN KEY (`food_type_id`) REFERENCES `food_types` (`type_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Machine learning food spoilage predictions';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS `idx_ml_predictions_composite` ON `ml_predictions` (`user_id`, `created_at`);
CREATE INDEX IF NOT EXISTS `idx_ml_predictions_probability` ON `ml_predictions` (`spoilage_probability`);

-- Insert sample data for testing (optional)
-- INSERT INTO ml_predictions (user_id, food_name, temperature, humidity, gas_level, spoilage_probability, spoilage_status, confidence_level, recommendations) VALUES
-- (1, 'Sample Food', 25.5, 65.2, 450.0, 0.75, 'HIGH_SPOILAGE_RISK', 'High', '["Check for visible signs of decay", "Consider discarding if unsure"]');
