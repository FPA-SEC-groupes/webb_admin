// Restrictions.js
import React, { useState, useEffect } from 'react';
import { Table, FormControl } from 'react-bootstrap';

const Restrictions = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        id: '',
        description: '',
        reservations_id: '',
        user_id: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    useEffect(() => {
        // Generate fake data
        const fakeData = [];
        for (let i = 1; i <= 10; i++) {
            fakeData.push({
                id: i,
                description: `Description ${i}`,
                reservations_id: Math.floor(Math.random() * 1000),
                user_id: Math.floor(Math.random() * 1000)
            });
        }
        setData(fakeData);
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
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.description}</td>
                            <td>{item.reservations_id}</td>
                            <td>{item.user_id}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Restrictions;
