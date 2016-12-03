p5.disableFriendlyErrors = true;
var n;
var structureField;
var button;
function setup() {

  var canvas = createCanvas(250, 250);
  canvas.parent('p5-graph');

  structureField = select("#neural-structure-field-value");
  structureField.value("2 3 1");
  structureField.input(newFieldNeuralStructure);

  button = select("#sendButton");
  button.mousePressed(sendData);

  displayNewNetwork([2,3,1]);

}

function sendData(){

  console.log("Sending data ...");

  var data = {
    data: textToNumbers(structureField.value())  // TODO: Ajouter vérification
  };

  console.log(data);

  httpPost('/computePython',data,'json', dataPosted, postError);

}

function dataPosted(result){
  console.log(result.sum);
}

function postError(error){
  console.log(error);
}



function newFieldNeuralStructure(){

  var text = structureField.value();

  numbers = textToNumbers(text);

  if(numbers.length>=2){ //Minimum les entrées et sorties
    displayNewNetwork(numbers);
  }else console.log("! : il faut minimum 2 chiffres (>0)");


  //var i = numbers[0];
  //var o = numbers.pop();  //Supprime et récupère la dernière valeur
  //numbers.splice(0,1);  //Enlève la première valeur -> numbers ne contient plus la 1ère et dernière valeur
  //var n = numbers;

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


function displayNewNetwork(layers){
  background(250);
  n = new Network(layers);

  var inputs = [];  //Nombre d'inputs en fonction du nombre d'entrée
  for(var j=0; j<layers[0]; j++) inputs.push(1);

  n.forward(inputs);
  n.display(width,height,32);
}

function draw() {


}
