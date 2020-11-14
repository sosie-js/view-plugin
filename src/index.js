/*!
*  View plugin
* 
*  @version 3.1.0
*  @package https://github.com/sosie-js/view-plugin
*/

/**
* @Note this has to be triggered after await editor.isReady.
* @author sos-productions.com
* @history
*    1.0.0 (10.10.2020) - Initial version from SoSIE
*    2.0.0 (17.10.2020) - Packaging all methods in View.init()
*    3.0.0 (22.10.2020) - diffs in colors with examine or when Bigbrother is mode enabled. Packaging done.
*    3.1.0 (14.11.2020) - BUGGY version
*/

import * as jsondiffpatch from './jsondiffpatch.esm';

class EditorBroadcastChannel {
        
    constructor(channel, handlerMessage) {
      
       /* Set up broadcast channel */
        const bc=new window.BroadcastChannel(channel);
            
        var _this=this;
        
        // Handler for accepting messages that are broadcasted an process them with the relevant actions
        bc.onmessage = (message)=>{
            
          if(this.disabled) {
            console.info('Message received in view-plugin but ignored:',message.data);
            _this.enable(': storm is over');
          } else {
            console.info('Broadcast received in view-plugin and processed:',message.data);
            handlerMessage(message.data.index,message.data.action,message.data.data);
          }  
        }
        
        //Fired when a message arrives that can't be deserialized.
        bc.onmessageerror = (error)=>{
          
          console.error('Broadcast received an error:',error);
          
        }
        
        //Backup the last current index, because removed block index gives -1, we will rely on this
        this.currentIndex = 0;
        
        this.bc = bc  
    }
    
    /**
   * Allows to disable post messaging
   */
    disable(from) {
      console.log('EditorBroadcastChannel disabled '+from);
      this.disabled = true;
    }

    /**
    * Enables post messaging
    */
    enable(from) {
      console.log('EditorBroadcastChannel enabled '+from);
      this.disabled = false;
    }

    /**
     * Sends the message, of any type of object, to each BroadcastChannel object listening to the same channel.
     **/
    postMessage(message) {
      
      /**
      * Drop message if disabled
      */
      if (this.disabled) {
        return;
      }
      var _this=this;
      try {
        if((message.action == 'insert' ) || (message.action == 'remove' )) {
          this.disable(': send and protect against '+message.action);
        }
        this.bc.postMessage(message);
      } catch(e) {
        console.error(e,message);
      }
    }

    close() {
      this.bc.close();
    }
}



/**
 * view plugin
 *
 * @typedef {Object} ViewPlugin
 * @description ViewPlugin will be intiatlised not in the constructor but lately with .init(editor)
 * called indiretly SoSIE when Editor and Menubar dom are both available
 */
class ViewPlugin {
        
    constructor() {}
    
    /**
    * Broadcast chanel to sync editors
    * 
    * @param {Object} editor - Editor.js API 
    */
    initBroadcast(editor) {
      
        editor.broadcast=new EditorBroadcastChannel('block_channel',function(index, action, data) {
          
            var block;
          
          
            switch (action) {
              case 'sync': //Synchronize the scroll to the the block which has been clicked from other editor 
                editor.blocks.scrollToBlock(index,data.y);
                setCurrentPosition(index+1);
                refreshTotalBlocks();
                break;
              case 'insert':
                block=editor.blocks.getBlockByIndex(index-1);
                console.info('insert block at index '+ index + 'with id '+data.id);
                block.save().then((blockData) => {
                    console.log('Insert with block data', blockData);
                    console.log('Insert with block config', block.config);
                    editor.broadcast.disable(': prevention against '+action )
                    editor.blocks.insert(blockData.tool,block.config,blockData.data,index,true);
                    editor.broadcast.enable(': remove prevention of '+action);
                });
                break;
              case 'remove':  
                editor.broadcast.disable(': prevention against '+action );
                //if(index == -1) {
                editor.blocks.delete(editor.broadcast.currentIndex+1);
                //} else {
                //  editor.blocks.delete(index);
                //}
                editor.broadcast.enable(': remove prevention of '+action);
                break;
              case 'edit':
                editor.broadcast.currentIndex = index;
                break;
              case 'replace':
                break;  
              default:
            }
        });
        
    }
    
    
    /**
    * init File Plugin
    * 
    * @param {Object} editor - Editor.js API 
    */
    init(editor) {

      
      /**
      * Get FilePlugin Dir relative to the HTML page
      * 
      * @return {String}
      **/ 
      function getFilePluginDir() {
          let currentScript='${currentScript}'; //Relative to the HTML page, resolved by script-loader
          return currentScript.replace('/dist/bundle.js','');  //'editor.js/example/plugins/file-plugin';
      }
        
     /*  if(!window.hasOwnProperty('jsondiffpatch')&&!window.hasOwnProperty('jsdiff')) {
         
      var mode='prod'
        var source='local';//Works only with local stored dists as we decided not to publish on npm
        var nocache=false;
        let pluginDir=getFilePluginDir();
        console.log('File plugin found in '+pluginDir);
        var target=source+':'+pluginDir;
      
        if(window.hasOwnProperty('loadEditor')) {
          (async () => {
              await loadEditor([
                  {'jsondiffpatch@0.4.1':['[src/jsondiffpatch.umd.js](https://github.com/benjamine/jsondiffpatch)','../../dist/jsondiffpatch.umd.js']},
                  {'jsdiff.js@latest':['[src/jsdiff.js](https://johnresig.com/files/jsdiff.js)','../../dist/jsdiff.js']
                  }],nocache,mode,target) 
          })();
          
        } else {
          alert('You need to load sosie-js/script-loader version 3.0.+ available on github');
        }
       } else {*/
         //Webpack mode
       
       require('./jsdiff.js');
      /*}*/
      
      
      var childWindow;
      var childWindowReadyNextTime;

      /*document.getElementById('btnOpen').onclick = openChildWindow;
      document.getElementById('btnClose').onclick = closeChildWindow;
      document.getElementById('btnRefresh').onclick = refreshChildWindow;*/

      window.openChildWindow = function (URL,html) {
          
          if (childWindow) {
              closeChildWindow();
          } 
          
          //childWindow = window.open(location.protocol + "//" + location.host + "/cotokijigu/1");
          var strWindowFeatures = "location=no,height=570,width=800,scrollbars=yes,status=yes";
          childWindow= window.open(URL, "_blank", strWindowFeatures);
          
          childWindow.document.write(html);
          childWindow.focus();
      }

      window.closeChildWindow = function () {
          if (!childWindow) {
              alert("There is no child window open.");
          }
          else {
              childWindow.close();
              childWindow = undefined;
          }
      }

      window.refreshChildWindow = function () {
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

      function getDiffColorStyles(method) {
      
        let style = '', pluginDir=getFilePluginDir();
        
        if(method == 'jsdiff.js') {
         style = '<style>\n\tins { background-color: #cdffd8; }\n\tdel { background-color: #ffdce0; }\n</style>';
       }
       
        if(method == 'jsondiffpatch') {
          style = '<link rel="stylesheet" href="' + pluginDir +'/dist/formatters-styles/html.css" type="text/css" media="screen" />'
          style += '<link rel="stylesheet" href="' + pluginDir + '/dist/formatters-styles/annotated.css" type="text/css" media="screen" />';
        }
        return style;
      }
      
      window.webservice_HTMLrenderFromJSON = function (json,diffMethod) {
  
          window.webservice_HTMLrender(convertJSONBlocks2HTML(json),diffMethod);
          
      }
      
      window.webservice_HTMLrender = function (html,diffMethod) {
          if(diffMethod) html=getDiffColorStyles(diffMethod)+html;
          openChildWindow("",html);
      }
      
      //now, the cherry on the cake
      this.initBroadcast(editor);
      
      console.log('View plugin initialized ');
    }
}


var View = new ViewPlugin();

//Register so SoSIe will autoinit.    
SoSIE.register('View');
