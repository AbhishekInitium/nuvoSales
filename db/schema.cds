namespace nuvosalesapp; //namespace of the entire schema

using {
    cuid,
    managed
} from '@sap/cds/common'; // importing aspects to be used in the schema


entity Cartdata : cuid, managed {
    productname               : String(500);
    productid                 : String(500);
    customername              : String(500);
    customerid                : String(500);
    quantity                  : String(500);
    priceperprod              : String(500);
    freeofcharge              : String(500);
    discount                  : String(500);
    isorderconfirm            : String(100);
    orderid                   : String(500);
    material                  : String(500);
    SalesOrderItem            : String(500);
    SalesOrderPath            : String(500);
    RequestedQuantityD        : Decimal;
    RequestedQuantityI        : Integer;
    RequestedQuantityT        : String(500);
    RequestedQuantityISOUnits : String(500);


}

entity AuditLog : cuid, managed {
    CustomerID   : String(500);
    CustomerName : String(500);
    SalesOrderID : String(500);
    ActionTaken  : String(500);
    FunctionName : String(500);
    AnyComments  : String(5000);
    Request1     : String(500);
    Request2     : String(500);

}
