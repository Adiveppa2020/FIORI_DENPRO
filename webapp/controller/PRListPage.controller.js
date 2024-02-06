sap.ui.define([
	"zprap/zfprap/controller/App.controller",
	"zprap/zfprap/utils/Utils",
	"sap/m/MessageToast"
], function (
	Controller, Utils, MessageToast
) {
	"use strict";

	return Controller.extend("zprap.zfprap.controller.PRListPage", {

		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("prlistpage").attachMatched(function (oEvent) {
				this.loadData(oEvent.getParameter("arguments"));
			}, this);
			this.supplyPlant = "";
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
			oView.byId("idPRListTable").getBinding("items").filter(aFilter);
			this.supplyPlant = "";
		},

		onDetailsButtonNavToPRdetailsPagePress: function () {
			const oView = this.getView();
			const aSelectedContext = oView.byId("idPRListTable").getSelectedContexts();
			if (aSelectedContext && aSelectedContext.length === 1) {
				const oContext = aSelectedContext[0].getObject();
				this.getRouter().navTo("prdetailslistpage", {
					purchaseReqNo: oContext.BANFN,
					"?query": {
						plant: oContext.WERKS,
						releaseCode: oContext.FRGZU,
						material: oContext.MATNR,
						docType: oContext.BSART
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
			const oLocalModel = this.getOwnerComponent().getModel("localModel");
			oLocalModel.setProperty("/headTableCount", oEvent.getParameter("total"));
			const aSelectedContext = oEvent.getSource().getSelectedContexts() || [];
			Utils.updateActionEnable.call(this, aSelectedContext);
		},

		onPressStockView: async function () {
			const oView = this.getView();
			const aSelectedContext = oView.byId("idPRListTable").getSelectedContexts();
			if (aSelectedContext && aSelectedContext.length === 1) {
				const oContext = aSelectedContext[0].getObject();
				const aFilter = Utils.getFilterArray([
					{
						sPath: "MATNR",
						sValue: oContext.MATNR || ""
					}
				]);
				Utils.openStoackDetailsFragment.call(this, aFilter);
			} else {
				Utils.displayErrorMessagePopup(Utils.getI18nText(oView, "errorMessageMultiSelect"));
			}
		},
		
		onPressApproveOrRejectHeaderItem: async function (oEvent, sAction) {
			const oView = this.getView();
			try {
				const sconfirmMsg = Utils.getI18nText(oView, (sAction === "Accept" ? "mgsConfirmAcceptHead" : "mgsConfirmRejectHead"));
				await Utils.displayConfirmMessageBox(sconfirmMsg, "Proceed");
				const aSelectedContext = oView.byId("idPRListTable").getSelectedContexts();
				const oPayload = Utils.getHeadSetUpdatePlayload.call(this, aSelectedContext, this.supplyPlant, sAction);
				oView.setBusy(true);
				const aResponse = await Utils.updateOdataCallList.call(this, "/ZHeadSet", oPayload);
				oView.setBusy(false);
				if (aResponse && aResponse.length > 0) {
					const msg = Utils.getI18nText(oView, (sAction === "Accept" ? "msgApproveSuccess" : "msgRejectSuccess"));
					MessageToast.show(msg);
				}
			} catch (error) {
				oView.setBusy(false);
				if (error && !error.popup) {
					Utils.displayErrorMessagePopup("Error while updating PR List - " + error?.message);
				}
			}
		}

	});
});
