import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import MentorCard from '../components/MentorCard';
import AIRecommendations from '../components/AIRecommendations';
import { mentors } from '../data/mentors';
import { getRecommendedMentors } from '../utils/mentorFilter';
import { taskAPI } from '../services/api';

const UNASSIGNED_KEY = '__unassigned__';

function aggregateMenteeProgress(taskList) {
  const map = new Map();
  for (const task of taskList) {
    const assignee = task.assignedTo;
    const id =
      assignee && typeof assignee === 'object' && assignee._id != null
        ? String(assignee._id)
        : assignee
          ? String(assignee)
          : UNASSIGNED_KEY;
    const name =
      assignee && typeof assignee === 'object' && assignee.name
        ? assignee.name
        : id === UNASSIGNED_KEY
          ? 'Unassigned'
          : 'Student';
    if (!map.has(id)) {
      map.set(id, {
        id,
        name,
        tasks: [],
        total: 0,
        done: 0,
        inProgress: 0,
        open: 0,
      });
    }
    const row = map.get(id);
    row.tasks.push(task);
    row.total += 1;
    if (task.status === 'done') row.done += 1;
    else if (task.status === 'in_progress') row.inProgress += 1;
    else row.open += 1;
  }
  return Array.from(map.values()).sort((a, b) => {
    if (a.id === UNASSIGNED_KEY) return 1;
    if (b.id === UNASSIGNED_KEY) return -1;
    return b.total - a.total;
  });
}

const Dashboard = () => {
  const [suggestedMentors, setSuggestedMentors] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const { user, interests, bookings, messages, logout, isAuthenticated } = useAuth();
  const isMentor = user?.role === 'mentor';
  const displayFirstName =
    user?.firstName || (user?.name ? String(user.name).split(/\s+/)[0] : null) || (isMentor ? 'Mentor' : 'Student');

  // Safe defaults for undefined data
  const safeInterests = interests || [];
  const safeBookings = bookings || [];
  const safeMessages = messages || [];
  const safeUpcomingSessions = upcomingSessions || [];
  const safeRecentMessages = recentMessages || [];
  const safeSuggestedMentors = suggestedMentors || [];

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'mentor') {
        setSuggestedMentors([]);
      } else {
        const recommended = getRecommendedMentors(mentors, interests, 3);
        setSuggestedMentors(recommended);
      }
      
      // Generate mock upcoming sessions
      const mockSessions = safeBookings.slice(0, 3).map((booking, index) => ({
        id: booking.id,
        mentor: booking.mentorName,
        date: booking.date,
        time: booking.time,
        domain: booking.domain,
        status: 'confirmed'
      }));
      setUpcomingSessions(mockSessions);
      
      // Generate mock recent messages
      const mockMessages = safeMessages.slice(-3).reverse().map((message, index) => ({
        id: message.id,
        sender: message.sender,
        content: (message.content || '').length > 50 
          ? (message.content || '').substring(0, 50) + '...' 
          : (message.content || ''),
        timestamp: message.timestamp,
        isOwn: message.isOwn
      }));
      setRecentMessages(mockMessages);
    }
  }, [isAuthenticated, user, safeInterests, safeBookings, safeMessages]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      setTasksLoading(true);
      try {
        const res = await taskAPI.getTasks();
        setTasks(res.data?.data?.tasks || []);
      } catch (e) {
        console.error(e);
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    })();
  }, [isAuthenticated]);

  const menteeProgressRows = useMemo(() => aggregateMenteeProgress(tasks), [tasks]);
  const assignedStudentCount = useMemo(
    () => menteeProgressRows.filter((r) => r.id !== UNASSIGNED_KEY).length,
    [menteeProgressRows]
  );
  const mentorTaskDone = useMemo(() => tasks.filter((t) => t.status === 'done').length, [tasks]);
  const mentorTaskActive = useMemo(
    () => tasks.filter((t) => t.status === 'open' || t.status === 'in_progress').length,
    [tasks]
  );
  const mentorOverallPct = useMemo(() => {
    if (!tasks.length) return 0;
    return Math.round((mentorTaskDone / tasks.length) * 100);
  }, [tasks, mentorTaskDone]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access your dashboard</h2>
          <Link to="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      {/* Header Profile Card */}
      <div className="glass-card mb-8 overflow-hidden relative border-t-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-futuristic"></div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Welcome back, <span className="text-gradient">{displayFirstName}</span>!
              </h1>
              <p className="text-white/70 mt-2 text-lg">
                {isMentor
                  ? "Here's your mentor hub — track mentee task progress, messages, and groups in one place."
                  : safeInterests.length > 0
                    ? `Here's your personalized dashboard based on your interests in ${safeInterests.slice(0, 2).join(', ')}${safeInterests.length > 2 ? '...' : ''}`
                    : "Here's your learning dashboard. Select interests to get personalized recommendations!"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="outline" className="hover:bg-white/10 transition-colors">My Profile</Button>
              </Link>
              <Button onClick={logout} variant="danger" className="shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isMentor ? (
            <>
              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Mentees</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{assignedStudentCount}</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Tasks assigned</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{tasks.length}</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Active</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{mentorTaskActive}</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{mentorTaskDone}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Mentors</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{mentors.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Interests</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{safeInterests.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Sessions</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{safeUpcomingSessions.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 hover-lift neon-border cursor-default">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Bookings</p>
                    <p className="text-2xl font-bold text-white drop-shadow-md">{safeBookings.length}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Interests */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {isMentor ? 'Your domains & interests' : 'Your Interests'}
            </h2>
            <Link to="/interests">
              <Button variant="outline" size="sm">{isMentor ? 'Edit' : 'Update Interests'}</Button>
            </Link>
          </div>
          
          {safeInterests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {safeInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50 mb-4">
                {isMentor
                  ? 'Add domains you mentor in — it helps students discover you.'
                  : "You haven't selected any interests yet"}
              </p>
              <Link to="/interests">
                <Button>{isMentor ? 'Set domains' : 'Select Your Interests'}</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Tasks / Progress (mentee) · Mentee progress (mentor) */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isMentor ? 'Mentee progress' : 'Your Tasks'}
            </h2>
            {isMentor && (
              <div className="flex flex-wrap gap-2">
                <Link to="/groups">
                  <Button variant="outline" size="sm">
                    Open groups
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="outline" size="sm">
                    New group
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {tasksLoading ? (
            <div className="text-center py-8">
              <p className="text-white/50">Loading tasks...</p>
            </div>
          ) : isMentor ? (
            tasks.length > 0 ? (
              <div className="space-y-6">
                {menteeProgressRows.map((row) => {
                  const pct = row.total ? Math.round((row.done / row.total) * 100) : 0;
                  return (
                    <div key={row.id} className="glass-card bg-white/5 p-4 card-hover">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{row.name}</h3>
                          <p className="text-xs text-white/50 mt-1">
                            {row.done} done · {row.inProgress} in progress · {row.open} open · {row.total} total
                          </p>
                        </div>
                        <span className="text-sm font-medium text-indigo-300 shrink-0">{pct}% complete</span>
                      </div>
                      <div className="w-full bg-slate-800/80 rounded-full h-2 mb-3 overflow-hidden border border-white/10">
                        <div
                          className="bg-gradient-futuristic h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="space-y-2">
                        {row.tasks.slice(0, 4).map((task) => (
                          <div
                            key={task._id}
                            className="flex items-center justify-between gap-3 text-sm border border-white/5 rounded-lg px-3 py-2 bg-black/20"
                          >
                            <span className="text-white/90 truncate min-w-0">{task.title}</span>
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                task.status === 'done'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : task.status === 'in_progress'
                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              }`}
                            >
                              {task.status?.replace('_', ' ') || 'open'}
                            </span>
                          </div>
                        ))}
                        {row.tasks.length > 4 && (
                          <p className="text-xs text-white/45 pl-1">
                            +{row.tasks.length - 4} more for this mentee
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50 mb-4">No tasks to track yet.</p>
                <p className="text-white/70 text-sm mb-4">
                  Create a group, add students, then assign tasks — their completion status will show up here.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link to="/create">
                    <Button>Create group</Button>
                  </Link>
                  <Link to="/groups">
                    <Button variant="outline">My groups</Button>
                  </Link>
                </div>
              </div>
            )
          ) : tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div key={task._id} className="glass-card bg-white/5 p-4 card-hover">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{task.title}</h3>
                      <p className="text-sm text-white/70 mt-1">{task.description}</p>
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${
                      task.status === 'done'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : task.status === 'in_progress'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {task.status?.replace('_', ' ') || 'open'}
                    </span>
                  </div>
                </div>
              ))}
              {tasks.length > 5 && (
                <p className="text-xs text-white/50 pt-2">Showing 5 of {tasks.length} tasks</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50 mb-4">No tasks yet.</p>
              <p className="text-white/70 text-sm">
                Your mentor will assign tasks inside your groups to help track your progress.
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Upcoming Sessions</h2>
            <Link to={isMentor ? '/groups' : '/profile'}>
              <Button variant="outline" size="sm">{isMentor ? 'Groups' : 'View All Sessions'}</Button>
            </Link>
          </div>
          
          {safeUpcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {safeUpcomingSessions.map((session) => (
                <div key={session.id} className="glass-card bg-white/5 p-4 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{session.mentor}</h3>
                      <p className="text-sm text-white/70">{session.domain} · {session.date} at {session.time}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50 mb-4">No upcoming sessions scheduled</p>
              <Link to={isMentor ? '/groups' : '/mentors'}>
                <Button>{isMentor ? 'View your groups' : 'Find a Mentor'}</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Messages</h2>
            <Link to="/chat">
              <Button variant="outline" size="sm">View All Messages</Button>
            </Link>
          </div>
          
          {safeRecentMessages.length > 0 ? (
            <div className="space-y-4">
              {safeRecentMessages.map((message) => (
                <div key={message.id} className="glass-card bg-white/5 p-4 card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{message.sender}</h3>
                      <p className="text-sm text-white/70 mt-1">{message.content}</p>
                    </div>
                    <span className="text-xs text-white/50">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50 mb-4">No recent messages</p>
              <Link to="/chat">
                <Button>Start a Conversation</Button>
              </Link>
            </div>
          )}
        </div>

        {/* AI Recommendations — mentee discovery */}
        {!isMentor && <AIRecommendations />}

        {/* Suggested Mentors */}
        {!isMentor && (
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {safeInterests.length > 0 ? 'Recommended for You' : 'Popular Mentors'}
              </h2>
              <Link to="/mentors">
                <Button variant="outline" size="sm">View All Mentors</Button>
              </Link>
            </div>

            {safeSuggestedMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeSuggestedMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50 mb-4">
                  {safeInterests.length > 0 ? 'No mentors found for your interests' : 'No mentors available'}
                </p>
                <Link to="/interests">
                  <Button>{safeInterests.length > 0 ? 'Update Your Interests' : 'Select Your Interests'}</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mentorship requests (mentee) · Mentoring shortcuts (mentor) */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isMentor ? 'Mentoring shortcuts' : 'Your Mentorship Requests'}
            </h2>
            <Link to={isMentor ? '/groups' : '/mentors'}>
              <Button variant="outline" size="sm">{isMentor ? 'Manage groups' : 'Find More Mentors'}</Button>
            </Link>
          </div>

          {isMentor ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card bg-white/5 p-4 card-hover">
                <h3 className="font-semibold text-white mb-1">Groups</h3>
                <p className="text-sm text-white/65 mb-3">See members, chat, and assign work.</p>
                <Link to="/groups">
                  <Button variant="outline" size="sm">Open groups</Button>
                </Link>
              </div>
              <div className="glass-card bg-white/5 p-4 card-hover">
                <h3 className="font-semibold text-white mb-1">Create</h3>
                <p className="text-sm text-white/65 mb-3">Spin up a new cohort or topic.</p>
                <Link to="/create">
                  <Button variant="outline" size="sm">New group</Button>
                </Link>
              </div>
              <div className="glass-card bg-white/5 p-4 card-hover">
                <h3 className="font-semibold text-white mb-1">Messages</h3>
                <p className="text-sm text-white/65 mb-3">Follow up with mentees in chat.</p>
                <Link to="/chat">
                  <Button variant="outline" size="sm">Open chat</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  mentor: 'Dr. Sarah Johnson',
                  domain: 'AI',
                  status: 'approved',
                  date: '2024-04-10',
                  message: 'Request approved! Let\'s schedule your first session.'
                },
                {
                  id: 2,
                  mentor: 'Michael Chen',
                  domain: 'Web Development',
                  status: 'pending',
                  date: '2024-04-11',
                  message: 'Mentor is reviewing your request. You\'ll hear back soon.'
                },
                {
                  id: 3,
                  mentor: 'Emily Rodriguez',
                  domain: 'Data Science',
                  status: 'pending',
                  date: '2024-04-09',
                  message: 'Waiting for mentor confirmation.'
                }
              ].map((request) => (
                <div key={request.id} className="glass-card bg-white/5 p-4 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{request.mentor}</h3>
                      <p className="text-sm text-white/70">{request.domain} • {request.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      request.status === 'approved'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {request.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mt-2">{request.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card hover-lift p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-2">
                {isMentor ? 'Your groups' : 'Find a Mentor'}
              </h3>
              <p className="text-white/70 mb-4 text-sm">
                {isMentor ? 'Jump back into cohorts you run or joined.' : 'Browse our extensive mentor network'}
              </p>
              <Link to={isMentor ? '/groups' : '/mentors'}>
                <Button variant="outline" size="sm" className="group-hover:bg-white/10 transition-colors">
                  {isMentor ? 'Open groups' : 'Browse Mentors'}
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass-card hover-lift p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-2">Update Profile</h3>
              <p className="text-white/70 mb-4 text-sm">Keep your information up to date</p>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="group-hover:bg-white/10 transition-colors">Edit Profile</Button>
              </Link>
            </div>
          </div>

          <div className="glass-card hover-lift p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-2">
                {isMentor ? 'Cohort task completion' : 'Learning Progress'}
              </h3>
              <p className="text-white/70 mb-4 text-sm">
                {isMentor
                  ? 'Share of tasks marked done across all assignments you created.'
                  : 'Track your learning journey'}
              </p>
              <div className="w-full bg-slate-800/80 rounded-full h-2 mb-2 overflow-hidden border border-white/10">
                <div
                  className={`bg-gradient-futuristic h-2 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)] ${!isMentor ? 'animate-progress' : ''}`}
                  style={{ width: `${isMentor ? mentorOverallPct : 65}%` }}
                />
              </div>
              <p className="text-xs text-right text-white/50 font-medium">
                {isMentor ? `${mentorOverallPct}% tasks completed` : '65% Completed'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
