sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("nuvo.controller.View1", {
        onInit() {
            // Dynamically resolve the path to the image
            var sImage = "./images/Nuvo.png";

            // Create a JSON model with the image path
            this.getView().setModel(new sap.ui.model.json.JSONModel({
                image: sImage
            }), "imageModel");

        },
        onNavigateToDetailPage: function () {
            // Navigate to the detail page using the updated route "detailPage"
            this.getOwnerComponent().getRouter().navTo("detailPageRoute");
        }
    });
});