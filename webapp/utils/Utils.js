sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (MessageBox, Filter, FilterOperator) {
    "use strict";

    function getI18nText(oView, key, parts) {
        return oView?.getModel("i18n")?.getResourceBundle()?.getText(key, parts);
    }

    function checkInputValue(oView) {
        let sInputlValue = oView.byId("idMaterialInput").getValue();
        let message = "";
        if (!sInputlValue) {
            message = getI18nText(oView, "messageMandatoryField", getI18nText(oView, "material"));
            return {
                error: true,
                message: message
            };
        }
        sInputlValue = oView.byId("idPurchaseReqNoInput").getValue();
        if (!sInputlValue) {
            message = getI18nText(oView, "messageMandatoryField", getI18nText(oView, "purchaseReqNo"));
            return {
                error: true,
                message: message
            };
        }
        sInputlValue = oView.byId("idPlantInput").getValue();
        if (!sInputlValue) {
            message = getI18nText(oView, "messageMandatoryField", getI18nText(oView, "plant"));
            return {
                error: true,
                message: message
            };
        }
        sInputlValue = oView.byId("idReleaseCodeInput").getValue();
        if (!sInputlValue) {
            message = getI18nText(oView, "messageMandatoryField", getI18nText(oView, "releaseCode"));
            return {
                error: true,
                message: message
            };
        }
        // sInputlValue = oView.byId("idDocType").getSelectedKey();
        // if (!sInputlValue) {
        //     return {
        //         error: true,
        //         message: ""
        //     };
        // }
        return { error: false };
    }

    function displayErrorMessagePopup (sMessage) {
        MessageBox.error(sMessage, {
            actions: [MessageBox.Action.CLOSE],
            emphasizedAction: MessageBox.Action.CLOSE,
            onClose: function () {
                return false;
            }
        });
    }

    return {
        displayErrorMessagePopup,
        checkMandatoryParams: function () {
            let oInputlRequire = checkInputValue(this.getView());
            if (oInputlRequire.error) {
                displayErrorMessagePopup(oInputlRequire.message);
            } else {
                return true;
            }
        },

        getFilterArray: function (aFilterParam) {
            const aFilter = [];
            aFilterParam.forEach(function (item) {
                if (item.sValue) {
                    aFilter.push(new Filter(item.sPath, FilterOperator.Contains, item.sValue));
                }
            });
            return aFilter;
        },

        readOdataCall: function (sEntityName, aFilter) {
            const oDataModel = this.getOwnerComponent().getModel();
            return new Promise(function (resolve, reject) {
                oDataModel.read(sEntityName, {
                    filters: aFilter,
                    success: function (oData, response) {
                        resolve(oData);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                });
            });
        }
    }
});
