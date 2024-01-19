sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, Fragment, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zprap.zfprap.controller.FilterSelectionPRAP", {
            onInit: function () {

            },

            /**
             * Convenience method for accessing the router.
             * @public
             * @returns {sap.ui.core.routing.Router} the router for this component
             */
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            /**
             * Shows the selected item on the object page
             * @param {sap.m.ObjectListItem} oItem selected Item
             * @private
             */
            onSearchButtonNavToListPress: function () {
                this.getRouter().navTo("prlistpage", {
                    id: "123"
                });
            },

            onInputMaterialsValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();

                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zprap.zfprap.fragments.MaterialValueHelpDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("MaterialId", FilterOperator.Contains, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },

            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("MaterialId", FilterOperator.Contains, sValue);

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                this.byId("idMaterialInput").setValue(oSelectedItem.getTitle());
            }
        });
    });
