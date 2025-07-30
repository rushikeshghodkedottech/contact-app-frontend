import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/contacts'

  console.log('BASE_URL:', BASE_URL)

  const [contacts, setContacts] = useState([])
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(BASE_URL)
      // Ensure we're setting an array
      setContacts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setError('Failed to fetch contacts')
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${BASE_URL}`, formData)
      setFormData({ name: '', phone: '' })
      fetchContacts()
    } catch (error) {
      console.error('Error adding contact:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`)
      fetchContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  return (
    <div className="app">
      <h1>Contact Manager</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <button type="submit">Add Contact</button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Loading contacts...</td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan="3">No contacts found</td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
