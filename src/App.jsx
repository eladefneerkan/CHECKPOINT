import { Routes, Route, Link } from 'react-router-dom'
import List from '../Frontend/List.jsx'
import Profile from '../Frontend/Profile.jsx'

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/list">List</Link> | 
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome Home</h1>} />
        <Route path="/list" element={<List />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}
