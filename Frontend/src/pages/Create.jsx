import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { mentors } from '../data/mentors';
import { groupAPI, taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const mockStudents = [
  { id: 's1', name: 'Alice Smith', role: 'student' },
  { id: 's2', name: 'Bob Johnson', role: 'student' },
  { id: 's3', name: 'Charlie Davis', role: 'student' }
];

const Create = () => {
  const { user } = useAuth();
  // Task State
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    domain: 'Artificial Intelligence',
    dueDate: '',
    groupId: ''
  });
  const [taskSuccess, setTaskSuccess] = useState(false);

  // Group State
  const [groupForm, setGroupForm] = useState({
    name: '',
    domain: 'Artificial Intelligence',
    members: []
  });
  const [groupSuccess, setGroupSuccess] = useState(false);
  const [myGroups, setMyGroups] = useState([]);

  const domains = [
    'Artificial Intelligence',
    'Web Development',
    'Data Science',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'UI/UX',
    'Blockchain'
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await groupAPI.getMyGroups();
        setMyGroups(res.data?.data?.groups || []);
      } catch (e) {
        setMyGroups([]);
      }
    })();
  }, [groupSuccess]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        groupId: taskForm.groupId,
        title: taskForm.title,
        description: taskForm.description,
        domain: taskForm.domain,
        dueDate: taskForm.dueDate
      };
      await taskAPI.createTask(payload);
      setTaskSuccess(true);
      setTimeout(() => setTaskSuccess(false), 3000);
      setTaskForm({ title: '', description: '', domain: 'Artificial Intelligence', dueDate: '', groupId: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        groupName: groupForm.name,
        description: `A study group for ${groupForm.domain}`,
        interest: groupForm.domain,
      };
      
      const res = await groupAPI.createGroup(payload);
      
      setGroupSuccess(true);
      setTimeout(() => setGroupSuccess(false), 3000);
      setGroupForm({ name: '', domain: 'Artificial Intelligence', members: [] });
      
      // Note: Backend requires students to be added via separate endpoint or join
      // so the members selected locally would need further API calls, but we'll focus
      // on group creation success here.
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create group');
    }
  };

  const toggleGroupMember = (memberId) => {
    setGroupForm(prev => {
      if (prev.members.includes(memberId)) {
        return { ...prev, members: prev.members.filter(id => id !== memberId) };
      } else {
        return { ...prev, members: [...prev.members, memberId] };
      }
    });
  };

  const displayMentors = [
    ...(user?.role === 'mentor'
      ? [{ id: 'you', name: `${user?.name || 'You'} (You)`, title: 'Mentor', isYou: true }]
      : []),
    ...mentors.slice(0, 5),
  ];

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="glass-card border-x-0 border-t-0 rounded-none border-b-white/10 mb-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Create & Manage</h1>
          <p className="text-white/70 mt-1">Create new learning tasks or collaborative groups.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Create Task Section */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Create Task</h2>
            {taskSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg">
                Task created successfully!
              </div>
            )}
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <InputField
                label="Task Title"
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="E.g., Complete React Tutorial"
                required
              />

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task details and expectations..."
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Domain</label>
                <select
                  value={taskForm.domain}
                  onChange={(e) => setTaskForm({ ...taskForm, domain: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  required
                >
                  {domains.map(d => (
                    <option key={d} value={d} className="bg-slate-800 text-white">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Select Group</label>
                <select
                  value={taskForm.groupId}
                  onChange={(e) => setTaskForm({ ...taskForm, groupId: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  required
                >
                  <option value="" disabled className="bg-slate-800 text-white/50">Choose a group</option>
                  {myGroups.map(g => (
                    <option key={g._id} value={g._id} className="bg-slate-800 text-white">
                      {g.groupName} ({g.interest})
                    </option>
                  ))}
                </select>
                {myGroups.length === 0 && (
                  <p className="text-xs text-white/50 mt-2">
                    Create a group first to assign tasks.
                  </p>
                )}
              </div>

              <InputField
                label="Due Date"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                required
              />

              <Button type="submit" className="w-full mt-4">Create Task</Button>
            </form>
          </div>

          {/* Create Group Section */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Create Group</h2>
            {groupSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg">
                Group created successfully!
              </div>
            )}
            <form onSubmit={handleGroupSubmit} className="space-y-4">
              <InputField
                label="Group Name"
                type="text"
                value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                placeholder="E.g., Web Dev Mastery"
                required
              />

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Domain</label>
                <select
                  value={groupForm.domain}
                  onChange={(e) => setGroupForm({ ...groupForm, domain: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  required
                >
                  {domains.map(d => (
                    <option key={d} value={d} className="bg-slate-800 text-white">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Add Members</label>
                <div className="glass-input p-4 rounded-xl max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                  <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Mentors</p>
                  {displayMentors.map(m => (
                    <label key={m.isYou ? 'm-you' : `m-${m.id}`} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={m.isYou ? true : groupForm.members.includes(`m-${m.id}`)}
                        disabled={m.isYou}
                        onChange={() => toggleGroupMember(`m-${m.id}`)}
                        className="w-4 h-4 text-indigo-500 border-white/20 rounded bg-white/10"
                      />
                      <span className="text-white text-sm">{m.name}</span>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs ml-auto">Mentor</span>
                    </label>
                  ))}
                  
                  <p className="text-xs text-white/50 mt-4 mb-2 uppercase tracking-wider">Students</p>
                  {mockStudents.map(s => (
                    <label key={s.id} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={groupForm.members.includes(s.id)}
                        onChange={() => toggleGroupMember(s.id)}
                        className="w-4 h-4 text-indigo-500 border-white/20 rounded bg-white/10"
                      />
                      <span className="text-white text-sm">{s.name}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs ml-auto">Student</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-2">Selected: {groupForm.members.length} members</p>
              </div>

              <Button type="submit" className="w-full mt-4" variant="secondary">Create Group</Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Create;
