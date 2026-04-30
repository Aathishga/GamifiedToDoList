const axios = require('axios');

async function testCreateTask() {
  try {
    const response = await axios.post('http://localhost:5000/api/tasks', {
      title: 'Test Task',
      difficulty: 'Easy'
    }, {
      headers: {
        'Authorization': 'Bearer <REPLACE_WITH_TOKEN>'
      }
    });
    console.log('Success:', response.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

// testCreateTask();
