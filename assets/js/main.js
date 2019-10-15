let members = [];
let value;
check_site();
//Checkea la url para pasarle al fetch la que necesita según donde este el usuario
function check_site(){
var site = location.pathname;

    if (site.includes("senate") == true){
        let url= 'https://api.propublica.org/congress/v1/113/senate/members.json';
        fetch_init(url);
    }
    else if(site.includes("house") == true){        
        let url= 'https://api.propublica.org/congress/v1/113/house/members.json';
        fetch_init(url);
    }
}

//Fetch para recibir los datos de la API de Propublica
function fetch_init(url){

var propublica = { method: 'GET',
               headers: {'X-API-Key': 'XJQQZrc8WR5srkXqM3T2Bb4J35gWbhkPgzY3i7oo'}
            };

fetch(url, propublica).then(function(response) {
  return response.json();

})
.then(function(data) {
    members = data.results[0].members;  
    stateselects(members);
    rows(members);
    checking(members);

});
}

//Función para rellenar la tabla principal y pintarla cargando la info
    function rows(members){
        
        var print_tab = new String();
        
        for (i = 0; i < members.length; i++) {        
            print_tab += "<tr><td><a href='"+ members[i].url + "' target='_blank'>"+ members[i].first_name 
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
        document.getElementById('tbody').innerHTML = print_tab;        
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
    
    var value = document.getElementById("state-filter").value;
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
        
    filtrado(arrvalues, value, members);
}

//Funcion para realizar el filtrado de los checkbox leyendo cuales estan o no checkeados gracias a los valores
//del array arrvalues conseguidos de la funcion checking.
//por otro lado comprueba el valor del select y realiza el filtrado de los dos parametros
function filtrado(arrvalues, value, members){
    
let filteredArray = [];


//Si no hay nada checkeado pinta la tabla completa
    if (arrvalues.length === 0 && value === "ALL"){
        rows(members);
    } else{
//Si hay algo checkeado ejecuto un for para ir leyendo el array y si en el arrvalues hay coincidencia con el partido entonces lo guardo en Newarray como true
//con este nuevo array en caso de que sea true añado a los miembros filtrados en un nuevo array llamado filteredArray         
        for (var i = 0 ;i< members.length; i++){
            var Newarray = (arrvalues.includes(members[i].party)) ;
            var StateFilter = members[i].state ;
            
        if (Newarray == true && value == StateFilter ){
                filteredArray.push(members[i]);    

            } else if(arrvalues.length === 0 && value == StateFilter ){
                filteredArray.push(members[i]);    

            }else if(Newarray == true && value == "ALL"){
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
