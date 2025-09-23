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
    "esri/widgets/FeatureTable"
  ], (
    Map, MapView, BasemapGallery, Search, ScaleBar, CoordinateConversion, Home, Expand,
    Legend, LayerList, Locate, FeatureLayer, FeatureTable
  ) => {

    const map = new Map({ basemap: "topo" });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [78.686, 10.796],
      zoom: 12
    });

    const bankRenderer = {
      type: "unique-value",
      field: "fclass",
      defaultSymbol: { type: "simple-marker", color: "black", size: "14px", outline: { color: "white", width: 1 } },
      uniqueValueInfos: [
        { value: "Bank", symbol: { type: "simple-marker", color: "red", size: "14px" }, label: "Bank" },
        { value: "Atm", symbol: { type: "simple-marker", color: "blue", size: "14px" }, label: "ATM" }
        
      ]
    };
    const educationRenderer = {
      type: "unique-value",
      field: "fclass",
      defaultSymbol: { type: "simple-marker", color: "yellow", style: "diamond", size: "14px", outline: { color: "white", width: 1 } },
      uniqueValueInfos: [
        { value: "School", symbol: { type: "simple-marker", style: "diamond",color: "Green", size: "14px" }, label: "School" },
        { value: "University", symbol: { type: "simple-marker", style: "diamond", color: "orange", size: "14px" }, label: "University" }
        
      ]
    };
    
    const BankLayer = new FeatureLayer({
      url: "https://services6.arcgis.com/JkqsQtq5tL21OFYa/arcgis/rest/services/Banks_in_Tiruchirapalli_Municipality/FeatureServer",
      outFields: ["*"],
      title: "Banks/ATM's in Trichy Municipality",
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
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
         style: "triangle",
         color: "purple", 
         size: "14px"
        }
      },
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
