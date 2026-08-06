import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Search,
  Filter,
  MapPin,
  CalendarCheck
} from 'lucide-react';
import { AppointmentEvent } from '../types';

interface CalendarViewProps {
  events: AppointmentEvent[];
  onAddEvent: (eventData: Partial<AppointmentEvent>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onAddEvent,
  onDeleteEvent
}) => {
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState('30');
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [provider, setProvider] = useState<'google_calendar' | 'calendly'>('google_calendar');

  const filteredEvents = events.filter((evt) => {
    const matchesProvider = filterProvider === 'all' || evt.provider === filterProvider;
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.attendeeName && evt.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProvider && matchesSearch;
  });

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    await onAddEvent({
      title,
      purpose: title,
      date,
      time,
      durationMinutes: parseInt(duration, 10) || 30,
      attendeeName: attendeeName || 'User',
      attendeeEmail,
      provider
    });

    // Reset form
    setTitle('');
    setDate('');
    setTime('10:00');
    setAttendeeName('');
    setAttendeeEmail('');
    setShowAddModal(false);
  };

  return (
    <div id="calendar-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Google Calendar & Calendly Agenda
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Live synchronized appointments created via Telegram AI Bot or API integration.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            id="btn-sync-calendar"
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs sm:text-sm font-medium transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing API...' : 'Sync Calendar'}</span>
          </button>

          <button
            id="btn-open-add-event-modal"
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-appointments"
            type="text"
            placeholder="Search title, attendee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2 outline-none"
          />
        </div>

        {/* Provider Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterProvider('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterProvider === 'all' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Providers ({events.length})
          </button>
          <button
            onClick={() => setFilterProvider('google_calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterProvider === 'google_calendar' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google Calendar
          </button>
          <button
            onClick={() => setFilterProvider('calendly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterProvider === 'calendly' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Calendly
          </button>
        </div>

      </div>

      {/* Events Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-lg hover:shadow-sky-950/20 group relative flex flex-col justify-between"
          >
            <div>
              {/* Event Badge & Options */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  evt.provider === 'google_calendar'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  <CalendarIcon className="w-3 h-3" />
                  <span className="capitalize">{evt.provider.replace('_', ' ')}</span>
                </span>

                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                    Confirmed
                  </span>
                  <button
                    onClick={() => onDeleteEvent(evt.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Cancel appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                {evt.title}
              </h3>

              {/* Time Details */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <CalendarIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-medium text-slate-200">{evt.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{evt.time} ({evt.durationMinutes} mins)</span>
                </div>
                {evt.attendeeName && (
                  <div className="flex items-center space-x-2 text-slate-400">
                    <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{evt.attendeeName} {evt.attendeeEmail ? `(${evt.attendeeEmail})` : ''}</span>
                  </div>
                )}
                {evt.location && (
                  <div className="flex items-center space-x-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer External Calendar Link */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                Created: {new Date(evt.createdAt).toLocaleDateString()}
              </span>
              <a
                href={evt.calendarLink || 'https://calendar.google.com'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                <span>Open in Calendar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No Appointments Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No calendar events match your search. Use the Telegram agent to schedule a new one!
            </p>
          </div>
        )}
      </div>

      {/* Manual Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-sky-400" />
              <span>Create New Appointment</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Appointment Title / Purpose *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Strategy Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Duration (mins)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                  >
                    <option value="google_calendar">Google Calendar</option>
                    <option value="calendly">Calendly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Attendee Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold shadow-md shadow-sky-500/20"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
