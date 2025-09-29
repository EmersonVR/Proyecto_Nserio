using SalesPrediction.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesPrediction.Infrastructure;

public interface ICustomerRepository
{
    Task<PagedResult<CustomerPredictionDto>> GetCustomerPredictionsAsync(PageQuery q, CancellationToken ct);
}

public interface IOrdersRepository
{
    Task<PagedResult<ClientOrderDto>> GetClientOrdersAsync(int customerId, PageQuery q, CancellationToken ct);
    Task<int> CreateOrderAsync(CreateOrderDto dto, CancellationToken ct);
}

public interface ICatalogRepository
{
    Task<IEnumerable<EmployeeDto>> GetEmployeesAsync(CancellationToken ct);
    Task<IEnumerable<ShipperDto>> GetShippersAsync(CancellationToken ct);
    Task<IEnumerable<ProductDto>> GetProductsAsync(CancellationToken ct);
}