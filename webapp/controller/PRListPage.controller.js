sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"zprap/zfprap/utils/Utils"
], function (
	Controller, UIComponent, Utils
) {
	"use strict";

	return Controller.extend("zprap.zfprap.controller.PRListPage", {

		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("prlistpage").attachMatched(function (oEvent) {
				this.loadData(oEvent.getParameter("arguments"));
			}, this);
		},

		loadData: async function (param) {
			const oLocalModel = this.getOwnerComponent().getModel("localModel");
			let oFilterValue = oLocalModel.getData();
			oFilterValue = oFilterValue.filterValues;
			const aFilter = Utils.getFilterArray([
				{
					sPath: "MATNR",
					sValue: oFilterValue.material
				},
				{
					sPath: "BANFN",
					sValue: oFilterValue.purchaseReqNo
				},
				{
					sPath: "WERKS",
					sValue: oFilterValue.plant
				},
				{
					sPath: "FRGZU",
					sValue: oFilterValue.releaseCode
				},
				{
					sPath: "BSART",
					sValue: oFilterValue.docType
				}
			]);
			const oView = this.getView();
			try {
				oView.setBusy(true);
				const oData = await Utils.readOdataCall.call(this, "/ZHeadSet", aFilter);
				oLocalModel.setProperty("/HeadDetails", oData.results);
				oLocalModel.setProperty("/headTableCount", (oData.results && oData.results.length));
				oView.setBusy(false);
			} catch (error) {
				oView.setBusy(false);
				Utils.displayErrorMessagePopup("Error while fetching PR Details" + error?.message);
			}
		},
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		onDetailsButtonNavToPRdetailsPagePress: function () {
			this.getRouter().navTo("prdetailslistpage", {
				id: "123"
			});
		}

	});
});
