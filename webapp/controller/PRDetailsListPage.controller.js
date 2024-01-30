sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"zprap/zfprap/utils/Utils"
], function (
	Controller, UIComponent, History, Utils
) {
	"use strict";

	return Controller.extend("zprap.zfprap.controller.PRDetailsListPage", {

		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("prdetailslistpage").attachMatched(function (oEvent) {
				this.loadData(oEvent.getParameter("arguments"));
			}, this);
		},
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		onBackButtonNavToPRListPagePress: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("RouteFilterSelectionPRAP", {}, true /*no history*/);
			}
		},

		loadData: async function (param) {
			const aFilter = Utils.getFilterArray([
				{
					sPath: "BANFN",
					sValue: param.purchaseReqNo
				}
			]);
			const oView = this.getView();
			oView.byId("idPRDetailsListTable").getBinding("items").filter(aFilter);
		},

		updateFinishedTable: function (oEvent) {
			const oLocalModel = this.getOwnerComponent().getModel("localModel");
			oLocalModel.setProperty("/lineTableCount", oEvent.getParameter("total"));
		}

	});
});
