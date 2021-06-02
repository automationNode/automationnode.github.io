
var codeEditor = ace.edit("codeEditor")
codeEditor.setTheme("ace/theme/chrome");
codeEditor.session.setMode("ace/mode/python");
codeEditor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    fontSize: '12pt'
});

var navbar = document.getElementById("navbar")
var btn_new_file = document.getElementById("btn_new_file")
var btn_delete_file = document.getElementById("btn_delete_file")
var btn_save = document.getElementById("btn_save")
var btn_restart = document.getElementById("btn_restart")
var btn_connect = document.getElementById("btn_connect")
var btn_download_project = document.getElementById("btn_download_project")
var btn_open_project = document.getElementById("btn_open_project")
var div_current_file = document.getElementById("div_current_file")
var div_files = document.getElementById("div_files")
var textarea_debug = document.getElementById("textarea_debug")
var indicator = document.getElementById("indicator")

var files = {
    "main.py" : `#Here your code in python`
}
var elements = {}
var currentFile = "main.py"

var banner = true

for(let i in files){
    if(banner){
        firstFile = i
        banner = false
    }
    elements[i] = document.createElement("div")
    elements[i].innerHTML = i

    elements[i].addEventListener("mouseover", function(){
        elements[i].className = "bg-primary text-white"
    })
    elements[i].addEventListener("mouseleave", function(){
        elements[i].className = "bg-white"
        elements[i].style.color = "#000"
    })
    elements[i].addEventListener("click", function(){
        files[currentFile] = codeEditor.getValue()
        codeEditor.setValue(files[i])
        currentFile = i
        div_current_file.innerHTML = currentFile
        })
        div_files.appendChild(elements[i])
    }
    codeEditor.setValue(files[firstFile])
    currentFile = firstFile
    div_current_file.innerHTML = firstFile


btn_delete_file.addEventListener("click",function(){
    //let _confirm = confirm("Are you secure to delete this currentFile?")
    var div_advice = document.getElementById("div_advice")
    var advice = document.createElement("p")
    advice.innerText = `Are you secure of delete ${currentFile} file?`
    var btn_yes = document.createElement("button")
    btn_yes.innerText = "yes"
    btn_yes.className = "btn btn-secondary btn-sm"
    var btn_cancel = document.createElement("button")
    btn_cancel.innerText = "cancel"
    btn_cancel.className = "btn btn-primary btn-sm"
    div_advice.appendChild(advice)
    div_advice.appendChild(btn_yes)
    div_advice.appendChild(btn_cancel)
    if(currentFile != "main.py"){
        btn_yes.addEventListener("click", function(){
            div_files.removeChild(elements[currentFile])
            delete files[currentFile]
            delete elements[currentFile]
            let firstFile
            let banner = true

            for(let i in files){
                if(banner){
                    firstFile = i
                    banner = false
                }
            }

            div_advice.removeChild(advice)
            div_advice.removeChild(btn_yes)
            div_advice.removeChild(btn_cancel)

            codeEditor.setValue(files[firstFile])
            div_current_file.innerHTML = firstFile

            fetch('http://' + ip0.value + '.' + ip1.value + '.' + ip2.value + '.' + ip3.value + '/actions/delete_file', 
            {
                method: 'post',
                mode:"no-cors",
                body: JSON.stringify({delete_file:true, file:currentFile})
            })
            .then(res => res.text())
            .then(res => textarea_debug.value += res);
        })
    }
    btn_cancel.addEventListener("click", function(){
        div_advice.removeChild(advice)
        div_advice.removeChild(btn_yes)
        div_advice.removeChild(btn_cancel)
    })
})

btn_new_file.addEventListener("click", function(){

    var div_advice = document.getElementById("div_advice")

    if(div_advice.innerHTML == ""){ 
        var txt_new_file = document.createElement("input")
        var save_new_file = document.createElement("button")
        var cancel_new_file = document.createElement("button")
        save_new_file.className = "btn btn-primary btn-sm"
        cancel_new_file.className = "btn btn-secondary btn-sm"
        txt_new_file.placeholder = "/Namefile"
        save_new_file.innerHTML = "Create"
        cancel_new_file.innerHTML = "Cancel"
        div_advice.appendChild(txt_new_file)
        div_advice.appendChild(save_new_file)
        div_advice.appendChild(cancel_new_file)
        txt_new_file.focus()

        cancel_new_file.addEventListener("click", function(){
            div_advice.removeChild(txt_new_file)
            div_advice.removeChild(save_new_file)
            div_advice.removeChild(cancel_new_file)
        })

        save_new_file.addEventListener("click", function(){
            var fileName = txt_new_file.value
            var bandera = false

            for(let i in files){
                if(i == fileName){
                    bandera = true
                }
            } 
            if(bandera == true){
                alert("That file already exists, please type another name file")
            }
            
            if(fileName != undefined && fileName != "" && fileName != "/" && fileName != "." && bandera == false){

                div_advice.removeChild(txt_new_file)
                div_advice.removeChild(save_new_file)
                div_advice.removeChild(cancel_new_file)

                files[currentFile] = codeEditor.getValue() //Save the last file

                console.log(files)

                currentFile = fileName
                files[fileName] = "#Here your code in python"
                div_current_file.innerHTML = fileName
                codeEditor.setValue(files[fileName])

                elements[fileName] = document.createElement("div")
                elements[fileName].innerHTML = fileName

                elements[fileName].addEventListener("mouseover", function(){
                    elements[fileName].className = "bg-primary text-white"
                })
                elements[fileName].addEventListener("mouseleave", function(){
                    elements[fileName].className = "bg-white"
                    elements[fileName].style.color = "#000"
                })
                elements[fileName].addEventListener("click", function(){
                    codeEditor.setValue(files[fileName])
                        currentFile = fileName
                        div_current_file.innerHTML = currentFile
                })
                div_files.appendChild(elements[fileName])
                fetch('http://' + ip0.value + '.' + ip1.value + '.' + ip2.value + '.' + ip3.value + '/actions/save_files', 
                {
                    method: 'post',
                    mode:"no-cors",
                    body: JSON.stringify({save_files:true, files:files})
                })
                .then(res => res.text())
                .then(res => textarea_debug.value += res);
            }
        })
    }
})

btn_save.addEventListener("click", function(){
    files[currentFile] = codeEditor.getValue()
    console.log(files)
    fetch('http://' + ip0.value + '.' + ip1.value + '.' + ip2.value + '.' + ip3.value + '/actions/save_files', 
    {
        method: 'post',
        mode:"no-cors",
        body: JSON.stringify({save_files:true, files:files})
    })
    .then(res => res.text())
    .then(res => {
        indicator.innerText = "Uploaded"
        indicator.className = "bg-warning"
        textarea_debug.value += res
    });
})

btn_restart.addEventListener("click", function(){
    fetch('http://' + ip0.value + '.' + ip1.value + '.' + ip2.value + '.' + ip3.value + '/actions/restart', 
    {
        method: 'post',
        mode:"no-cors",
        body: JSON.stringify({restart:true})
    })
    .then(res => res.text())
    .then(res =>{
       textarea_debug.value += res 
       indicator.innerText = "Restarted"
       indicator.className = "bg-info"
    });
})

var connection

function connect() {
    var ip0 = document.getElementById("ip0")
    var ip1 = document.getElementById("ip1")
    var ip2 = document.getElementById("ip2")
    var ip3 = document.getElementById("ip3")

    connection = new WebSocket('ws://'+ ip0.value + '.' + ip1.value + '.' + ip2.value + '.' + ip3.value);

    connection.onopen = function () {
        indicator.innerText = "Conected"
        indicator.className = "bg-success"
        textarea_debug.value += "Connected\n"
        textarea_debug.scrollTop = textarea_debug.scrollHeight
        onConnected = document.getElementById("onConnected")
        btn_get_data_from_plc = document.createElement("button")
        btn_get_data_from_plc.className = "btn btn-primary btn-sm"
        btn_get_data_from_plc.innerText = "Get data from connection"
        onConnected.appendChild(btn_get_data_from_plc)
        btn_get_data_from_plc.addEventListener("click",function(){
            fetch('http://' + ip0.value + '.' + ip1.value + '.' + ip2.value + '.' + ip3.value + '/data/files', {
                mode:"cors"
            })
            .then(data => data.json())
            .then(function(data){
                files = data
                let firstFile
                let banner = true
                div_files.innerHTML = ""
                for(let i in files){
                    if(banner){
                        firstFile = i
                        banner = false
                    }
                    elements[i] = document.createElement("div")
                    elements[i].innerHTML = i

                    elements[i].addEventListener("mouseover", function(){
                        elements[i].className = "bg-primary text-white"
                    })
                    elements[i].addEventListener("mouseleave", function(){
                        elements[i].className = "bg-white"
                        elements[i].style.color = "#000"
                    })
                    elements[i].addEventListener("click", function(){
                        files[currentFile] = codeEditor.getValue()
                        codeEditor.setValue(files[i])
                        currentFile = i
                        div_current_file.innerHTML = currentFile
                    })
                    div_files.appendChild(elements[i])
                }
                codeEditor.setValue(files[firstFile])
                currentFile = firstFile
                div_current_file.innerHTML = firstFile
            });
        })
    };

    connection.onerror = function (error) {
        textarea_debug.value += "Comunication error\n"
        textarea_debug.scrollTop = textarea_debug.scrollHeight
    };

    connection.onmessage = function (e) {
        var message = JSON.parse(e.data)
        if(message.debug == true){
            textarea_debug.value += message.message
            textarea_debug.scrollTop = textarea_debug.scrollHeight
        }
    }
        
    connection.onclose = function(){
        indicator.innerText = "Disconnected"
        indicator.className = "bg-gray"
        textarea_debug.value += "Disconnected\n"
        textarea_debug.scrollTop = textarea_debug.scrollHeight
        onConnected.removeChild(btn_get_data_from_plc)
    }
}

connect()

btn_connect.addEventListener("click",function(){
    try{
       connection.close() 
       setTimeout(function(){
        connect()
       }, 1000)
    }
    catch{
        connect()
    }
})

btn_download_project.addEventListener("click", function(){
    var element = document.createElement('a');
    var program = {
        files : files
    }
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(program)));
    element.setAttribute('download', "automationNodeHardware.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
})

btn_open_project.addEventListener("change", function(e){
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            elements = {}
            files = {}
            div_files.innerHTML = ""
            var contents = JSON.parse(e.target.result);
            files = contents.files
            let firstFile
            let banner = true
            for(let i in files){
                if(banner){
                    firstFile = i
                    banner = false
                }
                elements[i] = document.createElement("div")
                elements[i].innerHTML = i

                elements[i].addEventListener("mouseover", function(){
                    elements[i].className = "bg-primary text-white"
                })
                elements[i].addEventListener("mouseleave", function(){
                    elements[i].className = "bg-white"
                    elements[i].style.color = "#000"
                })
                elements[i].addEventListener("click", function(){
                    files[currentFile] = codeEditor.getValue()
                    codeEditor.setValue(files[i])
                    currentFile = i
                    div_current_file.innerHTML = currentFile
                })
                div_files.appendChild(elements[i])
            }
        codeEditor.setValue(files[firstFile])
        currentFile = firstFile
        div_current_file.innerHTML = firstFile
        }
}, false)

setTimeout(function(){
    setInterval(function(){
        connection.send(JSON.stringify({debug:true}))
    }, 300); 
}, 2000)