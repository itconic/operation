function search(){
    var cliente=document.getElementById("cliente").value;
    var table=document.getElementById("mytable");
    table.hidden=true;
    var dhAPI = "/actions";
    $.getJSON( dhAPI, {
        cliente:cliente
    },function( data ) {
        if ((data)&&(data.length>0)){
            table.hidden=false;
            table.removeChild(table.tBodies[0]);
	        var tBody = document.createElement ("tbody");
            table.appendChild (tBody);
            $.each( data, function( i, item ) {
                var row = table.tBodies[0].insertRow();
                var cliente=row.insertCell(0);
                cliente.innerHTML+=item.cliente;
                var device=row.insertCell(1);
                device.innerHTML+=item.device;
                var severity=row.insertCell(2);
                severity.innerHTML+=item.severity;
                var objectclass=row.insertCell(3);
                objectclass.innerHTML+=item.objectclass;
            });
        }
    });
        
        
}