import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button, Modal, Form, FormCheck } from 'react-bootstrap';

const UserTable = () => {
    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState({
        id: null,
        username: '',
        name: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        image: null,
        activated: false,
        role: [],
        zone: null
    });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleSaveUser = () => {
        console.log('Saving user:', userData);
        setShow(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleUserActivation = (id, isActive) => {
        console.log(`Toggling activation for user ID ${id}: ${!isActive}`);
        // Here you would typically handle the backend update
        // Mock update for demonstration
        // Update the activation state locally for demonstration
        setUserData(prev => ({
            ...prev,
            activated: !isActive
        }));
    };

    // Sample data
    const data = useMemo(() => [
        { id: 1, username: 'john_doe', name: 'John', lastname: 'Doe', email: 'johndoe@example.com', phone: '123-456-7890', activated: true },
        { id: 2, username: 'jane_smith', name: 'Jane', lastname: 'Smith', email: 'janesmith@example.com', phone: '234-567-8901', activated: false }
    ], []);

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
                    onChange={() => toggleUserActivation(row.original.id, row.original.activated)}
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
                Add User
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

            {/* Modal for adding or editing a user */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" name="username" value={userData.username} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" name="name" value={userData.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name" name="lastname" value={userData.lastname} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" value={userData.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" placeholder="Enter phone number" name="phone" value={userData.phone} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Activated</Form.Label>
                            <Form.Check type="checkbox" label="Is Active" name="activated" checked={userData.activated} onChange={handleChange} />
                        </Form.Group>
                        {/* For image, role, and zone, you will need to handle file upload and selection differently */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveUser}>
                        Save User
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserTable;
