function sampleView(e){if(e.hasOwnProperty("sosie")){e.sosie;e.sosie.addMenuIconBtn({icon:"television",id:"viewButton",title:"View",text:"",onClick:[function(i){e.save(!0).then(e=>{let i=convertJSONBlocks2HTML(e);openChildWindow("",i)}),i.stopPropagation()},!1]})}}