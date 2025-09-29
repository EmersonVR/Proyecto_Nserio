using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SalesPrediction.Infrastructure;

public class DapperContext
{
    private readonly IConfiguration _config;
    public DapperContext(IConfiguration config) => _config = config;

    public IDbConnection CreateConnection()
        => new SqlConnection(_config.GetConnectionString("DefaultConnection"));
}
