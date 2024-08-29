import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button, Modal, Form, FormCheck, FormControl, Row, Col, Table } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

// Placeholder function to mimic fetching data from a service
const fetchData = async () => {
    return [
        { id: 1, nom: 'John', prenom: 'Doe', phone: '1234567890', email: 'john.doe@example.com', sujet: 'Reservation', nomRestaurant: 'Le Gourmet', emplacement: 'Paris', description: 'Birthday celebration', date: '2024-09-01' },
        { id: 2, nom: 'Jane', prenom: 'Smith', phone: '0987654321', email: 'jane.smith@example.com', sujet: 'Booking', nomRestaurant: 'Chez Pierre', emplacement: 'Lyon', description: 'Business meeting', date: '2024-09-10' },
        // Add more fake data as needed
    ];
};

const RestaurantTable = () => {
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [entryData, setEntryData] = useState({
        nom: '',
        prenom: '',
        phone: '',
        email: '',
        sujet: '',
        nomRestaurant: '',
        emplacement: '',
        description: '',
        date: '',
    });
    const [filterValue, setFilterValue] = useState('');
    const [filterColumn, setFilterColumn] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleSaveEntry = async () => {
        // Simulate saving entry to the service
        try {
            // Add entryData to data list (mocking the save functionality)
            setData(prevData => [...prevData, { id: prevData.length + 1, ...entryData }]);
            setShow(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const fetchedData = await fetchData();
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEntryData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = (user) => {
        setEntryData(user);
        setShow(true);
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
        { Header: 'Nom', accessor: 'nom' },
        { Header: 'Prénom', accessor: 'prenom' },
        { Header: 'Numéro de Téléphone', accessor: 'phone' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Sujet', accessor: 'sujet' },
        { Header: 'Nom du Restaurant', accessor: 'nomRestaurant' },
        { Header: 'Emplacement', accessor: 'emplacement' },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Date', accessor: 'date' },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => (
                <Button variant="outline-primary" onClick={() => handleUpdate(row.original)}>
                    <FaEdit />
                </Button>
            ),
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
{/*
            <Button variant="primary" onClick={handleShow}>
                Add Entry
            </Button>
*/}
            <Table striped bordered hover {...getTableProps()}>
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
                    <Modal.Title>Add/Edit Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control type="text" placeholder="Enter Nom" name="nom" value={entryData.nom} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control type="text" placeholder="Enter Prénom" name="prenom" value={entryData.prenom} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Numéro de Téléphone</Form.Label>
                            <Form.Control type="text" placeholder="Enter Phone" name="phone" value={entryData.phone} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" name="email" value={entryData.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sujet</Form.Label>
                            <Form.Control type="text" placeholder="Enter Sujet" name="sujet" value={entryData.sujet} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom du Restaurant</Form.Label>
                            <Form.Control type="text" placeholder="Enter Nom du Restaurant" name="nomRestaurant" value={entryData.nomRestaurant} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Emplacement</Form.Label>
                            <Form.Control type="text" placeholder="Enter Emplacement" name="emplacement" value={entryData.emplacement} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter Description" name="description" value={entryData.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={entryData.date} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveEntry}>
                        {entryData.id ? 'Update Entry' : 'Save Entry'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RestaurantTable;
