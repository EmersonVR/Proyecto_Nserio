using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesPrediction.Domain;

public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.CustId).GreaterThan(0);
        RuleFor(x => x.EmpId).GreaterThan(0);
        RuleFor(x => x.ShipperId).GreaterThan(0);

        RuleFor(x => x.ShipName).NotEmpty().MaximumLength(40);
        RuleFor(x => x.ShipAddress).NotEmpty().MaximumLength(60);
        RuleFor(x => x.ShipCity).NotEmpty().MaximumLength(15);
        RuleFor(x => x.ShipCountry).NotEmpty().MaximumLength(15);

        RuleFor(x => x.OrderDate).NotEmpty();
        RuleFor(x => x.RequiredDate).NotEmpty()
            .GreaterThanOrEqualTo(x => x.OrderDate);

        RuleFor(x => x.ProductId).GreaterThan(0);
        RuleFor(x => x.UnitPrice).GreaterThan(0);
        RuleFor(x => x.Qty).GreaterThan((short)0);
        RuleFor(x => x.Discount).InclusiveBetween(0m, 0.999m);
    }
}

