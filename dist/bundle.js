var childWindow,childWindowReadyNextTime;function openChildWindow(e,a){childWindow&&closeChildWindow();(childWindow=window.open(e,"_blank","location=no,height=570,width=800,scrollbars=yes,status=yes")).document.write(a),childWindow.focus()}function closeChildWindow(){childWindow?(childWindow.close(),childWindow=void 0):alert("There is no child window open.")}function refreshChildWindow(){childWindow?childWindow.location.reload():alert("There is no child window open.")}function convertJSONBlocks2HTML(e){var a="",i=new Array;return e.blocks.forEach((function(e){try{switch(e.type){case"header":a+=`<h${e.data.level}>${e.data.text}</h${e.data.level}>\n`;break;case"paragraph":a+=`<p>${e.data.text}</p>\n`;break;case"delimiter":a+='<p align="center">* * *</p>';break;case"image":Object.prototype.hasOwnProperty.call(e.data,"file")?a+=`<img class="img-fluid" src="${e.data.file.url}" title="${e.data.caption}" /><br /><em>${e.data.caption}</em>`:a+=`<img class="img-fluid" src="${e.data.url}" title="${e.data.caption}" /><br /><em>${e.data.caption}</em>`;break;case"list":a+="<ul>\n",e.data.items.forEach((function(e){a+=`\t<li>${e}</li>\n`})),a+="</ul>\n";break;case"raw":a+=""+e.data.html,e.data.text&&i.push(""+e.data.text);break;default:console.log("Unknown block type",e.type),console.log(e)}}catch(a){console.log("Error for block type "+e.type,a)}})),i&&alert("HTML Code changes found:\n"+i.join("\n")),a}SoSIE.register("View");