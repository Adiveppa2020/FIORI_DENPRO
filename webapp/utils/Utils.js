sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (MessageBox, Filter, FilterOperator, Fragment) {
    "use strict";

    function getI18nText(oView, key, parts) {
        return oView?.getModel("i18n")?.getResourceBundle()?.getText(key, parts);
    }

    function checkInputValue(oView) {
        let sInputlValue = oView.byId("idMaterialInput").getValue();
        let message = "";
        sInputlValue = oView.byId("idReleaseCodeInput").getValue();
        if (!sInputlValue) {
            message = getI18nText(oView, "messageMandatoryField", getI18nText(oView, "releaseCode"));
            return {
                error: true,
                message: message
            };
        }
        return { error: false };
    }

    function displayErrorMessagePopup(sMessage) {
        MessageBox.error(sMessage, {
            actions: [MessageBox.Action.CLOSE],
            emphasizedAction: MessageBox.Action.CLOSE,
            onClose: function () {
                return false;
            }
        });
    }

    return {
        getI18nText,
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
                    aFilter.push(new Filter(item.sPath, FilterOperator.EQ, item.sValue));
                }
            });
            return aFilter;
        },

        readOdataCall: function (sEntityName, aFilter, urlParams) {
            const oDataModel = this.getOwnerComponent().getModel();
            return new Promise(function (resolve, reject) {
                oDataModel.read(sEntityName, {
                    urlParameters: urlParams,
                    filters: aFilter,
                    success: function (oData, response) {
                        resolve(oData);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                });
            });
        },

        updateOdataCall: function (sEntityName, oData) {
            const oDataModel = this.getOwnerComponent().getModel();
            return new Promise(function (resolve, reject) {
                oDataModel.update(sEntityName, oData,
                    {
                        success: function (oData, response) {
                            resolve(oData);
                        },
                        error: function (oError) {
                            reject(oError);
                        }
                    });
            });
        },

        updateActionEnable: function (aSelectedContext) {
            const oLocalModel = this.getOwnerComponent().getModel("localModel");
            if (aSelectedContext && aSelectedContext.length > 0) {
                oLocalModel.setProperty("/enableListPRActions", true);
                return;
            }
            oLocalModel.setProperty("/enableListPRActions", false);
        },

        openStoackDetailsFragment: function (aFilter) {
            const oView = this.getView();
            if (!this._stockDetailTableDialog) {
                this._stockDetailTableDialog = Fragment.load({
                    id: oView.getId(),
                    name: "zprap.zfprap.fragments.StockDetails",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._stockDetailTableDialog.then(function (oValueHelpDialog) {
                oView.byId("idStackDetailsDialog").getBinding("items").filter(aFilter);
                oValueHelpDialog.open();
                oValueHelpDialog._oSubHeader && oValueHelpDialog._oSubHeader.setVisible(false);
            }.bind(this));
        }
    }
});
