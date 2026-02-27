namespace JobTracker.Api.Models;

public class ApplicationItem
{
    public int Id { get; set; } 
    public string Company { get; set; } = "";
    public string Position { get; set; } = "";
    public string Status { get; set; } = "Applied"; // Applied | Interview | Offer | Rejected

    
    public DateTime? AppliedOn { get; set; }

    public string? Notes { get; set; }
    public string? Link { get; set; }
}

