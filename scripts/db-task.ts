const { Client } = require('pg');

// Fetch environment variables.
const {
  PGHOST,
  PGPORT,
  PGDATABASE,
  PGUSER,
  PGPASSWORD
} = process.env;

async function main() {
  const client = new Client({
    host: PGHOST,
    port: PGPORT ? parseInt(PGPORT) : 5432,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
  });

  await client.connect();

  // Insert a new task.
  const insertResult = await client.query(
    'INSERT INTO tasks (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *',
    ['Test Task', false, 1]
  );
  const task = insertResult.rows[0];
  console.log('Inserted task:', task);

  // Verify the task exists.
  const selectResult = await client.query(
    'SELECT * FROM tasks WHERE id = $1',
    [task.id]
  );
  console.log('Fetched task:', selectResult.rows[0]);

  // Update the completed flag.
  await client.query(
    'UPDATE tasks SET completed = $1 WHERE id = $2',
    [true, task.id]
  );
  const updatedResult = await client.query(
    'SELECT * FROM tasks WHERE id = $1',
    [task.id]
  );
  console.log('Updated task:', updatedResult.rows[0]);

  await client.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});