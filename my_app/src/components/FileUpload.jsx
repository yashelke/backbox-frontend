import React, { useRef, useState } from "react";
import Loader from "./Loader";
import "./FileUpload.css";

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const uploadEndpoint = `${API_URL}/api/files/upload`;

    const setFile = (file) => {
        if (!file) {
            return;
        }
        setSelectedFile(file);
        setStatus({ type: "", message: "" });
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        setFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        setFile(file);
    };

    const resetSelection = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setStatus({ type: "error", message: "Please choose a file first." });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setStatus({ type: "error", message: "You need to sign in again before uploading." });
            return;
        }

        setIsUploading(true);
        setStatus({ type: "", message: "" });

        const MIN_SPIN_MS = 1200;
        const start = Date.now();

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch(uploadEndpoint, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(payload?.message || "Upload failed. Please try again.");
            }

            setStatus({ type: "success", message: payload?.message || "File uploaded successfully!" });
            resetSelection();
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Unable to upload the file right now." });
        } finally {
            const elapsed = Date.now() - start;
            const delay = Math.max(0, MIN_SPIN_MS - elapsed);
            setTimeout(() => setIsUploading(false), delay);
        }
    };



    return (
        <section className="upload-section" id="try">
            <div className="upload-card">
                {isUploading && (
                    <div className="upload-overlay" role="status" aria-live="polite">
                        <Loader />
                        <p>Uploading to Cloudinary...</p>
                    </div>
                )}
                <header className="upload-header">
                    <p className="eyebrow">Upload to Backbox</p>
                    <h2>Bring your files to the cloud</h2>
                    <p>Drag & drop or browse files from your device, then send them straight to Cloudinary.</p>
                </header>

                <div
                    className={`drop-zone ${isDragging ? "dragging" : ""} ${selectedFile ? "has-file" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                    aria-label="File upload drop zone"
                >
                    <div className="drop-zone-content">
                        <span className="drop-zone-icon" aria-hidden="true">
                            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20 28L32 16L44 28"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M32 16V44"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M50 42V46C50 48.2091 48.2091 50 46 50H18C15.7909 50 14 48.2091 14 46V42"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>

                        {selectedFile ? (
                            <div className="file-summary">
                                <p className="file-name">{selectedFile.name}</p>
                                <p className="file-meta">
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || "Unknown format"}
                                </p>
                                <button type="button" className="text-button" onClick={resetSelection}>
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <div className="placeholder">
                                <p>Drag & drop your file here</p>
                                <p>or click to browse</p>
                                <small>Supported: documents, images, audio, videos, archives (max 10MB)</small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="upload-actions">
                    <button type="button" className="ghost" onClick={() => fileInputRef.current?.click()}>
                        Browse Files
                    </button>
                    <button
                        type="button"
                        className="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload to Cloudinary"}
                    </button>
                </div>

                {status.message && <p className={`status ${status.type}`}>{status.message}</p>}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.mp4,.mp3,.wav,.mov"
                    hidden
                    onChange={handleFileChange}
                />
            </div>
        </section>
    );
};

export default FileUpload;