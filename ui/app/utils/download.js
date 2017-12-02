let downloadCSV = function(res, filename) {
    var result = res;
    let data = result.split('\r\n');
    let header = data[0].split(';');
    for (let index in header) {
        header[index] = i18n.t(header[index]);
    }
    data[0] = header.join(';')
    result = data.join('\n')
    download(result,filename,'text/csv');
}


let download = function(data, fileName, typeResponse) {
    const blob = new Blob([data], {type: typeResponse});
    if (navigator.appVersion.toString().indexOf('.NET') > -1) {
        // for IE browser
        window.navigator.msSaveBlob(blob, fileName);
    } else {
        // for other browsers
        //Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
        const a = document.createElement("a");
        document.body.appendChild(a);
        //Create a DOMString representing the blob and point the link element towards it
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        //programatically click the link to trigger the download
        a.click();
    }
}

export default {
    downloadCSV: downloadCSV
}