using Microsoft.AspNetCore.Mvc;
using SalesPrediction.Domain;
using SalesPrediction.Infrastructure;

namespace SalesPrediction.Api.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeesController(ICatalogRepository repo) : ControllerBase
    {
        [HttpGet] public async Task<IEnumerable<EmployeeDto>> Get(CancellationToken ct) => await repo.GetEmployeesAsync(ct);
    }
}