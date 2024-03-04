// Filter.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Filter = ({ onChangeFilter }) => {
  const handleChange = (event) => {
    onChangeFilter(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel>Status</InputLabel>
      <Select value={'All'} onChange={handleChange}>
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="To Do">To Do</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Filter;
