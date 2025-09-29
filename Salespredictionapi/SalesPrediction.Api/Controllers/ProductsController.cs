using Microsoft.AspNetCore.Mvc;
using SalesPrediction.Domain;
using SalesPrediction.Infrastructure;

namespace SalesPrediction.Api.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController(ICatalogRepository repo) : ControllerBase
    {
        [HttpGet] public async Task<IEnumerable<ProductDto>> Get(CancellationToken ct) => await repo.GetProductsAsync(ct);
    }
}
