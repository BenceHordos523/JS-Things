let budgetController = (function(){

  let Expense = function(id, description, value){
    this.id = id
    this.description = description
    this.value = value
    this.percentage = -1
  }

  Expense.prototype.calcPrecentage = function(totalInc){
    if(totalInc > 0){
      this.percentage = Math.round((this.value / totalInc) * 100)
    } else {
      this.percentage = -1
    }
  }

  Expense.prototype.getPercentage = function(){
    return this.percentage
  }

  let Income = function(id, description, value){
    this.id = id
    this.description = description
    this.value = value
  }

  let calculateTotal = function(type){
    data.totals[type] = data.allItems[type].reduce((acc, item) => acc + item.value, 0)
  }

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: function({ type, description, value }){ //input values
      let newItem, lastID
      if(data.allItems[type].length > 0){
        lastID = data.allItems[type][data.allItems[type].length - 1].id
      } else {
        lastID = 0
      }

      switch(type){
        case "inc":
          newItem = new Income(lastID + 1, description, value)
          break;
        case "exp":
          newItem = new Expense(lastID + 1, description, value)
          break;
      }
      data.allItems[type].push(newItem)
      return newItem
    },

    calculateBudget: function(){
      calculateTotal("inc")
      calculateTotal("exp")
      data.budget = data.totals.inc - data.totals.exp

      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      } else {
        data.percentage = -1
      }
    },

    calculatePercenteges: function(){
      data.allItems.exp.forEach(item => item.calcPrecentage(data.totals.inc))
    },

    getPercentages: function(){
      return data.allItems.exp.map(item => item.getPercentage())
    },

    deleteItem: function(type, id){
      console.log(type, id)
      data.allItems[type] = data.allItems[type].filter(item => item.id !== id)
    },

    testing: function(){
      console.log(data)
    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    }
  }

})()

let UIController = (function(){
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensePercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  }

  let formatNumber = function(num, type){
    num = Math.abs(num).toFixed(2)
    let [int, dec] = num.split(".")
    if(int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length)
    }

    return (type === "exp" ? "-" : "+") + int + "." + dec

  }

  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value, //description value
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value), //money value
      }
    },

    addListItem: function({ id, description, value }, type){
      let html, element

      if(type === 'inc'){
        element = DOMstrings.incomeContainer
        html = `
          <div class="item clearfix" id="inc-${id}">
              <div class="item__description">${description}</div>
              <div class="right clearfix">
                  <div class="item__value">${formatNumber(value, type)}</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>
          `
      } else {
        element = DOMstrings.expenseContainer
        html = `
          <div class="item clearfix" id="exp-${id}">
              <div class="item__description">${description}t</div>
              <div class="right clearfix">
                  <div class="item__value">${formatNumber(value, type)}</div>
                  <div class="item__percentage"></div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>
        `
      }
      document.querySelector(element).insertAdjacentHTML('beforeend', html)
    },

    deleteListItem: function(selectorID){
      const element = document.getElementById(selectorID)

      element.parentNode.removeChild(element)
    },

    displayPercentages: function(percentages){
      let fields = document.querySelectorAll(DOMstrings.expensePercentageLabel)

      fields.forEach((field, index) => field.textContent = `${percentages[index]}%`)
    },

    clearFields: function(){
      let fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
      fields.forEach(field => field.value = "")
      fields[0].focus()
    },

    displayBudget: function({ budget, totalInc, totalExp, percentage }){
      let budgetType =  budget >= 0 ? 'inc' : 'exp'
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budget, budgetType)
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(totalInc, "+")
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(totalExp, "-")

      if(percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = percentage
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---'
      }

    },

    changeType: function(){
      let fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      )

      fields.forEach(field => {
        field.classList.toggle('red-focus')
      })

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
    },

    displayMonth: function(){
      const now = new Date()
      const year = now.getFullYear()
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
      const month = now.getMonth()

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
    },

    getDOMStrings: function(){
      return DOMstrings
    }
  }
})()

let controller = (function(budgetCtrl, UICtrl){

  let setUpEventListeners = function(){
    let DOM = UICtrl.getDOMStrings()

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAdditem)

    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        ctrlAdditem()
      }
    })

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)
  }

  let ctrlAdditem = function(){
    let input, newItem

    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      newItem = budgetCtrl.addItem(input);

      UICtrl.addListItem(newItem, input.type)

      UICtrl.clearFields()

      updateBudget()

      updtePercentages()
    }
  }

  let ctrlDeleteItem = function(e){
    let itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      let [type, id] = itemID.split("-")

      budgetCtrl.deleteItem(type, parseInt(id))

      UICtrl.deleteListItem(itemID)

      updateBudget()

      updtePercentages()
    }
  }

  let updateBudget = function(){
    budgetCtrl.calculateBudget()

    let budget = budgetCtrl.getBudget()

    UICtrl.displayBudget(budget)

  }

  let updtePercentages = function(){
    budgetCtrl.calculatePercenteges()

    let percentages = budgetCtrl.getPercentages()

    UICtrl.displayPercentages(percentages)
  }

  return {
    init: () => {
      setUpEventListeners()
      UICtrl.displayMonth()
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      })
    }
  }

})(budgetController, UIController)

controller.init()