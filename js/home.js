let employeePayrollList;

window.addEventListener('DOMContentLoaded', (event) => {
    if (site_properties.use_local_storage.match("true")) {
        getEmployeePayrollDataFromStorage();
    } else getEmployeePayrollDataFromServer();

});


const getEmployeePayrollDataFromStorage = () => {
    employeePayrollList = localStorage.getItem('EmployeePayrollList') ?
        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(responseText => {
            employeePayrollList = JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error => {
            console.log("GET Error Status: " + JSON.stringify(error));
            employeePayrollList = [];
            processEmployeePayrollDataResponse();
        })
}

const processEmployeePayrollDataResponse = () => {
    document.querySelector(".emp-count").textContent = employeePayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}


const createInnerHtml = () => {
    const headerHtml = `
        <th></th>
        <th>Name</th>
        <th>Gender</th>
        <th>Department</th>
        <th>Salary</th>
        <th>Start Date</th>
        <th>Actions</th> `;

    if (employeePayrollList.length == 0) return;
    let innerHtml = `${headerHtml}`;
    for (const employeePayrollData of employeePayrollList) {
        innerHtml = `${innerHtml}
    <tr>
        <td><img class="profile" alt="" src="${employeePayrollData._profilePic}"></td>
            <td>${employeePayrollData._name}</td>
            <td>${employeePayrollData._gender}</td>
            <td>
                ${getDeptHtml(employeePayrollData._department)}
            </td>
            <td>${employeePayrollData._salary}</td>
            <td>${stringifyDate(employeePayrollData._startDate)}</td>
            <td>
            <img id="${employeePayrollData.id}" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
            <img id="${employeePayrollData.id}" onclick="update(this)" src="../assets/icons/create-black-18dp.svg">
        </td>
    </tr>
        `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml;
}

// const creteEmployeePayrollJSON = () => {
//     let empPayrollListLocal = [
//         {
//             _name: 'Suraj Gupta',
//             _gender: 'male',
//             _department: [
//                 'Engineering',
//                 'HR'
//             ],
//             _salary: '400000',
//             _startDate: '07 Apr 2020',
//             _note: 'my first joining',
//             id: new Date().getTime(),
//             _profilePic: '../assets/profile-images/Ellipse -2.png'
//         },
//         {
//             _name: 'Sonali Rathore',
//             _gender: 'female',
//             _department: [
//                 'Engineering',
//                 'Finance'
//             ],
//             _salary: '800000',
//             _startDate: '01 Apr 2019',
//             _note: 'my first joining',
//             id: new Date().getTime() + 1,
//             _profilePic: '../assets/profile-images/Ellipse -2.png'
//         }
//     ]

//     return empPayrollListLocal;
// }

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class ='dept-label'>${dept} </div>`
    }
    return deptHtml;
}

const remove = (node) => {
    let empPayrollData = employeePayrollList.find(empData => empData.id == node.id);
    if (!empPayrollData) return;
    const index = employeePayrollList
                      .map(empData => empData.id)
                      .indexOf(empPayrollData.id);
    employeePayrollList.splice(index, 1);
    if (site_properties.use_local_storage.match("true")) {
        localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
        document.querySelector(".emp-count").textContent = employeePayrollList.length;
        createInnerHtml();
    } else {
        const deleteURL = site_properties.server_url + empPayrollData.id.toString();
        makeServiceCall("DELETE", deleteURL, true)
            .then(responseText => {
                document.querySelector(".emp-count").textContent = employeePayrollList.length;
                createInnerHtml();
            })
            .catch(error => {
                console.log("DELETE Error Status: " + JSON.stringify(error));
            });
    }

}

const update = (node) => {
    let employeePayrollData = employeePayrollList.find(empData => empData.id == node.id)
    if (!employeePayrollData) return;
    localStorage.setItem('editEmp', JSON.stringify(employeePayrollData));
    window.location.replace("../pages/payroll_form.html");
}
