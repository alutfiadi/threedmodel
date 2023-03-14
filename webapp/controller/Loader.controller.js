sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/ZoomTo"
], function(
	MessageToast,
	Controller,
	ContentConnector,
	threejs,
	ZoomTo
) {
	"use strict";

	return Controller.extend("threedmodel.controller.Loader", {

		onInit: function() {
			var view = this.getView();
			var viewer = this.viewer = view.byId("viewer");
			//fire node clicked 
			viewer.attachNodeClicked(function(event) {
				var nodeRef = event.getParameters().nodeRef;
				var id = nodeRef.id;
				console.log("NODEREF: \n",nodeRef.id)
				// console.log("NODEREF POSITION: \n",nodeRef.position);
			});
			
			var colladaLoader = function(parentNode, contentResource) {
				return new Promise(function(resolve, reject) {
					// var url = "https://threejs.org/examples/jsm/loaders/ColladaLoader.js";
					var url = "/libs/ColladaLoader.js";
					jQuery.ajax({
						url: url,
						dataType: "script",
						cache: true
					}).done(function() {
						var loader = new THREE.ColladaLoader();
						loader.load(contentResource.getSource(),
							function(collada) { // onload
								parentNode.add(collada.scene);
								resolve({
									node: parentNode,
									contentResource: contentResource
								});
							},
							null,  // onprogress
							reject // onfail
						);
					}).fail(function() {
						MessageToast.show("Cannot load Collada loader from " + url);
						var loader = new THREE.ColladaLoader();
						console.log(loader);
						reject();
					});
				});
			};

			ContentConnector.addContentManagerResolver({
				pattern: "dae",
				dimension: 3,
				contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
				settings: {
					loader: colladaLoader
				}
			});

			var viewer = this.getView().byId("viewer");
			viewer.attachSceneLoadingSucceeded(function() {
				viewer.getViewport().zoomTo([ ZoomTo.Visible, ZoomTo.ViewTop ], null, 0);
			});
			
			
		}
	});
});