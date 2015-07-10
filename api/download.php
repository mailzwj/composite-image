<?php
    if (isset($_GET["source"])) {
        $file = $_GET["source"];
        $fsize = getimagesize($file);
        header('Content-type: ' . $fsize['mime']);
        header("Content-Disposition: attachment; filename=" . basename($file));
        @readfile($file);
        exit;
    } else {
        header('Content-type: text/html;charset=utf-8');
        echo "Sorry, 下载失败！";
    }
?>
