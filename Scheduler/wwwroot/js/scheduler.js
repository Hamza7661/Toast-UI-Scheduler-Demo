// TOAST UI Scheduler Integration
var Calendar = tui.Calendar;

class SchedulerManager {
    constructor() {
        this.calendar = null;
        this.eventModal = null;
        this.init();
    }

    init() {
        // Initialize the calendar
        this.calendar = new Calendar('#calendar', {
            defaultView: 'week',
            taskView: true,
            eventView: true,
            useDetailPopup: true,
            useCreationPopup: true,
            isReadOnly: false,
            template: {
                monthGridHeader: function(model) {
                    return '<span class="tui-full-calendar-weekday-grid-date">' + model.date + '</span>';
                }
            },
            calendars: [
                {
                    id: 'cal1',
                    name: 'My Calendar',
                    color: '#ffffff',
                    backgroundColor: '#34c38f',
                    borderColor: '#34c38f'
                }
            ]
        });

        // Get modal reference
        this.eventModal = new bootstrap.Modal(document.getElementById('eventModal'));

        // Load initial events
        this.loadEvents();

        // Bind event handlers
        this.bindEventHandlers();
    }

    async loadEvents() {
        try {
            const response = await fetch('/Scheduler/GetEvents');
            const events = await response.json();
            
            // Convert UTC times to local timezone
            const localEvents = events.map(event => ({
                ...event,
                start: this.convertToLocalTime(event.start),
                end: this.convertToLocalTime(event.end)
            }));
            
            // Clear existing events before adding new ones
            this.calendar.clear();
            
            // Add the updated events with local times
            this.calendar.createSchedules(localEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    convertToLocalTime(utcTimeString) {
        if (!utcTimeString) return utcTimeString;
        
        // Parse the UTC time and convert to local timezone
        const utcDate = new Date(utcTimeString);
        const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
        
        return localDate.toISOString();
    }

    convertToUTC(localDate) {
        if (!localDate) return localDate;
        
        // Handle TOAST UI Calendar date format
        let dateString;
        if (typeof localDate === 'object' && localDate._date) {
            dateString = localDate._date;
        } else if (typeof localDate === 'string') {
            dateString = localDate;
        } else {
            return localDate;
        }
        
        // Convert local time to UTC for server storage
        const date = new Date(dateString);
        const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        
        return utcDate.toISOString();
    }

    bindEventHandlers() {
        // Handle event click
        this.calendar.on('clickSchedule', (event) => {
            this.showEventModal(event.schedule);
        });

        // Handle day click for new events
        this.calendar.on('clickDayname', (event) => {
            this.showCreateEventModal(event.date);
        });

        // Handle drag and drop
        this.calendar.on('beforeUpdateSchedule', (event) => {
            console.log('Before update schedule event:', event);
            console.log('Schedule data:', event.schedule);
            console.log('Changes:', event.changes);
            
            // Use the changes data which contains the new times
            if (event.changes && (event.changes.start || event.changes.end)) {
                const updatedSchedule = {
                    ...event.schedule,
                    start: event.changes.start || event.schedule.start,
                    end: event.changes.end || event.schedule.end
                };
                
                console.log('Updated schedule with changes:', updatedSchedule);
                
                // Update the event on the server with the new times
                this.updateEvent(updatedSchedule);
            }
        });

        // Handle after update for confirmation
        this.calendar.on('afterUpdateSchedule', (event) => {
            console.log('After update schedule event:', event);
            console.log('Final schedule data:', event.schedule);
        });

        // Handle event deletion
        this.calendar.on('beforeDeleteSchedule', (event) => {
            this.deleteEvent(event.schedule.id);
        });
    }

    showCreateEventModal(date = new Date()) {
        this.clearForm();
        
        // Set default date/time
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setHours(endDate.getHours() + 1);

        document.getElementById('eventStartDate').value = this.formatDateTime(startDate);
        document.getElementById('eventEndDate').value = this.formatDateTime(endDate);
        
        // Hide delete button for new events
        document.getElementById('deleteEventBtn').style.display = 'none';
        
        // Show modal
        this.eventModal.show();
    }

    showEventModal(schedule) {
        this.clearForm();
        
        // Populate form with existing data
        document.getElementById('eventId').value = schedule.id;
        document.getElementById('eventTitle').value = schedule.title || '';
        document.getElementById('eventDescription').value = schedule.body || '';
        document.getElementById('eventLocation').value = schedule.location || '';
        document.getElementById('eventAttendees').value = schedule.attendees || '';
        document.getElementById('eventStartDate').value = this.formatDateTime(new Date(schedule.start));
        document.getElementById('eventEndDate').value = this.formatDateTime(new Date(schedule.end));
        document.getElementById('eventIsAllDay').checked = schedule.isAllday || false;
        
        // Show delete button for existing events
        document.getElementById('deleteEventBtn').style.display = 'inline-block';
        
        // Show modal
        this.eventModal.show();
    }

    clearForm() {
        document.getElementById('eventForm').reset();
        document.getElementById('eventId').value = '';
    }

    async saveEvent() {
        const form = document.getElementById('eventForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

                    const eventData = {
                title: document.getElementById('eventTitle').value,
                description: document.getElementById('eventDescription').value,
                location: document.getElementById('eventLocation').value,
                attendees: document.getElementById('eventAttendees').value,
                startDate: new Date(document.getElementById('eventStartDate').value),
                endDate: new Date(document.getElementById('eventEndDate').value),
                isAllDay: document.getElementById('eventIsAllDay').checked,
                category: document.getElementById('eventIsAllDay').checked ? 'allday' : 'time',
                color: '#ffffff',
                backgroundColor: '#34c38f',
                borderColor: '#34c38f',
                dragBackgroundColor: '#34c38f'
            };

        try {
            const eventId = document.getElementById('eventId').value;
            let response;

            if (eventId) {
                // Update existing event
                response = await fetch(`/Scheduler/UpdateEvent/${eventId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData)
                });
            } else {
                // Create new event
                response = await fetch('/Scheduler/CreateEvent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData)
                });
            }

            if (response.ok) {
                // Reload events and close modal
                await this.loadEvents();
                this.eventModal.hide();
            } else {
                console.error('Error saving event');
            }
        } catch (error) {
            console.error('Error saving event:', error);
        }
    }

    async updateEvent(schedule) {
        try {
            // Ensure we have valid data before sending
            if (!schedule || !schedule.id) {
                console.error('Invalid schedule data for update');
                return;
            }

            console.log('Updating event with data:', schedule);

            // Handle TOAST UI Calendar's date format
            let startDate, endDate;
            
            if (schedule.start) {
                if (typeof schedule.start === 'object' && schedule.start._date) {
                    // TOAST UI Calendar format: { "_date": "2025-07-28T05:00:00.000Z" }
                    startDate = schedule.start._date;
                } else if (typeof schedule.start === 'string') {
                    // Direct string format
                    startDate = schedule.start;
                } else {
                    startDate = new Date().toISOString();
                }
            } else {
                startDate = new Date().toISOString();
            }
            
            if (schedule.end) {
                if (typeof schedule.end === 'object' && schedule.end._date) {
                    // TOAST UI Calendar format: { "_date": "2025-07-28T06:00:00.000Z" }
                    endDate = schedule.end._date;
                } else if (typeof schedule.end === 'string') {
                    // Direct string format
                    endDate = schedule.end;
                } else {
                    endDate = new Date().toISOString();
                }
            } else {
                endDate = new Date().toISOString();
            }

            const eventData = {
                title: schedule.title || '',
                description: schedule.body || '',
                location: schedule.location || '',
                attendees: schedule.attendees || '',
                startDate: this.convertToUTC(startDate),
                endDate: this.convertToUTC(endDate),
                isAllDay: schedule.isAllDay || false,
                category: schedule.category || 'time',
                color: schedule.color || '#ffffff',
                backgroundColor: schedule.bgColor || schedule.backgroundColor || '#34c38f',
                borderColor: schedule.borderColor || '#34c38f',
                dragBackgroundColor: schedule.dragBgColor || schedule.dragBackgroundColor || '#34c38f'
            };

            console.log('Sending event data:', eventData);

            const response = await fetch(`/Scheduler/UpdateEvent/${schedule.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error updating event:', response.status, errorText);
            } else {
                console.log('Event updated successfully');
                // Refresh the calendar to show updated data
                await this.loadEvents();
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }

    async deleteEvent(eventId) {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const response = await fetch(`/Scheduler/DeleteEvent/${eventId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await this.loadEvents();
                this.eventModal.hide();
            } else {
                console.error('Error deleting event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    }

    formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}

// Initialize scheduler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.schedulerManager = new SchedulerManager();
}); 