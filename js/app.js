var dataController = (() => {

    var Deposit = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var Withdrawal = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var calculateTotal = function (type) {
        var sum = 0
        data.allItems[type].forEach(function (current) {
            sum += current.value
            //console.log(current.value)
        })
        data.total[type] = sum
    }


    var data = {
        allItems: {
            dep: [],
            withd: []
        },
        total: {
            dep: 0,
            withd: 0
        },
        balance: 0,

    }
    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'withd' or 'dep' type
            if (type === 'withd') {
                newItem = new Withdrawal(ID, des, val);
            } else if (type === 'dep') {
                newItem = new Deposit(ID, des, val);
            }

            // Push into Data Structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        daleteItem: function (type, id) {

            var ids, index
            ids = data.allItems[type].map(function (current) {
                return current.id
            })


            index = ids.indexOf(id)


            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }

        },
        calculateBalance: function () {

            // calculate totla deposit & withdrawal
            calculateTotal('dep')
            calculateTotal('withd')

            // calculate the balance : deposit - withdrawal
            data.balance = data.total.dep - data.total.withd

            // calculate the percentage
        },
        getBalance: function () {
            return {
                balance: data.balance,
                totalDep: data.total.dep,
                totalWithd: data.total.withd
            }
        },
        testing: function () {
            console.log(data)
        }
    }
})()

var UIController = (() => {

    var DOMStrings = {
        inputType: '.add_type',
        inputDescription: '.add_description',
        inputValue: '.add_value',
        inputBtn: '.add_btn',
        depositContainer: '.deposit_list',
        withdrawnContainer: '.withdrawn_list',
        balanceLabel: '.bank_balance',
        container: '.container',
        depositLabel: '.bank_deposit--value',
        withdrawnLabel: '.bank_withdraw--value',

    }

    var formatNumber = function (num, type) {

        var numSplit, int, dec, sign
        // + or - before num
        // exactly 2 decimal points
        // comma seperating the thousands
        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')

        int = numSplit[0]

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }

        dec = numSplit[1]

        return (type === 'withd' ? '-' : '+') + ' ' + int + '.' + dec
    }

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // dep for deposit & withd for withdrawal
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, ele
            //Create HTML strings with placeholder text
            if (type === 'dep') {
                ele = DOMStrings.depositContainer
                html = '<div class="item clearfix" id="dep-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete--btn"><i class="fas fa-trash"></i></button></div></div></div>'
            } else if (type === 'withd') {
                ele = DOMStrings.withdrawnContainer
                html = '<div class="item clearfix" id="withd-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete--btn"><i class="fas fa-trash"></i></button></div></div></div>'
            }

            // replace the placeholder text with some actual data
            html = html.replace('%id%', obj.id)
            html = html.replace('%description%', obj.description)
            html = html.replace('%value%', formatNumber(obj.value, type))
            // Insert the HTML into DOM

            document.querySelector(ele).insertAdjacentHTML('beforeend', html)

        },

        deleteListItem: function (selecterID) {

            var el = document.getElementById(selecterID)
            el.parentNode.removeChild(el)
        },

        clearFields: function () {
            var fields, fieldArr
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue)
            //console.log(fields)
            fieldArr = Array.prototype.slice.call(fields)
            //console.log(fieldArr)
            fieldArr.forEach(function (current, index, araay) {
                current.value = ""
            })
            //console.log(fieldArr)
            fieldArr[0].focus()
        },
        displayBalance: function (obj) {

            var type

            obj.balance > 0 ? type = 'dep' : type = 'withd'
            document.querySelector(DOMStrings.balanceLabel).textContent = formatNumber(obj.balance, type)
            document.querySelector(DOMStrings.depositLabel).textContent = formatNumber(obj.totalDep, 'dep')
            document.querySelector(DOMStrings.withdrawnLabel).textContent = formatNumber(obj.totalWithd, 'withd')

        },
        getDOMString: function () {
            return DOMStrings
        },
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
            
        },
        displayMonth: function () {
            var x = new Date().getMonth()
            var year = new Date().getFullYear();
            var mnth = ['January', 'February', 'March', 'Aprail', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            document.getElementById('bank_title-month').innerHTML = mnth[x] 
        }
    }

})()

var controller = ((dataCtrl, UICtrl) => {

    var setupEventListener = () => {
        var DOM = UICtrl.getDOMString()
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', (event) => {
            if (event.keyCode == 13) {
                ctrlAddItem()
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDelItem)

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)

    }



    var updateBalance = function () {

        // 1. Calculate the Balance
        dataCtrl.calculateBalance()

        // 2. Return the balance
        var balance = dataCtrl.getBalance()
        // 3. Display the balance in nthe UI
        UICtrl.displayBalance(balance)
    }

    var ctrlAddItem = function () {
        var input, newItem

        // 1. Get the input data
        input = UICtrl.getInput()
        //console.log(input)

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item into DataController
            newItem = dataCtrl.addItem(input.type, input.description, input.value)

            // 3.add the newItem to UI
            UICtrl.addListItem(newItem, input.type)

            // 4.for clear fields
            UICtrl.clearFields()

            //Calculate & update Balance
            updateBalance()


        }
    }

    var ctrlDelItem = function (event) {
        var itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        //console.log(itemID)
        if (itemID) {

            // dep-0  String.split('-')
            splitID = itemID.split('-')
            // console.log(splitID)
            type = splitID[0]
            ID = parseInt(splitID[1])

            // Delete item from Data Structure

            dataCtrl.daleteItem(type, ID)
            // delte the item from UI
            UICtrl.deleteListItem(itemID)

            // Update and show new Balance
            updateBalance()
        }
    }

    return {
        init: function () {
            console.log('starting webapp')
            setupEventListener()
            updateBalance()
            UICtrl.displayMonth()
        }
    }

})(dataController, UIController)

controller.init()