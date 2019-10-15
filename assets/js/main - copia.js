var members=data.results[0].members;
rows(members);
stateselects(); 
let filteredArray = [];
let filteredStates = [];
//Función para rellenar la tabla y pintarla cargando la info
    function rows(members){
        var ths_var = new String();
        
        for (i = 0; i < members.length; i++) {
        
            ths_var += "<tr><td><a href='"+ members[i].url + "' target='_blank'>"+ members[i].first_name 
            + " " + avoidnull(members[i].middle_name) 
            + " " + members[i].last_name
            + "</a></td><td>" 
            + members[i].party 
            + "</td><td>"
            + members[i].state
            + "</td><td>" 
            + members[i].seniority
            + "</td><td>" 
            + members[i].votes_with_party_pct
            +"% </td></tr>"   

            ;
            
        }
        //Pinta la tabla en la pagina con los valores que devuelve la variable ths_var
        document.getElementById('tbody').innerHTML = ths_var;
        
    };


//Función para saltarte el null, le pasamos el parametro que tenemos entre parentesis dentro de la funcion avoidnull, en este caso el valor del middle_name

function avoidnull(middlename)
    {
        if (middlename==null){
            return "";
        }else{
            return middlename;
        }
    }   

//Función para comprobar si los checkbox están o no chekeados, se ejecuta a través del onclick de los checkbox
var checkboxes = document.getElementsByClassName("checkbox");
 
function checking(){
    
    var arrvalues = new Array();
    for(var i = 0;i < checkboxes.length;i++)
     {
        if(checkboxes[i].checked == true)
        {
        var valuecheckbox = checkboxes[i].value;
         
        //console.log("Valor del valuecheckbox: "+ valuecheckbox);
         arrvalues.push(valuecheckbox);
        }
     }

    filtrado(arrvalues);

    
}

//Funcion para realizar el filtrado de los checkbox leyendo cuales estan o no checkeados gracias a los valores
//del array arrvalues conseguidos de la funcion checking
function filtrado(arrvalues){

//Si no hay nada checkeado pinta la tabla completa
    if (arrvalues.length === 0){
        rows(members);
    } else{
//Si hay algo checkeado ejecuto un for para ir leyendo el array y si en el arrvalues hay coincidencia con el partido entonces lo guardo en Newarray como true
//con este nuevo array en caso de que sea true añado a los miembros filtrados en un nuevo array llamado filteredArray         
        for (var i = 0 ;i< members.length; i++){
            var Newarray = (arrvalues.includes(members[i].party)) ;
          
            if (Newarray == true ){
                filteredArray.push(members[i]);               
                    
            }
        }
        //Ejecuta la funcion rows solo con la informacion de los miembros ya filtrados dentro del array
        rows(filteredArray);     
        
        }
    
}


//Funcion para pintar los select
function stateselects(){
    var allselects = new String();
    allselects += "<option class='selects' value='ALL'>ALL</option>"        
    for (i = 0; i < members.length; i++) {
        
        allselects += "<option value='"+ members[i].state + "' class='selects'>"+ members[i].state + "</option>" 
        
    }
    //Pinta los selects en la pagina con los valores que devuelve la variable ths_var
    document.getElementById('state-filter').innerHTML = allselects;
    
}

//Función para saber que select esta seleccionado y filtrar

function filterSelect(value){
    
    if (value==undefined || value=="ALL"){
        rows(members);
       console.log("Patata");
    }else{
        for (var i = 0 ;i< members.length; i++){
            var StateFilter = members[i].state ;
          
            if (value == StateFilter ){
                console.log("StateFilter: " + StateFilter)
                filteredStates.push(members[i]);          
            }
        }
    rows(filteredStates);    
    
    }
  
}


//Dibuja los dos filtros conjuntamente
function allFilters(){
    if(filteredStates[0].State == filteredArray[0].State ){
        
    }
}
