using Microsoft.AspNetCore.Mvc;
using Scheduler.Models;
using System.Text.Json;

namespace Scheduler.Controllers
{
    public class SchedulerController : Controller
    {
        private static List<Event> _events = new List<Event>
        {
            new Event
            {
                Id = "1",
                Title = "Team Meeting",
                Description = "Weekly team sync meeting",
                StartDate = DateTime.Today.AddDays(1).AddHours(10),
                EndDate = DateTime.Today.AddDays(1).AddHours(11),
                Location = "Conference Room A",
                Attendees = "John, Jane, Mike",
                Category = "time",
                Color = "#ffffff",
                BackgroundColor = "#34c38f",
                BorderColor = "#34c38f"
            },
            new Event
            {
                Id = "2",
                Title = "Project Deadline",
                Description = "Final project submission",
                StartDate = DateTime.Today.AddDays(3),
                EndDate = DateTime.Today.AddDays(3),
                Category = "allday",
                IsAllDay = true,
                Color = "#ffffff",
                BackgroundColor = "#f46a6a",
                BorderColor = "#f46a6a"
            },
            new Event
            {
                Id = "3",
                Title = "Client Presentation",
                Description = "Present quarterly results to client",
                StartDate = DateTime.Today.AddDays(2).AddHours(14),
                EndDate = DateTime.Today.AddDays(2).AddHours(16),
                Location = "Virtual Meeting",
                Attendees = "Client Team, Sales Team",
                Category = "time",
                Color = "#ffffff",
                BackgroundColor = "#50a5f1",
                BorderColor = "#50a5f1"
            }
        };

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetEvents()
        {
            var events = _events.Select(e => new
            {
                id = e.Id,
                calendarId = "cal1",
                title = e.Title,
                body = e.Description,
                start = e.StartDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                end = e.EndDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                location = e.Location,
                attendees = e.Attendees,
                category = e.Category,
                isAllday = e.IsAllDay,
                color = e.Color,
                bgColor = e.BackgroundColor,  // TOAST UI Calendar expects bgColor
                borderColor = e.BorderColor,
                dragBgColor = e.DragBackgroundColor  // TOAST UI Calendar expects dragBgColor
            });

            return Json(events);
        }

        [HttpPost]
        public IActionResult CreateEvent([FromBody] Event newEvent)
        {
            if (ModelState.IsValid)
            {
                newEvent.Id = Guid.NewGuid().ToString();
                _events.Add(newEvent);

                return Json(new { success = true, eventData = new
                {
                    id = newEvent.Id,
                    calendarId = "cal1",
                    title = newEvent.Title,
                    body = newEvent.Description,
                    start = newEvent.StartDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    end = newEvent.EndDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    location = newEvent.Location,
                    attendees = newEvent.Attendees,
                    category = newEvent.Category,
                    isAllday = newEvent.IsAllDay,
                    color = newEvent.Color,
                    bgColor = newEvent.BackgroundColor,  // TOAST UI Calendar expects bgColor
                    borderColor = newEvent.BorderColor,
                    dragBgColor = newEvent.DragBackgroundColor  // TOAST UI Calendar expects dragBgColor
                }});
            }

            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult UpdateEvent(string id, [FromBody] object updateData)
        {
            // Log the received data for debugging
            Console.WriteLine($"UpdateEvent called with id: {id}");
            Console.WriteLine($"UpdateData: {System.Text.Json.JsonSerializer.Serialize(updateData)}");
            
            if (updateData == null)
            {
                Console.WriteLine("UpdateData is null");
                return BadRequest("Event data is required");
            }

            var existingEvent = _events.FirstOrDefault(e => e.Id == id);
            if (existingEvent == null)
            {
                return NotFound();
            }

            // Convert the dynamic object to our Event model
            var jsonElement = (System.Text.Json.JsonElement)updateData;
            
            // Update properties if they exist in the JSON
            if (jsonElement.TryGetProperty("title", out var titleElement))
                existingEvent.Title = titleElement.GetString() ?? existingEvent.Title;
            
            if (jsonElement.TryGetProperty("description", out var descElement))
                existingEvent.Description = descElement.GetString();
            
            if (jsonElement.TryGetProperty("startDate", out var startElement))
            {
                var startDateString = startElement.GetString();
                if (!string.IsNullOrEmpty(startDateString))
                {
                    if (DateTime.TryParse(startDateString, out var startDate))
                    {
                        existingEvent.StartDate = startDate;
                        Console.WriteLine($"Updated start date: {startDate}");
                    }
                    else
                    {
                        Console.WriteLine($"Failed to parse start date: {startDateString}");
                    }
                }
            }
            
            if (jsonElement.TryGetProperty("endDate", out var endElement))
            {
                var endDateString = endElement.GetString();
                if (!string.IsNullOrEmpty(endDateString))
                {
                    if (DateTime.TryParse(endDateString, out var endDate))
                    {
                        existingEvent.EndDate = endDate;
                        Console.WriteLine($"Updated end date: {endDate}");
                    }
                    else
                    {
                        Console.WriteLine($"Failed to parse end date: {endDateString}");
                    }
                }
            }
            
            if (jsonElement.TryGetProperty("location", out var locationElement))
                existingEvent.Location = locationElement.GetString();
            
            if (jsonElement.TryGetProperty("attendees", out var attendeesElement))
            {
                if (attendeesElement.ValueKind == System.Text.Json.JsonValueKind.String)
                {
                    existingEvent.Attendees = attendeesElement.GetString();
                }
                else if (attendeesElement.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    // Convert array to comma-separated string
                    var attendeesArray = attendeesElement.EnumerateArray()
                        .Select(item => item.GetString())
                        .Where(item => !string.IsNullOrEmpty(item))
                        .ToArray();
                    existingEvent.Attendees = string.Join(", ", attendeesArray);
                }
            }
            
            if (jsonElement.TryGetProperty("category", out var categoryElement))
                existingEvent.Category = categoryElement.GetString() ?? existingEvent.Category;
            
            if (jsonElement.TryGetProperty("isAllDay", out var isAllDayElement))
                existingEvent.IsAllDay = isAllDayElement.GetBoolean();
            
            if (jsonElement.TryGetProperty("color", out var colorElement))
                existingEvent.Color = colorElement.GetString() ?? existingEvent.Color;
            
            if (jsonElement.TryGetProperty("bgColor", out var bgColorElement))
                existingEvent.BackgroundColor = bgColorElement.GetString() ?? existingEvent.BackgroundColor;
            
            if (jsonElement.TryGetProperty("borderColor", out var borderColorElement))
                existingEvent.BorderColor = borderColorElement.GetString() ?? existingEvent.BorderColor;
            
            if (jsonElement.TryGetProperty("dragBgColor", out var dragBgColorElement))
                existingEvent.DragBackgroundColor = dragBgColorElement.GetString() ?? existingEvent.DragBackgroundColor;

            Console.WriteLine($"Event updated successfully: {existingEvent.Title}");
            return Json(new { success = true });
        }

        [HttpDelete]
        public IActionResult DeleteEvent(string id)
        {
            var existingEvent = _events.FirstOrDefault(e => e.Id == id);
            if (existingEvent == null)
            {
                return NotFound();
            }

            _events.Remove(existingEvent);
            return Json(new { success = true });
        }
    }
} 