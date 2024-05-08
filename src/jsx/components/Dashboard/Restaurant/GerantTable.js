import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button, Modal, Form, FormCheck } from 'react-bootstrap';
import { activateAccount, addModerator, getModerators } from '../../../../services/ModeratorService.js';

const GerantTable = () => {
    const [show, setShow] = useState(false);
    const [data, setData]= useState([]); 
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

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleSaveGerant =async() => {
        try{
            await addModerator(gerantData);
            fetchMaterials();
            setShow(false);
        }catch(e){
            console.log(e);
        }
       
    };
    useEffect(() => {
        fetchMaterials();
    }, []);
    
    const fetchMaterials = async () => {
        try {
            const response = await getModerators(); // Fetching data from the API
            const materials = response
            setData(materials); // Assuming you have a state 'setData' to hold your table data
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

    const toggleGerantActivation = (id, isActive) => {
        activateAccount(id);
        console.log(`Toggling activation for gerant ID ${id}: ${!isActive}`);
        setGerantData(prev => ({
            ...prev,
            activated: !isActive
        }));
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
                <FormCheck
                    type="switch"
                    id={`switch-${row.original.id}`}
                    checked={row.original.activated}
                    onChange={() => toggleGerantActivation(row.original.id, row.original.activated)}
                />
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

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Gerant
            </Button>

            <table {...getTableProps()} className="table table-hover">
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
            </table>

            {/* Modal for adding or editing a gerant */}
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
                        {/* For image, role, and zone, you will need to handle file upload and selection differently */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveGerant}>
                        Save Gerant
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GerantTable;
