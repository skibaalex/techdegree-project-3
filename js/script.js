//toggle the other job field display
const toggleJobField = (display) => {
    const jobField = document.getElementById('other-job-role')
    jobField.style.display = display
}

//toggle the color disabled attribute
const toggleColorDisable = (value) => {
    const ColorInput = document.getElementById('color')
    if (!ColorInput.disabled && !value) {
        ColorInput.setAttribute('disabled', true)
    } else {
        ColorInput.removeAttribute('disabled')
    }

}


//alternate between the t-shirt color based on the design
const alternateColors = (value) => {
    const colorInput = document.getElementById('color')
    const {
        children
    } = colorInput
    const jsPunsRegex = /js puns/
    const jsLoveRegex = /heart js/
    for (child of children) {
        //skip the first option (acts as a placeholder)
        if (!child.attributes['data-theme']) continue

        const regex = value === 'js puns' ? jsPunsRegex : jsLoveRegex
        const theme = child.attributes['data-theme'].value
        if (!regex.test(theme)) {
            child.setAttribute('hidden', true)
        } else {
            child.removeAttribute('hidden')
        }

    }
}

//helper function to extract the numeric value of the total cost
const extractNumber = (string) => {
    return parseInt(string.split('$').pop())
}

//update the total cost
const updateTotalPrice = (cost) => {
    const costElement = document.getElementById('activities-cost')
    const totalCost = extractNumber(costElement.innerText)
    costElement.innerText = `Total: $${totalCost + cost}`
}

//Toggle the Payment mether display
const togglePaymentMethodDisplay = (method) => {
    const creditCardPaymentForm = document.getElementById('credit-card')
    const paypalPaymentForm = document.getElementById('paypal')
    const bitcoinPaymentForm = document.getElementById('bitcoin')
    creditCardPaymentForm.style.display = method === 'credit-card' ? 'block' : 'none'
    paypalPaymentForm.style.display = method === 'paypal' ? 'block' : 'none'
    bitcoinPaymentForm.style.display = method === 'bitcoin' ? 'block' : 'none'
}


//display or remove Error messages
const displayErrors = (value, field) => {
    const element = document.getElementById(`${field}-hint`)
    element.style.display = value ? 'none' : 'block'
    if (field === 'email') {
        const email = element.parentNode.children[1].value
        console.log(email)
        element.innerText = email.length ? 'Email address must be formatted correctly' : 'Email field cannot be empty'
    }
}

//validate email
const validateEmail = () => {
    const email = document.getElementById('email')
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const emailValidation = emailRegex.test(email.value)
    email.parentNode.classList.add(emailValidation ? 'valid' : 'not-valid')
    email.parentNode.classList.remove(!emailValidation ? 'valid' : 'not-valid')
    displayErrors(emailValidation, 'email')
}

//validate name
const validateName = () => {
    const name = document.getElementById('name')
    const nameRegex = /^\w+$/
    const nameValidation = nameRegex.test(name.value) ? true : false
    name.parentNode.classList.add(nameValidation ? 'valid' : 'not-valid')
    name.parentNode.classList.remove(!nameValidation ? 'valid' : 'not-valid')
    displayErrors(nameValidation, 'name')
}

//validate Register for Activities
const validateActivities = () => {
    const total = document.getElementById('activities-cost')
    const activitiesValidation = extractNumber(total.innerText) ? true : false
    total.parentNode.classList.add(activitiesValidation ? 'valid' : 'not-valid')
    total.parentNode.classList.remove(!activitiesValidation ? 'valid' : 'not-valid')
    displayErrors(activitiesValidation, 'activities')
}


//validate CC number
const validateCCNumber = () => {
    const ccNumber = document.getElementById('cc-num')
    const ccNumberRegex = /^(\d{13,16})$/
    const ccNumberValidation = ccNumberRegex.test(ccNumber.value)
    ccNumber.parentNode.classList.add(ccNumberValidation ? 'valid' : 'not-valid')
    ccNumber.parentNode.classList.remove(!ccNumberValidation ? 'valid' : 'not-valid')
    displayErrors(ccNumberValidation, 'cc')
}


//validate zipcode
const validateZipCode = () => {
    const ccZip = document.getElementById('zip')
    const ccZipRegex = /^(\d{5})$/
    const ccZipValidation = ccZipRegex.test(ccZip.value)
    ccZip.parentNode.classList.add(ccZipValidation ? 'valid' : 'not-valid')
    ccZip.parentNode.classList.remove(!ccZipValidation ? 'valid' : 'not-valid')
    displayErrors(ccZipValidation, 'zip')
}

//validate CVV
const validateCVV = () => {
    const ccCVV = document.getElementById('cvv')
    const ccCVVRegex = /^(\d{3})$/
    const ccCVVValidation = ccCVVRegex.test(ccCVV.value)
    ccCVV.parentNode.classList.add(ccCVVValidation ? 'valid' : 'not-valid')
    ccCVV.parentNode.classList.remove(!ccCVVValidation ? 'valid' : 'not-valid')
    displayErrors(ccCVVValidation, 'cvv')
}

//validate the form
const validateForm = () => {

    validateEmail()
    validateName()
    validateActivities()

    //validate Credit card Payment if the method is selected
    const method = document.getElementById('payment').value
    if (method === 'credit-card') {
        validateCCNumber()
        validateZipCode()
        validateCVV()
    }

}


//disable Conflicting Activities
const disableConflictActivity = (node, activities, checked) => {
    const time1 = node.attributes['data-day-and-time'].value
    const {
        parentNode
    } = node
    for (activity of activities) {
        //skip if its the same node or the main activity
        if (activity === parentNode || activity.children.length === 4) continue;
        const input = activity.children[0]
        const time2 = input.attributes['data-day-and-time'].value
        if (time1 === time2) {
            if (checked) {
                activity.classList.add('disabled')
                input.setAttribute('disabled', true)
            } else {
                activity.classList.remove('disabled')
                input.removeAttribute('disabled')
            }
        }
    }
}

//initialize the app
const initializeApp = () => {
    //focus the name input
    document.getElementById('name').focus()

    //hide the other jobs field
    toggleJobField('none')
    //add event listener in case other job was clicked
    document.getElementById('title').addEventListener('change', e => {
        const {
            value
        } = e.target
        if (value === 'other') toggleJobField('block')
        else toggleJobField('none')
    })

    //disable the t-shirt color select element
    toggleColorDisable()

    //add an event listener to the Design select input
    const designInput = document.getElementById('design')
    designInput.addEventListener('change', e => {
        const {
            value
        } = e.target;
        if (value) {
            toggleColorDisable(value)
            alternateColors(value)
        }
    })

    //add activities checkbox change events
    const activities = document.getElementById('activities-box')
    for (activity of activities.children) {
        const {
            children
        } = activity;
        children[0].addEventListener('change', e => {
            const {
                checked
            } = e.target;
            updateTotalPrice(checked ? parseInt(e.target.attributes['data-cost'].value) : parseInt(e.target.attributes['data-cost'].value) * -1)
            //Extra Credit Disable Conflict Activities
            if (e.target.parentNode.children.length === 5) disableConflictActivity(e.target, activities.children, checked)
        })
        children[0].addEventListener('focus', e => {
            e.target.parentNode.classList.add('focus')
        })
        children[0].addEventListener('blur', e => {
            e.target.parentNode.classList.remove('focus')
        })
    }

    //handle payment selection
    const paymentSelect = document.getElementById('payment')
    //set default to creditcard payment
    paymentSelect.value = 'credit-card'
    togglePaymentMethodDisplay('credit-card')
    //alternate between the payment methods
    paymentSelect.addEventListener('change', e => {
        const {
            value
        } = e.target
        togglePaymentMethodDisplay(value)
    })

    //set submit handler
    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault()
        validateForm()
    })
    realTimeErrors()
}


//Extra Credit Real Time Error Messages
function realTimeErrors() {
    const elements = [{
        node: document.getElementById('name'),
        name: 'name',
        validator: validateName
    }, {
        node: document.getElementById('email'),
        name: 'email',
        validator: validateEmail
    }, {
        node: document.getElementById('credit-card'),
        name: 'credit-card',
        validator: validateCCNumber
    }, {
        node: document.getElementById('zip'),
        name: 'zip',
        validator: validateZipCode
    }, {
        node: document.getElementById('cvv'),
        name: 'cvv',
        validator: validateCVV
    }]
    for (let element of elements) {
        element.node.addEventListener('keyup', element.validator)
    }
}




initializeApp()