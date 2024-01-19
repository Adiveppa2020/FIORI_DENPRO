sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (
	Controller,
	UIComponent
) {
	"use strict";

	return Controller.extend("zprap.zfprap.controller.PRListPage", {
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