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
    return this.tileBounds[zoom]*4096*4096; // originally 256, but this would easily wrap all icons
  }
  
  
var gtasaIcons = {};
var markers = [];
var markersText = [];
var map = null;

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
						markers[item.id] = {}
						markers[item.id].point = fromCoords(item.x, item.y);
						var marker = createMapMarker(markers[item.id].point, item.id, item.icon);
						markers[item.id].marker = marker;
						markers[item.id].id = item.id;
						markersText[item.id] = "<b>" + item.title + "</b>";
						if(item.description != null && item.description != "")
							markersText[item.id] += "<br/>" + item.description;
						if(item.link !== null && item.link != "")
							markersText[item.id] += "<br /><a href='" + item.link + "' target='_blank'>Visit Website</a>";
						map.addOverlay(markers[item.id].marker);
					}
				}
			}
		);
		
		if(window.location.hash !== null)
			hashChanged(window.location.hash, true);
	});
}

function load() {
	
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));

		var copyrights = new GCopyrightCollection('');
		var tilelayer = new GTileLayer(copyrights, 1, 5);
		
		tilelayer.getTileUrl = function(tile, zoom)
		{ 
			return 'images/map/'+tile.x+'x'+tile.y+'-'+zoom+".jpg";
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

function createMapMarker(point, id, type)
{
	if (typeof gtasaIcons[type] === "undefined")
	{
		var icon = new GIcon(); 
		icon.image = 'images/icons/'+type+'.png';
		icon.iconSize = new GSize(32, 37);
		icon.iconAnchor = new GPoint(16, 37);
		icon.infoWindowAnchor = new GPoint(16, 1);
		gtasaIcons[type] = icon;
	}

	var marker = new GMarker(point, gtasaIcons[type]);
	GEvent.addListener(marker, 'click', function()
		{
			marker.openInfoWindowHtml(markersText[id], {onCloseFn: function() { window.location.hash = ""; }});
			window.location.hash = "#" + id;
		}
	);
	return marker;
}

// ---

function hashChanged(hash, first)
{
	var i = parseInt(hash.substr(1));
	if(markers[i] !== null && typeof markers[i] != "undefined")
	{
		if(first == true)
		{
			map.setCenter(markers[i].point, 5);
		}
		GEvent.trigger(markers[i].marker, "click");
	}
}

if ("onhashchange" in window) { // event supported?
    window.onhashchange = function () {
        hashChanged(window.location.hash, false);
    }
}
else { // event not supported:
    var storedHash = window.location.hash;
    window.setInterval(function () {
        if (window.location.hash != storedHash) {
            storedHash = window.location.hash;
            hashChanged(storedHash, false);
        }
    }, 100);
}
