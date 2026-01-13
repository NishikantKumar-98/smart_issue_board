import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Navbar from '../components/Navbar';
import CreateIssue from '../components/CreateIssue';
import IssueList from '../components/IssueList';

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch issues from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('createdTime', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIssues(issuesData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Apply filters whenever issues or filters change
  useEffect(() => {
    let filtered = issues;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, statusFilter, priorityFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Issue Dashboard</h1>
        
        {/* Create Issue Component */}
        <CreateIssue existingIssues={issues} />

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="All">All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issue List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading issues...</p>
        ) : (
          <IssueList issues={filteredIssues} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
