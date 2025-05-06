const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { getDestination } = require('@sap-cloud-sdk/core');

module.exports = async function (srv) {
    srv.on('PostSalesOrderData', async (req) => {
        try {
            console.log(req);
            // The original utf8 string
            var base64string = req.data.encode;
            // Create a buffer from the string
            var bufferObj = Buffer.from(base64string, "base64");
            // Encode the Buffer as a utf8 string
            var decodedString = bufferObj.toString("utf8");
            JSON.stringify(decodedString);
            console.log(decodedString);

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
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            //throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getSalesOrderType', async (req) => {
        try {

            const DESTINATION_NAME = 'NUVO_SALES_APP';
            const salesDocumentType = 'QT';
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: `ZSALES_ORDER_TYPE`
            });
            return response.data;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getCustomerList', async (req) => {
        try {

            const DESTINATION_NAME = 'NUVO_SALES_APP';
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: 'ZCUSTOMER_LIST'
            });
            return response.data;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getItemList', async (req) => {
        try {

            const DESTINATION_NAME = 'S4HANADESTINATION';

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: 'Product'
            });
            return response.data;
            //   return ('hi');            // console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
    srv.on('getParticularItemList', async (req) => {
        try {
            console.log(req);
            const DESTINATION_NAME = 'S4HANADESTINATION';
            // const Product = 'FG011';
            const { product } = req.data;
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: `Product?$filter=Product eq '${product}'`
            });
            return response.data;
            //   return ('hi');            // console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
    srv.on('getSalesOrderHistoryList', async (req) => {
        try {

            var stp = req.data.SoldToParty;
            var ds = req.data.OverallTotalDeliveryStatus;
            console.log(stp);
            console.log(ds);
            // var salesOrder = '66';


            if ((stp !== undefined || stp !== '' || stp !== null) &&
                (ds !== undefined || ds !== '' || ds !== null)) {

                var newurl = `A_SalesOrder?$filter=SoldToParty eq '${stp}' and OverallTotalDeliveryStatus eq '${ds}'&$expand=to_Item`
            }
            if ((stp !== undefined || stp !== '' || stp !== null) &&
                (ds === undefined || ds === '' || ds === null)) {
                var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}'`
                // var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}' and SalesOrder eq '${salesOrder}'`;
            }

            const DESTINATION_NAME = 'S4HANADESTINATION_TEST';

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: newurl
            });
            return response.data.d;

        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
    srv.on('getSalesOrderHistoryListwithInvoice', async (req) => {
        try {

            var stp = req.data.SoldToParty;
            var ds = req.data.OverallTotalDeliveryStatus;
            console.log(stp);
            console.log(ds);
            // var salesOrder = '66';


            if ((stp !== undefined || stp !== '' || stp !== null) &&
                (ds !== undefined || ds !== '' || ds !== null)) {

                var newurl = `A_SalesOrder?$select=SalesOrder,SalesOrderDate,RequestedDeliveryDate,OverallTotalDeliveryStatus,SalesOrderType,SoldToParty,TotalNetAmount,to_Item&$filter=SoldToParty eq '${stp}' and OverallTotalDeliveryStatus eq '${ds}'&$expand=to_Item`
            }
            if ((stp !== undefined || stp !== '' || stp !== null) &&
                (ds === undefined || ds === '' || ds === null)) {
                var newurl = `A_SalesOrder?$select=SalesOrder,SalesOrderDate,RequestedDeliveryDate,OverallTotalDeliveryStatus,SalesOrderType,SoldToParty,TotalNetAmount,to_Item&$expand=to_Item&$filter=SoldToParty eq '${stp}'`
                // var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}' and SalesOrder eq '${salesOrder}'`;
            }

            const DESTINATION_NAME = 'S4HANADESTINATION_TEST';

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: newurl
            });

            const response4 = await executeHttpRequest({ destinationName: 'NUVO_SALES_APP' }, {
                method: 'GET',
                url: `ZINVOICE_DETAIL`
            });

            const response1 = [];
            const response2 = [];

            response1.push.apply(response1, response.data.d.results);
            response2.push.apply(response2, response4.data.value);



            const mergedArray = response1.map(item1 => {
                const matchingItem = response2.find(item2 => item2.SalesOrder === item1.SalesOrder);
                return { ...item1, ...matchingItem }; // Merge the objects
            });



            return mergedArray;
            // return response4.data

        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
    srv.on('getSalesOrderHistoryListItem', async (req) => {
        try {

            var stp = req.data.SoldToParty;
            var ds = req.data.OverallTotalDeliveryStatus;
            console.log(stp);
            console.log(ds);
            var salesOrder = req.data.SalesOrder;


            if ((stp !== undefined || stp !== '' || stp !== null) &&
                (ds !== undefined || ds !== '' || ds !== null)) {

                var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}' and OverallTotalDeliveryStatus eq '${ds}'`
            }
            if ((stp !== undefined || stp !== '' || stp !== null) &&
                (ds === undefined || ds === '' || ds === null)) {
                // var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}'`
                var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}' and SalesOrder eq '${salesOrder}'`;
            }

            const DESTINATION_NAME = 'S4HANADESTINATION_TEST';

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: newurl
            });
            return response.data.d;

        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
    srv.on('getSalesOrderHistoryListItemReport', async (req) => {
        try {

            var stp = req.data.SoldToParty;

            console.log(stp);

            // Define the start and end dates for 2024
            const startDate = '/Date(1732233600000)/'; // Start of 2024
            const endDate = new Date('2024-12-31'); // End of 2024


            // var    newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}'`;
            // var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}'`;
            var newurl = `A_SalesOrder?$expand=to_Item&$filter=SoldToParty eq '${stp}' and SalesOrderDate eq '${startDate}'`;
            const DESTINATION_NAME = 'S4HANADESTINATION_TEST';

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: newurl
            });
            return response.data.d;

        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
    srv.on('SimulatetSalesOrderData', async (req) => {
        try {
            console.log(req);
            // The original utf8 string
            var base64string = req.data.encode;
            // Create a buffer from the string
            var bufferObj = Buffer.from(base64string, "base64");
            // Encode the Buffer as a utf8 string
            var decodedString = bufferObj.toString("utf8");
            JSON.stringify(decodedString);
            console.log(decodedString);

            const DESTINATION_NAME = 'S4HANADESTINATION_CLONING_CLONING';

            const destination = await getDestination('S4HANADESTINATION_CLONING_CLONING');

            const auth = 'Basic ' + Buffer.from(destination.username + ':' + destination.password).toString('base64');

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'POST',
                url: 'A_SalesOrderSimulation',
                data: decodedString,
                headers: {
                    'Authorization': auth,
                    'content-type': 'application/json'
                }
            });
            return response.data.d;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            //throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getCustomerBasicDetail', async (req) => {
        try {

            const DESTINATION_NAME = 'NUVO_SALES_APP';
            var stp = req.data.Customer;

            var newurl = `ZSD_customer_detail?$filter=Customer eq '${stp}'`
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: newurl
            });
            return response.data;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });


    //CPI USED
    srv.on('getCustomerListCPI', async (req) => {
        try {

            const DESTINATION_NAME = 'NUVO_SALES_APP_CPI';
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET'
            });
            return response.data;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });


    srv.on('getBillingDocument', async (req) => {
        try {
            var stp = req.data.SalesOrder;
            //const DESTINATION_NAME = 'NUVO_SALES_APP';

            const response = await executeHttpRequest({ destinationName: 'NUVO_SALES_APP' }, {
                method: 'GET',
                url: `ZINVOICE_DETAIL?$filter=SalesOrder eq '${stp}'`
            });
            return response.data.value[0].BillingDocument;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getInvoicePDF', async (req) => {
        try {
            var stp = req.data.BillingDocument;

            const response = await executeHttpRequest({ destinationName: 'NUVO_SALES_APP_INVOICE' }, {
                method: 'GET',
                url: `GetPDF?BillingDocument='${stp}'`
            });
            return response.data.d.GetPDF.BillingDocumentBinary;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
    srv.on('getInvoiceStatus', async (req) => {
        try {
            var stp = req.data.SalesOrder;
            //const DESTINATION_NAME = 'NUVO_SALES_APP';

            const response = await executeHttpRequest({ destinationName: 'NUVO_SALES_APP' }, {
                method: 'GET',
                url: `ZINVOICE_DETAIL`
            });
            return response.data;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });


    srv.on('PlaceSalesOrder', async (req) => {
        try {

            var SoldToParty = req.data.SoldToParty;
            var SalesOrder = req.data.SalesOrder;
            var materials = JSON.parse(req.data.materials); // Parse the JSON string
            var materials = JSON.parse(req.data.materials); // Parse the JSON string

            let materialDetails = Object.keys(materials)
                .map((key, index) => `${index + 1}. MATERIAL: ${key}, QUANTITY: ${materials[key]}`)

            const messageBody = `THANK YOU ${SoldToParty} FOR PLACING AN ORDER.ORDER DETAILS ARE AS:SALES ORDER NUMBER: ${SalesOrder} - ${materialDetails}`;
            // Define payload
            const payload = {
                data: {
                    body: messageBody,
                    number: "+919011186285"  // Replace with dynamic customer number if available
                }
            };
            //  const DESTINATION_NAME1 = 'WhatsAppDestination';
            // Sending message
            // const response1 = await executeHttpRequest(
            //     { destinationName: DESTINATION_NAME1 },
            //     {
            //         method: 'POST',
            //         url: `/rest/new/sendMessage`,
            //         data: payload,
            //         headers: { 'Content-Type': 'application/json' }
            //     }
            // );


            console.log("WhatsApp message sent:", messageBody);
            return messageBody;

        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw new Error('Failed to send WhatsApp notification');
        }
    });
};
