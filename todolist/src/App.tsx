import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddTodoInput, DeleteButton, ErrorMessage, TodoButton, TodoContainer, TodoItem, TodoList } from './StyledComponent';

// Types
type Task = {
  id: string;
  title: string;
  completed: boolean;
};


const Todo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const apiBaseUrl = 'http://localhost:3030';

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) {
      setErrorMessage('Task title cannot be empty');
      // alert('Task title cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/tasks`, { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Mark task as complete
  const completeTask = async (id: string) => {
    try {
      const response = await axios.put(`${apiBaseUrl}/tasks/${id}`, { completed: true });
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  // Delete all tasks
  const deleteAllTasks = async () => {
    if(tasks.length===0){
      setErrorMessage('"There are no tasks to delete yet. Please add some tasks to the list first, and then you will be able to use the delete functionality.');
    }
    try {
      await axios.delete(`${apiBaseUrl}/tasks`);
      setTasks([]);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };


  return (
    <TodoContainer>
      <AddTodoInput
        type="text"
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => {setErrorMessage(''); setNewTask(e.target.value)}}
      />
      <ErrorMessage>{errorMessage}</ErrorMessage>
      <TodoButton onClick={addTask}>Add Task</TodoButton>
      <DeleteButton onClick={deleteAllTasks} disabled={tasks.length === 0}>Delete All Tasks</DeleteButton>
      <TodoList>
        {tasks.map((task) => (
          <TodoItem key={task.id} completed={task.completed}>
            {task.title}
            <div>
              <TodoButton onClick={() => completeTask(task.id)}>Complete</TodoButton>
            </div>
          </TodoItem>
        ))}
      </TodoList>
    </TodoContainer>
  );
};

export default Todo;