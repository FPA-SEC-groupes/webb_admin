import axios from './axiosService';

// Function to get moderators
export const getModerators = async () => {
    try {
        const response = await axios.get('/users/get/moderators');
        if (response.status === 200) {
            console.log("Fetched moderators successfully:", response.data);
            return response.data;  // Assuming the backend sends the array directly
        } else {
            throw new Error(`Failed to load moderators: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching moderators:', error.response ? error.response.data : error);
        throw error;
    }
};

// Function to add a moderator
export const addModerator = async (user) => {
    try {
        const response = await axios.post('/auth/signup', user);
        if (response.status === 200) {
            return response.data.message;  // Assuming the API returns a message in the data
        } else if (response.status === 400) {
            throw new Error(response.data.message);  // Assuming 400 returns an error message
        } else {
            throw new Error(`Failed to add user: ${response.status}`);
        }
    } catch (error) {
        console.error('Error adding moderator:', error.response ? error.response.data : error);
        throw error;
    }
};

// Function to delete a moderator
export const deleteModerator = async (id) => {
    try {
        const response = await axios.delete(`/users/delete/${id}`);
        if (response.status === 200) {
            console.log("User with ID " + id + " deleted successfully.");
            return "Deleted successfully.";
        } else {
            throw new Error(`Failed to delete user with ID ${id}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error("Error occurred while deleting user with ID " + id + ": ", error);
        throw error;
    }
};

// Function to activate an account
export const activateAccount = async (user) => {
    try {
        const response = await axios.put('/users/update', user);
        if (response.status === 200) {
            console.log("Account activated successfully:", response.data);
            return response.data;  // Returning full response data
        } else {
            throw new Error(`Failed to activate account: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating user:', error.response ? error.response.data : error);
        throw error;
    }
};
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