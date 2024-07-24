import axios from './axiosService';

// Function to get all restrictions
export const getAllRestrictions = async () => {
    try {
        const response = await axios.get('/restrictions');
        if (response.status === 200) {
            console.log("Fetched all restrictions successfully:", response.data);
            return response.data;  // Assuming the backend sends the array directly
        } else {
            throw new Error(`Failed to load restrictions: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching restrictions:', error.response ? error.response.data : error);
        throw error;
    }
};

// Function to get restrictions by ID
export const getRestrictionsById = async (id) => {
    try {
        const response = await axios.get(`/restrictions/${id}`);
        if (response.status === 200) {
            console.log(`Fetched restrictions with ID ${id} successfully:`, response.data);
            return response.data;  // Assuming the backend sends the data directly
        } else {
            throw new Error(`Failed to load restrictions with ID ${id}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching restrictions with ID ${id}:`, error.response ? error.response.data : error);
        throw error;
    }
};

// Function to create restrictions
export const createRestrictions = async (restrictions) => {
    try {
        const response = await axios.post('/restrictions', restrictions);
        if (response.status === 201) {
            console.log("Created restrictions successfully:", response.data);
            return response.data;  // Returning the created restrictions
        } else {
            throw new Error(`Failed to create restrictions: ${response.status}`);
        }
    } catch (error) {
        console.error('Error creating restrictions:', error.response ? error.response.data : error);
        throw error;
    }
};

// Function to update restrictions
export const updateRestrictions = async (id, restrictionsDTO) => {
    try {
        const response = await axios.put(`/restrictions/${id}`, restrictionsDTO);
        if (response.status === 200) {
            console.log(`Updated restrictions with ID ${id} successfully:`, response.data);
            return response.data;  // Returning the updated restrictions
        } else {
            throw new Error(`Failed to update restrictions with ID ${id}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error updating restrictions with ID ${id}:`, error.response ? error.response.data : error);
        throw error;
    }
};

// Function to delete restrictions
export const deleteRestrictions = async (id) => {
    try {
        const response = await axios.delete(`/restrictions/${id}`);
        if (response.status === 204) {
            console.log(`Deleted restrictions with ID ${id} successfully.`);
            return "Deleted successfully.";
        } else {
            throw new Error(`Failed to delete restrictions with ID ${id}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error occurred while deleting restrictions with ID ${id}:`, error);
        throw error;
    }
};

// Function to get number of restrictions by user ID
export const getNumberOfRestrictionsByUserId = async (userId) => {
    try {
        const response = await axios.get(`/restrictions/user/${userId}`);
        if (response.status === 200) {
            console.log(`Fetched number of restrictions for user ID ${userId} successfully:`, response.data);
            return response.data;  // Assuming the backend sends the number directly
        } else {
            throw new Error(`Failed to load number of restrictions for user ID ${userId}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching number of restrictions for user ID ${userId}:`, error.response ? error.response.data : error);
        throw error;
    }
};

// Function to find restrictions by reservation ID
export const findByReservationId = async (reservationId) => {
    try {
        const response = await axios.get(`/restrictions/restrictions/${reservationId}`);
        if (response.status === 200) {
            console.log(`Fetched restrictions for reservation ID ${reservationId} successfully:`, response.data);
            return response.data;  // Assuming the backend sends the restrictions directly
        } else {
            throw new Error(`Failed to load restrictions for reservation ID ${reservationId}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching restrictions for reservation ID ${reservationId}:`, error.response ? error.response.data : error);
        throw error;
    }
};
