using JobTracker.Api.Models;

namespace JobTracker.Api.Data;

public static class InMemoryStore
{
    private static readonly List<ApplicationItem> _items = new()
    {
        new ApplicationItem
        {
            Id = 1,
            Company = "Flat Rock",
            Position = "Junior Frontend Developer",
            Status = "Applied",
            AppliedOn = DateTime.UtcNow.AddDays(-5),
            Link = "https://example.com",
            Notes = "Sent CV + GitHub"
        },
        new ApplicationItem
        {
            Id = 2,
            Company = "Accedia",
            Position = "Frontend Intern",
            Status = "Interview",
            AppliedOn = DateTime.UtcNow.AddDays(-2),
            Notes = "HR call scheduled"
        }
    };

    private static int _nextId = 3;

    public static List<ApplicationItem> Items => _items;

    public static int NextId() => _nextId++;
}
