/*View.init = (editor) => {

}*/

var childWindow;
var childWindowReadyNextTime;

/*document.getElementById('btnOpen').onclick = openChildWindow;
document.getElementById('btnClose').onclick = closeChildWindow;
document.getElementById('btnRefresh').onclick = refreshChildWindow;*/

function openChildWindow(URL,html) {
    
    if (childWindow) {
        closeChildWindow();
    } 
    
    //childWindow = window.open(location.protocol + "//" + location.host + "/cotokijigu/1");
    var strWindowFeatures = "location=no,height=570,width=800,scrollbars=yes,status=yes";
    childWindow= window.open(URL, "_blank", strWindowFeatures);
    
    childWindow.document.write(html);
    childWindow.focus();
}

function closeChildWindow() {
    if (!childWindow) {
        alert("There is no child window open.");
    }
    else {
        childWindow.close();
        childWindow = undefined;
    }
}

function refreshChildWindow() {
    if (!childWindow) {
        alert("There is no child window open.");
    } else {
        childWindow.location.reload();
    }
}

function convertJSONBlocks2HTML(json) {
    var html = '';
    var codechanges = new Array();
    json.blocks.forEach(function(block) {
        try {
            switch (block.type) {
                case 'header':
                html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>\n`;
                break;
                case 'paragraph':
                html += `<p>${block.data.text}</p>\n`;
                break;
                case 'delimiter':
                html += '<p align="center">* * *</p>';
                break;
                case 'image':
                if(Object.prototype.hasOwnProperty.call(block.data,'file')) {
                    html += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                } else {
                    html += `<img class="img-fluid" src="${block.data.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                }
                break;
                case 'list':
                html += '<ul>\n';
                block.data.items.forEach(function(li) {
                    html += `\t<li>${li}</li>\n`;
                });
                html += '</ul>\n';
                break;
                case 'raw':
                html += `${block.data.html}`;
                if(block.data.text) //Patch diff
                    codechanges.push(`${block.data.text}`);
                break;
                default:
                console.log('Unknown block type', block.type);
                console.log(block);
                break;
            }
        }catch(e) {
            console.log('Error for block type '+block.type, e);
        }
    });
    
    //if(codechanges) alert("HTML Code changes found:\n"+codechanges.join('\n'));
    //alert(html);
    return html;
}

//Register so SoSIe will autoinit.    
SoSIE.register('View');
