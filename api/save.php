<?php
    header("Access-Control-Allow-Origin: *");
    if (isset($_POST["type"]) && isset($_POST["content"])) {
        $type = $_POST["type"];
        $content = $_POST['content'];
        if ($type == 'img') {
            $mime = 'image/png';
            $filename = 'sprite.png';
            $file = '../download/sprite.png';
            $img = base64_decode(str_replace('data:image/png;base64,', '', $content));
            file_put_contents($file, $img);
        } else {
            $mime = 'text/css';
            $filename = 'sprite.css';
            $file = '../download/sprite.css';
            file_put_contents($file, $content);
        }
        echo $file;
        exit;
    } else {
        header('Content-type: text/html;charset=utf-8');
        echo "参数错误，保存失败！";
    }
?>
