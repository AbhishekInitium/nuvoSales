sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
  ], (BaseController, Fragment, JSONModel, MessageBox) => {
    "use strict";
  
    return BaseController.extend("nuvo.controller.DetailPageView", {
      onInit: function () {
        const model = new JSONModel({
  
          CustomerMasterList: [],
          getCustomerBasicDetail: [],
          CustID: "",
  
  
  
        
  
  
  
          isButtonVisible: false // Button hidden by default
        });
  
        this.getView().setModel(model, "localModel");
        const url = this.getOwnerComponent().getModel().getServiceUrl()
  
  
  
        const localModel = this.getView().getModel("localModel");
  
  
        $.ajax({
          type: "POST",
          contentType: "application/json",
  
          url: url + "getCustomerList",
          success: function (response) {
            console.log("Success:", response.value.value);
  
            localModel.setProperty("/CustomerMasterList", response.value.value);
  
          }
        })
  
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("detailPageRoute").attachPatternMatched(this._onRouteMatched, this);
  
      },
      _onRouteMatched: function (oEvent) {
        const localModel = this.getView().getModel("localModel");
        localModel.refresh();
      //  localModel.setProperty("/CustomerMasterList","");
      const input = this.getView().byId("customerInput");
      input.setValue(''); 
      },
  
      _refreshPageData: function () {
       
        const localModel = this.getView().getModel("localModel");
        localModel.refresh();
  
      },
      onValueHelpSearch1: function (oEvent) {
        // Get the search query
        const sQuery = oEvent.getParameter("value").toLowerCase();
  
        // Get the binding of the SelectDialog items
        const oBinding = oEvent.getSource().getBinding("items");
  
        // Create filters for search fields
        const oFilter = new sap.ui.model.Filter({
          filters: [
            new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sQuery)
          ],
          and: false // Match any field
        });
  
        // Apply filters to the binding
        oBinding.filter(oFilter);
      },
  
  
      handleValueHelp: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();
        this._sInputId = oEvent.getSource().getId();
  
        // this._inputPath = oEvent.getSource().getBindingInfo("value").parts[0].path;
        // // debugger;
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "nuvo.fragments.CustomerList",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pValueHelpDialog.then(function (oDialog) {
          // Create a filter for the binding
          // Open ValueHelpDialog filtered by the input's value
          oDialog.open();
        });
      },
      onPressValuHelp: function (oEvent) {
        const localModel = this.getView().getModel("localModel");
        const selectedItem = oEvent.getParameter("selectedItem");
        if (selectedItem) {
          // const localModel = this.getView().getModel("localModel");
          const selectedName = selectedItem.mProperties.title // Get the 
          const selectedID = selectedItem.mProperties.description // Get the 
          localModel.setProperty("/CustID", selectedID);
  
          const input = this.getView().byId("customerInput");
          input.setValue(selectedName); // Set the name in the Input field
  
          var globalModel = this.getOwnerComponent().getModel("globalModel");
          this.getOwnerComponent().getRouter(this).navTo("MainTabsPageRoute", {
            CustomerName: selectedName,
            CustomerID: selectedID
  
          });
  
          globalModel.setProperty("/keys", {
            CustomerName: selectedName, CustomerID: selectedID
           
          });
          
         
     
        }
  
        const url = this.getOwnerComponent().getModel().getServiceUrl()
  
        const CustID = localModel.getProperty("/CustID");
  
        // const localModel = this.getView().getModel("localModel");
        // let payload = {
        //   "Customer": CustID
        // }
  
        // $.ajax({
        //   type: "POST",
        //   contentType: "application/json",
  
        //   url: url + "getCustomerBasicDetail",
        //   data: JSON.stringify(payload),
        //   success: function (response) {
        //     console.log("Success:", response.value.value);
  
        //     localModel.setProperty("/getCustomerBasicDetail", response.value.value);
  
        //   }
        // });
  
      },
      handleProceed: function () {
        // Access the router and navigate to the next page
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("MainTabsPageRoute");
      },
      handleProceed2: function () {
        // Access the router and navigate to the next page
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("MainTabsPageRouteOption2");
      },
  
      onCreatesalesorder: function (oEvent) {
        const localModel = this.getView().getModel("localModel");
        const url = this.getOwnerComponent().getModel().getServiceUrl();
  
        let payload = {
          "SalesOrderType": "TA",
          "SoldToParty": "17100001"
        }
  
  
        //POST call to post data in Human Resource transactional table
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: url + "PostSalesOrderData",
          data: JSON.stringify(payload),
          success: function (response, second) {
          },
          error: function () { },
        })
      },
      onGeneratePDF: function () {
        // Define the content for the PDF
        var docDefinition = {
          content: [
            { text: 'Sales Order Details', style: 'header' },
            { text: 'Customer: John Doe', margin: [0, 10, 0, 5] },
            { text: 'Order ID: 12345', margin: [0, 0, 0, 10] },
            {
              table: {
                body: [
                  ['Material', 'Quantity', 'Price'],
                  ['Product A', '10', '$100'],
                  ['Product B', '5', '$50']
                ]
              }
            }
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              alignment: 'center'
            }
          }
        };
  
        // Generate and download the PDF
        pdfMake.createPdf(docDefinition).download("SalesOrder.pdf");
      }
  
  
    });
  });