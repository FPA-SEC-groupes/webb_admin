// Restrictions.js
import React, { useState, useEffect } from 'react';
import { Table, FormControl, Button } from 'react-bootstrap';
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
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
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
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            return item[key].toString().toLowerCase().includes(filters[key].toLowerCase());
        });
    });

    return (
        <div>
            <h1>Restrictions</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {Object.keys(filters).map((key) => (
                            <th key={key}>
                                <FormControl
                                    type="text"
                                    placeholder={`Filter by ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                    name={key}
                                    value={filters[key]}
                                    onChange={handleFilterChange}
                                />
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {Object.keys(filters).map((key) => (
                            <th key={key} onClick={() => handleSort(key)}>
                                {key.charAt(0).toUpperCase() + key.slice(1)} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.description}</td>
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
