document.getElementById("exploreBtn").addEventListener("click", showApp);

function showApp() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("appContainer").style.display = "block";

  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Search",
    "esri/widgets/ScaleBar",
    "esri/widgets/CoordinateConversion",
    "esri/widgets/Home",
    "esri/widgets/Expand",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Locate",
    "esri/layers/FeatureLayer",
    "esri/widgets/FeatureTable",
    "esri/symbols/WebStyleSymbol"
  ], (
    Map, MapView, BasemapGallery, Search, ScaleBar, CoordinateConversion, Home, Expand,
    Legend, LayerList, Locate, FeatureLayer, FeatureTable,WebStyleSymbol
  ) => {

    const map = new Map({ basemap: "topo" });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [78.686, 10.796],
      zoom: 12
    });
    const schoolSymbol = new WebStyleSymbol({
    name: "School_POI-Large_3",
    styleUrl: "https://cdn.arcgis.com/sharing/rest/content/items/11e7b433c72a4cef90c8a428de131147/data"
    });
    const universitySymbol = new WebStyleSymbol({
      name: "University_POI-Large_3",
      styleUrl: "https://cdn.arcgis.com/sharing/rest/content/items/11e7b433c72a4cef90c8a428de131147/data"
    });
    const hotelSymbol = new WebStyleSymbol({
      name: "Hotel",
      styleUrl: "https://cdn.arcgis.com/sharing/rest/content/items/6eeef46c653b40c9bda04f9bed913b70/data"
    });
    const atmSymbol = new WebStyleSymbol({
  name: "Training",
  styleUrl: "https://cdn.arcgis.com/sharing/rest/content/items/806df898e9c04516a704a9f93e2a0a5e/data"
});
 const bankSymbol = new WebStyleSymbol({
  name: "Government Office",
  styleUrl: "https://cdn.arcgis.com/sharing/rest/content/items/806df898e9c04516a704a9f93e2a0a5e/data"
});
  const bankRenderer = {
  type: "unique-value",
  field: "fclass",
  uniqueValueInfos: [
    {
      value: "Bank",
      symbol: bankSymbol,  
      label: "Bank"
    },
    {
      value: "Atm",
      symbol: atmSymbol,  
      label: "ATM"
    }
      ]
    };
  const educationRenderer = {
  type: "unique-value",
  field: "fclass",
  uniqueValueInfos: [
    {
      value: "School",
      symbol: schoolSymbol,  
      label: "School"
    },
    {
      value: "University",
      symbol: universitySymbol,      
      label: "College"
    }
  ]
};
    const hotelRenderer = {
  type: "unique-value",
  field: "fclass",
  uniqueValueInfos: [
    {
      value: "Hotel",
      symbol: hotelSymbol,  
      label: "Hotel"
    } 
  ]
};
    const BankLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/JkqsQtq5tL21OFYa/arcgis/rest/services/Banks_in_Tiruchirapalli_Municipality/FeatureServer",
      outFields: ["*"],
      title: "Banks/ATM's",
      renderer: bankRenderer,
      popupTemplate: {
        title: "{name}",
        content: [{
          type: "fields",
          fieldInfos: [
            { fieldName: "name", label: "Bank Name" },
            { fieldName: "fclass", label: "Category" },
            { fieldName: "subdistric", label: "Taluk" }
          ]
        }]
      }
    });
    map.add(BankLayer);

 
    const BoundaryLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/JkqsQtq5tL21OFYa/arcgis/rest/services/Boundary_trichy/FeatureServer",
      title: "Trichy Boundary",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [0, 0, 0, 0],
          outline: { color: "black", width: 2 }
        }
      },
      popupTemplate: { title: "Trichy Boundary", content: "Administrative boundary of Trichy" }
    });
    map.add(BoundaryLayer);

    const EducationLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/JkqsQtq5tL21OFYa/arcgis/rest/services/Educations/FeatureServer",
      title: "Educational Instituitions",
      renderer: educationRenderer,
      popupTemplate: {
      title: "{name}",
        content: [{
          type: "fields",
          fieldInfos: [
            { fieldName: "name", label: "School/University Name" },
            
          ]
        }]
      }
    });

    map.add(EducationLayer);
    
    const HotelLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/JkqsQtq5tL21OFYa/arcgis/rest/services/Hotels/FeatureServer",
      title: "Hotels",
      renderer:hotelRenderer,
      popupTemplate: {
      title: "{name}",
        content: [{
          type: "fields",
          fieldInfos: [
            { fieldName: "name", label: "Hotel Name" },
            
          ]
        }]
      }
    });

    map.add(HotelLayer);

    const featureTable = new FeatureTable({
      view: view,
      layer: BankLayer,
      container: "featureTableDiv"
    });

    view.ui.add(new Search({ view }), { position: "top-right", index: 0 });
    view.ui.add(new ScaleBar({ view }), "bottom-right");
    view.ui.add(new CoordinateConversion({ view }), "bottom-left");
    view.ui.add(new Home({ view }), "top-left");
    view.ui.add(new Locate({ view }), "top-left");

    const basemapGallery = new BasemapGallery({ view });
    view.ui.add(new Expand({ view, content: basemapGallery, expandTooltip: "Basemap Gallery" }), "top-right");

    const legend = new Legend({ view });
    view.ui.add(new Expand({ view, content: legend, expandTooltip: "Legend" }), "top-right");

    const layerList = new LayerList({ view, listItemCreatedFunction: defineActions });
    view.ui.add(new Expand({ view, content: layerList, expandIconClass: "esri-icon-layerList", expandTooltip: "Layer List" }), "top-right");

    function defineActions(event) {
      const item = event.item;
      item.actionsSections = [[
        { title: "Zoom to", className: "esri-icon-zoom-out-fixed", id: "zoom-to" },
        { title: "Show Attribute Table", className: "esri-icon-table", id: "show-table" }
      ]];
    }

    layerList.on("trigger-action", (event) => {
      if (event.action.id === "zoom-to") view.goTo(event.item.layer.fullExtent);
      else if (event.action.id === "show-table") {
        featureTable.layer = event.item.layer;
        featureTable.container.style.display = "block";
      }
    });
  });
}
