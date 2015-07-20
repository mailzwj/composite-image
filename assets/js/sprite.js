(function(){
    var area = document.getElementById('J_SpBox'),
        btnCss = document.getElementById('J_BtnCss'),
        downCss = document.getElementById('J_DownCss'),
        downImg = document.getElementById('J_DownImg'),
        spCss = document.getElementById('J_SpCss'),
        cvs = document.getElementById('J_SpCanvas'),
        dDom = document.getElementById('J_ForDown'),
        ctx = cvs.getContext('2d'),
        picCount = 0,
        space = 10,
        locs = [],
        imgArr = [],
        rImg = /image\/.*/g;

    var prepareSprite = function(fs) {
        // console.log(fs);
        var len = fs.length;
        for (var i = 0; i < len; i++) {
            if (rImg.test(fs[i].type)) {
                rImg.lastIndex = 0;
                var reader = new FileReader();
                reader.file = fs[i];
                reader.onload = function(ev) {
                    var oImg = new Image(),
                        src = ev.target.result,
                        loc = null;
                    oImg.src = src;
                    oImg.setAttribute('data-name', ev.target.file.name.replace(/\..*$/, ''));
                    imgArr.push(oImg);
                    if (imgArr.length === picCount) {
                        drawSprite(imgArr);
                    }
                };
                reader.readAsDataURL(fs[i]);
                picCount++;
            }
        }
    };

    var drawSprite = function(arr) {
        var maxw = cvs.width,
            nowh = cvs.height,
            cHeight = 0,
            drawn = {
                x: 0,
                y: 0
            };
        arr.sort(function(a, b){
            return b.height - a.height;
        });
        locs = [];
        cHeight = arr[0].height;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        for (var i = 0, len = arr.length; i < len; i++) {
            if (drawn.x + space + arr[i].width > maxw) {
                drawn.x = 0;
                drawn.y += space + cHeight;
                cHeight = arr[i].height;
                if (drawn.y + space + cHeight > nowh) {
                    cvs.height = drawn.y + space + cHeight + space;
                    drawSprite(arr);
                    return false;
                }
                ctx.drawImage(arr[i], drawn.x + space, drawn.y + space);
                locs.push({
                    left: drawn.x + space,
                    top: drawn.y + space,
                    width: arr[i].width,
                    height: arr[i].height,
                    iconName: arr[i].getAttribute('data-name')
                });
                drawn.x += space + arr[i].width;
            } else {
                if (drawn.y + space + cHeight > nowh) {
                    cvs.height = drawn.y + space + cHeight + space;
                    drawSprite(arr);
                    return false;
                }
                ctx.drawImage(arr[i], drawn.x + space, drawn.y + space);
                locs.push({
                    left: drawn.x + space,
                    top: drawn.y + space,
                    width: arr[i].width,
                    height: arr[i].height,
                    iconName: arr[i].getAttribute('data-name')
                });
                drawn.x += space + arr[i].width;
            }
        }
    };

    var sendFile = function(type, content) {
        var xhr = new XMLHttpRequest(),
            fd = new FormData();
        fd.append('type', type);
        fd.append('content', content);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (console) {
                    console.log('Download start.');
                }
                // window.open('http://www.seejs.com/demos/preview/cimg/api/download.php?source=' + xhr.responseText);
                dDom.src = 'http://www.seejs.com/demos/preview/cimg/api/download.php?source=' + xhr.responseText;
            }
        };
        xhr.open('POST', 'http://www.seejs.com/demos/preview/cimg/api/save.php');
        xhr.send(fd);
    };

    btnCss.onclick = function(ev) {
        // console.log(locs);
        if (spCss.style.display === 'block') {
            spCss.style.display = 'none';
        } else {
            spCss.style.display = 'block';
            var style = '.icons {\n\tdisplay: inline-block;\n\tvertical-align: middle;\n\tbackground-image: url(' + cvs.toDataURL('image/png') + ');\n}';
            for (var i = 0, len = locs.length; i < len; i++) {
                style += '\n\n.icons-' + locs[i].iconName + ' {\n\twidth: ' + locs[i].width + 'px;\n\theight: ' + locs[i].height + 'px;\n\tbackground-position: -' + locs[i].left + 'px -' + locs[i].top + 'px;\n}';
            }
            spCss.value = style;
        }
    };

    downCss.onclick = function(ev) {
        var style = '.icons {\n\tdisplay: inline-block;\n\tvertical-align: middle;\n\tbackground-image: url(' + cvs.toDataURL('image/png') + ');\n}';
        for (var i = 0, len = locs.length; i < len; i++) {
            style += '\n\n.icons-' + locs[i].iconName + ' {\n\twidth: ' + locs[i].width + 'px;\n\theight: ' + locs[i].height + 'px;\n\tbackground-position: -' + locs[i].left + 'px -' + locs[i].top + 'px;\n}';
        }
        sendFile('', style);
    };

    downImg.onclick = function(ev) {
        sendFile('img', cvs.toDataURL('image/png'));
    };

    area.ondragenter = function(ev) {
        ev.preventDefault();
    };
    area.ondragover = function(ev) {
        ev.preventDefault();
    };
    area.ondrop = function(ev) {
        ev.preventDefault();
        var dt = ev.dataTransfer;
        prepareSprite(dt.files);
    };
})();
