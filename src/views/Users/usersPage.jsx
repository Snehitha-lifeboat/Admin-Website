import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography, CardContent, Divider, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, Paper, TablePagination,
  IconButton, Dialog, DialogActions, DialogTitle, Button,
  Grid, TextField, Switch, FormControlLabel, Tabs, Tab, Box,
  InputAdornment, IconButton as MUIIconButton, MenuItem
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import Breadcrumb from 'component/Breadcrumb';
import { db } from '../../firebaseoptions';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '',
    phone: '',
    id: '', 
    fee: '', 
    course: '', 
    isAdmin: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('student');

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const data = snap.docs.map(doc => {
        const userData = doc.data();
        return {
          docId: doc.id, 
          id: userData.id, 
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          fee: userData.fee,
          isAdmin: userData.isAdmin || false,
          
        };
      });
      console.log('Fetched users:', data); 
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCourses = async () => {
    const snap = await getDocs(collection(db, 'courses'));
    const data = snap.docs.map(doc => doc.data().name);
    setCourses(data);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

   const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = { ...formData };
      if (selectedId) {
        await updateDoc(doc(db, 'users', selectedId), dataToSave);
      } else {
        await addDoc(collection(db, 'users'), dataToSave);
      }
      setFormData({
       name: '', 
        email: '', 
        password: '',
        phone: '',
        id: '', 
        fee: '', 
        course: '', 
        isAdmin: false
      });
      setSelectedId(null);
      setViewMode('table');
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    console.log('Editing user:', user); 
    console.log('Document ID (docId):', user.docId); 
    console.log('Student ID (id):', user.id); 

    const newFormData = {
      name: user.name || '',
      email: user.email || '',
      password: user.password || '',
      phone: user.phone || '',
      id: user.id || '', 
      fee: user.fee || '',
      course: user.course || '', 
      isAdmin: user.isAdmin || false
    };
    
    setFormData(newFormData);
    setSelectedId(user.docId); 
    console.log('Selected ID set to:', user.docId); 
    setViewMode('form');
  };

  const handleDeleteConfirm = (docId) => {
    setDeleteId(docId);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'users', deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    fetchUsers();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(user => activeTab === 'admin' ? user.isAdmin : !user.isAdmin);
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const resetForm = () => {
    setFormData({
      name: '', 
      email: '', 
      password: '',
      phone: '',
      id: '', 
      fee: '', 
      course: '', 
      isAdmin: false
    });
    setSelectedId(null);
    setViewMode('table');
  };

  return (
    <>
      <Breadcrumb title="Users">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">Home</Typography>
        <Typography variant="subtitle2" color="primary">Users</Typography>
      </Breadcrumb>

      {viewMode === 'form' ? (
        <form onSubmit={handleCreateOrUpdateUser}>
          <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {selectedId ? 'Update User' : 'Add New User'}
            </Typography>
            <FormControlLabel
              control={<Switch checked={formData.isAdmin} onChange={handleInputChange} name="isAdmin" />}
              label="Is Admin"
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {formData.isAdmin ? (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      label="Name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      label="Email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <MUIIconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </MUIIconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      label="Student Name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      label="Email ID" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      label="Phone Number" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <MUIIconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </MUIIconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      label="Student ID" 
                      name="id" 
                      value={formData.id} 
                      onChange={handleInputChange} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      label="Fee" 
                      name="fee" 
                      value={formData.fee} 
                      onChange={handleInputChange} 
                      fullWidth 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      fullWidth
                    >
                      <MenuItem value="">-- Select Course --</MenuItem>
                      {courses.map((courses, index) => (
                        <MenuItem key={index} value={courses}>{courses}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </>
              )}
              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button type="submit" variant="contained" color="success">
                  {selectedId ? 'Update' : 'Submit'}
                </Button>
                <Button type="button" variant="outlined" color="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFormData({
                  name: '', 
                  email: '', 
                  password: '',
                  phone: '',
                  id: '', 
                  fee: '', 
                  course: '', 
                  isAdmin: false
                });
                setSelectedId(null);
                setViewMode('form');
              }}
            >
              + Create
            </Button>
          </div>

          <Divider />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              aria-label="user type tabs"
            >
              <Tab label="Students" value="student" />
              <Tab label="Admin" value="admin" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>User Type</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user, index) => (
                    <TableRow key={user.docId} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <TableCell>{user.isAdmin ? 'Admin' : 'Student'}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <IconButton color='primary' onClick={() => handleEdit(user)}><Edit /></IconButton>
                        <IconButton color='error' onClick={() => handleDeleteConfirm(user.docId)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </CardContent>

          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Are you sure you want to delete?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)} color="primary">No</Button>
              <Button onClick={handleDelete} color="error">Yes</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default UsersPage;