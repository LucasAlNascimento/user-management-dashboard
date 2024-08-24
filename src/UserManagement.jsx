import { useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isUsersFetched, setIsUsersFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);


  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
      setError(null);
      setIsUsersFetched(true);
    } catch (error) {
      setError(`Failed to fetch users: ${error.message}`);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const keyEnter = (event) => {
    if (event.key === 'Enter') {
      fetchUsers();
    }
  }

  return (
    <main className='flex w-100 h-screen justify-center'>
      <div className="flex flex-col w-full h-auto items-center p-10 gap-16">
        <h1 className="text-2xl">User Management Dashboard</h1>
        <div className="flex gap-5 items-center">
          <input
            className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={keyEnter}
          />
          <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={fetchUsers}>Fetch Users</button>
        </div>

        {error && <p className="">{error}</p>}

        {isUsersFetched && filteredUsers.length === 0 && searchTerm !== '' && (
          <p className="text-red-500">No names found</p>
        )}

        {isUsersFetched && searchTerm !== '' && filteredUsers.length > 0 && (
          <>
            <table className="min-w-full mx-auto divide-y">
              <thead>
                <tr className='mx-5 divide-x'>
                  <th className="px-6 py-3 hover:cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                  <th className="px-6 py-3 hover:cursor-pointer" onClick={() => handleSort('username')}>Username</th>
                  <th className="px-6 py-3 hover:cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                  <th className="px-6 py-3 hover:cursor-pointer" onClick={() => handleSort('phone')}>Phone</th>
                  <th className="px-6 py-3 hover:cursor-pointer" onClick={() => handleSort('address.city')}>City</th>
                  <th className="px-6 py-3 hover:cursor-pointer" onClick={() => handleSort('company.name')}>Company</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-center">{user.name}</td>
                    <td className="px-6 py-4 text-center">{user.username}</td>
                    <td className="px-6 py-4 text-center">{user.email}</td>
                    <td className="px-6 py-4 text-center">{user.phone}</td>
                    <td className="px-6 py-4 text-center">{user.address.city}</td>
                    <td className="px-6 py-4 text-center">{user.company.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center gap-4">
              {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(number => (
                <button className="w-8 px-2 py-1 bg-black text-white rounded-md" key={number + 1} onClick={() => paginate(number + 1)}>
                  {number + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
