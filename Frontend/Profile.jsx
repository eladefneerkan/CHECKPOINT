// Frontend/Profile.jsx
// 

import React, { useState } from 'react';
function Profile() {
    <h2>This is the Profile page</h2>
  }

const ProfilePictureUploader = () => {
  // State to store the selected file object (for upload to server)
  const [imageFile, setImageFile] = useState(null);
  // State to store the URL for the preview image
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handler for when the user selects a file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // 1. Store the file object in state
      setImageFile(file);
      
      // 2. Create a temporary URL for the image preview
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      // Clear states if the file is not an image or no file is selected
      setImageFile(null);
      setPreviewUrl(null);
      alert('Please select an image file (e.g., JPEG, PNG).');
    }
  };

  // Handler for the upload action (e.g., when a submit button is clicked)
  const handleUpload = async () => {
    if (!imageFile) {
      alert('Please select an image first.');
      return;
    }

    // 3. Prepare data for server upload using FormData
    const formData = new FormData();
    formData.append('profilePicture', imageFile); // 'profilePicture' is the field name your server expects

    // 4. Send the file to your API endpoint
    try {
      // Replace '/api/upload-profile-picture' with your actual endpoint
      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
        // The browser automatically sets the correct 'Content-Type' header 
        // (multipart/form-data) when a FormData object is passed as the body.
      });

      if (response.ok) {
        // Handle success (e.g., show a success message, update user context)
        console.log('File uploaded successfully!');
      } else {
        // Handle server errors
        console.error('Upload failed with status:', response.status);
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error during upload:', error);
    }
  };

  return (
    
    <div>
      <h1>This is the Profile page</h1>
      <h2>Profile Picture</h2>
      {/* Image Preview Area */}
      {previewUrl ? (
        <img 
          src={previewUrl} 
          alt="Profile Preview" 
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} 
        />
      ) : (
        <div style={{ width: '150px', height: '150px', backgroundColor: '#ccc', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          No Image Selected
        </div>
      )}

      {/* File Input for selection */}
      <input 
        type="file" 
        accept="image/*" // Restricts the file selector to image types
        onChange={handleFileChange} 
        style={{ display: 'block', margin: '20px 0' }}
      />
      
      {/* Upload Button */}
      <button onClick={handleUpload} disabled={!imageFile}>
        Upload Picture
      </button>
    </div>
  );
};

export default ProfilePictureUploader;