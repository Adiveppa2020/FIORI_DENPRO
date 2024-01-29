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
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		loadData: async function (param) {
			const oLocalModel = this.getOwnerComponent().getModel("localModel");
			oLocalModel.setProperty("/enableListPRActions", false);
			const aFilter = Utils.getFilterArray([
				{
					sPath: "MATNR",
					sValue: param["?query"].material
				},
				{
					sPath: "BANFN",
					sValue: param["?query"].purchaseReqNo
				},
				{
					sPath: "WERKS",
					sValue: param["?query"].plant
				},
				{
					sPath: "FRGZU",
					sValue: param.releaseCode
				},
				{
					sPath: "BSART",
					sValue: param["?query"].docType
				}
			]);
			const oView = this.getView();
			try {
				oView.setBusy(true);
				const oData = await Utils.readOdataCall.call(this, "/ZHeadSet", aFilter, {$expand: "ZITEMNAV"});
				oLocalModel.setProperty("/HeadDetails", oData.results);
				oLocalModel.setProperty("/headTableCount", (oData.results && oData.results.length));
				oView.setBusy(false);
				oView.byId("idPRListTable").removeSelections(false);
			} catch (error) {
				oView.setBusy(false);
				Utils.displayErrorMessagePopup("Error while fetching PR List" + error?.message);
			}
		},

		onDetailsButtonNavToPRdetailsPagePress: function () {
			const oView = this.getView();
			const aSelectedContext = oView.byId("idPRListTable").getSelectedContexts();
			if (aSelectedContext && aSelectedContext.length === 1) {
				const oContext = aSelectedContext[0].getObject();
				this.getRouter().navTo("prdetailslistpage", {
					material: oContext.MATNR,
					"?query": {
						plant: oContext.WERKS,
						releaseCode: oContext.FRGZU,
						purchaseReqNo:oContext.BANFN,
						docType:oContext.BSART
					}
				});
			} else {
				Utils.displayErrorMessagePopup(Utils.getI18nText(oView, "errorMessageMultiSelect"));
			}
		},

		onSelectPRList: function (oEvent) {
			const aSelectedContext = oEvent.getSource().getSelectedContexts() || [];
			Utils.updateActionEnable.call(this, aSelectedContext);
		},

		updateFinishedTable: function (oEvent) {
			const aSelectedContext = oEvent.getSource().getSelectedContexts() || [];
			Utils.updateActionEnable.call(this, aSelectedContext);
		},

		onPressApproveHead: async function () {
			const oView = this.getView();
			try {
				const oPayload = {};
				oView.setBusy(true);
				await Utils.updateOdataCall.call(this, "/ZSTOCK_QTYSet", oPayload);
				oView.setBusy(false);
			} catch (error) {
				oView.setBusy(false);
				Utils.displayErrorMessagePopup("Error while updating PR List" + error?.message);
			}
		}
	});
});
