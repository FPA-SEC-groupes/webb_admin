import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
axios.defaults.withCredentials = true;

const CategoryPage = ({ categories }) => {
    const { id_category } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState('');
    const baseUrl = "http://localhost:8082";

    useEffect(() => {
        fetchCategoryTitle();
        fetchProducts();
    }, [id_category]);

    const fetchCategoryTitle = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/categories/${id_category}`);
            setCategoryTitle(response.data.categoryTitle);
        } catch (error) {
            console.error('Failed to fetch category title:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/products/all/id_categorie/${encodeURIComponent(id_category)}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleShowModal = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setTitle(product.productTitle);
            setPrice(product.price);
            setDescription(product.description);
            setImage(null);  // Reset image state (optionally handle existing images)
        } else {
            setCurrentProduct(null);
            setTitle('');
            setPrice('');
            setDescription('');
            setImage(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const productData = {
                productTitle: title,
                price: parseFloat(price),
                description: description,
                available: true,
            };
            let response;
            if (currentProduct) {
                response = await axios.put(`${baseUrl}/api/products/update/${currentProduct.id}`, productData);
            } else {
                response = await axios.post(`${baseUrl}/api/products/add/id_categorie/${encodeURIComponent(id_category)}`, productData);
            }
            if (image) {
                await uploadImage(image, response.data.idProduct || currentProduct.id);
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to submit product:', error);
        }
        setLoading(false);
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
        if (response.status !== 200) {
            throw new Error('Failed to add image.');
        }
    };

    return (
        <div>
            <h1>{categoryTitle}</h1>
            <Button variant="primary" onClick={() => handleShowModal()}>
                Add Product
            </Button>
            <div className="row">
                {products.map((product) => (
                    <div className="col-xl-3 col-xxl-4 col-sm-6" key={product.id}>
                        <div className="card dishe-bx b-hover style-1">
                            <Dropdown className="dropdown ms-auto">
                                <Dropdown.Toggle as="div" className="btn-link i-false">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item onClick={() => handleShowModal(product)}>Edit</Dropdown.Item>
                                    <Dropdown.Item>Delete</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div className="card-body pb-0 pt-3">
                                <div className="text-center mb-2">
                                    <img src={product.images && product.images.length > 0 ? `data:${product.images[0].fileType};base64,${product.images[0].data}` : 'default-image.jpg'} alt={product.title} style={{ width: '100px', height: '100px' }} />
                                </div>
                                <div className="border-bottom pb-3">
                                    <h4 className="font-w500 mb-1">{product.productTitle}</h4>
                                    <p className="font-w500 mb-0 px-2">{product.description}</p>
                                </div>
                                <div className="card-footer border-0 pt-2">
                                    <h3 className="mb-0 text-primary">${product.price.toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentProduct ? 'Edit Product' : 'Add a New Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formProductTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductDescription">
                            <Form.Label>Description</Form.Label>
                                                        <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Processing...' : currentProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CategoryPage;

