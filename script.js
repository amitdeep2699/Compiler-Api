var linecount=0;
var input=document.getElementById("input");
var line=document.getElementById("line");
var l_id="0";
var time_id;

function on() {
    line.scrollTop=input.scrollTop;
};

input.addEventListener("keydown",function(event){
    if(event.key==="Tab"){
        event.preventDefault();
        input.value+="\t";
    }
});

input.addEventListener("input",function(){
    var arr=[];
    var inputlinecount=input.value.split("\n").length;

    if(linecount !==inputlinecount){
        for(var i=0;i<inputlinecount;i++){
            arr[i]=i+1;
        }
        line.value=arr.join("\n");
    }
    linecount=inputlinecount;
});
function selectlang(){
    l_id=document.getElementById("lang").value;
    console.log(l_id);
}
function getData(response){
    let result;
    let data;
    console.log(response);
    let xhttp=new XMLHttpRequest();
    xhttp.open('GET',"https://codequotient.com/api/codeResult/"+response);
    xhttp.send();
    
    xhttp.addEventListener("load",function(){
        result=JSON.parse(xhttp.responseText);
        data=JSON.parse(result.data);
        if(data.status==="Pending"){
            time_id=setTimeout(function(){
                getData(response);
            },1000);
        }else{
            clearTimeout(time_id);
            if(data.output!=""){
                document.getElementById("opt").innerText=data.output.slice(1);   
            }
            else{
                console.log(data);
                document.getElementById("opt").innerText=data.errors;
                document.getElementById("opt").style.color="red"; 
            }
            
        }
    })
    
}
function Compile(){
    let result;
    let xhttp=new XMLHttpRequest();
    let text=input.value;
    xhttp.open('POST',"https://codequotient.com/api/executeCode");
    xhttp.setRequestHeader("Content-Type","Application/JSON");
    let obj={"code":text,"langId" : l_id}
    xhttp.send(JSON.stringify(obj));

    xhttp.addEventListener("load",function(){
        result=xhttp.responseText;
        let response=JSON.parse(result);
        if(response.error==="Code is null"){
            document.getElementById("opt").innerText="Error: "+response.error;
            document.getElementById("opt").style.color="red";
        }
        else if(response.codeId !=""){
        getData(response.codeId);
    }
    });
    
}