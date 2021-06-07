let isUpdate = false;
let employeePayrollObj = {};

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


const saveForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayrollObject();
        if (site_properties.use_local_storage.match("true")) {
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        } else {
            createOrUpdateEmployeePayroll();
        }

    } catch (e) {
        console.log(e);
        return;
    }
}

const setEmployeePayrollObject = () => {
    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayrollObj.id = createNewId();
    }
    employeePayrollObj._name = document.getElementById("name").value;
    employeePayrollObj._profile = document.querySelector('input[name = profile]:checked').value;
    employeePayrollObj._gender = document.querySelector('input[name = gender]:checked').value;
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = document.getElementById("salary").value;
    var day = document.getElementById("day").value;
    var month = document.getElementById("month").value;
    var year = document.getElementById("year").value;
    employeePayrollObj._note = document.getElementById("notes").value;
    employeePayrollObj._startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

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


function createAndUpdateStorage() {
    let employeeList = JSON.parse(localStorage.getItem("EmployeeList"));
    if (employeeList) {
        let employee = employeeList.find(emp => emp.id == employeePayrollObj.id);
        if (!employee) employeeList.push(saveData());
        else {
            const index = employeeList.map(emp => emp.id).indexOf(employee.id);
            employeeList.splice(index, 1, employeePayrollObj);
        }
    } else {
        employeeList = [saveData()];;
    }

    localStorage.setItem("EmployeeList", JSON.stringify(employeeList));
};

const createOrUpdateEmployeePayroll = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if (isUpdate) {
        methodCall = "PUT";
        postURL = postURL + employeePayrollObj.id.toString();
    }
    makePromiseCall(methodCall, postURL, true, employeePayrollObj)
        .then(responseText => {
            resetForm();
            window.location.replace(site_properties.home_page);
        })
        .catch(error => {
            throw error;
        });
}

function saveData() {
    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayrollObj.id = createNewId();
    }
    employeePayrollObj._name = document.getElementById("name").value;
    employeePayrollObj._profile = document.querySelector('input[name = profile]:checked').value;
    employeePayrollObj._gender = document.querySelector('input[name = gender]:checked').value;
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = document.getElementById("salary").value;
    var day = document.getElementById("day").value;
    var month = document.getElementById("month").value;
    var year = document.getElementById("year").value;
    employeePayrollObj._note = document.getElementById("notes").value;
    employeePayrollObj._startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return employeePayrollObj;
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

const createNewId = () => {
    let empId = localStorage.getItem("EmployeeID");
    empId = !empId ? 1 : (parseInt(empId) + 1).toString();
    localStorage.setItem("EmployeeID", empId);
    return empId;
};