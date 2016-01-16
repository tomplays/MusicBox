// Avoid `console` errors in browsers that lack a console.


// Place any jQuery/helper plugins in here.

// MISC UTILS
function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%')
}
function serialize(obj, prefix) {
  var str = [];
  for(var p in obj) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p]
    str.push(typeof v == "object" ?
      serialize(v, k) :
      encodeURIComponent(k) + "=" + encodeURIComponent(v))
  }
  return str.join("&")
}