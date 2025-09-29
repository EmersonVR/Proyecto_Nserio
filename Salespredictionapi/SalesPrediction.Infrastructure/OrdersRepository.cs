using Dapper;
using SalesPrediction.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesPrediction.Infrastructure;

public class OrdersRepository : IOrdersRepository
{
    private static readonly HashSet<string> AllowedSort =
        ["OrderId", "RequiredDate", "ShippedDate", "ShipName", "ShipCity"];

    private readonly DapperContext _ctx;
    public OrdersRepository(DapperContext ctx) => _ctx = ctx;

    public async Task<PagedResult<ClientOrderDto>> GetClientOrdersAsync(int customerId, PageQuery q, CancellationToken ct)
    {
        using var con = _ctx.CreateConnection();

        var sortBy = AllowedSort.Contains(q.SortBy ?? "") ? q.SortBy! : "RequiredDate";
        var sortDir = (q.SortDir?.ToUpperInvariant() == "ASC") ? "ASC" : "DESC";

        var countSql = @"SELECT COUNT(*) FROM Sales.Orders WHERE custid = @customerId;";

        var dataSql = $@"
            SELECT o.orderid      AS OrderId,
                   o.requireddate AS RequiredDate,
                   o.shippeddate  AS ShippedDate,
                   o.shipname     AS ShipName,
                   o.shipaddress  AS ShipAddress,
                   o.shipcity     AS ShipCity
            FROM Sales.Orders o
            WHERE o.custid = @customerId
            ORDER BY {sortBy} {sortDir}
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;";

        var param = new { customerId, offset = (q.Page - 1) * q.PageSize, pageSize = q.PageSize };

        var total = await con.ExecuteScalarAsync<int>(new CommandDefinition(countSql, param, cancellationToken: ct));
        var items = await con.QueryAsync<ClientOrderDto>(new CommandDefinition(dataSql, param, cancellationToken: ct));

        return new PagedResult<ClientOrderDto>(items, total);
    }

    public async Task<int> CreateOrderAsync(CreateOrderDto dto, CancellationToken ct)
    {
        using var con = _ctx.CreateConnection();

        var p = new DynamicParameters();
        p.Add("@CustId", dto.CustId);
        p.Add("@EmpId", dto.EmpId);
        p.Add("@ShipperId", dto.ShipperId);
        p.Add("@ShipName", dto.ShipName);
        p.Add("@ShipAddress", dto.ShipAddress);
        p.Add("@ShipCity", dto.ShipCity);
        p.Add("@OrderDate", dto.OrderDate);
        p.Add("@RequiredDate", dto.RequiredDate);
        p.Add("@ShippedDate", dto.ShippedDate);
        p.Add("@Freight", dto.Freight);
        p.Add("@ShipCountry", dto.ShipCountry);
        p.Add("@ProductId", dto.ProductId);
        p.Add("@UnitPrice", dto.UnitPrice);
        p.Add("@Qty", dto.Qty);
        p.Add("@Discount", dto.Discount);
        p.Add("@NewOrderId", dbType: System.Data.DbType.Int32, direction: System.Data.ParameterDirection.Output);

        await con.ExecuteAsync(new CommandDefinition(
            "Sales.usp_AddOrderWithDetail", p, commandType: System.Data.CommandType.StoredProcedure, cancellationToken: ct));

        return p.Get<int>("@NewOrderId");
    }
}