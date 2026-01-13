import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const IssueList = ({ issues }) => {
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    Open: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    Done: 'bg-gray-100 text-gray-800',
  };

  const validateStatusTransition = (currentStatus, targetStatus) => {
    if (currentStatus === 'Open' && targetStatus === 'Done') {
      return false;
    }
    return true;
  };

  const handleStatusChange = async (issueId, currentStatus) => {
    if (!validateStatusTransition(currentStatus, newStatus)) {
      setError('Cannot move directly from Open to Done. Please set to In Progress first.');
      setTimeout(() => setError(''), 5000);
      setEditingId(null);
      return;
    }

    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        status: newStatus,
        updatedTime: serverTimestamp(),
      });
      setEditingId(null);
      setError('');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (issues.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
        No issues found. Create your first issue to get started!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-bold p-4 bg-gray-100">All Issues</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned To</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created By</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{issue.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {issue.description}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[issue.priority]}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {editingId === issue.id ? (
                    <div className="flex gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      <button
                        onClick={() => handleStatusChange(issue.id, issue.status)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingId(issue.id);
                        setNewStatus(issue.status);
                      }}
                      className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${statusColors[issue.status]}`}
                    >
                      {issue.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{issue.assignedTo || 'Unassigned'}</td>
                <td className="px-4 py-3 text-sm">{issue.createdBy}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(issue.createdTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueList;
