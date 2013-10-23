// Generated by CoffeeScript 1.6.3
var $domflags, domArray, domCount, domString, domTag, key,
  __hasProp = {}.hasOwnProperty;

console.log("inject.js");

$domflags = $('[domflag]');

domCount = $domflags.length - 1;

console.log(domCount);

for (key in $domflags) {
  if (!__hasProp.call($domflags, key)) continue;
  if ($.isNumeric(key)) {
    domTag = $domflags[key].tagName;
    domArray = [domTag];
    Array.prototype.slice.call($domflags[key].attributes).forEach(function(item) {
      if (item.name !== "domflag") {
        return domArray.push("" + item.name + "='" + item.value + "'");
      }
    });
    domString = domArray.join(' ');
    console.log(domString);
  }
}

chrome.runtime.sendMessage({
  greeting: "div.domflag",
  domCount: domCount
}, function(response) {
  return console.log(response.farewell);
});
