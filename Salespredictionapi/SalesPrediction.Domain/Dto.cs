// SalesPrediction.Domain/Dtos.cs
namespace SalesPrediction.Domain;

// Paginación genérica
public record PagedResult<T>(IEnumerable<T> Items, int Total);
public record PageQuery(int Page = 1, int PageSize = 10, string? SortBy = null, string? SortDir = null, string? Search = null);

// Customers (predicción)
public record CustomerPredictionDto(
    int CustId,                      
    string CustomerName,
    DateTime? LastOrderDate,
    DateTime? NextPredictedOrder
);

// Orders por cliente (6 columnas exactas)
public record ClientOrderDto(
    int OrderId,
    DateTime? RequiredDate,
    DateTime? ShippedDate,
    string ShipName,
    string ShipAddress,
    string ShipCity
);

// Catálogos estrictos
public record EmployeeDto(int EmpId, string FullName);
public record ShipperDto(int ShipperId, string CompanyName);
public record ProductDto(int ProductId, string ProductName);

// Crear orden (campos exactos del PDF)
public class CreateOrderDto
{
    public int CustId { get; set; }
    public int EmpId { get; set; }
    public int ShipperId { get; set; }
    public string ShipName { get; set; } = default!;
    public string ShipAddress { get; set; } = default!;
    public string ShipCity { get; set; } = default!;
    public DateTime OrderDate { get; set; }
    public DateTime RequiredDate { get; set; }
    public DateTime? ShippedDate { get; set; }
    public decimal Freight { get; set; }
    public string ShipCountry { get; set; } = default!;

    // detalle único
    public int ProductId { get; set; }
    public decimal UnitPrice { get; set; }   // requerido
    public short Qty { get; set; }
    public decimal Discount { get; set; }    // 0..1
}
