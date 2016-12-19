p5.disableFriendlyErrors = true;
var n;
var structureField;
var activation, learning, bias;

var exempleCode, exampleData;
var buttonCode, buttonSaveCode;
var showCode = false;

var button, answer;

var exampleFile = "examples/sin.json";
var emptyFile = "examples/empty.json";
var exampleText;
function preload(){
  // Eviter d'utliser preload : appartion de texte dans structureField
  //example = loadJSON(exampleFile, loadExample);
  //exampleString = loadStrings(exampleFile);
}


function setup() {

  // Neural Network:
  var canvas = createCanvas(250, 250);
  canvas.parent('p5-graph');

  bias = select("#checkbox-1");
  bias.changed(newFieldNeuralStructure);

  structureField = select("#neural-structure-field-value");
  structureField.value("2 3 1");
  displayNewNetwork([2,3,1], bias.checked());
  structureField.input(newFieldNeuralStructure);

  activation = select("#select-activation");
  learning = select("#select-learning");


  //Example:
  // TODO : Créer une fonction pour ouvrir un exemple
  loadExample(exampleFile);

  exampleCode = select("#example-code");
  exampleData = select("#example-data");
  buttonCode = select("#button-code");
  buttonCode.mousePressed( function(){
    showCode = !showCode;
    if(showCode){ //Code
      exampleCode.style("display:block");
      exampleData.style("display:none");

      select("#example-code-text").value(exampleText);
    }else{  //Data
      exampleCode.style("display:none");
      exampleData.style("display:block");

      exampleText = select("#example-code-text").value();
      loadExampleData(exampleText);
    }
  });

  //Save text :
  buttonSaveCode = select("#button-example-code-save");
  buttonSaveCode.mousePressed(function(){
    var code = select("#example-code-text").value();
    code = split(code, '\n');
    saveStrings(code,'sin.txt');
  });

  buttonNewExample = select("#button-newFile");
  buttonNewExample.mousePressed(function(){
    var answer = confirm("Créer un nouvel exemple ?");
    if(answer) {
      loadExample(emptyFile);
    }
  });



  //button = select("#sendButton");
  //button.mousePressed(sendData);

  //answer = select("#answer");
  //answer.html(6);


  /*
  example.input(newExample);
  //loadExample('example name');
  console.log(example.value());
*/


}


function newExample(){
  console.log(example.value());
  //loadExample(example.value());
}

function loadExample(file){
  var text = loadStrings(file, function(){  //Chargement de l'exemple
    text = join(text, "\n");
    loadExampleData(text);

    select("#example-code-text").value(text);

    exampleText = text; // ~return
  });
}

function loadExampleData(data){ //data : String
  console.log("load data..");
  data = JSON.parse(data);  //String to JSON

  select("#example-name").html(data.name);

  select("#example-inputs").html(data.inputsName);
  select("#example-outputs").html(data.outputsName);

  if(data.inputsName.length==1)select("#example-inputs-text").html("Entrée :");
    else select("#example-inputs-text").html("Entrées :");
  if(data.outputsName.length==1)select("#example-outputs-text").html("Sortie :");
    else select("#example-outputs-text").html("Sorties :");

  select("#example-nExamples").html(data.examples.length);

  select("#example-structure").html(data.recommanded.structure);
  select("#example-activation").html(data.recommanded.activation);
  select("#example-rate").html(data.recommanded.rate);
  select("#example-bias").html(data.recommanded.bias);


  // TODO : Adapter l'affichage pour les exemples
  //select("#example-examples").html(data.examples);

}


function sendData(){
  console.log("Sending data ...");

  var data = {
    data: textToNumbers(structureField.value())  // TODO: Ajouter vérification
  };
  console.log(data);

  httpPost('/computePython',data,'json', dataPosted, postError);  //Envoie de la demande au serveur
}

function dataPosted(result){  //Réponse du serveur
  console.log(result.sum);
  //answer.html(result.sum);
}

function postError(error){
  console.log(error);
}



function newFieldNeuralStructure(){
  var text = structureField.value();
  numbers = textToNumbers(text);

  if(numbers.length>=2){ //Minimum les entrées et sorties
    displayNewNetwork(numbers, bias.checked());
  }else console.log("! : il faut minimum 2 chiffres (>0)");
}

function textToNumbers(text){
  numbers = split(text," ");  //Sépare les éléments du texte

  var onlyNumbers = true; //Trie des valeurs
  for(var i=numbers.length-1; i>=0; i--){
    if(numbers[i]=="") numbers.splice(i,1); //Supprime les éléments vide
     else if(!int(numbers[i])){ //Vérfie si la valeur est bien un nombre (>0)
      onlyNumbers=false;
      break;
    }else numbers[i]=int(numbers[i]);
  }

  if(!onlyNumbers){ //Message d'erreur
    console.log("not only numbers !!");
    return false;
  }

  return numbers;
}

function displayNewNetwork(layers, bias){
  background(250);
  n = new Network(layers, bias);

  var inputs = [];  //Nombre d'inputs en fonction du nombre d'entrée
  for(var j=0; j<layers[0]; j++) inputs.push(1);

  n.forward(inputs);
  translate(2,2);
  n.display(width-4,height-4,28);
}


function draw() {

}
