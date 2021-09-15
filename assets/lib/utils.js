function signalTestComplete(pageStats) {
    const div = document.createElement("div");
    div.id = "percyLoaded";
    div.innerText = JSON.stringify(pageStats);
    document.body.appendChild(div);
}

function getRequestParams() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        vars[key] = value;
    });
    return vars;
}

export {signalTestComplete, getRequestParams};