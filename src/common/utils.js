import makeRequest from "./axios";

/**
 * Handle the upload of an image file to the server
 * 
 * @param {File} file -The image file to be uploaded 
 * @returns -The response data from the server if the upload is successful.
 */

// Image upload
export const handleImageUpload = async (file) => {
    try {
        // Create new FormData object to prepare the file for upload
        const formData = new FormData();

        formData.append("file", file);

        const res = await makeRequest.post('/upload', formData, {
            // Set the Content-Type header to 'multipart/form-data' to indicate
            // that we are sending form data, specifically for file uploads.
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        // Return the respons data from the server
        return res.data;
    } catch (error) {
        console.log(error);
    }
}