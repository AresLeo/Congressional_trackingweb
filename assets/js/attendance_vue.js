const app = new Vue({
    el:'#app',
    data: {

        members: [],
        value: "",
        site: location.pathname,
        republicans:[],
        democrats:[],
        independents: [],
        rep: "R",        
        dem: "D",        
        ind: "I",
        pctRepublicans: 0,
        pctDemocrats: 0,
        pctIndependent: 0,
        pctTotal: 0,
        totalparty: 0,
        lmemberssort: [],
        memberssort_engaged: [],
        membersreversed_engaged: [],
    },
    
methods: {    

//Checkea la url para pasarle al fetch la que necesita según donde este el usuario
    check_site(){
        
        if (app.site.includes("senate") == true){
            url= 'https://api.propublica.org/congress/v1/113/senate/members.json';
            app.fetch_init(url);
        }
        else if(app.site.includes("house") == true){        
            let url= 'https://api.propublica.org/congress/v1/113/house/members.json';
            app.fetch_init(url);
        }
    },
    
    //Fetch para recibir los datos de la API de Propublica
    
    fetch_init(url){
    
        var propublica = { method: 'GET',
                       headers: {'X-API-Key': 'XJQQZrc8WR5srkXqM3T2Bb4J35gWbhkPgzY3i7oo'}
                    };
        
        fetch(url, propublica).then(function(response) {
          return response.json();
        
        })
        .then(function(data) {
            app.members = data.results[0].members; 
            members = app.members 
            app.calculate_Statistics();
        });
    },
    
    calculate_Statistics(){
    
    countmembers();
    engaged();

    //Funcion para meter en arrays separados a los miembros del senado según su partido.
    function countmembers(){
        for (i = 0; i < members.length; i++){
            let repArray = (app.rep.includes(members[i].party));
            let indArray = (app.ind.includes(members[i].party)) ;
            let demArray = (app.dem.includes(members[i].party)) ;
            if (indArray == true){
                app.independents.push(members[i]);             
            }
            if (repArray == true){
                app.republicans.push(members[i]);             
            }
            if (demArray == true){
                app.democrats.push(members[i]);  
            }        
        }
            
        mediavotesparty(app.republicans,app.democrats,app.independents); 
    }

    //Funcion  que calcula la media de los votos de cada partido
    function mediavotesparty(republicans, democrats,independents){
        
       
        for (i = 0; i < republicans.length; i++){
            app.pctRepublicans =+ app.pctRepublicans + republicans[i].votes_with_party_pct;
        }
        app.pctRepublicans = (app.pctRepublicans/republicans.length).toFixed(2);
      
        for (i = 0; i < democrats.length; i++){
            app.pctDemocrats =+ app.pctDemocrats + democrats[i].votes_with_party_pct;
        } 
        app.pctDemocrats = (app.pctDemocrats/democrats.length).toFixed(2);
        
        for (i = 0; i < independents.length; i++){
            app.pctIndependent=+ app.pctIndependent + independents[i].votes_with_party_pct;
            }         
            app.pctIndependent = (app.pctIndependent/independents.length).toFixed(2);       
            if(independents == 0){
                app.totalparty = 2;
                app.pctIndependent =0;
            
            }else{
                app.totalparty=3;
                
            }

            app.pctTotal = (parseFloat(app.pctRepublicans)+parseFloat(app.pctDemocrats)+parseFloat(app.pctIndependent))/parseFloat(app.totalparty);
            
            // rows_at_sen_glance(republicans,democrats,independents,pctRepublicans,pctDemocrats,pctIndependent,pctTotal);  
      
        }
    
    //Funcion para crear un array con todos los miembros y ordenarlo
    function engaged(){
       
        app.memberssort = members.sort(function(a,b){
            return a.missed_votes_pct - b.missed_votes_pct;
            }
        );
        
        var porcentaje = parseFloat(0.10)*members.length;
        
        for (i= 0; i < app.memberssort.length; i++){

            if (i<= porcentaje || app.memberssort[i].missed_votes_pct == app.memberssort_engaged[app.memberssort_engaged.length-1]
            .missed_votes_pct){
                app.memberssort_engaged.push(app.memberssort[i]);
            }
        }

        var membersreversed = app.memberssort.reverse();
        
        for (i= 0; i < membersreversed.length; i++){
            if (i<= porcentaje || membersreversed[i].missed_votes_pct == app.membersreversed_engaged[app.membersreversed_engaged.length-1]
            .missed_votes_pct){
                app.membersreversed_engaged.push(membersreversed[i]);
            }
        }
    }

    },

    avoidnull(middlename){
        if (middlename==null){
            return "";
        }else{
            return middlename;
        }
    }, 
     
    },
});


app.check_site();