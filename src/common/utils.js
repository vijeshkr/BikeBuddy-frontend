import makeRequest from "./axios";

// Image upload
export const handleImageUpload = async (file) => {
    try {
        const formData = new FormData();

        formData.append("file", file);

        const res = await makeRequest.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return res.data;
    } catch (error) {
        console.log(error);
    }
}