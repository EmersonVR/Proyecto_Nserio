Aplicación completa para predecir y gestionar pedidos de clientes.
Incluye UI Angular (SSR), API .NET 8 (Dapper) y script de base de datos para SQL Server.

Tech stack

Frontend: Angular 20 (standalone, SSR + Vite, Zone.js), Angular Material

Backend: .NET 8 Web API, Dapper

DB: SQL Server (vistas y SP dedicadas)


Proyecto_Nserio/
├─ Database/                 # Scripts SQL (setup inicial)
│  └─ 01_DBSetup.sql
├─ Salespredictionapi/       # .NET 8 Web API (Dapper)
└─ sales-ui/                 # Angular 20 (SSR + Vite)
   └─ public/d3-demo/        # Demo estática accesible en /d3-demo/

Puntos de conexión principales (API)

GET /api/customers
Parámetros de consulta: paginación/ordenación/búsqueda. Devuelve: Nombredelcliente, Fechadelúltimopedido, Próximopedidoprevisto.

GET /api/orders?customerId=...
Devuelve: Id.delpedido, Fecharequerida, Fechadeenvío, Nombredelenvío, Direccióndelenvío, Ciudaddelenvío.

POST /api/orders
Crea un pedido y un detalle usando Sales.usp_AddOrderWithDetail.

GET /api/employees → HR.vwEmployeesBasic

GET /api/shippers → Sales.vwShippersBasic

GET /api/products → Production.vwProductsBasic

Objetos de base de datos utilizados:
Sales.vwCustomerPrediction, HR.vwEmployeesBasic, Sales.vwShippersBasic, Production.vwProductsBasic y Sales.usp_AddOrderWithDetail.

Inicio (local)
1) Base de datos (SQL Server)

Abra Database/01_DBSetup.sql en SSMS/Azure Data Studio.

Ejecute el script (crea/actualiza los objetos necesarios).

Verifique las vistas y los SP:


la aplicacion backend al ejecutar mostrara el swagger con los enpoint  

cd Salespredictionapi

dotnet restore

dotnet run

sales-ui

cd sales-ui

npm i

npm start

# abre http://localhost:4200


La interfaz de usuario espera que environment.apiUrl apunte a la API.

La ruta estática /d3-demo/ sirve el contenido de sales-ui/public/d3-demo/index.html.

para ingresar a las graficas puede acceder dando clic al nav en D3-DEMO
