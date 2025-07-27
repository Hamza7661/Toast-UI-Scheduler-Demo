# TOAST UI Scheduler - ASP.NET MVC Integration

A comprehensive calendar scheduling solution that integrates TOAST UI Scheduler with ASP.NET MVC, providing a modern and user-friendly interface for managing events and appointments.

## Features

- **Full Calendar View**: Week, month, and day views with TOAST UI Scheduler
- **Event Management**: Create, edit, and delete events
- **Drag & Drop**: Intuitive drag and drop functionality for event scheduling
- **All-Day Events**: Support for both time-based and all-day events
- **Attendee Management**: Track event attendees and locations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Bootstrap Integration**: Modern UI with Bootstrap 5 styling
- **RESTful API**: Clean API endpoints for event operations

## Technology Stack

- **Backend**: ASP.NET Core 8.0 MVC
- **Frontend**: TOAST UI Scheduler, Bootstrap 5, JavaScript (ES6+)
- **Styling**: Custom CSS with Bootstrap integration
- **Icons**: Font Awesome 6

## Project Structure

```
Scheduler/
├── Controllers/
│   ├── HomeController.cs
│   └── SchedulerController.cs
├── Models/
│   ├── ErrorViewModel.cs
│   └── Event.cs
├── Views/
│   ├── Home/
│   │   └── Index.cshtml
│   ├── Scheduler/
│   │   └── Index.cshtml
│   └── Shared/
│       └── _Layout.cshtml
└── wwwroot/
    ├── css/
    │   └── scheduler.css
    └── js/
        └── scheduler.js
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Visual Studio 2022 or VS Code
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Scheduler
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

4. Navigate to `https://localhost:5001` in your browser

## Usage

### Creating Events

1. Click the "Add Event" button in the calendar header
2. Fill in the event details:
   - Title (required)
   - Description
   - Location
   - Start and End dates/times
   - Attendees
   - All-day event option
3. Click "Save Event"

### Editing Events

1. Click on any existing event in the calendar
2. Modify the event details in the modal
3. Click "Save Event" to update

### Deleting Events

1. Click on an existing event
2. Click the "Delete" button in the modal
3. Confirm the deletion

### Drag and Drop

- Drag events to different time slots or dates
- Events automatically update when dropped

## API Endpoints

The application provides the following RESTful API endpoints:

- `GET /Scheduler/GetEvents` - Retrieve all events
- `POST /Scheduler/CreateEvent` - Create a new event
- `PUT /Scheduler/UpdateEvent/{id}` - Update an existing event
- `DELETE /Scheduler/DeleteEvent/{id}` - Delete an event

## Customization

### Styling

Custom styles are defined in `wwwroot/css/scheduler.css`. You can modify:

- Calendar appearance
- Modal styling
- Button colors
- Responsive breakpoints

### Event Properties

The `Event` model supports the following properties:

- `Id` - Unique identifier
- `Title` - Event title
- `Description` - Event description
- `StartDate` - Event start date/time
- `EndDate` - Event end date/time
- `Location` - Event location
- `Attendees` - Event attendees
- `Category` - Event category (time/allday)
- `IsAllDay` - All-day event flag
- `Color` - Text color
- `BackgroundColor` - Background color
- `BorderColor` - Border color

### JavaScript Configuration

The scheduler configuration can be modified in `wwwroot/js/scheduler.js`:

- Default view (week/month/day)
- Calendar colors
- Event handlers
- Modal behavior

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [TOAST UI Scheduler](https://ui.toast.com/tui-calendar/) - The calendar component
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Font Awesome](https://fontawesome.com/) - Icons

## Support

For issues and questions, please create an issue in the repository or contact the development team. 