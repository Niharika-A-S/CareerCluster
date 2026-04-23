import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { groupAPI } from '../services/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await groupAPI.getMyGroups();
        setGroups(res.data?.data?.groups || []);
      } catch (e) {
        console.error(e);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="glass-card border-x-0 border-t-0 rounded-none border-b-white/10 mb-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Your Groups</h1>
              <p className="text-white/70 mt-1">Collaborate and learn with mentors and peers.</p>
            </div>
            <Link to="/create">
              <Button>+ Create New Group</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="glass-card p-8 text-center text-white/70">
            Loading your groups...
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && groups.map((group) => (
            <div key={group._id || group.id} className="glass-card p-6 card-hover flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-1">{group.groupName || group.name}</h3>
                <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-medium">
                  {group.interest || group.domain}
                </span>
              </div>

              <p className="text-white/70 text-sm mb-6 flex-grow">
                {group.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center text-white/50 text-sm">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {(group.members?.length ?? group.memberCount ?? 0)} Members
                </div>
                <Link to={`/groups/${group._id || group.id}`}>
                  <Button variant="secondary" size="sm">Open Chat</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!loading && groups.length === 0 && (
          <div className="glass-card p-10 text-center mt-8">
            <h3 className="text-xl font-semibold text-white mb-2">No groups yet</h3>
            <p className="text-white/70 mb-6">Join a group based on your interests, or (if you're a mentor) create one.</p>
            <Link to="/create">
              <Button>Go to Create</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
