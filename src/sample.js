/**
    * Sample of buttons for the View Plugin
    *
    * @property {EditorJS} editor - an instance of Editor.js with SoSIE menubar
    */
function sampleView(editor) {
 
    if(editor.hasOwnProperty('sosie')) { 
    
        let sosie=editor.sosie;
        
        sosie.addMenuIconBtn({   
            icon:'television',
            id:'viewButton',
            title:'View',
            text:'',
            onClick: [function (evt) {
                editor.save(true).then((savedData) => {
                    //to HTML
                    let editorjs_innerHTML_data=convertJSONBlocks2HTML(savedData);
                    openChildWindow("",editorjs_innerHTML_data);
                });
                evt.stopPropagation();
            }, false]
        });
    }
}

