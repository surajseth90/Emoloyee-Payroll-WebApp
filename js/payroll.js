let isUpdate = false;
window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    name.addEventListener('input', function () {
        if (name.value.length == 0) {
            setTextValue('.text-error', "")
            return;
        }
        try {
            checkName(name.value);
            setTextValue('.text-error', "")
        } catch (e) {
            setTextValue('.text-error', e)
        }
    });

    const date = document.querySelector('#date');
    date.addEventListener('input', function () {
        const startDate = new Date(Date.parse(getInputValueById('#day') + " " +
            getInputValueById('#month') + " " +
            getInputValueById('#year')));
        try {
            checkStartDate(startDate);
            setTextValue('.date-error', "")
        } catch (e) {
            setTextValue('.date-error', e)
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });

    checkForUpdate();
});


const saveForm = () => {
    try {
        let employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
        window.location.replace("../pages/home_page.html")

    } catch (e) {
        console.log(e);
        return;
    }
}


const createEmployeePayroll = () => {
    try {
        employeePayrollData.name = getInputValueById('#name');
    } catch (e) {
        setTextValue('.error-text', e);
    }
    employeePayrollData.id = new Date().getTime() + 1;
    employeePayrollData.profilePic = getSelectedValues('[name = profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name = gender]').pop();
    employeePayrollData.department = getSelectedValues('[name = department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.notes = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " "
        + getInputValueById('#year');
    employeePayrollData.startDate = new Date(Date.parse(date));
    return employeePayrollData;
}


const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let setItems = [];
    allItems.forEach(item => {
        if (item.checked) setItems.push(item.value);
    });
    return setItems;
}


const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}


function createAndUpdateStorage(employeePayrollData) {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList != undefined) {
        let employeePayrollCheckList = JSON.parse(localStorage.getItem("editEmp"));
        if (employeePayrollCheckList == null)
            employeePayrollList.push(employeePayrollData);
        else {
            let empCheck = employeePayrollList.find(empData => empData.id == employeePayrollCheckList.id)
            const index = employeePayrollList.map(empData => empData.id).indexOf(employeePayrollCheckList.id);
            employeePayrollList.splice(index, 1, employeePayrollData);
        }
    }
    else {
        employeePayrollList = [employeePayrollData]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
    resetForm();
}


const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name = profile]');
    unsetSelectedValues('[name = gender]');
    unsetSelectedValues('[name = department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setSelectedIndex('#day', 0);
    setSelectedIndex('#month', 0);
    setSelectedIndex('#year', 0);
}


let checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    empPayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}


const setForm = () => {
    setValue('#name', empPayrollObj._name);
    setSelectedValues('[name=profile]', empPayrollObj._profilePic);
    setSelectedValues('[name=gender]', empPayrollObj._gender);
    setSelectedValues('[name=department]', empPayrollObj._department);
    setValue('#salary', empPayrollObj._salary);
    setTextValue('.salary-output', empPayrollObj._salary);
    setValue('#notes', empPayrollObj._notes);
    let date = stringifyDate(empPayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}


const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        else if (item.value === value)
            item.checked = true;
    });
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}


const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}


const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}


const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}