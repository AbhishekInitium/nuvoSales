using {nuvosalesapp as my} from '../db/schema';

service MyService {

    entity Cartdata as projection on my.Cartdata;
    entity AuditLog as projection on my.AuditLog;
    action PostSalesOrderData(encode : String)                           returns String;
    action getSalesOrderType()                                           returns String;
    action getCustomerList()                                             returns String;
    action getItemList()                                                 returns String;
    action getParticularItemList(product : String)                       returns String;

    action getSalesOrderHistoryList(SoldToParty : String,
                                    OverallTotalDeliveryStatus : String) returns String;

    action getSalesOrderHistoryListItem(SoldToParty : String,
                                        OverallTotalDeliveryStatus : String,
                                        SalesOrder : String)             returns String;

    action getSalesOrderHistoryListItemReport(SoldToParty : String)      returns String;
    action SimulatetSalesOrderData(encode : String)                      returns String;
    action getCustomerListCPI()                                          returns String;
    action getCustomerBasicDetail(Customer : String)                     returns String;
    action getBillingDocument(SalesOrder : String)                       returns String;
    action getInvoicePDF(BillingDocument : String)                       returns String;
    action getInvoiceStatus() returns String;
     action PlaceSalesOrder(SoldToParty : String,
                                        SalesOrder : String,
                                        materials : String)   returns String;
     action getSalesOrderHistoryListwithInvoice(SoldToParty : String,  OverallTotalDeliveryStatus : String)                returns String;
}
