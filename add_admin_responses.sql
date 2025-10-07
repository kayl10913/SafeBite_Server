-- Add sample admin responses for testing
UPDATE feedbacks 
SET 
    admin_notes = 'This is a test admin note for debugging purposes.',
    response_text = 'Thank you for your feedback. We are working on improving the device performance.'
WHERE feedback_id = 1;

UPDATE feedbacks 
SET 
    admin_notes = 'Device issue reported. Investigating hardware compatibility.',
    response_text = 'We have received your device issue report. Our technical team is investigating this matter.'
WHERE feedback_id = 2;

UPDATE feedbacks 
SET 
    admin_notes = 'Performance issue noted. Checking system optimization.',
    response_text = 'Thank you for reporting the performance issue. We are optimizing the system for better speed.'
WHERE feedback_id = 3;

