  // ====== Create the Euclidean Projection for the flat map ======
  // == Constructor ==
      function EuclideanProjection(a){
        this.pixelsPerLonDegree=[];
        this.pixelsPerLonRadian=[];
        this.pixelOrigo=[];
        this.tileBounds=[];
        var b=256;
        var c=1;
        for(var d=0;d<a;d++){
          var e=b/2;
          this.pixelsPerLonDegree.push(b/360);
          this.pixelsPerLonRadian.push(b/(2*Math.PI));
          this.pixelOrigo.push(new GPoint(e,e));
          this.tileBounds.push(c);
          b*=2;
          c*=2
        }
      }
 
      // == Attach it to the GProjection() class ==
      EuclideanProjection.prototype=new GProjection();
 
 
      // == A method for converting latitudes and longitudes to pixel coordinates == 
  EuclideanProjection.prototype.fromLatLngToPixel=function(a,b){
    var c=Math.round(this.pixelOrigo[b].x+a.lng()*this.pixelsPerLonDegree[b]);
    var d=Math.round(this.pixelOrigo[b].y+(-2*a.lat())*this.pixelsPerLonDegree[b]);
    return new GPoint(c,d)
  };

  // == a method for converting pixel coordinates to latitudes and longitudes ==
  EuclideanProjection.prototype.fromPixelToLatLng=function(a,b,c){
    var d=(a.x-this.pixelOrigo[b].x)/this.pixelsPerLonDegree[b];
    var e=-0.5*(a.y-this.pixelOrigo[b].y)/this.pixelsPerLonDegree[b];
    return new GLatLng(e,d,c)
  };

  // == a method that checks if the y value is in range, and wraps the x value ==
  EuclideanProjection.prototype.tileCheckRange=function(a,b,c){
    var d=this.tileBounds[b];
    if (a.y<0 || a.y>=d || a.x<0 || a.x>=d)
    {
      return false;
    }
    return true
  }

  // == a method that returns the width of the tilespace ==      
  EuclideanProjection.prototype.getWrapWidth=function(zoom) {
    return this.tileBounds[zoom]*256;
  }
  
  
var gtasaIcons = {};
var markers = [];
var markersText = [];
var map = null;
var update_c = 1;

function fromCoords(x, y)
{
	return new GLatLng(((parseFloat(y)*90)/3000), ((parseFloat(x)*90)/1500));
}

function fetchData() {
	GDownloadUrl("/points.json", function(data)
	{
		data = data.evalJSON(true);
		data.each(
			function(data)
			{
				if (typeof data !== "undefined") {
					for (id in data) {
						var item = data[id];
						var point = fromCoords(item.x, item.y)
						markers[item.id] = {}
						var marker = createMapMarker(point, item.id, "item.text", parseInt(item.icon));
						markers[item.id].marker = marker;
						markers[item.id].id = item.id;
						markersText[item.id] = "<b>" + item.title + "</b> <br/>" + item.description;
						map.addOverlay(markers[item.id].marker);
					}
				}
			}
		);
	});
}

function load() {
	
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));

		var copyrights = new GCopyrightCollection('');
		var tilelayer = new GTileLayer(copyrights, 1, 4);
		
		tilelayer.getTileUrl = function(tile, zoom)
		{ 
			return 'images/map/'+tile.x+'x'+tile.y+'-'+(6-zoom)+".jpg";
		};
		
		var CUSTOM_MAP = new GMapType( [tilelayer], new EuclideanProjection(20), "Cake" );
		map.addMapType(CUSTOM_MAP);
		map.setMapType(CUSTOM_MAP);
		map.addControl(new GLargeMapControl());
		map.enableScrollWheelZoom();
		map.setCenter(fromCoords(2000, -1500), 3);
		fetchData();
	}
}

function createMapMarker(point, id, text, type)
{
	if (typeof gtasaIcons[type] === "undefined")
	{
		var icon = new GIcon(); 
		icon.image = 'images/icons/Icon_'+type+'.gif';
		icon.iconSize = new GSize(20, 20);
		icon.iconAnchor = new GPoint(10, 10);
		icon.infoWindowAnchor = new GPoint(1, 1);
		gtasaIcons[type] = icon;
	}

	var marker = new GMarker(point, gtasaIcons[type]);
	GEvent.addListener(marker, 'click', function()
		{
			marker.openInfoWindowHtml(markersText[id]);
		}
	);
	return marker;
}