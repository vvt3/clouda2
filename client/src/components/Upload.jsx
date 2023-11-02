import React, { useState } from 'react';
import styles from '../css/Upload.module.css';
import Axios from 'axios';

const myURL = "http://3.25.244.240:3000/"


//For testing
const checkServer = async () => {
    try {
      const response = await Axios.get(myURL);
      console.log('Server is reachable:', response.data);
    } catch (error) {
      console.error('Error reaching the server:', error);
    }
  };

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [sizeOptions, setSizeOptions] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if(file === undefined) {
            setSelectedFile(null)
            console.log("file was removed?");
        }
        if(file !== null || file !== undefined) {
            setSelectedFile(file);
            const formdata = new FormData();

            formdata.append(file.name,file);

            // Make the POST request using Axios
            Axios.post(myURL + "upload", formdata, {
              headers: { 
                'Content-Type': 'multipart/form-data',
              }
            }) 
            .then(response => {
              console.log("file uploaded: ", response.data);
            })
            .catch(error => {
              console.log("error: ", error);
            })

            console.log(file);
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
        if (selectedFile && selectedSize) {
            // Create a FormData object to send the selected file
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Endpoint url
            const resizeURL = "http://13.55.139.143:3000/";

            // Define the request data, including the file, size, and aspect ratio
            const requestData = {
                size: selectedSize,
            };

            // // Make a POST request to the API
            // Axios.get(resizeURL, requestData, {
            //     headers: {
            //     'Content-Type': 'multipart/form-data', // Important when sending files
            //     },
            // })
            // .then((response) => {
            // // Handle the successful response from the API
            // console.log('Image resized successfully:', response.data);
            // // You can update your UI or perform any other actions here.
            // })
            // .catch((error) => {
            // // Handle any errors from the API request
            // console.error('Error resizing image:', error);
            // }
            checkServer();

        console.log(`I am converting ${selectedFile.name} to this size: ${selectedSize}`);
        }
    };

    return (
        <div className={styles.uploadContainer}>
          <div>
            <h2>1. Please upload the file or Search the file you want to resize</h2>
            <label>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            </label>
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