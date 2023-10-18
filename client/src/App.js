const serverURL = "http://13.55.139.143:3000/resize"
// Define the width and height you want to use
const width = 400;
const height = 300;

function App() {

  // Create a FormData object to upload the image file
  const formData = new FormData();
  formData.append('image', yourImageFile);
// Append the width and height as query parameters
formData.append('width', width);
formData.append('height', height);

  // Make the POST request
fetch(serverURL, {
  method: 'POST',
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    // Handle the response data, which will contain the S3 URL
    console.log('Resized image URL:', data.s3Url);
    t = data.s3Url;
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  return (
    <div className="App">

    </div>
  );
}

export default App;
