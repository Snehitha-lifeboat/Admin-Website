import React, { useEffect, useState } from 'react';
import {
  Typography, CardContent, Divider, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, Paper, TablePagination,
  IconButton, Dialog, DialogActions, DialogTitle, Button,
  Grid, TextField, MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../../firebaseoptions';
import Breadcrumb from 'component/Breadcrumb';

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    fee: '',
    share: '',
    duration: ''
  });
  

  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [courseList, setCourseList] = useState([]);

 

  const fetchTrainers = async () => {
    const snap = await getDocs(collection(db, 'trainers'));
    const data = snap.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));
    setTrainers(data);
  };

 const fetchCourses = async () => {
  const snap = await getDocs(collection(db, 'courses'));
  const courseData = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setCourses(courseData);
  setCourseList(courseData.map(c => c.name));
};
console.log('All courses:', courses);
 useEffect(() => {
 fetchCourses();
 fetchTrainers();
 }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'course') {
      const selectedCourse = courses.find(c => c.name === value);
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          course: value,
          fee: selectedCourse.fee || '',
          duration: selectedCourse.duration || ''
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await updateDoc(doc(db, 'trainers', selectedId), formData);
      } else {
        await addDoc(collection(db, 'trainers'), formData);
      }
      resetForm();
      fetchTrainers();
    } catch (error) {
      console.error('Error saving trainer:', error);
    }
  };

  const handleEdit = (trainer) => {
    setFormData({
      name: trainer.name || '',
      course: trainer.course || '',
      fee: trainer.fee || '',
      share: trainer.share || '',
      duration: trainer.duration || ''
    });
    setSelectedId(trainer.docId);
    setViewMode('form');
  };

  const handleDeleteConfirm = (docId) => {
    setDeleteId(docId);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'trainers', deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    fetchTrainers();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      course: '',
      fee: '',
      share: '',
      duration: ''
    });
    setSelectedId(null);
    setViewMode('table');
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  const paginated = trainers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Breadcrumb title="Trainers">
        <Typography variant="subtitle2" color="inherit">Home</Typography>
        <Typography variant="subtitle2" color="primary">Trainers</Typography>
      </Breadcrumb>

      {viewMode === 'form' ? (
        <form onSubmit={handleCreateOrUpdate}>
          <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {selectedId ? 'Update Trainer' : 'Add Trainer'}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Trainer Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
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
                  required
                >
                  {courseList.map((courseName, index) => (
                        <MenuItem key={index} value={courseName}>
                          {courseName}
                        </MenuItem>
                      ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fee"
                  name="fee"
                  value={formData.fee}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Share"
                  name="share"
                  value={formData.share}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button type="submit" variant="contained" color="success">
                  {selectedId ? 'Update' : 'Submit'}
                </Button>
                <Button variant="outlined" onClick={resetForm}>Cancel</Button>
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
              resetForm();
              setViewMode('form');
            }}
            sx={{ mb: 2 }}
          >
            + Create 
          </Button>
</div>
          <Divider sx={{ mb: 2 }} />

          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Course</strong></TableCell>
                    <TableCell><strong>Fee</strong></TableCell>
                    <TableCell><strong>Share</strong></TableCell>
                    <TableCell><strong>Duration</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((trainer, index) => (
                    <TableRow key={trainer.docId} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <TableCell>{trainer.name}</TableCell>
                      <TableCell>{trainer.course}</TableCell>
                      <TableCell>{trainer.fee}</TableCell>
                      <TableCell>{trainer.share}</TableCell>
                      <TableCell>{trainer.duration}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(trainer)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDeleteConfirm(trainer.docId)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={trainers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </CardContent>

          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Are you sure you want to delete this trainer?</DialogTitle>
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

export default TrainersPage;
