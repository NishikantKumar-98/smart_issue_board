import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';

const CreateIssue = ({ existingIssues }) => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [similarIssues, setSimilarIssues] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detect similar issues based on keyword matching
  const checkSimilarIssues = (inputTitle) => {
    if (!inputTitle.trim()) {
      setSimilarIssues([]);
      setShowWarning(false);
      return;
    }

    const keywords = inputTitle.toLowerCase().split(' ').filter((word) => word.length > 2);
    
    const similar = existingIssues.filter((issue) => {
      const issueTitle = issue.title.toLowerCase();
      return keywords.some((keyword) => issueTitle.includes(keyword));
    });

    setSimilarIssues(similar);
    setShowWarning(similar.length > 0);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    checkSimilarIssues(newTitle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await addDoc(collection(db, 'issues'), {
        title,
        description,
        priority,
        status: 'Open',
        assignedTo,
        createdBy: currentUser.email,
        createdTime: serverTimestamp(),
        updatedTime: serverTimestamp(),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setAssignedTo('');
      setSimilarIssues([]);
      setShowWarning(false);
      setShowForm(false);
      alert('Issue created successfully!');
    } catch (error) {
      console.error('Error creating issue:', error);
      alert('Failed to create issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelCreation = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setAssignedTo('');
    setSimilarIssues([]);
    setShowWarning(false);
    setShowForm(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          + Create New Issue
        </button>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Create New Issue</h2>
          
          {/* Similar Issues Warning */}
          {showWarning && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
              <p className="font-semibold">⚠️ Similar issues found:</p>
              <ul className="list-disc ml-5 mt-2">
                {similarIssues.slice(0, 3).map((issue) => (
                  <li key={issue.id}>
                    <strong>{issue.title}</strong> - {issue.status}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm">You can still continue creating this issue.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                rows="4"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Assigned To</label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Enter email or name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {loading ? 'Creating...' : 'Create Issue'}
              </button>
              <button
                type="button"
                onClick={cancelCreation}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateIssue;
