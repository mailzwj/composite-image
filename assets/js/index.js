(function(){
    var cBox = document.getElementById('J_CanBox'),
        cvs = document.getElementById('J_Target'),
        ctx = cvs.getContext('2d'),
        souList = document.getElementById('J_SouList'),
        sous = souList.getElementsByTagName('img'),
        len = sous.length,
        createImg = document.getElementById('J_GetImage'),
        showImg = document.getElementById('J_NewImage');

    function hasClass(node, cls) {
        var clsArr = node.className.split(' ');
        for (var i = 0, len = clsArr.length; i < len; i++) {
            if (cls === clsArr[i]) {
                return true;
            }
        }
        return false;
    }

    // bind click event
    for (var i = 0; i < len; i++) {
        sous[i].onclick = (function(s){
            return function() {
                var src = s.getAttribute('src'),
                    tmp = document.createElement('div');
                tmp.className = 'tmp-canvas';
                tmp.style.left = '0px';
                tmp.style.top = '0px';
                tmp.style.backgroundImage = 'url(' + src +')';
                tmp.setAttribute('data-src', src);
                tmp.innerHTML = '<input type="button" class="btn cancel" id="J_Cancel" value="删除">';
                cBox.appendChild(tmp);
            };
        })(sous[i]);
    }

    // bind drag effect
    cBox.onmousedown = function(ev){
        if (hasClass(ev.target, 'tmp-canvas')) {
            var tar = ev.target,
                ox = parseFloat(tar.style.left),
                oy = parseFloat(tar.style.top),
                ex = ev.clientX,
                ey = ev.clientY;
            document.onmousemove = function(ev){
                tar.style.left = ox + ev.clientX - ex + 'px';
                tar.style.top = oy + ev.clientY - ey + 'px';
            };
            document.onmouseup = function(ev){
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    };

    // bind cancel click
    cBox.onclick = function(ev){
        if (hasClass(ev.target, 'cancel')) {
            cBox.removeChild(ev.target.parentNode);
            ev.preventDefault();
        }
    };

    // create Image
    createImg.onclick = function(ev){
        var eles = cBox.children,
            eLen = eles.length - 1,
            counter = 0,
            img = null;
        for (var i = 1, total = eles.length; i < total; i++) {
            (function(tmp){
                var oImg = new Image(),
                    x = parseFloat(tmp.style.left),
                    y = parseFloat(tmp.style.top);
                oImg.onload = function() {
                    ctx.drawImage(oImg, x, y);
                    if (++counter === eLen) {
                        img = cvs.toDataURL('image/png')
                        showImg.innerHTML = '<img src="' + img + '">';
                        ctx.clearRect(0, 0, cvs.width, cvs.height);
                    }
                };
                oImg.src = tmp.getAttribute('data-src');
            })(eles[i]);
        }
    };
})();
