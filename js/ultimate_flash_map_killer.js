//Displaying tooltips
var tooltip=function(){
	var id = 'tt';
	var top = 3;
	var left = 3;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h;
	var ie = document.all ? true : false;
	return{
		show:function(v,w){
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				t = document.createElement('div');
				t.setAttribute('id',id + 'top');
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				b = document.createElement('div');
				b.setAttribute('id',id + 'bot');
				tt.appendChild(t);
				tt.appendChild(c);
				tt.appendChild(b);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.pos;
			}
			tt.style.display = 'block';
			c.innerHTML = v;
			tt.style.width = w ? w + 'px' : 'auto';
			if(!w && ie){
				t.style.display = 'none';
				b.style.display = 'none';
				tt.style.width = tt.offsetWidth;
				t.style.display = 'block';
				b.style.display = 'block';
			}
			if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
			h = parseInt(tt.offsetHeight) + top;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		pos:function(e){
			var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			tt.style.top = (u - h) + 'px';
			tt.style.left = (l + left) + 'px';
		},
		fade:function(d){
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
   for(var i=0; i<this.length; i++){
    if(this[i]==obj){
     return i;
    }
   }
   return -1;
  }
}
// Polygon 
function Polygon(){}
Polygon.prototype.Africa= "2";
Polygon.prototype.Australia= "9";
Polygon.prototype.SouthAmerica= "209";
Polygon.prototype.NorthAmerica= "19";
Polygon.prototype.Asia= "142";
Polygon.prototype.Europe= "150";
Polygon.prototype.createPolygon = function (map,options)
{   
    
    if(map==undefined || options==undefined){return;}
    var fieldName;
    var arrParameter;
    var TagName;
    var urlXml;
    if (options.continent!= undefined && options.continent.length>0)
                    {
                        fieldName="REGION";
                        arrParameter=options.continent;
                        TagName="country";
                        urlXml='lib/polregi.lib';
                    }
                else if (options.country!= undefined && options.country.length>0)
                    {
                        fieldName="NAME";
                        arrParameter=options.country;
                        TagName="country";
                        urlXml='lib/polregi.lib';
                    }
                else if (options.state!= undefined && options.state.length>0)
                    {
                        fieldName="name";
                        arrParameter=options.state;
                        TagName="state";
                        urlXml='lib/polstat.lib';
                    }
                   
    $.ajax({url: urlXml,
         type: 'GET',
         dataType: "xml",
         success: function (xml){ 
             var PolyRawData="";
             $(xml).find(TagName).each(function(){
                 if (TagName=="country")
                        {
                         if(arrParameter.indexOf($(this).find(fieldName).text())>-1)
                            {
                             PolyRawData=PolyRawData+ $(this).find('GEOM').text()+"~~~";
                            }
                        }
                else
                        {
                            if(arrParameter.indexOf($(this).attr(fieldName))>-1)
                            {
                                $(this).find('point').each(function(){
                                        PolyRawData+=$(this).attr('lat')+" "+$(this).attr('lng')+",";
                                    });
                                    PolyRawData=PolyRawData.substring(0,PolyRawData.length-1);
                                    PolyRawData+="~~~";
                            }
                        }
		});    
              
         var xmlArray=PolyRawData.split("~~~",PolyRawData.length);
         
         $.each(xmlArray, function(index, value) { 
                    var str=value;
                    var totalPaths=[];
                    var sFrom;
                    var sTo;
                    var strSplit;
                    var tmpSplit;
           if (TagName=="country"){                    
                    if(str.search(/MULTIPOLYGON/i)==0)
                    {
                        str=str.substring(14, str.length-1);
                    }
                    else if(str.search(/POLYGON/i)==0)
                    {
                        str=str.substring(8,str.length);
                    }
           
                    var sFind = str.indexOf("((");
                    while(sFind > -1) 
                        {
                            sFrom=sFind+2;
                            sFind = str.indexOf("((", sFind+1);
                            if (sFind <0)
                            {
                                sTo=str.length-2;
                            }
                            else
                            {
                                sTo=sFind-4;
                            }
                            strSplit =str.substring(sFrom,sTo);
                            
                            strSplit=strSplit.split(",",strSplit.length);
                            var paths=[];
                            for (var aa=0; aa<strSplit.length;aa++)
                            {
                                tmpSplit=strSplit[aa].replace(/^\s+|\s+$/g,"");//strSplit[aa].trim();
                                tmpSplit=tmpSplit.split(" ");
                                paths.push(new google.maps.LatLng(tmpSplit[1],tmpSplit[0]));                                         
                            }
                            totalPaths.push(paths);  
                        }
           }
           else
           {
               str=str.split(",",str.length);
                            var paths=[];
                            for (var aa=0; aa<str.length;aa++)
                            {
                                tmpSplit=str[aa].replace(/^\s+|\s+$/g,"");//strSplit[aa].trim();
                                tmpSplit=tmpSplit.split(" ");
                                paths.push(new google.maps.LatLng(tmpSplit[0],tmpSplit[1]));                                         
                            }
                            totalPaths.push(paths);  
           }
   
                    var poly = new google.maps.Polygon(options);
                    poly.setOptions({paths:totalPaths});
                    poly.setMap(map);
                    
                    if (options.onClickType!=undefined)
                    {
                        if (options.onClickType==1)
                        {
                            google.maps.event.addListener(poly,"click",function(){
                            window.open(options.onClickValue.url);
                           
							}); 
                        }
                        else if (options.onClickType==2)
                        {
                            
                           var infowindow = new google.maps.InfoWindow(); 
                            infowindow.setContent(options.onClickValue.popup); 
                            google.maps.event.addListener(poly,"click",function(event){
                                
                                  
                            infowindow.setPosition(event.latLng); 
                            infowindow.open(map); 
                            });
                        }
                        else if (options.onClickType==3)
                        {
                            google.maps.event.addListener(poly,"click",options.onClickValue.callback);
                        }
                    }
                            
                    google.maps.event.addListener(poly,"mouseover",function(event){
                        poly.setOptions({fillColor:options.hoverFillColor,strokeColor:options.hoverStrokeColor,fillOpacity:options.hoverFillOpacity,strokeOpacity:options.hoverStrokeOpacity,strokeWeight:options.hoverStrokeWeight});
                        
                        if (options.toolTip===true)
                            {
                            tooltip.show(options.toolTipText);
                            }
                    }); 

                    google.maps.event.addListener(poly,"mouseout",function(){
                        poly.setOptions({fillColor:options.fillColor,strokeColor:options.strokeColor,fillOpacity:options.fillOpacity,strokeOpacity:options.strokeOpacity,strokeWeight:options.strokeWeight});
                        if (options.toolTip===true)
                            {
                            tooltip.hide();
                            }
                        
                    });
                
            });
            
    }
    });               
   
}





//////////////////////Displaying Land Marks from XML////////////////////////
function LandMark(map)
{
    LandMark.prototype.mapObject=map;
}
LandMark.prototype.mapObject=null;

LandMark.prototype.loadLandMarks = function()
{
    var marker;
        var infoWindow = new google.maps.InfoWindow;
    
     $.ajax({
    type: "GET",
    cache: false,
    url: "lib/LandMarks.xml",
    dataType: "xml",
    success: function(output) {
            
                    $(output).find("LandMark").each(function()
                    {
                        
                           var point = new google.maps.LatLng(parseFloat($(this).attr("Lat")),parseFloat($(this).attr("Lng")));
                           var dataPopup =$(this).attr("Description");
                            if ($(this).attr("LandMarkType")=="TIME")
                            {
                                marker = new CustomMarker(point, LandMark.prototype.mapObject,parseFloat($(this).attr("Offset")),$(this).attr("Description"));
                            }
                            else if ($(this).attr("LandMarkType")=="ICON")
                             {
                            var image = new google.maps.MarkerImage($(this).attr("ImageUrl"));
                            marker = new google.maps.Marker({
                                map: LandMark.prototype.mapObject,
                                position: point,
                                icon: image,
                                title:""
                            });
                             }                            
                            bindInfoWindow(marker, LandMark.prototype.mapObject, infoWindow, dataPopup);
               
                    });
                      


                  }
    });
}
function bindInfoWindow(marker, map, infoWindow, html) {

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);  
  });

}

///////////////////*************Custom Marker***********////////////////////////


function CustomMarker(latlng,  map, offset,CountryName) {
    this.latlng_ = latlng;
    this.offset_ = offset;
    this.countryname_ = CountryName;
    
    this.setMap(map);
  }

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.draw = function() {
    var me = this;

    
    
    var div = this.div_;
    if (!div) {
      // Create a overlay text DIV
      div = this.div_ = document.createElement('DIV');
      // Create the DIV representing our CustomMarker
      div.className = 'divCustomMarker';
      div.innerHTML=this.countryname_;
           var options = {//%A, %d %B 
            format:'<span class=\"dt\">%I:%M:%S %P</span>',
            timeNotation: '12h',
            am_pm: true,
            fontFamily: 'Verdana, Times New Roman',
            fontSize: '11px',
            foreground: 'white',
            background: '#000',
            utc:true,
            utc_offset: this.offset_
          }
          var  divTime =  document.createElement('DIV');
            divTime.className = 'divCustomMarkerTime';
         $(divTime).timezone(options);
	 $(div).append(divTime);   
      
      google.maps.event.addDomListener(div, "click", function(event) {
        google.maps.event.trigger(me, "click");
      });

      // Then add the overlay to the DOM
      var panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }

    // Position the overlay 
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
      div.style.left = point.x + 'px';
      div.style.top = point.y + 'px';
    }
  };

  CustomMarker.prototype.remove = function() {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };

  CustomMarker.prototype.getPosition = function() {
   return this.latlng_;
  };


//Displaying Local Time as Land Mark
(function($) {
 
  $.fn.timezone = function(options) {
    // options
    var opts = $.extend({}, $.fn.timezone.defaults, options);
         
    return this.each(function() {
      $this = $(this);
      $this.timerID = null;
      $this.running = false;
 

      $this.increment = 0;
      $this.lastCalled = new Date().getTime();
 
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
 
      $this.format = o.format;
      $this.utc = o.utc;

      $this.utcOffset = (o.utc_offset != null) ? o.utc_offset : o.utcOffset;
      $this.seedTime = o.seedTime;
      $this.timeout = o.timeout;
 
      $this.css({
        fontFamily: o.fontFamily,
        fontSize: o.fontSize,
        backgroundColor: o.background,
        color: o.foreground
      });
 
      // %a
      $this.daysAbbrvNames = new Array(7);
      $this.daysAbbrvNames[0] = "Sun";
      $this.daysAbbrvNames[1] = "Mon";
      $this.daysAbbrvNames[2] = "Tue";
      $this.daysAbbrvNames[3] = "Wed";
      $this.daysAbbrvNames[4] = "Thu";
      $this.daysAbbrvNames[5] = "Fri";
      $this.daysAbbrvNames[6] = "Sat";
 
      // %A
      $this.daysFullNames = new Array(7);
      $this.daysFullNames[0] = "Sunday";
      $this.daysFullNames[1] = "Monday";
      $this.daysFullNames[2] = "Tuesday";
      $this.daysFullNames[3] = "Wednesday";
      $this.daysFullNames[4] = "Thursday";
      $this.daysFullNames[5] = "Friday";
      $this.daysFullNames[6] = "Saturday";
 
      // %b
      $this.monthsAbbrvNames = new Array(12);
      $this.monthsAbbrvNames[0] = "Jan";
      $this.monthsAbbrvNames[1] = "Feb";
      $this.monthsAbbrvNames[2] = "Mar";
      $this.monthsAbbrvNames[3] = "Apr";
      $this.monthsAbbrvNames[4] = "May";
      $this.monthsAbbrvNames[5] = "Jun";
      $this.monthsAbbrvNames[6] = "Jul";
      $this.monthsAbbrvNames[7] = "Aug";
      $this.monthsAbbrvNames[8] = "Sep";
      $this.monthsAbbrvNames[9] = "Oct";
      $this.monthsAbbrvNames[10] = "Nov";
      $this.monthsAbbrvNames[11] = "Dec";
 
      // %B
      $this.monthsFullNames = new Array(12);
      $this.monthsFullNames[0] = "January";
      $this.monthsFullNames[1] = "February";
      $this.monthsFullNames[2] = "March";
      $this.monthsFullNames[3] = "April";
      $this.monthsFullNames[4] = "May";
      $this.monthsFullNames[5] = "June";
      $this.monthsFullNames[6] = "July";
      $this.monthsFullNames[7] = "August";
      $this.monthsFullNames[8] = "September";
      $this.monthsFullNames[9] = "October";
      $this.monthsFullNames[10] = "November";
      $this.monthsFullNames[11] = "December";
 
      $.fn.timezone.startClock($this);
 
    });
  };
       
  $.fn.timezone.startClock = function(el) {
    $.fn.timezone.stopClock(el);
    $.fn.timezone.displayTime(el);
  }
 
  $.fn.timezone.stopClock = function(el) {
    if(el.running) {
      clearTimeout(el.timerID);
    }
    el.running = false;
  }
 
  $.fn.timezone.displayTime = function(el) {
    var time = $.fn.timezone.getTime(el);
    el.html(time);
    el.timerID = setTimeout(function(){$.fn.timezone.displayTime(el)},el.timeout);
  }
 
  $.fn.timezone.getTime = function(el) {
    if(typeof(el.seedTime) == 'undefined') {

      var now = new Date();
    } else {

      el.increment += new Date().getTime() - el.lastCalled;
      var now = new Date(el.seedTime + el.increment);
      el.lastCalled = new Date().getTime();
    }
 
    if(el.utc == true) {
      var localTime = now.getTime();
      var localOffset = now.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var utcTime = utc + (3600000 * el.utcOffset);
      now = new Date(utcTime);
    }
 
    var timeNow = "";
    var i = 0;
    var index = 0;
    while ((index = el.format.indexOf("%", i)) != -1) {
      timeNow += el.format.substring(i, index);
      index++;     
      var property = $.fn.timezone.getProperty(now, el, el.format.charAt(index));
      index++;
      
      timeNow += property;
      i = index
    }
 
    timeNow += el.format.substring(i);
    return timeNow;
  };
 
  $.fn.timezone.getProperty = function(dateObject, el, property) {
 
    switch (property) {
      case "a": // abbrv day names
          return (el.daysAbbrvNames[dateObject.getDay()]);
      case "A": // full day names
          return (el.daysFullNames[dateObject.getDay()]);
      case "b": // abbrv month names
          return (el.monthsAbbrvNames[dateObject.getMonth()]);
      case "B": // full month names
          return (el.monthsFullNames[dateObject.getMonth()]);
      case "d": // day 01-31
          return ((dateObject.getDate() < 10) ? "0" : "") + dateObject.getDate();
      case "H": // hour as a decimal number using a 24-hour clock (range 00 to 23)
          return ((dateObject.getHours() < 10) ? "0" : "") + dateObject.getHours();
      case "I": // hour as a decimal number using a 12-hour clock (range 01 to 12)
          var hours = (dateObject.getHours() % 12 || 12);
          return ((hours < 10) ? "0" : "") + hours;
      case "m": // month number
          return ((dateObject.getMonth() < 10) ? "0" : "") + (dateObject.getMonth() + 1);
      case "M": // minute as a decimal number
          return ((dateObject.getMinutes() < 10) ? "0" : "") + dateObject.getMinutes();
      case "p": // either `am' or `pm' according to the given time value,
          // or the corresponding strings for the current locale
          return (dateObject.getHours() < 12 ? "am" : "pm");
      case "P": // either `AM' or `PM' according to the given time value,
          return (dateObject.getHours() < 12 ? "AM" : "PM");
      case "S": // second as a decimal number
          return ((dateObject.getSeconds() < 10) ? "0" : "") + dateObject.getSeconds();
      case "y": // two-digit year
          return dateObject.getFullYear().toString().substring(2);
      case "Y": // full year
          return (dateObject.getFullYear());
      case "%":
          return "%";
    }
 
  }
       
  $.fn.timezone.defaults = {
    format: '%H:%M:%S',
    utcOffset: 0,
    utc: false,
    fontFamily: '',
    fontSize: '',
    foreground: '',
    background: '',
    seedTime: undefined,
    timeout: 1000 // 1000 = one second, 60000 = one minute
  };
 
})(jQuery);
