<?php
    if (isset($_GET["source"])) {
        $file = $_GET["source"];
        $rs = preg_match("/^\.\.\/download\/sprite\.(png|css)$/", $file, $matches);
        if (!$rs) {
            header('Content-type: text/html;charset=utf-8');
            echo "非法的资源路径，请检查！";
            exit;
        }
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
