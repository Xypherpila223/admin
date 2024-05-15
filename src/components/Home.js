import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [viewStudent, setViewStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [messageRowId, setMessageRowId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [messageQueue, setMessageQueue] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(row =>
      row.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Check for online users and send queued messages
      messageQueue.forEach(messageObj => {
        if (onlineUsers.includes(messageObj.username)) {
          sendMessage(messageObj.username, messageObj.message);
          setMessageQueue(prevQueue => prevQueue.filter(m => m !== messageObj));
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [messageQueue, onlineUsers]);

  useEffect(() => {
    axios.get('https://pcg81mqc-3001.asse.devtunnels.ms/onlineusers')
      .then(response => setOnlineUsers(response.data))
      .catch(error => console.error('Error fetching online users:', error.message));
  }, []);
  

  const fetchData = () => {
    axios.get('https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount')
      .then(response => setData(response.data))
      .catch(error => setError('Error fetching data: ' + error.message));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (id, username, password) => {
    setEditId(id);
    setEditUsername(username);
    setEditPassword(password);
  };

  const handleSave = () => {
    axios.put(`https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount/${editId}`, { username: editUsername, password: editPassword })
      .then(() => {
        fetchData();
        setEditId(null);
        setEditUsername('');
        setEditPassword('');
        setError('');
      })
      .catch(error => setError('Error updating data: ' + error.message));
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    axios.delete(`https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount/${deleteId}`)
      .then(() => {
        fetchData();
        setDeleteId(null);
        setError('');
      })
      .catch(error => setError('Error deleting data: ' + error.message));
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleAddSubmit = () => {
    axios.post('https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount', { username: newUsername, password: newPassword })
      .then(() => {
        fetchData();
        setNewUsername('');
        setNewPassword('');
        setShowAddForm(false);
        setError('');
      })
      .catch(error => setError('Error adding data: ' + error.message));
  };

  const handleView = (student) => {
    setViewStudent(student);
  };

  const handleCloseView = () => {
    setViewStudent(null);
  };

  const handleMessageSubmit = (username) => {
    const userMessages = messages[username] || [];
    const newMessage = { message, timestamp: new Date().toLocaleString() };
    const updatedMessages = { ...messages, [username]: [...userMessages, newMessage] };

    if (onlineUsers.includes(username)) {
      sendMessage(username, message);
    } else {
      setMessageQueue(prevQueue => [...prevQueue, { username, message }]);
    }

    axios.post('https://pcg81mqc-3001.asse.devtunnels.ms/messages', { username, message })
      .then(() => {
        setMessages(updatedMessages);
        setMessage('');
        setError('');
      })
      .catch(error => setError('Error sending message: ' + error.message));
  };

  const handleMessageClick = (rowId, username) => {
    setMessageRowId(rowId === messageRowId ? null : rowId);
    setMessage('');
  };

  const sendMessage = (username, message) => {
    // Implement your logic to send message to username
  };


  useEffect(() => {
    axios.get('https://pcg81mqc-3001.asse.devtunnels.ms/onlineusers')
      .then(response => setOnlineUsers(response.data))
      .catch(error => console.error('Error fetching online users:', error.message));
  }, []);

  
  return (
    <div className="table-container">
      <h2>Student Accounts</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button className="add-btn" onClick={handleAdd}>Add Student</button>
      </div>
      {showAddForm && (
        <div>
          <input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button className="submit-btn" onClick={handleAddSubmit}>Submit</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{editId === row.id ? <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} /> : row.username}</td>
              <td>{editId === row.id ? <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} /> : row.password}</td>
              <td>
                {editId === row.id ? (
                  <>
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={() => { setEditId(null); setEditUsername(''); setEditPassword(''); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="view-btn" onClick={() => handleView(row)}>View</button>
                    <button className="edit-btn" onClick={() => handleEdit(row.id, row.username, row.password)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(row.id)}>Delete</button>
                    <button className="message-btn" onClick={() => handleMessageClick(row.id, row.username)}>Message</button>
                  </>
                )}
              </td>
              {messageRowId === row.id && (
                <td colSpan="4">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                  <button onClick={() => handleMessageSubmit(row.username)}>Send</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {deleteId && (
        <div className="delete-modal">
          <p>Are you sure you want to delete this student account?</p>
          <button className="confirm-btn" onClick={handleDeleteConfirm}>Yes</button>
          <button className="cancel-btn" onClick={() => setDeleteId(null)}>No</button>
        </div>
      )}
      {viewStudent && (
        <div className="view-container">
          <h3>Student Information</h3>
          <p>ID: {viewStudent.id}</p>
          <p>Username: {viewStudent.username}</p>
          <p>Password: {viewStudent.password}</p>
          <button className="close-btn" onClick={handleCloseView}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Home;
