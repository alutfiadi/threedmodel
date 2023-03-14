sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/Core",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/unified/Menu",
    "sap/ui/unified/MenuItem",
	"sap/m/Dialog",
	"sap/m/library",
	"sap/m/Button",
	"sap/m/Label"
], function (Controller, Core, JSONModel, Device, MessageToast,MessageBox, Menu, MenuItem,Dialog, mobileLibrary, Button, Label) {
    "use strict";
    	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;
	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;

    return Controller.extend("threedmodel.controller.Main", {
        onInit: function () {
            //JSON Model
            var oModel = new JSONModel("/LocalData/Data.json");
            this.getView().setModel(oModel);

            // console.log(oModel);
            // set the device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.getView().setModel(oDeviceModel, "device");

            // CIT 
            //https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day.grey/15/26094/16957/256/png8?apiKey=-nB2RVbXaymYcaISh96kt0puHq_apbzhlZc0zt-i9Ik
            var oMap = this.getView().byId("GeoMap");
            var oMapConfig = {
                "MapProvider": [{
                    "name": "HEREMAPS",
                    "type": "",
                    "description": "",
                    "tileX": "256",
                    "tileY": "256",
                    "maxLOD": "20",
                    "copyright": "Tiles Courtesy of HERE Maps",
                    "Source": [{
                        "id": "s1",
                        "url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day.grey/{LOD}/{X}/{Y}/256/png8?apiKey=-nB2RVbXaymYcaISh96kt0puHq_apbzhlZc0zt-i9Ik"
                    }]
                }],
                "MapLayerStacks": [{
                    "name": "DEFAULT",
                    "MapLayer": {
                        "name": "layer1",
                        "refMapProvider": "HEREMAPS",
                        "opacity": "1.0",
                        "colBkgnd": "RGB(255,255,255)"
                    }
                }]
            };
            oMap.setMapConfiguration(oMapConfig);
            oMap.setRefMapLayerStack("DEFAULT");
            oMap.setInitialZoom(16);
            oMap.setInitialPosition("106.6522354;-6.302285;0");
            oMap.setEnableAnimation(true);

        },
        onPressResize: function () {
            if (this.byId("btnResize").getTooltip() == "Minimize") {
                if (Device.system.phone) {
                    this.byId("vbi").minimize(132, 56, 1320, 560); //Height: 3,5 rem; Width: 8,25 rem
                } else {
                    this.byId("vbi").minimize(168, 72, 1680, 720); //Height: 4,5 rem; Width: 10,5 rem
                }
                this.byId("btnResize").setTooltip("Maximize");
            } else {
                this.byId("vbi").maximize();
                this.byId("btnResize").setTooltip("Minimize");
            }
        },
        onClickSpot: function (evt) {
            var oSource = evt.getSource();
            var spot_id = oSource.data("spotid");
            var label_text = oSource.getProperty("text");
            //oSource.openDetailWindow("Building " + label_text + " with ID " + spot_id, "0", "0");
            var that = this;
            MessageBox.confirm("Do you want to see 3D Model of " + label_text + " ?", {
				actions: ["Ok", MessageBox.Action.CLOSE],
				emphasizedAction: "Manage Products",
				onClose: function(sAction) {
					if (sAction === "Ok") {
						that.getRouter().navTo("Loader", {
                            spotid: spot_id
                        });
                        MessageToast.show("Action selected: OK" )
					} else {
							MessageToast.show("Action selected: ELSE" );
					}

				}
			});

        },
    
        onContextMenuSpot: function (evt) {
            var oSource = evt.getSource();
            var spot_id = oSource.data("spotid");
            var label_text = oSource.getProperty("text");

            if (evt.getParameter("menu")) {
                // Function to handle the select event of the items
                var that = this;
                var handleSelect = function (oEvent) {
                    MessageToast.show("clicked on " + oEvent.getSource().getText() + " " + spot_id);
                    that.getRouter().navTo("Loader", {
                        spotid: spot_id
                    });
                };

                // Create the menu items
                var oMenu11 = evt.getParameter("menu");
                oMenu11.addItem(
                    new MenuItem({
                        text: "Go To Model " + label_text,
                        select: handleSelect
                    })
                );

                evt.getSource().openContextMenu(oMenu11);

            }

        },
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }

    });
});