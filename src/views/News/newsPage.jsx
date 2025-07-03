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

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: '',
    imageUrl: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchNews = async () => {
    const snap = await getDocs(collection(db, 'news'));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateNews = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        source: formData.source,
        imageUrl: formData.imageUrl
      };

      if (selectedId) {
        await updateDoc(doc(db, 'news', selectedId), dataToSave);
      } else {
        await addDoc(collection(db, 'news'), dataToSave);
      }

      setFormData({ title: '', description: '', source: '', imageURL: '' });
      setSelectedId(null);
      setViewMode('table');
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEdit = (newsItem) => {
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      source: newsItem.source,
      imageUrl: newsItem.imageUrl
    });
    setSelectedId(newsItem.id);
    setViewMode('form');
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'news', deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    fetchNews();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedNews = news.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Breadcrumb title="News">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">Home</Typography>
        <Typography variant="subtitle2" color="primary">News</Typography>
      </Breadcrumb>

      {viewMode === 'form' ? (
        <form onSubmit={handleCreateOrUpdateNews}>
          <Paper elevation={3} sx={{ maxWidth: 700, margin: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {selectedId ? 'Update News' : 'Add New News'}
            </Typography>
            <Grid container spacing={2}>
              {['title', 'description', 'source'].map((field) => (
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
                      const storageRef = ref(storage, `news_images/${file.name}`);
                      uploadBytes(storageRef, file).then((snapshot) => {
                        getDownloadURL(snapshot.ref).then((url) => {
                          setFormData((prev) => ({ ...prev, imageUrl: url }));
                        });
                      });
                    }
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formData.imageUrl ? 'Image uploaded successfully' : 'No file chosen'}
                </Typography>
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="News Preview"
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
                    setFormData({ title: '', description: '', source: '', imageUrl: '' });
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
                setFormData({ title: '', description: '', source: '', imageUrl: '' });
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
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Source</strong></TableCell>
                    <TableCell><strong>Image</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedNews.map((item, index) => (
                    <TableRow key={item.id} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt="News"
                            width={60}
                            height={40}
                            style={{ borderRadius: 4 }}
                          />
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDeleteConfirm(item.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={news.length}
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

export default NewsPage;
