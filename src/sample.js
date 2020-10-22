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
                editor.save().then((savedData) => {
                    //to HTML
                    webservice_HTMLrenderFromJSON(savedData);
                });
                evt.stopPropagation();
            }, false]
        });
        
    
        sosie.addMenuIconBtn({
            icon:'eye',
            id:'examineButton',
            title:'examine',
            text:'',
            onClick: [function (evt) {
              
                var undo=editor.undo;
            
                if(editor.blocks.getBlocksCount()) {
                    //alert(block.name);
                    editor.save().then((savedData) => {
                            if(undo.count()) {
                                var initialblocks=undo.stack[0].state;
                                var currentblocks=savedData.blocks;
                                var left=initialblocks;
                     
                                var delta = jsondiffpatch.diff(initialblocks,currentblocks );
                      
                                 if(initialblocks.length == currentblocks.length) {
                                   
                                    var indexes=new Array();
                                    var diffs=new Array();
                                    if(delta) {
                                      for (const index in delta) {
                                        indexes.push(index);
                                        diffs.push(delta[index]);
                                      }
                                    }

                                    var json=JSON.parse(JSON.stringify(savedData)); ///Clone
                                    
                                    for(var i=0;i<indexes.length-1;i++) {
                                        index=parseInt(indexes[i]);
                                        if(json.blocks[index].type == 'raw') {
                                        
                                            json.blocks[index].data.text='WARNING:hml code of block '+i+' has changed diff is:\n'+diffs[i].data.html+'\n==8<===From Initial code ====\n'+initialblocks[index].data.html;
                                        
                                        }else {
                                          try {
                                            json.blocks[index].data.text=diffString(initialblocks[index].data.text,
                                            currentblocks[index].data.text);
                                          } catch(e) {
                                            console.error('Index '+i+' encounter an error ',e);
                                            console.info('Dumping initialblocks',initialblocks.state);
                                            console.info('Dumping currentblocks',currentblocks);
                                            console.info('Json.blocks',json.blocks);
                                          }
                                        }
                                    }
                                  
                                    webservice_HTMLrenderFromJSON(json,'jsdiff.js');
                                   
                                } else { //failsafe
                                
                                  var visualdiff = document.createElement('div');
                                  visualdiff.innerHTML = jsondiffpatch.formatters.html.format(
                                    delta,
                                    left
                                  );
                                  
                              /*    function runScriptTags(el) {
                                    let scripts = el.querySelectorAll('script');
                                    for (let i = 0; i < scripts.length; i++) {
                                      let s = scripts[i];
                                      // eslint-disable-next-line no-eval
                                      //eval(s.innerHTML);
                                      alert(s.innerHTML);
                                    }
                                  }
                                  runScriptTags(visualdiff);*/
                                  webservice_HTMLrender(visualdiff.innerHTML,'jsondiffpatch');
                                }
                               
                              } else {
                                  alert('No modifications found');
                              }
                      
                    });
                } else {
                    alert('Nothing to examine');
                }
                evt.stopPropagation();
            }, false],
            custom: {
                disabled: true,
            },
        });
        
    }
}

