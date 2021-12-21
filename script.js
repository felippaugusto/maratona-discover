const Modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        // Fechar o modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
} // responsável por adicionar a classe active ou retira-lá

// poderiamos usar também o toggle e em vez de usar duas funções poderiamos ter usado uma já que o toggle adiciona e remove dependendo da existência do elemento e ao invés do remove e do add poderia usar toggle, por isso js tem diversas maneiras de se construir funcionalidades

// const transactions

// Eu preciso somar as entradas
// depois eu preciso somar as saídas e
// remover das entradas o valor das saídas
// assim, eu terei o total

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
        // está transformando de volta em arrays quando ele for pegar de volta do localStorage, se não tiver nada ele voltará como array vazio 
    },

    set(transactions) {
            localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
            // Está transformando seus arrays em strings para enviar ao localStorage
    }
} // aqui vai ser onde vamos guardar nossos dados

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    }, // aqui ele vai adicionar uma nova transação

    remove(index) {
        // aqui vai ser onde vamos remover os registros caso clicamos em remover
        Transaction.all.splice(index, 1) // removerá um elemento a partir do seu array
        App.reload()
    }, // método para remover as transações

    incomes() {
        let income = 0;
        // Somar as entradas

        // pegar todas as transações
        // para cada transação
        Transaction.all.forEach(transaction => {
            // se ela for maior que zero
            if(transaction.amount > 0) {
                // somar a uma variável e retornar a variável
                income += transaction.amount;
            }
        })
      
        return income;
    },
    expenses() {
        let expense = 0;
        // Somar as saídas

        // pegar todas as transações
        // para cada transação
        Transaction.all.forEach(transaction => {
            // se ela for menor que zero
            if(transaction.amount < 0) {
                // somar a uma variável e retornar a variável
                expense += transaction.amount;
            }
        })
        return expense
    },
    total() {
        // entradas - saídas
        return Transaction.incomes() + Transaction.expenses();
    }
}
// Transaction é responsável apenas pelo cálculo matemático

// Eu preciso pegar as minhas transações do meu objeto
// aqui no JavaScript
// e colocar lá no HTML
// Substituir os dados do HTML com os dados do JS

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'), // é o que está contendo as 3 entradas la na tabela do html

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) // dentro do tr, o innerHTML está colocando toda a estrutura da const html, o tr.innerHTML está capturando o return
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formateCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formateCurrency(Transaction.incomes()) // innerHTML pode trocar o texto
        // Utils.formateCurrency está formatando os números colocando vírgula, ponto e R$

        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formateCurrency(Transaction.expenses())

        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formateCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}
// a DOM é a parte visual do HTML

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        // aqui ele faz o retorno de um valor formatado
        
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        // aqui ele pega a data do seu input e tira o -

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        // aqui ele retorna a a date em formato de dia, mês e ano com /
    },

    formateCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        // verifição se o número for menor que 0 ele adiciona um menos ao número senão ele deixa sem nada, uma string vazia

        value = String(value).replace(/\D/g, "")
        // trabalha a remoção de qualquer caracter especial

        value = Number(value) / 100
        // Dividir por 100 pois, estamos guardando ele sempre multiplicado por 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        // trabalha o valor da moeda

        // aqui vamos transformar o number em string, pois a string tem a funcioanalidade chamada de replace

        return signal + value

    }
}

// está pegando os objetos do transactions e passando para dentro de DOM.addTransaction e ali dentro estamos usando os objetos e interpolando com a tabela

// não pode usar nomes reservados para colocar em nomes de vairáveis, por exemplo document que chama os elementos do html

// A function DOM vai ser responsável por criar o HTML para mim

const Form = {
    description: document.querySelector('input#description'), // aqui ele pega o elemento input inteiro
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
            // aqui é onde estamos recebendo os objetos com os valores
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        // aqui se colocarmos informações no description estaremos pegando elas

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        // está dentro da função utils a formatação do amount

        date = Utils.formatDate(date)
        // está dentro da função utils a formatação do date
        
        return {
            description,
            amount,
            date
        }
    }, // formatação da descrição, dos valores e das datas

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {

        event.preventDefault()
        // essa linha não deixa que os dados sejam salvos na url, interrompendo o comportamento padrão

        try {
            // verificar se todas as informações foram preenchidas
            Form.validateFields()
            // formatar os dados para salvar
            const transaction = Form.formatValues()
            // salvar
            Form.saveTransaction(transaction)
            // apagar os dados do formulário para fazer novas transações
            Form.clearFields()
            // modal feche
            Modal.close()
        
        } catch (error) {
            alert(error.message)
        }
        
        
    }
}

const App = {
    init () {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        // aqui está adicionando a DOM

        DOM.updateBalance()
        // atualizando a parte dos cartões

        Storage.set(transaction.all)
        // atualizando nosso localStorage onde está salvando nossos dados
    },
    reload() {
        DOM.clearTransactions()
        // antes de executar de novo toda nossa aplicação, ele limpa esse DOM.clearTransactions limpa os dados antigos e registra de novo com o App.init()
        App.init()
    },
}



// foreach = para cada. O foreach se parece mt com o for e ele tmb é uma estrutura de repetição, ali por exemplo ele é um estrutra de repetição que para cada elemento de trasactions que no caso é aqueles objetos, ele vai rodar um DOM.addTransaction


// Aqui é onde vai ser adicionado uma nova transação

App.init()



