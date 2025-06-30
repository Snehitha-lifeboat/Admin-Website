import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
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
  Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Breadcrumb from 'component/Breadcrumb';
import { db } from '../../firebaseoptions';

const SamplePage = () => {
  const [leads, setLeads] = useState([]);
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
    createdBy: '',
    remarks: ''
  });

  const fetchLeads = async () => {
    const leadsRef = collection(db, 'leads');
    const snapshot = await getDocs(leadsRef);
    const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLeads(leadsData);
  };

  useEffect(() => {
    fetchLeads();
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
        <form onSubmit={handleCreateOrUpdateLead} style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
          <Typography variant="h6" gutterBottom>{selectedId ? 'Update Lead' : 'Add New Lead'}</Typography>
          {['name', 'email', 'mobile', 'fee', 'source', 'status', 'createdBy', 'remarks'].map(field => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: 4 }}>
              {selectedId ? 'Update' : 'Submit'}
            </button>
            <button type="button" onClick={() => { setFormData({ name: '', email: '', mobile: '', fee: '', source: '', status: '', createdBy: '', remarks: '' }); setSelectedId(null); setViewMode('table'); }}
              style={{ padding: '10px 20px', background: 'gray', color: 'white', border: 'none', borderRadius: 4 }}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              onClick={() => { setViewMode('form'); setSelectedId(null); setFormData({ name: '', email: '', mobile: '', fee: '', source: '', status: '', createdBy: '', remarks: '' }); }}
              style={{ padding: '12px 12px', fontWeight: 'bold', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4,}}
            >
              + Create
            </button>
          </div>

          {/* <CardHeader title={<Typography variant="h6">Leads</Typography>} /> */}
          <Divider />
          {/* <CardContent sx={{ p: 0 }}> */}
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
                      <TableCell>{lead.createdBy}</TableCell>
                      <TableCell>{lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {lead.remarks?.map((r, index) => (
                            <li key={index}>{r}</li>
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
          {/* </CardContent> */}

          {/* Delete confirmation dialog */}
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
