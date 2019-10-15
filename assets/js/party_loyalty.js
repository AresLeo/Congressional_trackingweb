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
    partyloyalty();

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
    function partyloyalty(){
        let  memberssort = new Array();
        memberssort = members.sort(function(a,b){
            return a.votes_with_party_pct - b.votes_with_party_pct;
            }
        );
        
        var porcentaje = parseFloat(0.10)*members.length;
        
        memberssort_loyal = new Array();
        for (i= 0; i < memberssort.length; i++){
            //if(memberssort_engaged.length/memberssort.length <= porcentaje/100){
            //    memberssort_engaged.push(memberssort[i]);
            //} 
            if (i<= porcentaje || memberssort[i].votes_with_party_pct == memberssort_loyal[memberssort_loyal.length-1]
            .missed_votes_pct){
                memberssort_loyal.push(memberssort[i]);
            }
        }
        //Llamada a la funcion que pinta la tabla con el 10% y el array ya ordenado
        rows_Least_Loyal(memberssort_loyal);

        var membersreversed = memberssort.reverse();
        membersreversed_loyal = new Array();
        for (i= 0; i < membersreversed.length; i++){
            if (i<= porcentaje || membersreversed[i].votes_with_party_pct == membersreversed_loyal[membersreversed_loyal.length-1]
            .votes_with_party_pct){
                membersreversed_loyal.push(membersreversed[i]);
            }
        }
         //Llamada a la funcion que pinta la tabla con el 10% y el array ya ordenado alreves
        rows_Most_Loyal(membersreversed_loyal);
        
    }

    //Funcion dibuja tabla Senate Least loyal
    function rows_Least_Loyal(memberssort_loyal){
        var print_tab = new String();
        //Tabla 
        for (i = 0; i < memberssort_loyal.length; i++) { 
            print_tab += "<tr><td><a href='"+ memberssort_loyal[i].url + "' target='_blank'>"+ memberssort_loyal[i].first_name 
            + " " + avoidnull(memberssort_loyal[i].middle_name) 
            + " " + memberssort_loyal[i].last_name
            + "</a></td><td>"
            + memberssort_loyal[i].total_votes
            + "</td><td>"
            + memberssort_loyal[i].votes_with_party_pct
            + "</td></tr>"  
        }
        document.getElementById('tbody_at_leastLoyal').innerHTML = print_tab
    }
    //Funcion dibuja tabla Senate Most loyal
    function rows_Most_Loyal(membersreversed_loyal){
        var print_tab = new String();
        
        for (i = 0; i < membersreversed_loyal.length; i++) { 
            print_tab += "<tr><td><a href='"+ membersreversed_loyal[i].url + "' target='_blank'>"+ membersreversed_loyal[i].first_name 
            + " " + avoidnull(membersreversed_loyal[i].middle_name) 
            + " " + membersreversed_loyal[i].last_name
            + "</a></td><td>"
            + membersreversed_loyal[i].total_votes
            + "</td><td>"
            + membersreversed_loyal[i].votes_with_party_pct
            + "</td></tr>"  
        }
        document.getElementById('tbody_at_MostLoyal').innerHTML = print_tab
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