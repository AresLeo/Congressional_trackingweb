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
        calculate_Statistics();
    });
    }


function calculate_Statistics(){
    let republicans = new Array();
    let democrats = new Array();
    let independents = new Array(); 
    countmembers();
    engaged();

    //Funcion para meter en arrays separados a los miembros del senado según su partido.
    function countmembers(){
        let rep= "R";        
        let dem= "D";        
        let ind= "I";

        for (i = 0; i < members.length; i++){
            let repArray = (rep.includes(members[i].party));
            let indArray = (ind.includes(members[i].party)) ;
            let demArray = (dem.includes(members[i].party)) ;
            if (indArray == true){
                independents.push(members[i]);             
            }
            if (repArray == true){
                republicans.push(members[i]);             
            }
            if (demArray == true){
                democrats.push(members[i]);  
            }        
        }
            
        mediavotesparty(republicans,democrats,independents); 
    }

    //Funcion  que calcula la media de los votos de cada partido
    function mediavotesparty(republicans, democrats,independents){
        let pctRepublicans = 0;
        let pctDemocrats = 0;
        let pctIndependent = 0;
        let pctTotal = 0;
        let totalparty = 0;
        for (i = 0; i < republicans.length; i++){
            pctRepublicans =+ pctRepublicans + republicans[i].votes_with_party_pct;
        }
        pctRepublicans = (pctRepublicans/republicans.length).toFixed(2);
      
        for (i = 0; i < democrats.length; i++){
            pctDemocrats =+ pctDemocrats + democrats[i].votes_with_party_pct;
        } 
        pctDemocrats = (pctDemocrats/democrats.length).toFixed(2);
        
        for (i = 0; i < independents.length; i++){
            pctIndependent=+ pctIndependent + independents[i].votes_with_party_pct;
            }         
            pctIndependent = (pctIndependent/independents.length).toFixed(2);       
            if(independents == 0){
                totalparty = 2;
                pctIndependent =0;
            
            }else{
                totalparty=3;
                
            }

        pctTotal = (parseFloat(pctRepublicans)+parseFloat(pctDemocrats)+parseFloat(pctIndependent))/parseFloat(totalparty);
        rows_at_sen_glance(republicans,democrats,independents,pctRepublicans,pctDemocrats,pctIndependent,pctTotal);  
        }
    //Función que pinta la tabla Senate at a glance
    function rows_at_sen_glance(republicans,democrats,independents,pctRepublicans,pctDemocrats,pctIndependent,pctTotal){
        

        if (independents==0){
            var print_tab2 = new String();
            print_tab2 += "<tr><td>DEMOCRATS</td><td>"+ democrats.length + "</td><td>"+pctDemocrats+" % </td></tr>"+
            "<tr><td>REPUBLICANS</td><td>"+ republicans.length + "</td><td>"+pctRepublicans+" % </td></tr>"+
            "<tr><td>TOTAL</td><td>"+ members.length + "</td><td>"+ pctTotal.toFixed(2) + " % </td></tr>"
            ;
            document.getElementById('tbody_at_glance_house').innerHTML = print_tab2
        } else{
            var print_tab = new String();
            print_tab += "<tr><td>DEMOCRATS</td><td>"+ democrats.length + "</td><td>"+pctDemocrats+" % </td></tr>"+
            "<tr><td>REPUBLICANS</td><td>"+ republicans.length + "</td><td>"+pctRepublicans+" % </td></tr>"+
            "<tr><td>INDEPENDENT</td><td>"+ independents.length + "</td><td>"+pctIndependent+" % </td></tr>"+
            "<tr><td>TOTAL</td><td>"+ members.length + "</td><td>"+ pctTotal.toFixed(2) + " % </td></tr>"
            ;
            document.getElementById('tbody_at_glance').innerHTML = print_tab;
        }
    }
    //Funcion para crear un array con todos los miembros y ordenarlo
    function engaged(){
        let  memberssort = new Array();
        memberssort = members.sort(function(a,b){
            return a.missed_votes_pct - b.missed_votes_pct;
            }
        );
        
        var porcentaje = parseFloat(0.10)*members.length;
        
        memberssort_engaged = new Array();
        for (i= 0; i < memberssort.length; i++){
            //if(memberssort_engaged.length/memberssort.length <= porcentaje/100){
            //    memberssort_engaged.push(memberssort[i]);
            //} 
            if (i<= porcentaje || memberssort[i].missed_votes_pct == memberssort_engaged[memberssort_engaged.length-1]
            .missed_votes_pct){
                memberssort_engaged.push(memberssort[i]);
            }
        }
        //Llamada a la funcion que pinta la tabla con el 10% y el array ya ordenado
        rows_Least_Engaged(memberssort_engaged);

        var membersreversed = memberssort.reverse();
        membersreversed_engaged = new Array();
        for (i= 0; i < membersreversed.length; i++){
            if (i<= porcentaje || membersreversed[i].missed_votes_pct == membersreversed_engaged[membersreversed_engaged.length-1]
            .missed_votes_pct){
                membersreversed_engaged.push(membersreversed[i]);
            }
        }
         //Llamada a la funcion que pinta la tabla con el 10% y el array ya ordenado alreves
        rows_Most_Engaged(membersreversed_engaged);
        
    }

    //Funcion dibuja tabla Senate Least Engaged
    function rows_Least_Engaged(memberssort_engaged){
        var print_tab = new String();
        //Tabla 
        for (i = 0; i < memberssort_engaged.length; i++) { 
            print_tab += "<tr><td><a href='"+ memberssort_engaged[i].url + "' target='_blank'>"+ memberssort_engaged[i].first_name 
            + " " + avoidnull(memberssort_engaged[i].middle_name) 
            + " " + memberssort_engaged[i].last_name
            + "</a></td><td>"
            + memberssort_engaged[i].missed_votes
            + "</td><td>"
            + memberssort_engaged[i].missed_votes_pct
            + "</td></tr>"  
        }
        document.getElementById('tbody_at_Lengaged').innerHTML = print_tab
    }
    //Funcion dibuja tabla Senate Most Engaged
    function rows_Most_Engaged(membersreversed_engaged){
        var print_tab = new String();
        
        for (i = 0; i < membersreversed_engaged.length; i++) { 
            print_tab += "<tr><td><a href='"+ membersreversed_engaged[i].url + "' target='_blank'>"+ membersreversed_engaged[i].first_name 
            + " " + avoidnull(membersreversed_engaged[i].middle_name) 
            + " " + membersreversed_engaged[i].last_name
            + "</a></td><td>"
            + membersreversed_engaged[i].missed_votes
            + "</td><td>"
            + membersreversed_engaged[i].missed_votes_pct
            + "</td></tr>"  
        }
        document.getElementById('tbody_at_Mengaged').innerHTML = print_tab
    }

    function avoidnull(middlename)
    {
        if (middlename==null){
            return "";
        }else{
            return middlename;
        }
    }  

}