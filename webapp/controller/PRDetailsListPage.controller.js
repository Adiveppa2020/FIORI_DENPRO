sap.ui.define([
	"zprap/zfprap/controller/App.controller",
	"sap/ui/core/routing/History",
	"zprap/zfprap/utils/Utils",
	"sap/m/MessageToast"
], function (
	Controller, History, Utils, MessageToast
) {
	"use strict";

	return Controller.extend("zprap.zfprap.controller.PRDetailsListPage", {

		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("prdetailslistpage").attachMatched(function (oEvent) {
				this.loadData(oEvent.getParameter("arguments"));
			}, this);
			this.material = "";
			this.supplyPlant = "";
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
			this.material = param["?query"].material;
			const aFilter = Utils.getFilterArray([
				{
					sPath: "BANFN",
					sValue: param.purchaseReqNo
				},
				{
					sPath: "MATNR",
					sValue: param["?query"].material
				}
			]);
			const oView = this.getView();
			oView.byId("idPRDetailsListTable").getBinding("items").filter(aFilter);
			this.supplyPlant = "";

			try {
				const sEntityName = `/ZHeadSet(MATNR='${param["?query"].material}',BANFN='${param.purchaseReqNo}')`;
				const oResponse = await Utils.readOdataCall.call(this, sEntityName, [], {});
				this.HeadSetItem = oResponse;
			} catch (error) {
				Utils.displayErrorMessagePopup("Error while fetching Head Set data - " + error?.message);
			}
		},

		updateFinishedTable: function (oEvent) {
			const oLocalModel = this.getOwnerComponent().getModel("localModel");
			oLocalModel.setProperty("/lineTableCount", oEvent.getParameter("total"));
		},

		onPressStockView: async function () {
			const oView = this.getView();
			if (this.material) {
				const aFilter = Utils.getFilterArray([
					{
						sPath: "MATNR",
						sValue: this.material || ""
					}
				]);
				Utils.openStoackDetailsFragment.call(this, aFilter);
			} else {
				Utils.displayErrorMessagePopup(Utils.getI18nText(oView, "noMaterial"));
			}
		},

		onPressSupplyPlantToListItems: function (oEvent) {
			const oView = this.getView();
			const sSuppPlantValue = oView.byId("idInputSupplyPlant10").getValue();
			if (sSuppPlantValue) {
			  this.supplyPlant = sSuppPlantValue;
			  Utils.updateSupplyPlantToLineItemList.call(this, sSuppPlantValue);
			  this.onPressCloseDialog(oEvent);
			} else {
			  this.supplyPlant = "";
			  const msg = Utils.getI18nText(oView, "noPlant");
			  MessageToast.show(msg);
			}
		},

		onPressApproveOrRejectLineItem: async function (oEvent, sAction) {
			const oView = this.getView();
			try {
				const aContext = oView.byId("idPRDetailsListTable").getBinding("items").getContexts();
				const oPayload = Utils.getLineItemSetUpdatePlayload.call(this, aContext, this.supplyPlant, sAction, this.HeadSetItem);
				oView.setBusy(true);
				const aResponse = await Utils.updateOdataCallList.call(this, "/ZHeadSet", [oPayload]);
				oView.setBusy(false);
				if (aResponse && aResponse.length > 0) {
					const msg = Utils.getI18nText(oView, (sAction === "Accept" ? "msgApproveSuccess" : "msgRejectSuccess"));
					MessageToast.show(msg);
				}
			} catch (error) {
				oView.setBusy(false);
				Utils.displayErrorMessagePopup("Error while updating PR List - " + error?.message);
			}
		}

	});
});
