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
			const oLocalModel = this.getOwnerComponent().getModel("localModel");
			const aFilter = Utils.getFilterArray([
				{
					sPath: "MATNR",
					sValue: param.material
				},
				{
					sPath: "BANFN",
					sValue: param["?query"].purchaseReqNo
				},
				// {
				// 	sPath: "WERKS",
				// 	sValue: param["?query"].plant
				// },
				// {
				// 	sPath: "FRGZU",
				// 	sValue: param["?query"].releaseCode
				// },
				// {
				// 	sPath: "BSART",
				// 	sValue: param["?query"].docType
				// }
			]);
			const oView = this.getView();
			try {
				oView.setBusy(true);
				const oData = await Utils.readOdataCall.call(this, "/ZLineSet", aFilter);
				oLocalModel.setProperty("/LineDetails", oData.results);
				oLocalModel.setProperty("/lineTableCount", (oData.results && oData.results.length));
				oView.setBusy(false);
			} catch (error) {
				oView.setBusy(false);
				Utils.displayErrorMessagePopup("Error while fetching PR Item Details" + error?.message);
			}
		}

	});
});
