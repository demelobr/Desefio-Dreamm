var db = openDatabase("usersDB", "1.0", "TiPS Database Example", 2 * 1024 * 1024);

function PageDefault(){
    document.getElementById("warning").style.visibility = 'hidden';
    document.getElementById('btn-save').addEventListener('click', Send);

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS usersTable ( nomeEmpresa TEXT,cnpjEmpresa TEXT,tipoEmpresa TEXT,telefoneEmpresa TEXT,cepEmpresa TEXT,ruaEmpresa TEXT,cidadeEmpresa TEXT,paisEmpresa TEXT,nomeResponsavel TEXT,sobrenomeResponsavel TEXT,telefoneResponsavel TEXT,celularResponsavel TEXT,emailResponsavel TEXT)");
    });
}

function Send(){
    var fieldsName = ["nomeEmpresa","cnpjEmpresa","tipoEmpresa","telefoneEmpresa","cepEmpresa","ruaEmpresa","cidadeEmpresa","paisEmpresa",
                      "nomeResponsavel","sobrenomeResponsavel","telefoneResponsavel","celularResponsavel","emailResponsavel"];
    var fields = [];
    var currentField;
    var cont=0;

    for(var i=0; i < fieldsName.length; i++){
        currentField = document.getElementById(fieldsName[i]);
        fields.push(currentField.value);         
    }

    if(fields[0] == '' || fields[1] == '' || fields[2] == '' || fields[3] == '' || fields[9] == ''){
        console.log("Os campos de Nome, CNPJ, Tipo, Telefone da empresa além do sobrenome do responsável são obrigatórios!");
        document.getElementById("warning").style.visibility = 'visible';
        let warning = setTimeout(function() {
            document.getElementById("warning").style.visibility = 'hidden';
        }, 3000)
    }else{
        console.log(fields);
        UserExists(fields);
    }
}

function UserExists(fields){
    var cnpj = fields[1];
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM usersTable WHERE cnpjEmpresa = ?', [cnpj], function(tx, data){
            var rowsData = data.rows;
            if(rowsData.length == 0){
                UpdateDataBase(fields);
            }else{
                console.log("Já existe usuário com esse CNPJ!");
                Warning(1);
            }
        }, null);
    });   
}

function UpdateDataBase(fields){
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO usersTable (nomeEmpresa,cnpjEmpresa,tipoEmpresa,telefoneEmpresa,cepEmpresa,ruaEmpresa,cidadeEmpresa,paisEmpresa,nomeResponsavel,sobrenomeResponsavel,telefoneResponsavel,celularResponsavel,emailResponsavel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [fields[0],fields[1],fields[2],fields[3],fields[4],fields[5],fields[6],fields[7],fields[8],fields[9],fields[10],fields[11],fields[12]]);
    });
    console.log("Cadastro realizado com sucesso!");
    Warning(0);    
}

function Warning(flag){
    if(flag){
        document.getElementById("warning").style.backgroundColor = "#C1503E";
        document.getElementById("warningText").innerHTML = "Já existe usuário com esse CNPJ!";
        document.getElementById("warning").style.visibility = 'visible';
        let warning = setTimeout(function() {
            document.getElementById("warning").style.visibility = 'hidden';
        }, 3000)
    }else if(!flag){
        document.getElementById("warning").style.backgroundColor = "#39ff14";
        document.getElementById("warningText").innerHTML = "Cadastro realizado com sucesso!";
        document.getElementById("warning").style.visibility = 'visible';
        let warning = setTimeout(function() {
            document.getElementById("warning").style.visibility = 'hidden';
        }, 3000)
    }
}