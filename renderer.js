const $ = require('jquery')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const Store = require('electron-store')
const store = new Store();
var port;
var parser;
var response;
SerialPort.list().then(
    ports => ports.forEach(addPort),
    err => console.error(err)
)
var ports = [];
var path;
var rate = 115200;

function addPort(item, index){
    $('#comports').append('<option value="'+item.comName+'">'+item.comName+'</option>');
    ports.push(item.comName);
    if(store.get('com.port')==undefined){
        var val=document.getElementById('comports').value;
        store.set('com.port',val);
        path=val;
        console.log('porta escolhida: '+val);
    }
}

function startCOM(){
    if(!path){
        path=document.getElementById('comports').value;
    }
    port = new SerialPort(path, { baudRate: rate }, function(err){
        console.log(err);
    })
    parser = new Readline()
    port.pipe(parser)
    parser.on('data', line => response=line)
    $('.group2').prop('disabled',false);
    $('.group1').prop('disabled',true);
    $('#titl').html(path);
}

function changeCOM(){
    store.set('com.port',document.getElementById('comports').value);
    path=document.getElementById('comports').value;
    console.log('porta atualizada: '+document.getElementById('comports').value);
}

function sendCOM(comm){
    if(comm=="4"){
        $('#stop_button').html('STOP');
        $('#stop_button').attr('onclick',"sendCOM('3')");
    }else{
        $('#stop_button').html('START');
        $('#stop_button').attr('onclick',"sendCOM('4')");
    }
    port.write(comm);
}

function getCOM(comm){
    port.write(comm);
    $('.group2').prop('disabled',true);
    console.log('loading...');   
    setTimeout(function(){
        console.log(response);
        $('.group2').prop('disabled',false);
    },1500);
}

function closeCOM(){
    port.close(function(err){
        console.log(err);
    });
    $('.group2').prop('disabled',true);
    $('.group1').prop('disabled',false);
    $('#titl').html('ICU');
    port=null;
}
