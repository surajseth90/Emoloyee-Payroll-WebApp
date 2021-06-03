window.addEventListener('DOMContentLoaded', (event) => {
    createInnerHtml();
});

const createInnerHtml = () => {

    const headerHtml = `
        <th></th>
        <th>Name</th>
        <th>Gender</th>
        <th>Department</th>
        <th>Salary</th>
        <th>Start Date</th>
        <th>Actions</th> `;

    let innerHtml = `${headerHtml}`;
    let employeePayrollList = creteEmployeePayrollJSON();
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
            <td>${employeePayrollData._startDate}</td>
            <td>
                <img name="${employeePayrollData._id}" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
                <img name="${employeePayrollData._id}" onclick="update(this)" src="../assets/icons/create-black-18dp.svg">
        </td>
    </tr>
        `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml;
}

const creteEmployeePayrollJSON = () => {
    let empPayrollListLocal = [
        {
            _name: 'Suraj Gupta',
            _gender: 'male',
            _department: [
                'Engineering',
                'HR'
            ],
            _salary: '400000',
            _startDate: '07 Apr 2020',
            _note: 'my first joining',
            _id: new Date().getTime(),
            _profilePic: '../assets/profile-images/Ellipse -2.png'
        },
        {
            _name: 'Sonali Rathore',
            _gender: 'female',
            _department: [
                'Engineering',
                'Finance'
            ],
            _salary: '800000',
            _startDate: '01 Apr 2019',
            _note: 'my first joining',
            _id: new Date().getTime() + 1,
            _profilePic: '../assets/profile-images/Ellipse -2.png'
        }
    ]

    return empPayrollListLocal;
}

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class ='dept-label'>${dept} </div>`
    }
    return deptHtml;
}