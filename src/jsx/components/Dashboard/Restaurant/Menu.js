
import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import MenuCategorySlider from './MenuCategorySlider';
import MenuPopularSlider from './MenuPopularSlider';
import BestSellerSlider from './BestSellerSlider';
import PromoSlider from './PromoSlider';
import axios from 'axios';


axios.defaults.withCredentials = true;
class Category {
    constructor(id_category, categoryTitle) {
        this.id_category = id_category;
        this.categoryTitle = categoryTitle;
    }

    static fromJson(json) {
        return new Category(json.id_category, json.categoryTitle);
    }
}

function reducer(state, action) {
    switch (action.type) {
        case "addMenu":
            return { ...state, addMenu: !state.addMenu };
        case "addCategory":
            return { ...state, addCategory: !state.addCategory };
        default:
            return state;
    }
}

const Menu = () => {
    const id = localStorage.getItem('userId');
    const [id_space ,setIdSpace] = useState();
    const [state, dispatch] = useReducer(reducer, { addMenu: false, addCategory: false });
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [categoryTitle, setCategorieTitle]=useState();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const baseUrl = "http://localhost:8082"
    const [categoryId, setCategoryId]= useState();
    const addMenu = async () => {
      try {
        // Prepare the product data
        const productData = {
          productTitle: title,
          price: parseFloat(price),
          description: description,
          available: true, // Assuming the menu item is always available
          // You can add more fields here if needed
        };
  
        // Add the product by category
        const response = await addProductByIdCategory(1, productData);
        
        // Upload the image if available
        if (image) {
            console.log(response.idProduct);
          await uploadImage(image, response.idProduct);
        }
  
        // Reset the form and close the modal
        setTitle('');
        setPrice('');
        setDescription('');
        setImage(null);
        setImagePreviewUrl(null);
        dispatch({ type: 'addMenu' }); // Close the modal
      } catch (error) {
        console.error('Error adding menu:', error);
      }
    };
  
    const addProductByIdCategory = async (categoryId, product) => {
      const url = `${baseUrl}/api/products/add/id_categorie/${categoryId}`;
      const response = await axios.post(url, product);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error('Failed to add product. Error code:', response.status);
        throw new Error('Failed to add product.');
      }
    };
  
    const uploadImage = async (image, id) => {
      const url = `${baseUrl}/api/products/${id}/images`;
      const formData = new FormData();
      formData.append('file', image);
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        console.log('Image added successfully!');
      } else {
        console.error('Failed to add image. Error code:', response.status);
        throw new Error('Failed to add image.');
      }
    };
    const addCategory = async()=>{
        try {
            const response = await axios.post(`http://localhost:8082/api/categories/add/id_space/${id_space}`,{categoryTitle});
            if (response.status === 200) {
                getCategories()
            } else {
                console.log(response);
                throw new Error(`Failed to load categories: ${response.status}`);
            }
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    }
    const getCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8082/api/spaces/idModerator/${id}`);
            if (response.status === 200) {
                const idSpace= response.data.id_space;
                const categoriesData = response.data.categories;
                localStorage.setItem('id_space',idSpace); 
                setCategories(categoriesData);
                setIdSpace(idSpace);
                console.log(categoriesData);
            } else {
                throw new Error(`Failed to load categories: ${response.status}`);
            }
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        getCategories();
    }, [id]); // Include dependencies that trigger re-execution of this effect

    const handleImageChange = (e) => {
        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          setImage(file);
          setImagePreviewUrl(reader.result);
        };
    
        reader.readAsDataURL(file);
      };
    return (
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
                    <button type="button" className="btn btn-secondary mt-3 mt-sm-0" onClick={() => dispatch({ type: 'addCategory' })}>Add Category</button>   
                    <button type="button" className="btn btn-primary mt-3 mt-sm-0" onClick={() => dispatch({type:'addMenu'})}>Add New Menu</button>                                  
                </div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 className="mb-0 cate-title">Category </h4>
                    <Link to={"/favorite-menu"} className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link>
                </div>
                
                <MenuCategorySlider categories={categories} />
            </div>
            <div className="col-xl-12">
                <div className="d-flex align-items-center justify-content-between mb-2 mt-sm-0 mt-3">
                    <h4 className=" mb-0 cate-title">Popular This Week</h4>
                    <Link to={"/favorite-menu"} className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link>
                </div>
                <MenuPopularSlider /> 
            </div>    
            <div className="col-xl-12">
                <div className="d-flex align-items-center justify-content-between mb-2 mt-sm-0 mt-3">
                    <h4 className=" mb-0 cate-title">Best Seller</h4>
                    <Link to={"/favorite-menu"} className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link>
                </div>
                <Link to={"/favorite-menu"} className="text-primary">
                <BestSellerSlider />
                </Link>
            </div>
            <div className="col-xl-12">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 className=" mb-0 cate-title">Promo</h4>
                    <Link to={"/favorite-menu"} className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link>
                </div>
                <PromoSlider />
            </div>
        </div>
        
        <Modal className="modal fade" show={state.addMenu} onHide={() => dispatch({ type: 'addMenu' })}>
        <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Add Menu</h5>
            <button type="button" className="btn-close" onClick={() => dispatch({ type: 'addMenu' })}></button>
        </div>
        <div className="modal-body">
            <form>
            <div className="modal-inside">
                <label htmlFor="exampleInputText" className="form-label">Title</label>
                <input type="text" className="form-control" id="exampleInputText" placeholder="" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="row">
                <div className="col-xl-4">
                <div className="modal-inside">
                    <label htmlFor="exampleInputnumber" className="form-label mb-2">Item Pricing</label>
                    <input type="number" className="form-control" id="exampleInputnumber" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                </div>
            </div>
            <div className="modal-inside">
                <label htmlFor="menuDescription" className="form-label mb-2">Description</label>
                <textarea className="form-control" id="menuDescription" rows="6" cols="33" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="modal-inside">
                <label htmlFor="menuImage" className="form-label mb-2">Menu Image</label>
                <input type="file" className="form-control" id="menuImage" accept="image/*" onChange={handleImageChange} />
                {imagePreviewUrl && <img src={imagePreviewUrl} alt="Menu Preview" style={{ marginTop: '20px', maxWidth: '100%' }} />}
            </div>
            </form>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: 'addMenu' })}>Close</button>
            <button type="button" className="btn btn-primary" onClick={addMenu}>Save changes</button>
        </div>
        </Modal> 
        <Modal className="modal fade" show={state.addCategory} onHide={() => dispatch({ type: 'addCategory' })}>
            <div className="modal-header">
                <h5 className="modal-title">Add Category</h5>
                <button type="button" className="btn-close" onClick={() => dispatch({ type: 'addCategory' })}></button>
            </div>
            <div className="modal-body">
                <form>
                <div className="modal-inside">
                        <label for="exampleInputText" className="form-label">Add Category</label>
                        <input type="text" className="form-control" id="exampleInputText" value={categoryTitle} onChange={(e) => setCategorieTitle(e.target.value)} placeholder="" />                                    
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: 'addCategory' })}>Close</button>
                <button type="button" className="btn btn-primary" onClick={addCategory}>Save changes</button>
            </div>
        </Modal>     
        </>
    )
}
export default Menu; 