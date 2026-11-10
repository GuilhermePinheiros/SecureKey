


const passwordLength = document.querySelector('#password-length');


const lengthValue = document.querySelector('#length-value');

const passwordStatus = document.querySelector('#password-status'); //validar as opções

const passwordOutput = document.querySelector('#password-output');

const copyButton = document.querySelector('#copy-button');

const message = document.querySelector('#message');  //para apresentar mensagens de feedback ao usuário.

const modeToggle = document.querySelector('#mode-toggle'); //identificar o interruptor

const wordCountField = document.querySelector('#word-count-field'); //seletor de quantidade de palavras

const wordCount = document.querySelector('#word-count');// Pegando a quantidade de palavras 

modeToggle.addEventListener('change', () => {
    wordCountField.hidden = !modeToggle.checked;
});


// Armazenar as palavras carregadas do JSON
let words = [];

async function loadWords() {
    try {
        const response = await fetch('./palavras/palavras-securekey.json');

        if (!response.ok) {
            throw new Error('Não foi possível carregar o arquivo de palavras.');

        }

        words = await response.json();

        console.log('Palavras carregadas:', words.length);
        


    }catch (error) {

        console.error('Erro ao carregar palavras:', error);
        
    }
}

loadWords();

//sortear palavras

function getRandomWord() {
    const randomValue = new Uint32Array(1);

    crypto.getRandomValues(randomValue);

    const randomIndex = randomValue[0] % words.length;

    return words[randomIndex];
}

/* ====================
Evento de tamnho da senha
======================  */
 function generateReadablePassword() {
    const quantity = Number(wordCount.value);

    //fazer a função escolher palavras aleatórias do nosso arquivo JSON.
    const selectedWords = [];

    for (let i = 0; i < quantity; i++) {
        selectedWords.push(getRandomWord());
    }

    //Juntar as palavras
    const readablePassword = selectedWords.join('');

    //Preparar a senha
    let password = readablePassword;

    //Adicionar números quando selecionados
    if (numbers.checked) {
        const randomNumber = crypto.getRandomValues(new Uint32Array(1))[0] % 100; //Depois melhorar a segurança estatíca da geração.
        password += randomNumber;
    }

    //Adicionar símbolos
    if (symbols.checked) {
        const availableSymbols = '!@#$%&*()-_=+';
        const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % availableSymbols.length;

        password += availableSymbols[randomIndex];
    }

    //Retornar a senha gerada
    return password;

 }

passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
});

 //identificar os tipos de caracteres
const lowercase = document.querySelector('#lowercase');
const uppercase = document.querySelector('#uppercase');
const numbers = document.querySelector('#numbers');
const symbols = document.querySelector('#symbols');

console.log('Minúsculas:', lowercase);
console.log('Maiúsculas:', uppercase);
console.log('Números:', numbers);
console.log('Símbolos:', symbols);



//detectar quando o usuário clicar no botão de gerar senha.

const passwordForm = document.querySelector('#password-form');

passwordForm.addEventListener('submit', (event) => {
    event.preventDefault(); // impede a ação padrão do navegador.

    if (modeToggle.checked) {
        const password = generateReadablePassword();
        passwordOutput.textContent = password;
        copyButton.disabled = false;
        return;
    }

    //Verificar os tipos de caracteres
    const hasCharacterType =
        lowercase.checked ||
        uppercase.checked ||
        numbers.checked ||
        symbols.checked ;

    if (!hasCharacterType) {
        passwordStatus.textContent =  'Selecione pelo menos um tipo de caractere.';
        passwordOutput.textContent = '';
        copyButton.disabled = true;
        return;
    }

    passwordStatus.textContent = 'Opções válidas! Podemos gerar a senha.';

    //Lógica dos tipos de caracteres
    let characters = ''

    if (lowercase.checked) { // Verifica se a caixa de letras minúsculas está marcada.
        characters += 'abcdefghijklmnopqrstuvwxyz';

    }

    if (uppercase.checked) { // Verifica se a caixa de letras maiúsculas está marcada.
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // implementar a letra maiúscula no Modo legível
    }

    if (numbers.checked) { //verifica se a opção de números está marcada.
        characters += '0123456789';
    }

    if (symbols.checked) { //verifica se o checkbox de símbolos está marcado.
        characters += '!@#$%&*()-_=+';
    }

    //Usando uma a API para  gerar a senha com mais segurança

    const randomValues  = new Uint32Array(Number(passwordLength.value));

    crypto.getRandomValues(randomValues); //gera valores aleatórios adequados para operações que exigem segurança.

    //usar esses números para escolher caracteres aleatórios e montar a senha.
    let password = '';

    for (const randomValue of randomValues) {
        const randomIndex = randomValue % characters.length;

        password += characters[randomIndex];
    }

    //Exibindo a senha

   
    passwordOutput.textContent = password; //Inserindo o conteúdo no no elemento html 
    copyButton.disabled = false; //Para Habilitar o botão de copiar senha 

  
})

/* ======================
Funcionalidade de copiar senha
========================== */

copyButton.addEventListener('click', async () => { //Cria uma função assíncrona

    const password = passwordOutput.textContent;

    try { //Define um bloco para tentar executar uma operação que pode apresentar erro.

        await navigator.clipboard.writeText(password);

        showMessage('Senha copiada com sucesso!');
    } catch (error) {

        showMessage('Não foi possível copiar a senha.');
        
        console.error('Erro ao copiar:', error);

    }
});

//Fazer os feedback de mensagem para o usuario desaparecer 
let messageTimeout;

function showMessage(text) {
    message.textContent = text;

    clearTimeout(messageTimeout);

    messageTimeout = setTimeout(() => {
        message.textContent = '';
    }, 3000);
}

