using JobTracker.Api.Data;
using JobTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<ApplicationItem>> GetAll()
        => Ok(InMemoryStore.Items.OrderByDescending(x => x.AppliedOn ?? DateTime.MinValue));

    [HttpGet("{id:int}")]
    public ActionResult<ApplicationItem> GetById(int id)
    {
        var item = InMemoryStore.Items.FirstOrDefault(x => x.Id == id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public ActionResult<ApplicationItem> Create([FromBody] ApplicationItem dto)
    {
        if (dto is null) return BadRequest("Body is required.");
        if (string.IsNullOrWhiteSpace(dto.Company) || string.IsNullOrWhiteSpace(dto.Position))
            return BadRequest("Company and Position are required.");

        var item = new ApplicationItem
        {
            Id = InMemoryStore.NextId(),
            Company = dto.Company.Trim(),
            Position = dto.Position.Trim(),
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Applied" : dto.Status.Trim(),
            AppliedOn = dto.AppliedOn ?? DateTime.UtcNow,
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes,
            Link = string.IsNullOrWhiteSpace(dto.Link) ? null : dto.Link
        };

        InMemoryStore.Items.Add(item);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] ApplicationItem dto)
    {
        if (dto is null) return BadRequest("Body is required.");

        var item = InMemoryStore.Items.FirstOrDefault(x => x.Id == id);
        if (item is null) return NotFound();

        if (string.IsNullOrWhiteSpace(dto.Company) || string.IsNullOrWhiteSpace(dto.Position))
            return BadRequest("Company and Position are required.");

        item.Company = dto.Company.Trim();
        item.Position = dto.Position.Trim();
        item.Status = string.IsNullOrWhiteSpace(dto.Status) ? item.Status : dto.Status.Trim();

        // ✅ ако не е подадена дата, запази старата
        if (dto.AppliedOn is not null) item.AppliedOn = dto.AppliedOn;

        item.Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes;
        item.Link = string.IsNullOrWhiteSpace(dto.Link) ? null : dto.Link;

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var item = InMemoryStore.Items.FirstOrDefault(x => x.Id == id);
        if (item is null) return NotFound();

        InMemoryStore.Items.Remove(item);
        return NoContent();
    }
}

