(function() {
reload();


function openLightroom(url, imgId, title) {
    console.log(imgId);
    var light = document.getElementById('lightboxImg');
    light.setAttribute('src', url);
    light.setAttribute('element', imgId);
    
    document.getElementById('imgTitle').textContent = title;
    document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block';
}

function closeLightroom() {
    console.log("closed");
    document.getElementById('light').style.display='none';
    document.getElementById('fade').style.display='none';
}

function reload() {
    
    var key = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=598de6749119f6898364a8de72af545d&user_id=126801113%40N07&format=json&nojsoncallback=1";
    
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            
            // remove old stuff
            var gridNode = document.getElementById("grid");
            if (gridNode.hasChildNodes()) {
                var fc = gridNode.firstChild;

                while(fc) {
                    gridNode.removeChild(fc);
                    fc = gridNode.firstChild;
                }
            }
            
            
            // make new stuff
            var json = JSON.parse(xmlHttp.responseText);
            var data = json.photos.photo;


            for (var i = 0; i < data.length; i++) {
                var list = document.createElement("li");
                var img = document.createElement("img");
                var str = "http://farm" + data[i].farm + ".static.flickr.com/" 
                + data[i].server + "/" + data[i].id + "_" + data[i].secret + ".jpg";

                img.setAttribute("src", str);
                list.appendChild(img);
                var title = document.createElement("h3");
                var t = document.createTextNode(data[i].title);  
                title.appendChild(t);
                list.appendChild(title);
                list.setAttribute('id', data[i].id);
                document.getElementById("grid").appendChild(list);
            }
        }
    }
    
    xmlHttp.open("GET", key, true); // true for asynchronous 
    xmlHttp.send(null);
    
    
}

     setInterval(function() {
                  reload();
                }, 3000); 

    
    var items = document.getElementsByClassName("grid-container");
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function(ev) {
            var parent = ev.target.parentElement;
            var imgURL = parent.firstChild.getAttribute('src');
//            console.log("parent girst child: " + parent.firstChild);
            var imgNum = parent.getAttribute('id');
            var imgTitle = parent.lastChild.textContent;

            openLightroom(imgURL, imgNum, imgTitle);
        }); 
    }  
     
function changelightboxImage(node) {
    var lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.setAttribute('src', node.firstChild.getAttribute('src'));
    document.getElementById('imgTitle').textContent = node.textContent;
    lightboxImg.setAttribute('element', node.getAttribute('id'));
}
    
document.onkeydown = switchImages;

function switchImages(e) {

    e = e || window.event;
    var idCurr = lightboxImg.getAttribute('element');
    var curr = document.getElementById(idCurr);
    
    if (e.keyCode == '37' || e.keyCode == '40') {
        var prev = curr.previousSibling;
        
        if (prev == null) {
            var lastChild = curr.parentNode.lastChild;
            changelightboxImage(lastChild);
        } else {
            changelightboxImage(prev);
        }
    }
    else if (e.keyCode == '39' ||  e.keyCode == '38') {
        var next = curr.nextSibling;
        
        if (next == null) {
            var firstChild = curr.parentNode.firstChild;
            changelightboxImage(firstChild);
        } else {
            changelightboxImage(next);
        }
    }

}
    
})();