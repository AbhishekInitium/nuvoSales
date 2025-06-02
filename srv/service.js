require('dotenv').config();
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { getDestination } = require('@sap-cloud-sdk/core');

const isLocal = !process.env.VCAP_SERVICES || process.env.BOLT_ENV === 'true';

const mockIfLocal = (action, mockData) => {
    if (isLocal) {
        console.log(`⚠️ Running in Bolt: Mocking ${action} response`);
        return mockData;
    }
    return null;
};

module.exports = async function (srv) {
    srv.on('PostSalesOrderData', async (req) => {
        try {
            const mock = mockIfLocal('PostSalesOrderData', {
                d: {
                    SalesOrder: "1234567890",
                    SalesOrderType: "OR",
                    SalesOrganization: "1710",
                    DistributionChannel: "10",
                    OrganizationDivision: "00",
                    SoldToParty: "17100001"
                }
            });
            if (mock) return mock;

            console.log(req);
            var base64string = req.data.encode;
            var bufferObj = Buffer.from(base64string, "base64");
            var decodedString = bufferObj.toString("utf8");
            JSON.stringify(decodedString);

            const DESTINATION_NAME = 'S4HANADESTINATION_TEST';
            const destination = await getDestination('S4HANADESTINATION_TEST');
            const auth = 'Basic ' + Buffer.from(destination.username + ':' + destination.password).toString('base64');

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'POST',
                url: 'A_SalesOrder',
                data: decodedString,
                headers: {
                    'Authorization': auth,
                    'content-type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error calling destination API:', error);
        }
    });

    srv.on('getCustomerList', async (req) => {
        try {
            const mock = mockIfLocal('getCustomerList', {
                value: [
                    { Customer: "17100001", CustomerName: "Test Customer 1" },
                    { Customer: "17100002", CustomerName: "Test Customer 2" }
                ]
            });
            if (mock) return mock;

            const DESTINATION_NAME = 'NUVO_SALES_APP';
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: 'ZCUSTOMER_LIST'
            });
            return response.data;
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getCustomerBasicDetail', async (req) => {
        try {
            const mock = mockIfLocal('getCustomerBasicDetail', {
                value: [{
                    Customer: req.data.Customer,
                    CustomerName: "Test Customer",
                    SalesOrganization: "1710",
                    SalesOrganizationName: "US Sales Org.",
                    TelephoneNumber1: "999 585 1245",
                    CustomerPaymentTerms: "0001",
                    CustomerPaymentTermsName: "As of End of Month"
                }]
            });
            if (mock) return mock;

            const DESTINATION_NAME = 'NUVO_SALES_APP';
            var stp = req.data.Customer;
            var newurl = `ZSD_customer_detail?$filter=Customer eq '${stp}'`;
            
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: newurl
            });
            return response.data;
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });

    // Add similar mock implementations for other service handlers...
};