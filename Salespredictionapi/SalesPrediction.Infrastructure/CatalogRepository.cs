using Dapper;
using SalesPrediction.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesPrediction.Infrastructure;

public class CatalogRepository : ICatalogRepository
{
    private readonly DapperContext _ctx;
    public CatalogRepository(DapperContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<EmployeeDto>> GetEmployeesAsync(CancellationToken ct)
    {
        const string sql = @"SELECT EmpId, FullName FROM HR.vwEmployeesBasic ORDER BY FullName;";
        using var con = _ctx.CreateConnection();
        return await con.QueryAsync<EmployeeDto>(new CommandDefinition(sql, cancellationToken: ct));
    }

    public async Task<IEnumerable<ShipperDto>> GetShippersAsync(CancellationToken ct)
    {
        const string sql = @"SELECT ShipperId, CompanyName FROM Sales.vwShippersBasic ORDER BY CompanyName;";
        using var con = _ctx.CreateConnection();
        return await con.QueryAsync<ShipperDto>(new CommandDefinition(sql, cancellationToken: ct));
    }

    public async Task<IEnumerable<ProductDto>> GetProductsAsync(CancellationToken ct)
    {
        const string sql = @"SELECT ProductId, ProductName FROM Production.vwProductsBasic ORDER BY ProductName;";
        using var con = _ctx.CreateConnection();
        return await con.QueryAsync<ProductDto>(new CommandDefinition(sql, cancellationToken: ct));
    }

}
