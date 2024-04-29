import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { useRouter } from 'next/router';

const DataTablePage: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log("token===",token)
      const response = await axios.get('https://35.175.25.7/auth/chat-history',
      {
        headers: {
          Authorization: `${token}`
        }
      });


      setRows(response.data.data.chats.map((row: any) => ({
        ...row,
        createdAt: formatDateTime(new Date(row.createdAt)), // Format date
      })));
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); 
    }
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 300 },
    {
      field: 'about',
      headerName: 'About',
      width: 600,
      sortable: false,
      renderCell: (params) => (
        <div
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => setSelectedRow(params.row)}
        >
          {params.value}
        </div>
      ),
    },
    { field: 'createdAt', headerName: 'Date Created', width: 200 },
  ];

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const formatDateTime = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);
    return `${formattedDate} ${formattedTime}`;
  };

  function formatTranscription(transcription: any) {
    try {
      // Extracting the title from the transcription
      const titleMatch = transcription.match(/Title:(.*)/);
      const title = titleMatch ? titleMatch[1].trim() : "Untitled"; // Using "Untitled" if no title is found

      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <h1>${title}</h1>
    <p>${transcription.replace(/\n\n/g, '</p><p>').replace(/(Title:|In conclusion,)/g, '<strong>$1</strong>')}</p>
</body>
</html>`;
    } catch (err) {
      return transcription; // Returning original transcription if an error occurs
    }
  }

  const handleCreateTranscription = () => {
    router.push('/transcript');
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
        Welcome to YT2L - Here is Your Chat History
      </Typography>
      <div style={{ marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleCreateTranscription}>
          Create New Transcription
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
            {rows.length === 0 ? (
              <Typography variant="body1" align="center">
                No History Found
              </Typography>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id} 
              />
            )}
            <Modal open={!!selectedRow} onClose={handleCloseModal}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                </Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: selectedRow ? formatTranscription(selectedRow.transcription) : '' }} />
              </div>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
  
};

export default DataTablePage;
