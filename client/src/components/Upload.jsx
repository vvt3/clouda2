import React, { useState } from 'react';
import styles from '../css/Upload.module.css';
import Axios from 'axios';
const FormData = require('form-data');
// Manually set the Content-Type header
const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
};

const myURL = "http://13.236.165.251:3000/"
const uploadURL = "http://13.236.165.251:3000/upload"

//For testing
const checkIndex = async () => {
    if (!('indexedDB' in window)) {
      console.log('IndexedDB is not supported in this browser.');
    }
    else {
      console.log('IndexedDB is supported');
    }
  };

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [sizeOptions, setSizeOptions] = useState([]);

    const [myOutput, setMyOutput] = useState([]);
    //checkIndex();

    const handleUserFile = () => {
      if (selectedFile !== null && selectedFile !== undefined) {

        console.log("Appended: ", selectedFile);

        const formdata = new FormData();
        formdata.append("file", selectedFile, selectedFile.originalname);
    
        // Log the contents of the FormData and the selected file
        // for (var key of formdata.entries()) {
        //   console.log(key);
        // }
    
        // Make the GET request using Axios
        Axios.post(uploadURL, formdata, config)
        .then(response => {
          console.log("file uploaded: ", response.data);
        })
        .catch(error => {
          console.log("error: ", error);
        })
      } 
      else {
        console.log("No file selected.");
      }
    }

    const handleFileUpload = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if(file === undefined) {
            setSelectedFile(null)
            console.log("file was removed?");
        }
        if(file !== null && file !== undefined) {
            setSelectedFile(file);
        } 
    };

    const handleAspectRatioChange = (event) => {
        const aspectRatio = event.target.value;
        setSelectedAspectRatio(aspectRatio);

        // Update the available options for the second dropdown based on the aspect ratio.
        let sizeOptions = [];
        if (aspectRatio === '1x1') {
            sizeOptions = ['100x100', '125x125', '150x150', '200x200']; 
        } else if (aspectRatio === '4x3') {
            sizeOptions = ['640x480', '800x600', '960x720', '1024x768', '1280x960', '1400x1050', '1440x1080'];
        } else if (aspectRatio === '16x9') {
            sizeOptions = ['426x240', '640x360', '854x480', '1280x720', '1920x1080'];
        }
        setSelectedSize('');
        setSizeOptions(sizeOptions);
    };

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    const handleConvert = () => {
        if (!selectedFile || !selectedSize) {
          console.log('No file and size selected.');
          return;
        }

        const [width, height] = selectedSize.split('x');

        // Create a new FormData object to send data to the server
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('width', width);
        formData.append('height', height);

        // Make a POST request to your server to initiate the conversion
        Axios.post(myURL + 'resize', formData, config)
        .then((response) => {
          console.log('Image converted successfully.');
          // Display the converted image to the user
          setMyOutput(response.data)
          console.log('Recieved: '. myOutput);
        })
        .catch(error => {
        console.error('Error during conversion: ', error);
        });

        console.log(`I am converting ${selectedFile.name} to this size: ${selectedSize}`);
    };

    return (
        <div className={styles.uploadContainer}>
          <div>
            <h2>1. Please upload the file or Search the file you want to resize</h2>
            <label>
              <input type="file" name="file" accept="image/*" id="fileInput" onChange={handleFileUpload} required/>
            </label>
            <button onClick={handleUserFile} >Upload</button>
          </div>
          
          {selectedFile && (
            <div>
              <h2>2. Select the aspect ratio</h2>
              <select value={selectedAspectRatio} onChange={handleAspectRatioChange}>
                <option value="">Select Aspect Ratio</option>
                <option value="1x1">1x1</option>
                <option value="4x3">4x3</option>
                <option value="16x9">16x9</option>
              </select>
            </div>
          )}
      
          {selectedFile && selectedAspectRatio && (
            <div>
              <h2>3. Select the size</h2>
              <select value={selectedSize} onChange={handleSizeChange}>
                <option value="">Select Size</option>
                {sizeOptions.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
      
          {selectedFile && selectedAspectRatio && selectedSize && (
            <button className={styles.convertButton} onClick={handleConvert}>Convert</button>
          )} 
        </div>
      );
      
}
export default Upload;