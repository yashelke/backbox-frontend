import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import "./Uploads.css";

const Uploads = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch files from backend
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/api/files/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch files');
            }

            const data = await response.json();
            setFiles(data);
        } catch (err) {
            console.error('Error fetching files:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }

            // Refresh the file list
            fetchFiles();
        } catch (err) {
            console.error('Error deleting file:', err);
            alert('Failed to delete file. Please try again.');
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        const kb = bytes / 1024;
        const mb = kb / 1024;
        
        if (mb >= 1) {
            return `${mb.toFixed(2)} MB`;
        } else {
            return `${kb.toFixed(2)} KB`;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
        });
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return 'PDF';
        if (fileType.includes('image')) return 'IMG';
        if (fileType.includes('video')) return 'VID';
        if (fileType.includes('word') || fileType.includes('document')) return 'DOC';
        return 'FILE';
    };

    const filteredFiles = files.filter(file => 
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
    const lastUpload = files.length > 0 ? files[0] : null;

    const gotoHome = () => {
        navigate("/greet");
    };

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to direct download
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName || 'download';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

   const goToFileUpload = () => {
    navigate("/greet");
    // Delay to allow navigation to complete
    setTimeout(() => {
        const element = document.getElementById("try");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, 100);
};

    return (
        <div className="dashboard-container">
            {/* Header Navigation */}
            <header className="dashboard-navbar">
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <h2 className="brand-logo">BackBox</h2>
                        <span className="brand-divider">|</span>
                        <span className="brand-subtitle">Dashboard</span>
                    </div>
                    <nav className="navbar-menu">
                        <a href="#" className="menu-item" onClick={gotoHome}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            </svg>
                            <span>Go to Home</span>
                        </a>
                       
                       
                    </nav>
                </div>
            </header>

            {/* Main Content */}
             <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="dashboard-title">Uploads Dashboard</h1>
                        <p className="dashboard-subtitle">Manage and track your uploaded files</p>
                    </div>
                    <div className="header-right">
                        <span className="status-badge">Active Plan</span>
                        <button className="btn-primary" onClick={gotoHome}>Back to Home</button>
                    </div>
                </header> 

                {/* Stats Cards */}
                 <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Files</p>
                            <p className="stat-value">{files.length}</p>
                            <p className="stat-change positive">{files.filter(f => {
                                const today = new Date();
                                const uploadDate = new Date(f.uploadedAt);
                                return uploadDate.toDateString() === today.toDateString();
                            }).length} today</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Last Upload</p>
                            <p className="stat-value">{lastUpload ? formatDate(lastUpload.uploadedAt) : 'No files'}</p>
                            <p className="stat-change">{lastUpload ? lastUpload.fileName : '-'}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Files in Cloud</p>
                            <p className="stat-value">{files.length}</p>
                            <p className="stat-change">Cloudinary</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">File Types</p>
                            <p className="stat-value">{new Set(files.map(f => f.fileType)).size}</p>
                            <p className="stat-change positive">Different types</p>
                        </div>
                    </div>
                </div> 

                 <div className="files-section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Files</h2>
                        <div className="section-actions">
                            <input 
                                type="search" 
                                placeholder="Search files..." 
                                className="search-input" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn-upload" onClick={goToFileUpload}>+ Upload New</button>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <p>Loading files...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#f5576c' }}>
                            <p>Error: {error}</p>
                            <button onClick={fetchFiles} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                                Retry
                            </button>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <p>{searchTerm ? 'No files found matching your search' : 'No files uploaded yet'}</p>
                            <button className="btn-upload" onClick={goToFileUpload} style={{ marginTop: '20px' }}>
                                Upload Your First File
                            </button>
                        </div>
                    ) : (
                        <div className="files-table">
                            <div className="table-header">
                                <div className="th th-name">Name</div>
                                <div className="th th-size">Type</div>
                                <div className="th th-date">Date</div>
                                <div className="th th-actions">Actions</div>
                            </div>
                            <div className="table-body">
                                {filteredFiles.map((file) => (
                                    <div className="table-row" key={file._id}>
                                        <div className="td td-name">
                                            <div className="file-info">
                                                <div className="file-icon">{getFileIcon(file.fileType)}</div>
                                                <div>
                                                    <p className="file-name">{file.fileName}</p>
                                                    <p className="file-meta">{file.fileType}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="td td-size">
                                            {file.fileType.includes('image') ? 'Image' : 
                                             file.fileType.includes('pdf') ? 'PDF' : 'Document'}
                                        </div>
                                        <div className="td td-date">{formatDate(file.uploadedAt)}</div>
                                        <div className="td td-actions">
                                            <StyledSwitch>
                                                <div className="switch-container">
                                                    <label className="switch-label">
                                                        <input 
                                                            type="checkbox" 
                                                            className="switch-input"
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    // After animation completes, download the file
                                                                    setTimeout(() => {
                                                                        handleDownload(file.url, file.fileName);
                                                                        // Reset checkbox after download
                                                                        e.target.checked = false;
                                                                    }, 4000);
                                                                }
                                                            }}
                                                        />
                                                        <span className="switch-circle">
                                                            <svg className="switch-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19V5m0 14-4-4m4 4 4-4" />
                                                            </svg>
                                                            <div className="switch-square" />
                                                        </span>
                                                        <p className="switch-title">Download</p>
                                                        <p className="switch-title">Open</p>
                                                    </label>
                                                </div>
                                            </StyledSwitch>
                                            <button 
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(file._id)}
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main> 
        </div>
    );
};

// Styled component for the animated Download/Open switch
const StyledSwitch = styled.div`
  .switch-container {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .switch-label {
    background-color: transparent;
    border: 2px solid rgb(91, 91, 240);
    display: flex;
    align-items: center;
    border-radius: 50px;
    width: 120px;
    cursor: pointer;
    transition: all 0.4s ease;
    padding: 4px;
    position: relative;
  }

  .switch-label::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    width: 8px;
    height: 8px;
    transition: all 0.4s ease;
    border-radius: 100%;
    margin: auto;
    opacity: 0;
    visibility: hidden;
  }

  .switch-label .switch-input {
    display: none;
  }

  .switch-label .switch-title {
    font-size: 13px;
    color: #a855f7;
    transition: all 0.4s ease;
    position: absolute;
    right: 12px;
    bottom: 10px;
    text-align: center;
    font-weight: 600;
  }

  .switch-label .switch-title:last-child {
    opacity: 0;
    visibility: hidden;
  }

  .switch-label .switch-circle {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background-color: rgb(91, 91, 240);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.4s ease;
    position: relative;
    box-shadow: 0 0 0 0 rgb(255, 255, 255);
    overflow: hidden;
  }

  .switch-label .switch-circle .switch-icon {
    color: #fff;
    width: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .switch-label .switch-circle .switch-square {
    aspect-ratio: 1;
    width: 15px;
    border-radius: 2px;
    background-color: #fff;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .switch-label .switch-circle::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    background-color: #3333a8;
    width: 100%;
    height: 0;
    transition: all 0.4s ease;
  }

  .switch-label:has(.switch-input:checked) {
    width: 40px;
    animation: installed 0.4s ease 3.5s forwards;
  }

  .switch-label:has(.switch-input:checked)::before {
    animation: rotate 3s ease-in-out 0.4s forwards;
  }

  .switch-label .switch-input:checked + .switch-circle {
    animation:
      pulse 1s forwards,
      circleDelete 0.2s ease 3.5s forwards;
    rotate: 180deg;
  }

  .switch-label .switch-input:checked + .switch-circle::before {
    animation: installing 3s ease-in-out forwards;
  }

  .switch-label .switch-input:checked + .switch-circle .switch-icon {
    opacity: 0;
    visibility: hidden;
  }

  .switch-label .switch-input:checked ~ .switch-circle .switch-square {
    opacity: 1;
    visibility: visible;
  }

  .switch-label .switch-input:checked ~ .switch-title {
    opacity: 0;
    visibility: hidden;
  }

  .switch-label .switch-input:checked ~ .switch-title:last-child {
    animation: showInstalledMessage 0.4s ease 3.5s forwards;
  }

  @keyframes pulse {
    0% {
      scale: 0.95;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      scale: 1;
      box-shadow: 0 0 0 16px rgba(255, 255, 255, 0);
    }
    100% {
      scale: 0.95;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  @keyframes installing {
    from {
      height: 0;
    }
    to {
      height: 100%;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(-90deg) translate(27px) rotate(0);
      opacity: 1;
      visibility: visible;
    }
    99% {
      transform: rotate(270deg) translate(27px) rotate(270deg);
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes installed {
    100% {
      width: 110px;
      border-color: rgb(35, 174, 35);
    }
  }

  @keyframes circleDelete {
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes showInstalledMessage {
    100% {
      opacity: 1;
      visibility: visible;
      right: 42px;
    }
  }
`;

export default Uploads;