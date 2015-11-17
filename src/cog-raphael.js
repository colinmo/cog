var paper = '';
var cog=false;// Duplicating the PHP Cog code into Raphael.  I think.
var spokes=false;
document.getElementById('outercirclesize').onchange = adjustCog;
document.getElementById('innercirclesize').onchange = adjustCog;
document.getElementById('pitchcirclesize').onchange = adjustCog;
document.getElementById('numberofteeth').onchange = adjustCog;
document.getElementById('brushsize').onchange = adjustCog;
document.getElementById('outerfuzz').onchange = adjustCog;
document.getElementById('innerfuzz').onchange = adjustCog;
document.getElementById('pitchfuzz').onchange = adjustCog;
document.getElementById('linecolor').onchange = adjustCog;
document.getElementById('fillcolor').onchange = adjustCog;
document.getElementById('hollowsize').onchange = adjustCog;
document.getElementById('numberofspokes').onchange = adjustCog;
document.getElementById('widthofspokes').onchange = adjustCog;
document.getElementById('mooringwidth').onchange = adjustCog;
document.getElementById('holewidth').onchange = adjustCog;
  
function drawTheCircle(paper, outercirclesize, innercirclesize, pitchcirclesize, numberofteeth, brushsize, outerfuzz, innerfuzz, pitchfuzz, linecolor, fillcolor, hollowsize, numberofspokes, widthofspokes, mooringwidth, holewidth) {
  var linecolor = "#"+linecolor;
  var fillcolor = "#"+fillcolor;
  var outercircler    = outercirclesize / 2;
  var innercircler    = innercirclesize / 2;
  var pitchcircler    = pitchcirclesize / 2;
  var centre          = outercircler + 5;
  var innerlength     = 2 * innercircler * Math.PI;
  var outerlength     = 2 * outercircler * Math.PI;
  var pitchlength     = 2 * pitchcircler * Math.PI;
  var teethandspace   = numberofteeth * 2;
  var innerpoints     = 360 / teethandspace;
  var innerpointsr    = 2 * Math.PI / teethandspace;
  var rq              = Math.PI / 2;

  var outertoothdegree  = (innerlength/teethandspace)/(innerlength/360); // Degrees
  var outertoothdegreer = (innerlength/teethandspace)/(innerlength/(2*Math.PI)); // Radians
  var outertdhalf       = outertoothdegree/2;
  var outertdhalfr      = outertoothdegreer/2;

  var outergapsdegree   = (outerlength-innerlength)/numberofteeth/(innerlength/360);
  var outergapsdegreer  = (outerlength-innerlength)/numberofteeth/(innerlength/(2*Math.PI));
  var outergapshalf     = outergapsdegree;
  var outergapshalfr    = outergapsdegreer;

  var innercirclepoints = getNPointsOnCircle(centre, centre, innercircler, teethandspace, innerfuzz);
  var outercirclepoints = getNPointsOnCircle(centre, centre, outercircler, teethandspace, outerfuzz);
  var pitchcirclepoints = getNPointsOnCircle(centre, centre, pitchcircler, teethandspace, pitchfuzz);
  
  if (isNaN(mooringwidth)) {
    mooringwidth=0;
  } else {
    mooringwidth/=2; // radius!
  }
  if (isNaN(holewidth)) {
    holewidth=0;
  } else {
    holewidth=holewidth/2; // radius!
  }
  if (isNaN(numberofspokes)) {
    numberofspokes=0;
  }
  if (isNaN(widthofspokes)) {
    widthofspokes=0;
  }
  // Decoration: hollow prep
  if (hollowsize > 0) 
    hollowRadius = innercircler-hollowsize;
  else
    hollowRadius = innercircler;
  //-- End setup --//

  var toDraw = "";
  // Decoration: spokes
  // Draw a vertical spoke first, then rotate
  halfwidthofspokes = widthofspokes/2;
  spokeLines="";
  leftX = centre-halfwidthofspokes;
  bottomY = centre-holewidth-(mooringwidth-holewidth)/2
  rightX = centre+halfwidthofspokes;
  topY = centre-hollowRadius;
  points = rotateASpoke(centre,centre,leftX,bottomY,rightX,topY,numberofspokes);
  for (i=0;i<numberofspokes;i++) {
    point = points[i];
    spokeLines += "M"+point.bleftX+","+point.lbottomY+" L"+point.tleftX+","+point.ltopY+" A"+hollowRadius+","+hollowRadius+" 0 0,1 "+point.trightX+","+point.rtopY+"  L"+point.brightX+","+point.rbottomY+" A"+mooringwidth+","+mooringwidth+" 0 0,0 "+point.bleftX+","+point.lbottomY+" "; 
  }
  // debug - draws one
  //spokeLines+= "M"+leftX+","+bottomY+" L"+leftX+","+topY+" A"+hollowRadius+","+hollowRadius+" 0 0,1 "+rightX+","+topY+"  L"+rightX+","+bottomY+" A"+mooringwidth+","+mooringwidth+" 0 0,0 "+leftX+","+bottomY+" ";
  
  toDraw+=spokeLines;
  toDraw+="z";
  spokes = paper.path(toDraw).attr({stroke: linecolor, 'stroke-width': brushsize, 'fill': fillcolor, 'rotation':0,'fill-rule':'evenodd'});

  // End spikes
  
  toDraw = "";
  // i is degrees, j is radians
  toDraw += "M"+innercirclepoints[teethandspace-1].x+","+innercirclepoints[teethandspace-1].y;
  for (i=0;i<teethandspace;i++) {
    toDraw += "A"+innercircler+","+innercircler+" 0 0,1 "+innercirclepoints[i].x+","+innercirclepoints[i].y;
    toDraw += "L"+pitchcirclepoints[i].x+","+pitchcirclepoints[i].y;
    toDraw += "L"+outercirclepoints[i].x+","+outercirclepoints[i].y;
    toDraw += "A"+outercircler+","+outercircler+" 0 0,1 "+outercirclepoints[++i].x+","+outercirclepoints[i].y;
    toDraw += "L"+pitchcirclepoints[i].x+","+pitchcirclepoints[i].y;
    toDraw += "L"+innercirclepoints[i].x+","+innercirclepoints[i].y;
  }
  //Decoration: hollow
  if (hollowsize > 0) {   emptyCentre="M"+(centre+hollowRadius)+","+centre+"A"+hollowRadius+","+hollowRadius+" 0 1,1 "+(centre+hollowRadius)+","+(centre-1)+" ";
      toDraw+=emptyCentre;
  } 

  //Decoration: mooring circle
  mooringCircle = "";
  if (mooringwidth > 0) {
   mooringCircle="M"+(centre+mooringwidth)+","+centre+"A"+mooringwidth+","+mooringwidth+" 0 1,1 "+(centre+mooringwidth)+","+(centre-1);
  }
  if (holewidth > 0) {
    mooringCircle += " M"+(centre+holewidth)+","+centre+"A"+holewidth+","+holewidth+" 0 1,1 "+(centre+holewidth)+","+(centre-1)+" ";
  } else if (mooringCircle > 0) {
    mooringCircle+=" M"+(centre+mooringwidth)+","+centre+"A"+mooringwidth+","+mooringwidth+" 0 1,1 "+(centre+mooringwidth)+","+(centre-1)+" ";
  }
  toDraw+=mooringCircle;
  
  // end Hollow
  toDraw+="z";
  cog = paper.path(toDraw).attr({stroke: linecolor, 'stroke-width': brushsize, 'fill': fillcolor, 'rotation':0,'fill-rule':'evenodd'});
  $(cog.node).css('fill-rule','evenodd');
  cog.node.onclick = function() {
    cog.animate({rotation: 360},6000,"backOut");
  }
}

function makeNewCogs() {
   allCogs = $("#makenew").val().split(',');
   var newnumberofteeth = parseInt(allCogs[0],10);
   newCog = calculateNewCircle(outercirclesize,
      innercirclesize,
      pitchcirclesize,
      numberofteeth,
      newnumberofteeth,
      brushsize,
      outerfuzz,
      innerfuzz,
      pitchfuzz);

   drawTheCircle(Raphael(600,20,newCog.outer,newCog.outer),
      newCog.outer,
      newCog.inner,
      newCog.pitch,
      newnumberofteeth,
      brushsize,
      newCog.outerFuzz, 
      newCog.innerFuzz, 
      newCog.pitchFuzz,
      linecolor,
      fillcolor
      );     
}

function getNPointsOnCircle(x,y,radius,number,fuzz) {
  if (typeof(fuzz)=='undefined') fuzz = 0; else fuzz *= -1;
  var alpha = Math.PI * 2 / number;
  var points = new Array();
  
  var i=-1;
  while (++i < number) {
    var theta = alpha * i + (fuzz*=-1);
    points.push({x:Math.cos(theta)*radius+x, y:Math.sin(theta)*radius+y});
  }
  return points;
}

function rotateASpoke(centerx,centery,leftx,bottomy,rightx,topy,times) {
  var points = new Array();
  var angle = Math.PI * 2 / times; 
  //move the spoke to straddle x=0
  leftx-=centerx;
  bottomy-=centery;
  rightx-=centerx;
  topy-=centery;
  blAngle = Math.atan2(bottomy,leftx);
  trAngle = Math.atan2(topy,rightx);
  blAngle2 = blAngle;
  trAngle2 = trAngle;
  
  bleftx = leftx;
  tleftx = leftx;
  lbottomy = bottomy;
  rbottomy = bottomy;
  brightx = rightx;
  trightx = rightx;
  ltopy = topy;
  rtopy = topy;
  
  //rotate around x
  for (i=0;i<times;i++,blAngle2+=angle,trAngle2+=angle) {
    points.push({
    bleftX:parseFloat(leftx*Math.cos(blAngle2-blAngle)-bottomy*Math.sin(blAngle2-blAngle),10)+centerx,
    tleftX:parseFloat(leftx*Math.cos(blAngle2-blAngle)-topy*Math.sin(trAngle2-trAngle),10)+centerx,
    lbottomY:parseFloat(leftx*Math.sin(blAngle2-blAngle)+bottomy*Math.cos(blAngle2-blAngle),10)+centery,
    rbottomY:parseFloat(rightx*Math.sin(trAngle2-trAngle)+bottomy*Math.cos(blAngle2-blAngle),10)+centery,
    trightX:parseFloat(rightx*Math.cos(trAngle2-trAngle)-topy*Math.sin(trAngle2-trAngle),10)+centerx,
    brightX:parseFloat(rightx*Math.cos(trAngle2-trAngle)-bottomy*Math.sin(blAngle2-blAngle),10)+centerx,
    rtopY:parseFloat(rightx*Math.sin(trAngle2-trAngle)+topy*Math.cos(trAngle2-trAngle),10)+centery,
    ltopY:parseFloat(leftx*Math.sin(blAngle2-blAngle)+topy*Math.cos(trAngle2-trAngle),10)+centery
    });
    //a = Raphael.getColor()
    //paper.circle(points[i].bleftX,points[i].lbottomY,4).attr({stroke: a});
    //paper.circle(points[i].tleftX,points[i].ltopY,4).attr({stroke: a});
    //paper.circle(points[i].trightX,points[i].rtopY,4).attr({stroke: a});
    //paper.circle(points[i].brightX,points[i].rbottomY,4).attr({stroke: a});
  }
  return points;
}

function calculateNewCircle(outer, inner, pitch, oldteeth, newteeth, brushsize, outerFuzz, innerFuzz, pitchFuzz) 
{
  // Determine the ratio
  ratio = 1 / oldteeth * newteeth;
  odiff = outer - inner;
  pdiff = pitch - inner;
  inner *= ratio;
  outer = inner + odiff;
  pitch = inner + pdiff;
  outerFuzz /= ratio;
  innerFuzz /= ratio;
  pitchFuzz /= ratio;
  return {
     "outer": outer,
     "inner": inner,
     "pitch": pitch,
     "outerFuzz": outerFuzz,
     "innerFuzz": innerFuzz,
     "pitchFuzz": pitchFuzz
  }
}

function adjustCog() {
   spokes.remove();
   cog.remove(); 
   document.getElementById('savelink').href="index.php?outercirclesize="+parseInt(document.getElementById('outercirclesize').value,10)+
   "&innercirclesize="+parseInt(document.getElementById('innercirclesize').value,10)+
   "&pitchcirclesize="+parseInt(document.getElementById('pitchcirclesize').value,10)+
   "&numberofteeth="+parseInt(document.getElementById('numberofteeth').value,10)+
   "&brushsize="+parseInt(document.getElementById('brushsize').value,10)+
   "&outerfuzz="+parseFloat(document.getElementById('outerfuzz').value,10)+
   "&innerfuzz="+parseFloat(document.getElementById('innerfuzz').value,10)+
   "&pitchfuzz="+parseFloat(document.getElementById('pitchfuzz').value,10)+
   "&linecolor="+document.getElementById('linecolor').value+
   "&fillcolor="+document.getElementById('fillcolor').value+
   "&hollowsize="+document.getElementById('hollowsize').value+
   "&numberofspokes="+document.getElementById('numberofspokes').value+
   "&widthofspokes="+document.getElementById('widthofspokes').value+
   "&mooringwidth="+document.getElementById('mooringwidth').value+
   "&holewidth="+document.getElementById('holewidth').value;
   drawTheCircle(
      paper
     ,parseInt(document.getElementById('outercirclesize').value,10)
     ,parseInt(document.getElementById('innercirclesize').value,10)
     ,parseInt(document.getElementById('pitchcirclesize').value,10)
     ,parseInt(document.getElementById('numberofteeth').value,10)
     ,parseInt(document.getElementById('brushsize').value,10)
     ,parseFloat(document.getElementById('outerfuzz').value,10)
     ,parseFloat(document.getElementById('innerfuzz').value,10)
     ,parseFloat(document.getElementById('pitchfuzz').value,10)
     ,document.getElementById('linecolor').value
     ,document.getElementById('fillcolor').value
     ,parseFloat(document.getElementById('hollowsize').value,10)
     ,parseFloat(document.getElementById('numberofspokes').value,10)
     ,parseFloat(document.getElementById('widthofspokes').value,10)
     ,parseFloat(document.getElementById('mooringwidth').value,10)
     ,parseFloat(document.getElementById('holewidth').value,10)
   );
   return false;
}


$('#bSave').click(function() {
   $('#svg').val($('#gauge').html()); 
   $('form').submit();
});

$(document).ready(function() {
    paper = Raphael("gauge", 420, 420);
    jscolor_init();
    drawTheCircle(paper, outercirclesize, innercirclesize, pitchcirclesize, numberofteeth, brushsize, outerfuzz, innerfuzz, pitchfuzz, linecolor, fillcolor, hollowsize, numberofspokes, widthofspokes, mooringwidth, holewidth);
});
