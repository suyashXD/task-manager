// TaskForm.js
import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const TaskForm = ({ onCreateTask }) => {
  const [task, setTask] = useState({ title: '', description: '', status: 'To Do' });

  const handleChange = (event) => {
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreateTask(task);
    setTask({ title: '', description: '', status: 'To Do' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            name="title"
            label="Title"
            variant="outlined"
            value={task.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="description"
            label="Description"
            variant="outlined"
            value={task.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button type="submit" variant="contained" color="primary">
            Add Task
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TaskForm;
