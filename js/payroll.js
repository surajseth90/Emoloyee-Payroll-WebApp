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
            createAndUpdateJSONServer();
            resetForm();
            window.location.replace(site_properties.homePage);
        }

    } catch (e) {
        console.log(e);
        return;
    }
}

const setEmployeePayrollObject = () => {
    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayrollObj.id = createNewId();
    } else if (isUpdate) {
        const employeePayrollJson = localStorage.getItem('editEmp');
        empPayrollObj = JSON.parse(employeePayrollJson);
        employeePayrollObj.id = empPayrollObj.id;

    }
    employeePayrollObj._name = document.getElementById("name").value;
    employeePayrollObj._profile = document.querySelector('input[name = profile]:checked').value;
    employeePayrollObj._gender = document.querySelector('input[name = gender]:checked').value;
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = document.getElementById("salary").value;
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " "
        + getInputValueById('#year');
    employeePayrollObj._startDate = new Date(Date.parse(date));
    employeePayrollObj._notes = document.getElementById("notes").value;
};


// const createEmployeePayroll = () => {
//     try {
//         employeePayrollData.name = getInputValueById('#name');
//     } catch (e) {
//         setTextValue('.error-text', e);
//     }
//     employeePayrollData.id = new Date().getTime() + 1;
//     employeePayrollData.profilePic = getSelectedValues('[name = profile]').pop();
//     employeePayrollData.gender = getSelectedValues('[name = gender]').pop();
//     employeePayrollData.department = getSelectedValues('[name = department]');
//     employeePayrollData.salary = getInputValueById('#salary');
//     employeePayrollData.notes = getInputValueById('#notes');
//     let date = getInputValueById('#day') + " " + getInputValueById('#month') + " "
//         + getInputValueById('#year');
//     employeePayrollData.startDate = new Date(Date.parse(date));
//     return employeePayrollData;
// }

const createAndUpdateJSONServer = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if (isUpdate) {
        methodCall = "PUT";
        console.log(employeePayrollObj.id);
        postURL = postURL + employeePayrollObj.id.toString();
    }
    makeServiceCall(methodCall, postURL, true, employeePayrollObj)
        .then(responseText => {
            resetForm();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
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


function saveData() {
    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayrollObj.id = createNewId();
    }
    employeePayrollObj._name = document.getElementById("name").value;
    employeePayrollObj._profile = getSelectedValues('[name = profile]').pop();
    employeePayrollObj._gender = document.querySelector('input[name = gender]:checked').value;
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = document.getElementById("salary").value;
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " "
        + getInputValueById('#year');
    employeePayrollObj._startDate = new Date(Date.parse(date));
    employeePayrollObj._notes = document.getElementById("notes").value;
    return employeePayrollObj;
}


const createNewId = () => {
    let empId = localStorage.getItem("EmployeeID");
    empId = !empId ? 1 : (parseInt(empId) + 1).toString();
    localStorage.setItem("EmployeeID", empId);
    return empId;
};


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
    setSelectedValues('[name=profile]', empPayrollObj._profile);
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
