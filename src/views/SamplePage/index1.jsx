import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CardContent,
  Divider,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Container,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import Breadcrumb from 'component/Breadcrumb';
import { db } from '../../firebaseoptions';

const SamplePage = () => {
  const [leads, setLeads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    fee: '',
    source: '',
    status: '',
    courses: '',
    createdBy: '',
    remarks: ''
  });

  const fetchLeads = async () => {
    const leadsRef = collection(db, 'leads');
    const snapshot = await getDocs(leadsRef);
    const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLeads(leadsData);
  };

  const fetchCourses = async () => {
    const coursesSnap = await getDocs(collection(db, 'courses'));
    setCourses(coursesSnap.docs.map(doc => doc.data().name));
  };

  useEffect(() => {
    fetchLeads();
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateLead = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      remarks: formData.remarks ? formData.remarks.split(',') : [],
      createdAt: selectedId ? formData.createdAt : new Date()
    };

    try {
      if (selectedId) {
        await updateDoc(doc(db, 'leads', selectedId), data);
      } else {
        const docRef = await addDoc(collection(db, 'leads'), data);
        data.id = docRef.id;
      }
      setFormData({
        name: '',
        email: '',
        mobile: '',
        fee: '',
        source: '',
        status: '',
        courses: '',
        createdBy: '',
        remarks: ''
      });
      setSelectedId(null);
      setViewMode('table');
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (lead) => {
    setFormData({
      ...lead,
      remarks: lead.remarks?.join(',') || ''
    });
    setSelectedId(lead.id);
    setViewMode('form');
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'leads', deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    fetchLeads();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLeads = leads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Breadcrumb title="Leads">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Leads
        </Typography>
      </Breadcrumb>

      {viewMode === 'form' ? (
        
        <form onSubmit={handleCreateOrUpdateLead}>
  <Paper elevation={3} sx={{ maxWidth: 700, margin: 'auto', p: 3 }}>
    <Typography variant="h5" gutterBottom>
      {selectedId ? 'Update Lead' : 'Add New Lead'}
    </Typography>

    <Grid container spacing={2}>
      {['name', 'email', 'mobile', 'fee'].map((field) => (
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
        <FormControl fullWidth>
          <InputLabel>Source</InputLabel>
          <Select
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            label="Source"
          >
            {[
              'justdial', 'websitechat', 'facebook', 'inbound', 'walkin',
              'referral', 'jd-hnk', 'organic', 'instagram', 'local',
              'google forms', 'meta', 'insta100% job guarntee'
            ].map((src) => (
              <MenuItem key={src} value={src}>{src}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            label="Status"
          >
            {[
              'Lead', 'irrelvant', 'retry', 'folowup', 'demo ready', 'demo attended',
              'interested', 'notintereseted', 'converted', 'missed', 'offline',
              'duplicate', 'not reponded', 'declined', 'ready to join', 'company', 'courses'
            ].map((stat) => (
              <MenuItem key={stat} value={stat}>{stat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            name="courses"
            value={formData.courses}
            onChange={handleInputChange}
            label="Course"
          >
            {courses.map((course, idx) => (
              <MenuItem key={idx} value={course}>{course}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Created By</InputLabel>
          <Select
            name="createdBy"
            value={formData.createdBy}
            onChange={handleInputChange}
            label="Created By"
          >
            {['harshini', 'mahitha'].map((user) => (
              <MenuItem key={user} value={user}>{user}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Remarks (comma separated)"
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          fullWidth
        />
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
            setFormData({
              name: '',
              email: '',
              mobile: '',
              fee: '',
              source: '',
              status: '',
              courses: '',
              createdBy: '',
              remarks: ''
            });
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
            <button
              onClick={() => {
                setViewMode('form');
                setSelectedId(null);
                setFormData({ name: '', email: '', mobile: '', fee: '', source: '', status: '', courses: '', createdBy: '', remarks: '' });
              }}
              style={{ padding: '12px 12px', fontWeight: 'bold', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}
            >
              + Create
            </button>
          </div>

          <Divider />
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Mobile</strong></TableCell>
                    <TableCell><strong>Fee</strong></TableCell>
                    <TableCell><strong>Source</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    {/* <TableCell><strong>Courses</strong></TableCell> */}
                    <TableCell><strong>Created By</strong></TableCell>
                    <TableCell><strong>Created At</strong></TableCell>
                    <TableCell><strong>Remarks</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLeads.map((lead, index) => (
                    <TableRow key={lead.id} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.mobile}</TableCell>
                      <TableCell>{lead.fee}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.status}</TableCell>
                      {/* <TableCell>{lead.courses}</TableCell> */}
                      <TableCell>{lead.createdBy}</TableCell>
                      <TableCell>{lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {lead.remarks?.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(lead)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDeleteConfirm(lead.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={leads.length}
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

export default SamplePage;
