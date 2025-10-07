const mysql = require('mysql2/promise');

async function updateAdminResponses() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'safebite_db'
  });

  try {
    // Update feedback with admin responses
    await connection.execute(`
      UPDATE feedbacks 
      SET 
        admin_notes = 'This is a test admin note for debugging purposes.',
        response_text = 'Thank you for your feedback. We are working on improving the device performance.'
      WHERE feedback_id = 1
    `);

    await connection.execute(`
      UPDATE feedbacks 
      SET 
        admin_notes = 'Device issue reported. Investigating hardware compatibility.',
        response_text = 'We have received your device issue report. Our technical team is investigating this matter.'
      WHERE feedback_id = 2
    `);

    await connection.execute(`
      UPDATE feedbacks 
      SET 
        admin_notes = 'Performance issue noted. Checking system optimization.',
        response_text = 'Thank you for reporting the performance issue. We are optimizing the system for better speed.'
      WHERE feedback_id = 3
    `);

    console.log('Admin responses updated successfully!');
    
    // Verify the updates
    const [rows] = await connection.execute(`
      SELECT feedback_id, admin_notes, response_text 
      FROM feedbacks 
      WHERE feedback_id IN (1, 2, 3)
    `);
    
    console.log('Updated feedbacks:');
    console.log(rows);
    
  } catch (error) {
    console.error('Error updating admin responses:', error);
  } finally {
    await connection.end();
  }
}

updateAdminResponses();

