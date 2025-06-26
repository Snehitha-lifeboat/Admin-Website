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
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import Breadcrumb from 'component/Breadcrumb';
import { db } from '../../firebaseoptions';

const SamplePage = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchLeads = async () => {
      const leadsRef = collection(db, 'leads');
      const snapshot = await getDocs(leadsRef);
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
    };
    fetchLeads();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Slice the leads for current page
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

      {/* <Card elevation={2}> */}
        <CardHeader title={<Typography variant="h6">Leads</Typography>} />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper}
          sx={{
    overflowX: 'auto',
    scrollbarWidth: 'none',           // Firefox
    '&::-webkit-scrollbar': {
      display: 'none',                // Chrome, Safari
    },
    '-ms-overflow-style': 'none',     // IE and Edge
  }}>
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
                    <TableCell>
                      {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {lead.remarks?.map((r, index) => (
                          <li key={index}>{r}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
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
      
    </>
  );
};

export default SamplePage;
