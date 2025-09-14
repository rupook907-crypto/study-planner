import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileService } from '../services/fileService';

const FileUpload = ({ assignmentId, userId, onFileUpload, onError }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        const result = await FileService.uploadFile(file, assignmentId, userId);
        
        if (result.success) {
          onFileUpload && onFileUpload(result);
        } else {
          onError && onError(result.error);
        }
      }
    } catch (error) {
      onError && onError(error.message);
    } finally {
      setIsUploading(false);
    }
  }, [assignmentId, userId, onFileUpload, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    maxSize: 10 * 1024 * 1024, // 10MB max
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt']
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #007bff',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        background: isDragActive ? '#e3f2fd' : '#f8f9fa',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        opacity: isUploading ? 0.6 : 1
      }}
    >
      <input {...getInputProps()} />
      
      {isUploading ? (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
          <p>Uploading files...</p>
        </div>
      ) : isDragActive ? (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎯</div>
          <p>Drop the files here...</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📁</div>
          <p>Drag & drop files here, or click to select files</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            PDF, Word, Images, Text files (Max 10MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 