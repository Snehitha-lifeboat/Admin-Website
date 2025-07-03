import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography, CardContent, Divider, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, Paper, TablePagination,
  IconButton, Dialog, DialogActions, DialogTitle, Button,
  Grid, TextField
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Breadcrumb from 'component/Breadcrumb';
import { db, storage } from '../../firebaseoptions';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    fee: '',
   course_images: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCourses = async () => {
    const snap = await getDocs(collection(db, 'courses'));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        name: formData.name,
        duration: formData.duration,
        fee: formData.fee,
imageUrl: formData.imageUrl
      };

      if (selectedId) {
        await updateDoc(doc(db, 'courses', selectedId), dataToSave);
      } else {
        await addDoc(collection(db, 'courses'), dataToSave);
      }

      setFormData({ name: '', duration: '', fee: '', imageUrl: '' });
      setSelectedId(null);
      setViewMode('table');
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      duration: course.duration,
      fee: course.fee,
      imageUrl: course.imageUrl
    });
    setSelectedId(course.id);
    setViewMode('form');
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'courses', deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    fetchCourses();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedCourses = courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Breadcrumb title="Courses">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">Home</Typography>
        <Typography variant="subtitle2" color="primary">Courses</Typography>
      </Breadcrumb>

      {viewMode === 'form' ? (
        <form onSubmit={handleCreateOrUpdateCourse}>
          <Paper elevation={3} sx={{ maxWidth: 700, margin: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {selectedId ? 'Update Course' : 'Add New Course'}
            </Typography>
            <Grid container spacing={2}>
              {['name', 'duration', 'fee'].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const storageRef = ref(storage, `course_images${file.name}`);
                      uploadBytes(storageRef, file).then((snapshot) => {
                        getDownloadURL(snapshot.ref).then((url) => {
                          setFormData((prev) => ({ ...prev, imageUrl: url }));
                        });
                      });
                    }
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formData.imageUrl  ? 'Image uploaded successfully' : 'No file chosen'}
                </Typography>
                {formData.imageUrl  && (
                  <img
                    src={formData.imageUrl }
                    alt="Course Preview"
                    width={80}
                    height={60}
                    style={{ marginTop: 10, borderRadius: 4 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button type="submit" variant="contained" color="success">
                  {selectedId ? 'Update' : 'Submit'}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setFormData({ name: '', duration: '', fee: '', courseImage: '' });
                    setSelectedId(null);
                    setViewMode('table');
                  }}
                >
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
                setFormData({ name: '', duration: '', fee: '', course_images: '' });
                setSelectedId(null);
                setViewMode('form');
              }}
            >
              + Create
            </Button>
          </div>

          <Divider />
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Course Name</strong></TableCell>
                    <TableCell><strong>Duration</strong></TableCell>
                    <TableCell><strong>Fee</strong></TableCell>
                    <TableCell><strong>Image</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCourses.map((course, index) => (
                    <TableRow key={course.id} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.duration}</TableCell>
                      <TableCell>{course.fee}</TableCell>
                      <TableCell>
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl }
                            alt="Course"
                            width={60}
                            height={40}
                            style={{ borderRadius: 4 }}
                          />
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(course)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDeleteConfirm(course.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={courses.length}
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

export default CoursesPage;
