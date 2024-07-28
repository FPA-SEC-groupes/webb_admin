import React, { useState, useEffect } from 'react';
import { Table, FormControl, Button, Row, Col } from 'react-bootstrap';
import { getAllRestrictions, deleteRestrictions } from '../../../../services/RestrictionsService';

const Restrictions = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        id: '',
        description: '',
        "Reservations Title": '',
        Username: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    const columns = {
        id: 'ID',
        description: 'Description',
        "Reservations Title": 'Reservations Title',
        Username: 'Username'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const restrictions = await getAllRestrictions();
                setData(restrictions);
            } catch (error) {
                console.error('Error fetching restrictions:', error);
            }
        };
        fetchData();
    }, []);

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

    const handleDelete = async (id) => {
        try {
            await deleteRestrictions(id);
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            console.error(`Error deleting restriction with ID ${id}:`, error);
        }
    };

    const sortedData = React.useMemo(() => {
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
        <div>
            <h1>Restrictions</h1>
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
                        {Object.keys(columns).map((key) => (
                            <option key={key} value={key}>
                                {columns[key]}
                            </option>
                        ))}
                    </FormControl>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {Object.keys(columns).map((key) => (
                            <th key={key} onClick={() => handleSort(key)}>
                                {columns[key]} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            {/* <td>{item.description}</td> */}
                            <td>{item.reservation.eventTitle}</td>
                            <td>{item.user.username}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Restrictions;
