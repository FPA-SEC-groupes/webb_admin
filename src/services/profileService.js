import axios from './axiosService';

// Fetch user by ID
export const fetchUserById = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        throw new Error("No user ID found in localStorage.");
    }
    const url = `/users/id/${userId}`;

    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Failed to fetch user. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error);
        throw error;
    }
};

// Upload profile image
export const uploadProfileImage = async (fileData) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        throw new Error("No user ID found in localStorage.");
    }
    const url = `/users/${userId}/add-image`;

    try {
        const formData = new FormData();
        formData.append('image', fileData);

        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            console.log('Image added successfully!');
            return response.data;
        } else {
            throw new Error(`Failed to add image. Error code: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to upload image:', error.response ? error.response.data : error);
        throw error;
    }
};

// Log out user
export const logoutUser = async () => {
    const url = '/auth/signout';
    try {
        const response = await axios.post(url);
        if (response.status === 200) {
            localStorage.clear();
            console.log('User logged out successfully.');
        } else {
            throw new Error(`Logout failed. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

// Update user information
export const updateUser = async (user) => {
    const url = '/users/update';
    console.log("Updating user with data:", user); // Log to see what's being sent
    try {
        const response = await axios.put(url, user);
        if (response.status === 200) {
            console.log('User updated successfully:', response.data);
            return response.data;
        } else {
            throw new Error(`Failed to update user: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to update user:', error.response ? error.response.data : error);
        throw error;
    }
};

export const changePassword = async (resetPasswordRequest) => {
    const url = '/auth/reset-password';

    try {
        const response = await axios.post(url, resetPasswordRequest);
        if (response.status === 200) {
            console.log('Password changed successfully!');
        } else {
            throw new Error(`Failed to change password. Error code: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to change password:', error.response ? error.response.data : error);
        throw error;
    }
};