"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout";
import axios from "axios";

interface Event {
  event_id: number;
  event_name: string;
  event_date: string;
  check_in_time: string;
  check_out_time: string;
  event_code: string;
  active: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    event_date: "",
    check_in_time: "",
    check_out_time: "",
    event_code: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost/attendance/admin.php?action=fetchEvents"
      );
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Handle adding a new event
  const handleAddEvent = async () => {
    try {
      const response = await axios.post(
        "http://localhost/attendance/admin.php?action=addEvent",
        newEvent
      );
      if (response.data.success) {
        setIsModalOpen(false);
        fetchEvents(); // Refresh events
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Handle activating an event
  const handleActivateEvent = async (eventId: number) => {
    if (
      window.confirm(
        "Activating this event will deactivate all others. Proceed?"
      )
    ) {
      try {
        const response = await axios.post(
          "http://localhost/attendance/admin.php?action=activateEvent",
          { event_id: eventId }
        );
        if (response.data.success) {
          fetchEvents(); // Refresh events
        }
      } catch (error) {
        console.error("Error activating event:", error);
      }
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Events Management</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Event
      </button>

      <table className="min-w-full table-auto border-collapse mt-4">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Event Name</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Check-in</th>
            <th className="px-4 py-2 text-left">Check-out</th>
            <th className="px-4 py-2 text-left">Reference Key</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.event_id} className="border-b">
              <td className="px-4 py-2">{event.event_name}</td>
              <td className="px-4 py-2">{event.event_date}</td>
              <td className="px-4 py-2">{event.check_in_time}</td>
              <td className="px-4 py-2">{event.check_out_time}</td>
              <td className="px-4 py-2">{event.event_code}</td>
              <td className="px-4 py-2">
                {event.active ? "Active" : "Inactive"}
              </td>
              <td className="px-4 py-2">
                {!event.active && (
                  <button
                    onClick={() => handleActivateEvent(event.event_id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Event</h2>
            <input
              type="text"
              placeholder="Event Name"
              value={newEvent.event_name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, event_name: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="date"
              placeholder="Event Date"
              value={newEvent.event_date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, event_date: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="time"
              placeholder="Check-in Time"
              value={newEvent.check_in_time}
              onChange={(e) =>
                setNewEvent({ ...newEvent, check_in_time: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="time"
              placeholder="Check-out Time"
              value={newEvent.check_out_time}
              onChange={(e) =>
                setNewEvent({ ...newEvent, check_out_time: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              placeholder="Reference Key"
              value={newEvent.event_code}
              onChange={(e) =>
                setNewEvent({ ...newEvent, event_code: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Events;
