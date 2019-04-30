'use strict'

function readFile(filename, callback)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function()
    {
        if(req.readyState == 4)
        {
            if(req.status == 200)
            {
                callback(req.response, false/* no error */);
            }else{
                callback(null, true/* error */);
            }
        }
    }
    req.responseType = "json";
    req.open("GET", filename, true);
    req.send(null);
}

function elt(name, attributes)
{
    var node = document.createElement(name);

    if(attributes)
    {
		//console.log("attributes : " + attributes);
        for(var attr in attributes)
        {
     //       console.log("attr : " + attr);
		  //  console.log("attributes[attr] : " + attributes[attr]);
            if(attributes.hasOwnProperty(attr))
                node.setAttribute(attr, attributes[attr]);
        }
    }

    for(var i = 2; i < arguments.length; i++)
    {
   //     console.log("argument : " + arguments[i]);
        var child = arguments[i];
        if(typeof child == "string")
            child = document.createTextNode(child);

        node.appendChild(child);
    }

    return node;
}