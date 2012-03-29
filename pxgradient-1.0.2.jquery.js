/**
 * @author Sergey Nikitin (mrnix@ya.ru)
 * @link www.mrnix.ru
 * @version 1.0.2
 * @date 30.03.2012
 * @requires jQuery
 *
 * Description:
 * pxgradient is a jQuery plugin that paints text in gradient colors by pixel
 * 
 * Usage:
 * $(selector).pxgradient(options);
 * 
 * options is an object contents configuraton paramenters:
 * {Number} step - Step Color. The smaller the number, the greater the load. Default: 10
 * {Array}  colors - array of hex colors. Default: ["#ffcc00", "#cc0000", "#000000"];
 * {String} dir - gradient direction. "x" - horizontal,  "y" - vertical
 */
(function($){

  $('head').append('<style type="text/css">.sn-pxg .pxg-set{user-select:none;-moz-user-select:none;-webkit-user-select:none;}.sn-pxg span.pxg-source{position:relative;display:inline-block;z-index:2;}.sn-pxg U.pxg-set,.sn-pxg U.pxg-set S,.sn-pxg U.pxg-set S B{left:0;right:0;top:0;bottom:0;height:inherit;width:inherit;position:absolute;display:inline-block;text-decoration:none;font-weight:inherit;}.sn-pxg U.pxg-set S{overflow:hidden;}.sn-pxg U.pxg-set{text-decoration:none;z-index:1;display:inline-block;position:relative;}</style>')

  $.fn.pxgradient=function(options){
    
    var options = $.extend({
      step: 10,
      colors: ["#ffcc00","#cc0000","#000000"],
      dir: "y"
    }, options);

    options.RGBcolors = [];

    for(var i=0;i<options.colors.length;i++){
      options.RGBcolors[i] = hex2Rgb(options.colors[i]);
    }

    return this.each(function(i,e){

      var pxg = $(e);

      if(!pxg.hasClass("sn-pxg")) {

        var pxg_source = pxg.html();
        pxg
          .html('<span class="pxg-source" style="visibility: hidden;">'+pxg_source+'</span>')
          .append('<u class="pxg-set"></u>');

        
        var pxg_set = pxg.find(".pxg-set");
        var pxg_text = pxg.find(".pxg-source");
        var pxg_w = pxg_text.innerWidth();
        var pxg_h = pxg_text.innerHeight();

        pxg_text.hide();
        pxg.addClass("sn-pxg");

        if ( options.dir == "x" ) { var blocksize = pxg_w; }
        else if ( options.dir =="y" ) { var blocksize = pxg_h; }

        var fullsteps = Math.floor( blocksize/options.step );
        var allsteps  = fullsteps;
        var laststep  = ( blocksize-( fullsteps * options.step) );
        
        if( laststep>0 ) { allsteps++; }

        pxg_set.css({ width: pxg_w, height: pxg_h });

        var offleft = 0;
        var pxg_set_html = '';

        if(options.dir == "x"){
          for(var i=0; i<allsteps; i++){
            var color = getColor ( offleft, blocksize );
            pxg_set_html += '<s style="height:'+pxg_h+'px;width:'+options.step+'px;left:'+offleft+'px;color:'+color+'"><b style="left:-'+offleft+'px;width:'+pxg_w+'px;height:'+pxg_h+'px;">'+pxg_source+'</b></s>';
            offleft = offleft + options.step;
          }
        }
        
        else if(options.dir=="y"){
          for(var i=0; i<allsteps; i++){
            var color=getColor(offleft,blocksize);
            pxg_set_html += '<s style="width:'+pxg_w+'px;height:'+options.step+'px;top:'+offleft+'px;color:'+color+'"><b style="top:-'+offleft+'px;height:'+pxg_w+'px;height:'+pxg_h+'px;">'+pxg_source+'</b></s>';
            offleft = offleft + options.step;
          }
        }

        pxg_set.append(pxg_set_html);
      }
    });

    function hex2Rgb(hex){
      if('#'==hex.substr(0,1)){
        hex=hex.substr(1);
      }
      if (3==hex.length){
        hex=hex.substr(0,1)+hex.substr(0,1)+hex.substr(1,1)+hex.substr(1,1)+hex.substr(2,1)+hex.substr(2,1);
      }
      return [parseInt(hex.substr(0,2),16),parseInt(hex.substr(2,2),16),parseInt(hex.substr(4,2),16)];
    }

    function rgb2Hex(rgb){
      var s = '0123456789abcdef';
      return '#'+s.charAt(parseInt(rgb[0]/16))+s.charAt(rgb[0]%16)+s.charAt(parseInt(rgb[1]/16))+s.charAt(rgb[1]%16)+s.charAt(parseInt(rgb[2]/16))+s.charAt(rgb[2]%16);
    }

    function getColor(off,blocksize){
      var fLeft=(off>0)?(off/blocksize):0;
      for (var i=0;i<options.colors.length;i++){
        fStopPosition=(i/(options.colors.length-1));
        fLastPosition=(i>0)?((i-1)/(options.colors.length-1)):0;
        if(fLeft==fStopPosition){
          return options.colors[i];
        }
        else if(fLeft<fStopPosition){
          fCurrentStop=(fLeft-fLastPosition)/(fStopPosition-fLastPosition);
          return getMidColor(options.RGBcolors[i-1],options.RGBcolors[i],fCurrentStop);
        }
      }
      return options.colors[options.colors.length-1];
    }
    
    function getMidColor(aStart,aEnd,fMidStop){
      var aRGBColor=[];
      for (var i=0;i<3;i++){
        aRGBColor[i]=aStart[i]+Math.round((aEnd[i]-aStart[i])*fMidStop)
      }
      return rgb2Hex(aRGBColor)
    }
  }

})(jQuery);