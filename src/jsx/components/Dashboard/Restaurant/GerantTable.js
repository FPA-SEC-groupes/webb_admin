import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button, Modal, Form, FormCheck, FormControl, Row, Col, Table } from 'react-bootstrap';
import { activateAccount, addModerator, getModerators, updateUser } from '../../../../services/ModeratorService.js';
import { FaEdit, FaTrash } from 'react-icons/fa';
const GerantTable = () => {
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [gerantData, setGerantData] = useState({
        username: '',
        name: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        activated: false,
        role: ["provider"],
    });
    const [filterValue, setFilterValue] = useState('');
    const [filterColumn, setFilterColumn] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleSaveGerant = async () => {
        try {
            await addModerator(gerantData);
            fetchMaterials();
            setShow(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await getModerators();
            const materials = response;
            setData(materials);
        } catch (error) {
            console.error('Error fetching materials:', error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGerantData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleGerantActivation = async (id, isActive) => {
        try {
            await activateAccount(id);
            console.log(`Toggling activation for gerant ID ${id}: ${!isActive}`);
            setData(prevData => prevData.map(item => 
                item.id === id ? { ...item, activated: !isActive } : item
            ));
        } catch (error) {
            console.error('Error toggling activation:', error.message);
        }
    };

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    };

    const handleColumnChange = (event) => {
        setFilterColumn(event.target.value);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const columns = useMemo(() => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Username', accessor: 'username' },
        { Header: 'First Name', accessor: 'name' },
        { Header: 'Last Name', accessor: 'lastname' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Phone', accessor: 'phone' },
        {
            Header: 'Activated',
            accessor: 'activated',
            Cell: ({ row }) => (
                <div style={{ textAlign: 'left' }}>
                    
                                    {/* <FaEdit /> */}
                                    <FormCheck
                                        type="switch"
                                        id={`switch-${row.original.id}`}
                                        checked={row.original.activated}
                                        onChange={() => toggleGerantActivation(row.original.id, row.original.activated)}
                                    />
                                <Button variant="outline-primary" onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleUpdate(row.original);  // Pass the entire row data to handleUpdate
                                    }}>
                        <FaEdit />
                    </Button>
                </div>
            )
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable({ columns, data }, useSortBy, usePagination);

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);
    const handleUpdate = (user) => {
        // Log to see what is being passed
        console.log("Attempting to update user with:", user);
    
        // Create a new object that only contains the properties you need
        const userDataToUpdate = {
            id: user.id,
            username: user.username,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            activated: user.activated,
            role: user.role
        };
    
        // Now pass only this userDataToUpdate to avoid circular JSON issues
        updateUser(userDataToUpdate)
            .then(response => {
                console.log("Update successful:", response);
                fetchMaterials(); // Reload data
                setShow(false);
            })
            .catch(error => {
                console.error("Failed to update user:", error);
            });
    };
    const filteredData = sortedData.filter(item => {
        if (!filterColumn || !filterValue) return true;
        return item[filterColumn]?.toString().toLowerCase().includes(filterValue.toLowerCase());
    });

    return (
        <>
            <Row className="mb-3">
                <Col>
                    <FormControl
                        type="text"
                        placeholder="Filter value"
                        value={filterValue}
                        onChange={handleFilterChange}
                    />
                </Col>
                <Col>
                    <FormControl
                        as="select"
                        value={filterColumn}
                        onChange={handleColumnChange}
                    >
                        <option value="">Select column to filter</option>
                        {columns.map(column => (
                            <option key={column.accessor} value={column.accessor}>
                                {column.Header}
                            </option>
                        ))}
                    </FormControl>
                </Col>
            </Row>

            <Button variant="primary" onClick={handleShow}>
                Add Gerant
            </Button>

            <Table striped bordered hover>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/Edit Gerant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" name="username" value={gerantData.username} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" name="name" value={gerantData.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name" name="lastname" value={gerantData.lastname} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" value={gerantData.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" placeholder="Enter phone number" name="phone" value={gerantData.phone} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Activated</Form.Label>
                            <Form.Check type="checkbox" label="Is Active" name="activated" checked={gerantData.activated} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={gerantData.id ? handleUpdate  : handleSaveGerant}>{gerantData.id ? 'Update  Gerant' : 'Save Gerant'}</Button>
                    {/* <Button variant="primary" onClick={handleSaveGerant}>
                        Save Gerant
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GerantTable;
