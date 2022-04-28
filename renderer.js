window.electronapi.onFilePath(filePath => { 
    document.getElementById("video").src = filePath;
    document.getElementById("videoPlayer").load();
});

