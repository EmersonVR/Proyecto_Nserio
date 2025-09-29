using Microsoft.AspNetCore.Mvc;
using SalesPrediction.Domain;
using SalesPrediction.Infrastructure;

namespace SalesPrediction.Api.Controllers
{
    [ApiController]
    [Route("api/shippers")]
    public class ShippersController(ICatalogRepository repo) : ControllerBase
    {
        [HttpGet] public async Task<IEnumerable<ShipperDto>> Get(CancellationToken ct) => await repo.GetShippersAsync(ct);
    }
}
