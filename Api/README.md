Get all Records
http://localhost:3000/tasks

Save new record
http://localhost:3000/tasks
Body : { "title": "New Task" }

Update existing records
http://localhost:3000/tasks/:id
{ "id": "1", "title": "Task 1", "completed": true }

delete all records
http://localhost:3000/tasks