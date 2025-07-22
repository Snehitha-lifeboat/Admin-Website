import React, { useEffect, useState } from 'react';
import {
  Typography, CardContent, Divider, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, Paper, TablePagination,
  IconButton, Dialog, DialogActions, DialogTitle, Button,
  Grid, TextField, MenuItem, Tabs, Tab, Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../../firebaseoptions';
import Breadcrumb from 'component/Breadcrumb';

const RevenuPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [txnTypes, setTxnTypes] = useState([]);
  const [subTxnCredit, setSubTxnCredit] = useState([]);
  const [subTxnDebit, setSubTxnDebit] = useState([]);

  const [formData, setFormData] = useState({
    amount: '',
    txnType: '',
    subTxn: '',
    student: '',
    remarks: ''
  });

  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('credit');

  useEffect(() => {
    fetchTransactions();
    fetchTxnTypes();
    fetchSubTxnTypes();
  }, []);

  const fetchTransactions = async () => {
    const snap = await getDocs(collection(db, 'transactions'));
    const data = snap.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));
    setTransactions(data);
  };

  const fetchTxnTypes = async () => {
    const snap = await getDocs(collection(db, 'txn_types'));
    const data = snap.docs.map(doc => doc.data().name);
    setTxnTypes(data);
  };

  const fetchSubTxnTypes = async () => {
    const creditSnap = await getDocs(collection(db, 'sub_txn_credit'));
    const debitSnap = await getDocs(collection(db, 'sub_txn_debit'));

    const creditOptions = creditSnap.docs.map(doc => doc.data().name);
    const debitOptions = debitSnap.docs.map(doc => doc.data().name);

    setSubTxnCredit(creditOptions);
    setSubTxnDebit(debitOptions);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'txnType' ? { subTxn: '', student: '' } : {}) // Reset subTxn & studentName if txnType changes
    }));
  };

  const handleCreateOrUpdate = async (e) => {
  e.preventDefault();
  try {
    const updatedData = {
      ...formData,
      txnType: formData.txnType.toLowerCase(),
      amount: Number(formData.amount),
      timestamp: new Date()
    };

    if (selectedId) {
     
      await updateDoc(doc(db, 'transactions', selectedId), updatedData);
    } else {
    
      await addDoc(collection(db, 'transactions'), updatedData);
    }

    resetForm();
    fetchTransactions(); 
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};


  const handleEdit = (txn) => {
    setFormData({
      amount: txn.amount || '',
      txnType: txn.txnType || '',
      subTxn: txn.subTxn || '',
      student: txn.student || '',
      remarks: txn.remarks || ''
    });
    setSelectedId(txn.docId);
    setActiveTab(txn.txnType);
    setViewMode('form');
  };

  const handleDeleteConfirm = (docId) => {
    setDeleteId(docId);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'transactions', deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    fetchTransactions();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      txnType: '',
      subTxn: '',
      student: '',
      remarks: ''
    });
    setSelectedId(null);
    setViewMode('table');
    setActiveTab('credit');
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

// When filtering for tab
const filtered = transactions.filter(txn => txn.txnType?.toLowerCase() === activeTab);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const subTxnOptions = formData.txnType === 'credit' ? subTxnCredit : subTxnDebit;

  return (
    <>
      <Breadcrumb title="Transactions">
        <Typography variant="subtitle2" color="inherit">Home</Typography>
        <Typography variant="subtitle2" color="primary">Transactions</Typography>
      </Breadcrumb>

      {viewMode === 'form' ? (
        <form onSubmit={handleCreateOrUpdate}>
  <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
    <Typography variant="h5" gutterBottom>
      {selectedId ? 'Update Transaction' : 'Add Transaction'}
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
          fullWidth
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Transaction Type"
          name="txnType"
          value={formData.txnType}
          onChange={handleInputChange}
          fullWidth
          required
        >
          <MenuItem value="">-- Select Type --</MenuItem>
          <MenuItem value="credit">Credit</MenuItem>
          <MenuItem value="debit">Debit</MenuItem>
        </TextField>
      </Grid>

      {formData.txnType && (
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Sub Transaction"
            name="subTxn"
            value={formData.subTxn}
            onChange={handleInputChange}
            fullWidth
            required
          >
            <MenuItem value="">-- Select SubTxn --</MenuItem>
            {(formData.txnType === 'credit'
              ? ['fee', 'certificates', 'material', 'aadhar']
              : ['rent', 'powerbill', 'maintenance', 'internet', 'salaries', 'recharge', 'trainerpayment', 'others']
            ).map((opt, idx) => (
              <MenuItem key={idx} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Grid>
      )}

      {formData.txnType === 'credit' && (
        <Grid item xs={12} sm={6}>
          <TextField
            label="Student Name"
            name="studentName"
            value={formData.student}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <TextField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={2}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              aria-label="Transaction Tabs"
            >
              <Tab label="Credit" value="credit" />
              <Tab label="Debit" value="debit" />
            </Tabs>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                resetForm();
                setViewMode('form');
              }}
            >
              + Create
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Transaction Type</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>SubTransaction</strong></TableCell>
                    {activeTab === 'credit' && <TableCell><strong>Student Name</strong></TableCell>}
                    <TableCell><strong>Remarks</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((txn, index) => (
                    <TableRow key={txn.docId} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <TableCell>{txn.txnType}</TableCell>
                      <TableCell>{txn.amount}</TableCell>
                      <TableCell>{txn.subTxn}</TableCell>
                      {activeTab === 'credit' && <TableCell>{txn.student}</TableCell>}
                      <TableCell>{txn.remarks}</TableCell>
                      <TableCell>
                        <IconButton color='primary'onClick={() => handleEdit(txn)}><Edit /></IconButton>
                        <IconButton  color='error' onClick={() => handleDeleteConfirm(txn.docId)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filtered.length}
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

export default RevenuPage;
