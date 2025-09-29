using Dapper;
using SalesPrediction.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesPrediction.Infrastructure
{
    public class CustomerRepository : ICustomerRepository
    {
        private static readonly HashSet<string> AllowedSort =
        ["CustomerName", "LastOrderDate", "NextPredictedOrder"];

        private readonly DapperContext _ctx;
        public CustomerRepository(DapperContext ctx) => _ctx = ctx;

        public async Task<PagedResult<CustomerPredictionDto>> GetCustomerPredictionsAsync(PageQuery q, CancellationToken ct)
        {
            using var con = _ctx.CreateConnection();

            var sortBy = AllowedSort.Contains(q.SortBy ?? "") ? q.SortBy! : "NextPredictedOrder";
            var sortDir = (q.SortDir?.ToUpperInvariant() == "ASC") ? "ASC" : "DESC";

            var where = new StringBuilder("WHERE 1=1 ");
            if (!string.IsNullOrWhiteSpace(q.Search))
                where.Append("AND (CustomerName LIKE @s) ");

            var countSql = $@"SELECT COUNT(*) FROM Sales.vwCustomerPrediction {where};";

            var dataSql = $@"
            SELECT CustId, CustomerName, LastOrderDate, NextPredictedOrder
            FROM Sales.vwCustomerPrediction
            {where}
            ORDER BY {sortBy} {sortDir}
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;";

            var param = new
            {
                s = $"%{q.Search}%",
                offset = (q.Page - 1) * q.PageSize,
                pageSize = q.PageSize
            };

            var total = await con.ExecuteScalarAsync<int>(new CommandDefinition(countSql, param, cancellationToken: ct));
            var items = await con.QueryAsync<CustomerPredictionDto>(new CommandDefinition(dataSql, param, cancellationToken: ct));

            return new PagedResult<CustomerPredictionDto>(items, total);
        }
    }
}
