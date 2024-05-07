import React, { useEffect, useReducer, useState } from 'react';
import { Link } from "react-router-dom";
import {Modal} from 'react-bootstrap';
//import { actions } from 'react-table';

import ZoneSlider from './ZoneSlider';
import axios from 'axios';
axios.defaults.withCredentials = true;

//const init =  false;
function reducer(state, action) {   
    switch (action.type) {
       
        case "addCategory":
            return { ...state, addCategory: !state.addCategory };
        default:
            return state;
    }
}

const Zone = ({ zonees }) => {
    const [state, dispatch] = useReducer(reducer, { addMenu: false, addCategory: false });
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [zone, setZone]= useState();
    const [zoneTitle, setZoneTitle]=useState();
    const spaceId = localStorage.getItem('id_space');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const baseUrl = "http://localhost:8082"
    const [zones, setZones] = useState([]);

    useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await getZonesByIdSpace();
        setZones(response);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchZones();
  }, []);
    const addZoneByIdSpace = async()=>{
        try {
          const url = `${baseUrl}/api/zones/add/id_space/${spaceId}`;
          const response = await axios.post(url, {zoneTitle});
    
          // Handle the response from the API
          if (response.status === 200) {
            getZonesByIdSpace();
            dispatch({ type: 'addCategory' });
            console.log('Zone added successfully!');
          } else {
            // Zone addition failed, display an error message to the user
            console.error(`Failed to add zone. Error code: ${response.status}`);
            throw new Error("Failed to add zone.");
          }
        } catch (error) {
          console.error('Failed to add zone:', error);
          throw new Error("Failed to add zone.");
        }
      }
    
      // Function to get zones by ID space
      const getZonesByIdSpace = async () => {
        try {
          const url = `${baseUrl}/api/zones/all/id_space/${spaceId}`;
      
          // Send the request using Axios
          const response = await axios.get(url);
      
          // Handle the response from the API
          if (response.status === 200) {
            // Assuming response.data is an array of zones
            return response.data.map((zoneData) => {
              return {
                id: zoneData.idZone,
                title: zoneData.zoneTitle,
                boards: zoneData.boards.map((boardData) => {
                  return {
                    id: boardData.idTable,
                    numTable: boardData.numTable,
                    availability: boardData.availability,
                    placeNumber: boardData.placeNumber
                  };
                })
              };
            });
          } else {
            throw new Error(`Failed to load zones: ${response.status}`);
          }
        } catch (error) {
          console.error('Failed to load zones:', error);
          throw new Error('Failed to load zones.');
          setError(error.message);
        }
        setLoading(false);
      };
      
    
    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    };
    return(
        <>
        {loading && <h4 className="mb-0 cate-title">Loading...</h4>}
        {error && <p className="error-text">{error}</p>} 

            <div className="row">
                <div className="col-xl-12">
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                        <div className="input-group search-area2">
                            <span className="input-group-text p-0">
                                <Link to={"#"}><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.414 24.586L22.337 19.509C23.386 17.928 24 16.035 24 14C24 8.486 19.514 4 14 4C8.486 4 4 8.486 4 14C4 19.514 8.486 24 14 24C16.035 24 17.928 23.386 19.509 22.337L24.586 27.414C25.366 28.195 26.634 28.195 27.414 27.414C28.195 26.633 28.195 25.367 27.414 24.586ZM7 14C7 10.14 10.14 7 14 7C17.86 7 21 10.14 21 14C21 17.86 17.86 21 14 21C10.14 21 7 17.86 7 14Z" fill="#FC8019"/>
                                    </svg>
                                </Link>
                            </span>
                            <input type="text" className="form-control p-0" placeholder="Search here" />
                        </div>
                        <button type="button" className="btn btn-primary mt-3 mt-sm-0" onClick={() => dispatch({ type: 'addCategory' })}>Add Zone</button>   
                                                         
                    </div>
                    
                </div>
                <div className="col-xl-12">
                    <div className="d-flex align-items-center justify-content-between mb-2 mt-sm-0 mt-3">
                        <h4 className=" mb-0 cate-title">Zone</h4>
                        <Link to={"/favorite-menu"} className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link>
                    </div>
                    <ZoneSlider zones={zones} />
                </div>    
               
            </div>
            
         
            <Modal className="modal fade" show={state.addCategory} onHide={() => dispatch({ type: 'addCategory' })}>
                <div className="modal-header">
                    <h5 className="modal-title">Add Zone</h5>
                    <button type="button" className="btn-close" ></button>
                </div>
                <div className="modal-body">
                    <form>
                    {/* <div className="modal-inside">
                            <label htmlFor="menuImage" className="form-label mb-2">Menu Image</label>
                            <input type="file" className="form-control" id="menuImage" accept="image/*" onChange={handleImageChange} />
                            {imagePreviewUrl && <img src={imagePreviewUrl} alt="Menu Preview" style={{ marginTop: '20px', maxWidth: '100%' }} />}
                        </div> */}
                    <div className="modal-inside">
                            <label for="exampleInputText" className="form-label">Add Zone</label>
                            <input type="text" className="form-control" id="exampleInputText" value={zoneTitle} onChange={(e) => setZoneTitle(e.target.value)} placeholder="" />                                    
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: 'addCategory' })}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={addZoneByIdSpace}>Save changes</button>
                </div>
            </Modal>    
        </>
    )
}
export default Zone; 