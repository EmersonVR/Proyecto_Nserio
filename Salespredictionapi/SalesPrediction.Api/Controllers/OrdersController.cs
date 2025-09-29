using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SalesPrediction.Domain;
using SalesPrediction.Infrastructure;

namespace SalesPrediction.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(IOrdersRepository repo, IValidator<CreateOrderDto> validator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<ClientOrderDto>>> Get([FromQuery] int customerId, [FromQuery] PageQuery q, CancellationToken ct)
        => Ok(await repo.GetClientOrdersAsync(customerId, q, ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto, CancellationToken ct)
    {
        var val = await validator.ValidateAsync(dto, ct);
        if (!val.IsValid)
        {
            var problem = new ValidationProblemDetails(val.ToDictionary())
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation failed."
            };
            return BadRequest(problem);
        }

        var id = await repo.CreateOrderAsync(dto, ct);
        return Ok(new { orderId = id });
    }

}
