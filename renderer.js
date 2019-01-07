const $ = require('jquery')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const Store = require('electron-store')
const store = new Store();
var port;
var parser;
var response;
var seconds = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59']
SerialPort.list().then(
    ports => ports.forEach(addPort),
    err => console.error(err)
)
var ports = [];
var path;
var rate = 115200;
var TIME_DELAY = 200;
function addPort(item, index){
    $('#comports').append('<option value="'+item.comName+'">'+item.comName+'</option>');
    ports.push(item.comName);
    if(store.get('com.port')==undefined){
        var val=document.getElementById('comports').value;
        store.set('com.port',val);
        path=val;
        logOutput('porta escolhida: '+val);
    }else{
        path=store.get('com.port');
        $("#comports").val(path);
    }
}

function startCOM(){
    if(!path){
        path=document.getElementById('comports').value;
    }
    port = new SerialPort(path, { baudRate: rate }, function(err){
        logOutput(err);
    })
    parser = new Readline()
    port.pipe(parser)
    parser.on('data', line => response=line)
    $('.group2').prop('disabled',false);
    $('.group1').prop('disabled',true);
    $('#titl').html(path);
    $('#com_button').html('Finalizar');
    $('#com_button').attr('onclick','closeCOM()');
}

function changeCOM(){
    store.set('com.port',document.getElementById('comports').value);
    path=document.getElementById('comports').value;
    logOutput('porta atualizada: '+document.getElementById('comports').value);
}

function sendCOM(comm){
    if(comm=="4"){
        $('#stop_button').html('STOP');
        $('#stop_button').attr('onclick',"sendCOM('3')");
        
    }else{
        $('#stop_button').html('START');
        $('#stop_button').attr('onclick',"sendCOM('4')");
    }
    $('.group2').prop('disabled',true);
    port.write(comm);
    setTimeout(function(){
        logOutput(response);
        $('.group2').prop('disabled',false);
    },TIME_DELAY);
}

function getCOM(comm){
    port.write(comm);
    $('.group2').prop('disabled',true);
    setTimeout(function(){
        logOutput(response);
        $('.group2').prop('disabled',false);
    },TIME_DELAY);
}

function closeCOM(){
    port.close(function(err){
        logOutput(err);
    });
    $('.group2').prop('disabled',true);
    $('.group1').prop('disabled',false);
    $('#titl').html('ICU');
    port=null;
    $('#com_button').html('Iniciar');
    $('#com_button').attr('onclick','startCOM()');
}
function logOutput(str){
    $('p').css('color','#888');
    $('p').css('font-weight','100');
    $('p').css('margin','1px 1px 1px 1px');
    $('p').css('font-size','12px');
    $('p span').css('color','#A00');
    var d = new Date();
    var pre= seconds[d.getHours()]+':'+seconds[d.getMinutes()]+':'+seconds[d.getSeconds()]+'>';
    $('.output').prepend('<p><span>'+pre+'</span>'+str+'</p>');
}