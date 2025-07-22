
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography, CardContent, Divider, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, Paper, TablePagination,
  IconButton, Dialog, DialogActions, DialogTitle, DialogContent,
  Button, Grid, TextField, Autocomplete, MenuItem,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Breadcrumb from 'component/Breadcrumb';
import { db } from '../../firebaseoptions';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [emails, setEmails] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [formData, setFormData] = useState({ name: '', course: '', members: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [chatGroup, setChatGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const lastMsgMap = useRef({});

  const auth = getAuth();
  const currentUserEmail = auth.currentUser?.email || 'anon@user.com';

  const fetchEmails = async () => {
    const snap = await getDocs(collection(db, 'users'));
    setEmails(snap.docs.map(d => d.data().email));
  };

  const fetchCourses = async () => {
    const snap = await getDocs(collection(db, 'courses'));
    setCourseList(snap.docs.map(d => d.data().name));
  };

  const openChat = (groupDoc) => setChatGroup(groupDoc);
  const closeChat = () => { setChatGroup(null); setMessages([]); };

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setGroups(data);

      data.forEach((g) => {
        const t = g.lastMessageTime?.seconds;

        if (t && lastMsgMap.current[g.id] && t > lastMsgMap.current[g.id]) {
          if (g.lastMessageSender !== currentUserEmail && Notification.permission === 'granted') {
            new Notification(`New message from ${g.name}`, {
              body: g.lastMessage,
              icon: '/favicon.ico'
            });
          }
        }
        if (t) lastMsgMap.current[g.id] = t;
      });
    });

    fetchEmails();
    fetchCourses();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!chatGroup?.id) return;
    const q = query(
      collection(db, 'groups', chatGroup.id, 'messages'),
      orderBy('timestamp')
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [chatGroup]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatGroup) return;

    const payload = {
      text: newMessage.trim(),
      sender: currentUserEmail,
      timestamp: serverTimestamp()
    };

    await addDoc(collection(db, 'groups', chatGroup.id, 'messages'), payload);

    await updateDoc(doc(db, 'groups', chatGroup.id), {
      lastMessage: payload.text,
      lastMessageSender: currentUserEmail,
      lastMessageTime: serverTimestamp()
    });

    setNewMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateGroup = async (e) => {
    e.preventDefault();
    const payload = { name: formData.name, course: formData.course, members: formData.members };
    if (selectedId) await updateDoc(doc(db, 'groups', selectedId), payload);
    else await addDoc(collection(db, 'groups'), payload);

    setFormData({ name: '', course: '', members: '' });
    setSelectedId(null);
    setViewMode('table');
  };

  const handleEdit = (group) => {
    setFormData({ name: group.name, course: group.course, members: group.members });
    setSelectedId(group.id);
    setViewMode('form');
  };

  const handleDeleteConfirm = (id) => { setDeleteId(id); setConfirmOpen(true); };
  const handleDelete = async () => {
    await deleteDoc(doc(db, 'groups', deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(+e.target.value); setPage(0); };
  const paginatedGroups = groups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const bottomRef = useRef();
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  /* ============== UI ============== */
  return (
    <>
      {/* ---------- breadcrumb ---------- */}
      <Breadcrumb title="Groups">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">Home</Typography>
        <Typography variant="subtitle2" color="primary">Groups</Typography>
      </Breadcrumb>

      {/* ---------- FORM ---------- */}
      {viewMode === 'form' ? (
        <form onSubmit={handleCreateOrUpdateGroup}>
          <Paper elevation={3} sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>{selectedId ? 'Update Group' : 'Add New Group'}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Group Name" name="name"
                  value={formData.name} onChange={handleInputChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Course" name="course" select
                  value={formData.course} onChange={handleInputChange} fullWidth>
                  {courseList.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete options={emails} freeSolo
                  getOptionLabel={(o) => o || ''}
                  value={formData.members}
                  onChange={(_, v) => setFormData(p => ({ ...p, members: v }))}
                  renderInput={(p) => <TextField {...p} label="Email" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button type="submit" variant="contained" color="success">
                  {selectedId ? 'Update' : 'Submit'}
                </Button>
                <Button variant="outlined" color="secondary"
                  onClick={() => { setFormData({ name: '', course: '', members: '' }); setSelectedId(null); setViewMode('table'); }}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      ) : (
      /* ---------- TABLE ---------- */
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button variant="contained" onClick={() => { setFormData({ name: '', course: '', members: '' }); setSelectedId(null); setViewMode('form'); }}>
              + Create
            </Button>
          </div>

          <Divider />
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Group</strong></TableCell>
                    <TableCell><strong>Course</strong></TableCell>
                    <TableCell><strong>Members</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedGroups.map((g, idx) => (
                    <TableRow key={g.id} sx={{ backgroundColor: idx % 2 ? '#fff' : '#fafafa' }}>
                      <TableCell sx={{ cursor: 'pointer' }} onClick={() => openChat(g)}>
                        <strong>{g.name}</strong><br/>
                        <Typography variant="caption">{g.lastMessageSender}: {g.lastMessage}</Typography>
                      </TableCell>
                      <TableCell>{g.course}</TableCell>
                      <TableCell>{g.members}</TableCell>
                      <TableCell>
                        <IconButton color='primary' onClick={() => handleEdit(g)}><Edit /></IconButton>
                        <IconButton color='error' onClick={() => handleDeleteConfirm(g.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]} component="div"
                count={groups.length} page={page} rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </CardContent>

          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Delete this group?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>No</Button>
              <Button color="error" onClick={handleDelete}>Yes</Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* ---------- CHAT DIALOG ---------- */}
      <Dialog open={!!chatGroup} onClose={closeChat} fullWidth maxWidth="sm" 
       PaperProps={{
    sx: {
      width: 400,        
      height: 450         
    }}
  }
      >
        <DialogTitle>Chat • {chatGroup?.name}</DialogTitle>

        {/* message list */}
        <DialogContent dividers sx={{ maxHeight: 400, overflowY: 'auto', bgcolor: '#f9f9f9' }}>
  {messages.length === 0 ? (
    <Typography>No messages yet.</Typography>
  ) : (
    messages.map((m) => {
      const isMe = m.sender === currentUserEmail;

      return (
        <Box
          key={m.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
            mb: 2,

          }}
        >
          <Box
            sx={{
              maxWidth: '75%',
              p: 1.5,
              borderRadius: 2,
              bgcolor: isMe ? '#e3f2fd' : '#eeeeee',
              color: '#000',
              boxShadow: 1,
              
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {m.text}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 0.5, fontSize: '0.7rem' }}
          >
            {isMe ? 'You' : m.sender} •{' '}
            {m.timestamp?.seconds
              ? new Date(m.timestamp.seconds * 1000).toLocaleString()
              : '...'}
          </Typography>
        </Box>
      );
    })
  )}
  <div ref={bottomRef} />
</DialogContent>


        {/* send box */}
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, py: 2, px: 3 }}>
          <TextField
            placeholder="Type your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            fullWidth
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } }}
          />
          <Button variant="contained" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupsPage;
