using Microsoft.AspNetCore.Mvc;
using SalesPrediction.Domain;
using SalesPrediction.Infrastructure;

namespace SalesPrediction.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomersController(ICustomerRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<CustomerPredictionDto>>> Get([FromQuery] PageQuery q, CancellationToken ct)
        => Ok(await repo.GetCustomerPredictionsAsync(q, ct));
}
