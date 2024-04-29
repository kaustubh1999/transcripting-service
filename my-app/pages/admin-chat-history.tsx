import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress'; 
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import IconButton from '@mui/material/IconButton';

const DataTablePage: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  const [newUserData, setNewUserData] = useState<{ username: string; email: string; password: string }>({ username: '', email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://35.175.25.7/auth/dashboard',{
        headers:{
          Authorization:`${token}`
        }
      });

      setRows(response.data.data.map((row: any) => ({
        ...row,
        createdAt: formatDateTime(new Date(row.createdAt)),
      })));
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); 
    }
  };

  const handleEditUser = (rowData) => {
    setOpenEditModal(true);
    setNewUserData({ ...rowData });
  };
  
  const handleDeleteUser = async (rowData) => {
    setNewUserData({ ...rowData });
    const token = localStorage.getItem('accessToken');
    const response = await axios.post('https://35.175.25.7/auth/delete-user',rowData,
    {
      headers:{
      Authorization:`${token}`
    }
  })
  console.log("response====",response)
    fetchData()
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'email', headerName: 'Email', width: 200 },

    {
      field: 'username',
      headerName: 'Name',
      width: 200
    },
    { field: 'totalArticles', headerName: 'Articles', width: 100 },

    { field: 'createdAt', headerName: 'Date Created', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100, 
      renderCell: (params) => (
        <span>
          {params.value ? 'Active' : 'Inactive'}
        </span>
      ),
    },  
      {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div>
          <IconButton color="primary" onClick={() => handleEditUser(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteUser(params.row)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUserData({ username: '', email: '', password: '' }); 
  };
  const handleEditCloseModal = () => {
    setOpenEditModal(false);
    setNewUserData({ username: '', email: '', password: '' }); 
  };

  const handleSaveUser = async () => {
    try {
      const response = await axios.post('https://35.175.25.7/auth/add-user', newUserData);
      console.log('User created:', response.data);
      fetchData();
      handleCloseModal();
    } catch (error) {
      alert('Something Went Wrong');
    }
  };

  const handleEditSaveUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log("newUserData====",newUserData)
      const response = await axios.post(
        'https://35.175.25.7/auth/edit-user-info',
        newUserData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log('User info edited:', response.data);
      fetchData();
      handleEditCloseModal();
    } catch (error) {
      alert('Something Went Wrong');
    }
  };

  const handleCreateNewUser = () => {
    setNewUserData({ username: '', email: '', password: '' });
    setOpenModal(true);
  };
  

  const handleSignOut = () => {
    router.push('/login');
  };

  const formatDateTime = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
        Welcome to YT2L - Here is Your Chat History
      </Typography>
      <div style={{ marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleCreateNewUser}>
          Add New User
        </Button>
        <Button variant="contained" color="primary" onClick={handleSignOut} style={{ marginLeft: '10px' }}>
          Sign Out
        </Button>
      </div>
      <div style={{ height: 600, width: '100%', overflow: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id}
              sortingOrder={['desc', 'asc']}         
            />
            <Modal open={openModal} onClose={handleCloseModal}>
              
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Create New User
                </Typography>
                <TextField
  label="Username"
  value={newUserData.username}
  onChange={(e) => setNewUserData(prevState => ({ ...prevState, username: e.target.value }))}
  fullWidth
  margin="normal"
/>
<TextField
  label="Email"
  value={newUserData.email}
  onChange={(e) => setNewUserData(prevState => ({ ...prevState, email: e.target.value }))}
  fullWidth
  name='email1scnsdijcnc'
  margin="normal"
/>
<TextField
  label="Password"
  value={newUserData.password}
  onChange={(e) => setNewUserData(prevState => ({ ...prevState, password: e.target.value }))}
  fullWidth
  name='pass1scnsdijcnc'
  margin="normal"
  type="password"
/>

<div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
  <Button variant="contained" color="primary" onClick={handleSaveUser}>
    Save
  </Button>
  <Button variant="contained" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
    Cancel
  </Button>
</div>

              </div>
            </Modal>
            <Modal open={openEditModal} onClose={handleEditCloseModal}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Edit User
                </Typography>
                <TextField
  label="Username"
  value={newUserData.username}
  onChange={(e) => setNewUserData(prevState => ({ ...prevState, username: e.target.value }))}
  fullWidth
  margin="normal"
/>
<TextField
  label="Email"
  value={newUserData.email}
  onChange={(e) => setNewUserData(prevState => ({ ...prevState, email: e.target.value }))}
  fullWidth
  margin="normal"
/>
<TextField
  label="Password"
  value={newUserData.password}
  onChange={(e) => setNewUserData(prevState => ({ ...prevState, password: e.target.value }))}
  fullWidth
  margin="normal"
  type="password"
/>

                <Button variant="contained" color="primary" onClick={handleEditSaveUser}>
                  Save
                </Button>
                <Button variant="contained" onClick={handleEditCloseModal} style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </div>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default DataTablePage;
