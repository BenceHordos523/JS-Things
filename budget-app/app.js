let budgetController = (function(){
  let Expanse = function(id, description, value){
    this.id = id
    this.description = description
    this.value = value
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
          newItem = new Expanse(lastID + 1, description, value)
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
    percentageLabel: '.budget__expenses--percentage'
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
          <div class="item clearfix" id="income-${id}">
              <div class="item__description">${description}</div>
              <div class="right clearfix">
                  <div class="item__value">+ ${value}</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>
          `
      } else {
        element = DOMstrings.expenseContainer
        html = `
          <div class="item clearfix" id="expense-${id}">
              <div class="item__description">${description}t</div>
              <div class="right clearfix">
                  <div class="item__value">- ${value}</div>
                  <div class="item__percentage">dummy%</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>
        `
      }
      document.querySelector(element).insertAdjacentHTML('beforeend', html)
    },

    clearFields: function(){
      let fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
      fields.forEach(field => field.value = "")
      fields[0].focus()
    },

    displayBudget: function({ budget, totalInc, totalExp, percentage }){
      document.querySelector(DOMstrings.budgetLabel).textContent = budget
      document.querySelector(DOMstrings.incomeLabel).textContent = totalInc
      document.querySelector(DOMstrings.expenseLabel).textContent = totalExp

      if(percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = percentage
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---'
      }

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
  }

  let ctrlAdditem = function(){
    let input, newItem

    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      newItem = budgetCtrl.addItem(input);

      UICtrl.addListItem(newItem, input.type)

      UICtrl.clearFields()

      updateBudget()
    }



  }

  let updateBudget = function(){
    budgetCtrl.calculateBudget()

    let budget = budgetCtrl.getBudget()

    UICtrl.displayBudget(budget)

  }

  return {
    init: () => {
      setUpEventListeners()
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