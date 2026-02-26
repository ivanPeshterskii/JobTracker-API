namespace JobTracker.Api.Models;

public class ApplicationItem
{
    private int _id;

    public int Id
    {
        get => this._id;

        set
        {
            if(value < 0)
            {
                throw new ArgumentException("Id cannot be lower than 0");
            }

            this._id = value;
        }
    }
    public string Company { get; set; } = "";
    public string Position { get; set; } = "";
    public string Status { get; set; } = "Applied"; // Applied | Interview | Offer | Rejected

    
    public DateTime? AppliedOn { get; set; }

    public string? Notes { get; set; }
    public string? Link { get; set; }
}

