sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (
	Controller, UIComponent
) {
	"use strict";

	return Controller.extend("zprap.zfprap.controller.PRDetailsListPage", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		onBackButtonNavToPRListPagePress: function () {
			this.getRouter().navTo("prlistpage", {
				id: "123"
			});
		}
	});
});