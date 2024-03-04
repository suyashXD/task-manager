import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, formatDistanceToNow } from 'date-fns';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    dueDate: '',
    deadline: '',
    completed: false,
  });
  const [filter, setFilter] = useState('All');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [buttonText, setButtonText] = useState('Add Task');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const handleChange = (event) => {
    setNewTask({ ...newTask, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if mandatory fields are filled
    if (newTask.title.trim() === '' || newTask.description.trim() === '' || newTask.dueDate === '') {
      // Show error dialog
      setErrorDialogOpen(true);
      return; // Do not submit form if mandatory fields are empty
    }
    
    if (selectedTaskIndex !== null) {
      // Update existing task
      const updatedTasks = [...tasks];
      updatedTasks[selectedTaskIndex] = newTask;
      setTasks(updatedTasks);
      setSelectedTaskIndex(null); // Reset selected task index
      setButtonText('Add Task'); // Reset button text to "Add Task" after update
    } else {
      // Add new task
      setTasks([...tasks, newTask]);
    }
    // Reset form fields
    setNewTask({
      title: '',
      description: '',
      status: 'To Do',
      dueDate: '',
      deadline: '',
      completed: false,
    });
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleStatusChange = (index, status) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = status;
    setTasks(updatedTasks);
  };

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => task.status === filter);

  const handleDelete = (index) => {
    const task = tasks[index];
    if (task.status === 'To Do' || task.status === 'In Progress') {
      setSelectedTaskIndex(index); // Set selected task index for possible update
      setDeleteConfirmationOpen(true);
    } else if (task.status === 'Done') {
      deleteTask(index);
    }
  };
  
  const handleConfirmDelete = (action) => {
    if (action === 'Update') {
      setNewTask(tasks[selectedTaskIndex]);
      setButtonText('Update Task'); // Change button text to "Update Task" when updating
    } else if (action === 'Delete') {
      deleteTask(selectedTaskIndex);
    }
    setDeleteConfirmationOpen(false);
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setSelectedTaskIndex(null); // Reset selected task index on cancel
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Task Manager
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              variant="outlined"
              value={newTask.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Description"
              variant="outlined"
              value={newTask.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="dueDate"
              type="date"
              label="Due Date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={newTask.dueDate}
              onChange={handleChange}
              placeholder="Select due date"
              inputProps={{ min: new Date().toISOString().split('T')[0] }} // Set minimum date to current date
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="deadline"
              type="time"
              label="Deadline (Optional)"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={newTask.deadline}
              onChange={handleChange}
              placeholder="Select deadline time"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {buttonText}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Tasks
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </Grid>
      </Grid>
      {filteredTasks.map((task, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{ mb: 2, textDecoration: task.completed ? 'line-through' : 'none' }}
        >
          <CardContent>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {task.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {task.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.dueDate && `Due Date: ${format(new Date(task.dueDate), 'MM/dd/yyyy')}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.deadline && `Deadline: ${task.deadline}`}
            </Typography>
            {!task.completed && task.dueDate && (
              <Typography variant="body2" color="text.secondary">
                {`Time Remaining: ${formatDistanceToNow(new Date(task.dueDate), {
                  addSuffix: true,
                })}`}
              </Typography>
            )}
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event from firing
                  setSelectedTaskIndex(index);
                  setDeleteConfirmationOpen(true);
                }}
                disableRipple
              >
                <DeleteIcon
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    padding: '0',
                    borderRadius: '0',
                  }}
                />
              </IconButton>
              <Select
                value={task.status}
                onChange={(e) => handleStatusChange(index, e.target.value)}
                sx={{ width: '120px' }}
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </Grid>
          </CardContent>
        </Card>
      ))}
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirmation-dialog-title"
        aria-describedby="delete-confirmation-dialog-description"
      >
        <DialogTitle id="delete-confirmation-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-dialog-description">
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={() => handleConfirmDelete('Update')}>Update</Button>
          <Button onClick={() => handleConfirmDelete('Delete')} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      {/* Error Dialog for Mandatory Fields */}
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            Title, Description, and Due Date are mandatory fields. Please fill them before submitting.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskManager;
