using System.ComponentModel.DataAnnotations;

namespace Scheduler.Models
{
    public class Event
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        public string? Location { get; set; }
        
        public string? Attendees { get; set; }
        
        public string Category { get; set; } = "time";
        
        public bool IsAllDay { get; set; }
        
        public string? Color { get; set; }
        
        public string? BackgroundColor { get; set; }
        
        public string? BorderColor { get; set; }
        
        public string? DragBackgroundColor { get; set; }
    }
} 