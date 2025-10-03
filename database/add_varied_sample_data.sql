-- Add varied sample data for testing Report Generator
-- This adds Safe and At Risk items to complement the existing Spoiled items

INSERT INTO `ml_predictions` (`prediction_id`, `user_id`, `food_id`, `food_name`, `food_category`, `temperature`, `humidity`, `gas_level`, `spoilage_probability`, `spoilage_status`, `confidence_score`, `model_version`, `prediction_data`, `recommendations`, `is_training_data`, `actual_outcome`, `feedback_score`, `created_at`) VALUES

-- Safe items (recent scans)
(100, 11, 2, 'Apple', 'Fruits', 22.50, 45.00, 15.00, 10.00, 'safe', 90.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-02T10:30:00.000Z","model_type":"smart_training_db"}', '["Store in cool, dry place","Monitor for browning","Good for consumption"]', 1, NULL, NULL, '2025-10-02 10:30:00'),

(101, 11, 3, 'Carrot', 'Vegetables', 24.00, 50.00, 20.00, 15.00, 'safe', 85.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-02T09:15:00.000Z","model_type":"smart_training_db"}', '["Keep refrigerated","Excellent condition","Safe for consumption"]', 1, NULL, NULL, '2025-10-02 09:15:00'),

(102, 11, 4, 'Milk', 'Dairy', 23.00, 55.00, 25.00, 20.00, 'safe', 88.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-02T08:45:00.000Z","model_type":"smart_training_db"}', '["Keep refrigerated below 4°C","Fresh and safe","Check expiry date regularly"]', 1, NULL, NULL, '2025-10-02 08:45:00'),

-- At Risk (Caution) items
(103, 11, 5, 'Bread', 'Grains', 26.50, 65.00, 45.00, 40.00, 'caution', 70.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-02T07:20:00.000Z","model_type":"smart_training_db"}', '["Store in dry place","Monitor for mold","Use within 2 days"]', 1, NULL, NULL, '2025-10-02 07:20:00'),

(104, 11, 6, 'Chicken', 'Meat', 27.00, 70.00, 55.00, 45.00, 'caution', 75.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-02T06:10:00.000Z","model_type":"smart_training_db"}', '["Refrigerate immediately","Cook thoroughly","Use within 24 hours"]', 1, NULL, NULL, '2025-10-02 06:10:00'),

(105, 11, 7, 'Lettuce', 'Vegetables', 25.50, 68.00, 50.00, 42.00, 'caution', 72.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-02T05:30:00.000Z","model_type":"smart_training_db"}', '["Keep cool and dry","Check for wilting","Use soon"]', 1, NULL, NULL, '2025-10-02 05:30:00'),

-- Additional Safe items from yesterday
(106, 11, 8, 'Orange', 'Fruits', 23.50, 48.00, 18.00, 12.00, 'safe', 92.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-01T16:45:00.000Z","model_type":"smart_training_db"}', '["Store at room temperature","Excellent condition","Rich in Vitamin C"]', 1, NULL, NULL, '2025-10-01 16:45:00'),

(107, 11, 9, 'Potato', 'Vegetables', 22.00, 52.00, 22.00, 18.00, 'safe', 87.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-01T15:20:00.000Z","model_type":"smart_training_db"}', '["Store in cool, dark place","No sprouting detected","Safe for cooking"]', 1, NULL, NULL, '2025-10-01 15:20:00'),

-- Additional At Risk items from yesterday  
(108, 11, 10, 'Cheese', 'Dairy', 26.00, 72.00, 48.00, 38.00, 'caution', 68.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-01T14:10:00.000Z","model_type":"smart_training_db"}', '["Refrigerate properly","Check for mold","Use within 3 days"]', 1, NULL, NULL, '2025-10-01 14:10:00'),

(109, 11, 11, 'Tomato', 'Vegetables', 27.50, 75.00, 52.00, 43.00, 'caution', 73.00, '1.0', '{"ai_analysis":true,"timestamp":"2025-10-01T13:30:00.000Z","model_type":"smart_training_db"}', '["Store at room temperature","Monitor for soft spots","Use within 2 days"]', 1, NULL, NULL, '2025-10-01 13:30:00');

-- Add corresponding food_items entries
INSERT INTO `food_items` (`food_id`, `user_id`, `food_name`, `food_category`, `expiration_date`, `storage_location`, `purchase_date`, `quantity`, `unit`, `notes`, `barcode`, `created_at`, `updated_at`) VALUES

(2, 11, 'Apple', 'Fruits', '2025-10-05', 'Refrigerator', '2025-10-01', 5, 'pieces', 'Fresh red apples', NULL, '2025-10-01 10:00:00', '2025-10-02 10:30:00'),
(3, 11, 'Carrot', 'Vegetables', '2025-10-08', 'Refrigerator', '2025-10-01', 1, 'kg', 'Organic carrots', NULL, '2025-10-01 09:00:00', '2025-10-02 09:15:00'),
(4, 11, 'Milk', 'Dairy', '2025-10-04', 'Refrigerator', '2025-10-01', 1, 'liter', 'Fresh whole milk', NULL, '2025-10-01 08:00:00', '2025-10-02 08:45:00'),
(5, 11, 'Bread', 'Grains', '2025-10-04', 'Pantry', '2025-10-01', 1, 'loaf', 'Whole wheat bread', NULL, '2025-10-01 07:00:00', '2025-10-02 07:20:00'),
(6, 11, 'Chicken', 'Meat', '2025-10-03', 'Refrigerator', '2025-10-01', 500, 'grams', 'Fresh chicken breast', NULL, '2025-10-01 06:00:00', '2025-10-02 06:10:00'),
(7, 11, 'Lettuce', 'Vegetables', '2025-10-04', 'Refrigerator', '2025-10-01', 1, 'head', 'Iceberg lettuce', NULL, '2025-10-01 05:00:00', '2025-10-02 05:30:00'),
(8, 11, 'Orange', 'Fruits', '2025-10-06', 'Counter', '2025-09-30', 6, 'pieces', 'Navel oranges', NULL, '2025-09-30 16:00:00', '2025-10-01 16:45:00'),
(9, 11, 'Potato', 'Vegetables', '2025-10-10', 'Pantry', '2025-09-30', 2, 'kg', 'Russet potatoes', NULL, '2025-09-30 15:00:00', '2025-10-01 15:20:00'),
(10, 11, 'Cheese', 'Dairy', '2025-10-05', 'Refrigerator', '2025-09-30', 200, 'grams', 'Cheddar cheese', NULL, '2025-09-30 14:00:00', '2025-10-01 14:10:00'),
(11, 11, 'Tomato', 'Vegetables', '2025-10-05', 'Counter', '2025-09-30', 4, 'pieces', 'Roma tomatoes', NULL, '2025-09-30 13:00:00', '2025-10-01 13:30:00');

