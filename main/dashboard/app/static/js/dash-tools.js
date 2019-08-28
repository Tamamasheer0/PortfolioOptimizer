console.log("<Tools> SideNav Interactive Functionality Loaded... Successful")

/*  Dashboard - JavaScript Functions
    Created On: 08/17/2019          Last Modified: 08/24/2019

    Module Support Items:
    1. Side NavBar - User Portfolio Selection

*/

/*############################################################################
                  SideNav - User Porfolio Selection
############################################################################*/

// Create a 'Close' Button and Append it to Each List Item
var myNodelist = document.getElementsByTagName("li");
var i;
for (i = 0; i < myNodelist; i++){
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span)
}

// Close Button Functionality - Remove From List
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++){
    close[i].onclick = function(){
      var div = this.parentElement;
      div.style.display = "none";
    }
}

// Create New Element When 'Add' is Pressed
function newElement(){
var li = document.createElement("li");
var inputValue = document.getElementById("myInput").value;
var t = document.createTextNode(inputValue);
li.appendChild(t);
if (inputValue === ''){
  alert("No Stock Selected");
}
else{
  document.getElementById("myUL").appendChild(li);
}
// Clear Input Text Box
document.getElementById("myInput").value = "";

var span = document.createElement("SPAN");
var txt = document.createTextNode("\u00D7");

span.className = "close";
span.appendChild(txt);
li.appendChild(span);

for (i = 0; i < close.length; i++){
  close[i].onclick = function(){
    var div = this.parentElement;
    div.style.display = "none";
  }
}
}

/*############################################################################
                  SideNav - Settings and Configuration
############################################################################*/
function openNav(){
document.getElementById("DashSideNav").style.width = "400px";
document.getElementById("dashboard").style.marginLeft = "400px";
}

function closeNav(){
document.getElementById("DashSideNav").style.width = "0px";
document.getElementById("dashboard").style.marginLeft = "0px";
}
