sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "zprap/zfprap/utils/ValueHelpFilter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, Fragment, Filter, FilterOperator, ValueHelpFilter) {
        "use strict";

        return Controller.extend("zprap.zfprap.controller.FilterSelectionPRAP", {
            onInit: function () {
                this.oFragment = {}
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
                ValueHelpFilter.onInputMaterialsValueHelpRequest.call(this, oEvent);
            },

            onValueHelpSearch: function (oEvent) {
                ValueHelpFilter.onValueHelpSearch.call(this, oEvent);
            },

            onValueHelpClose: function (oEvent) {
                ValueHelpFilter.onValueHelpClose.call(this, oEvent);
            },

            onChangeInputValue: function (oEvent, sFilterProperty) {
                this.getView().getModel("localModel").getProperty(sFilterProperty, "test");
            }
        });
    });
