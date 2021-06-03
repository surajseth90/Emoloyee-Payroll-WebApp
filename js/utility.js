const stringifyDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const empDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString('en-GB', options);
    return empDate;
}

const update = (node) => {
    let employeePayrollData = employeePayrollList.find(empData => empData._id == node.id)
    if (!employeePayrollData) return;
    localStorage.setItem('editEmp', JSON.stringify(employeePayrollData));
    console.log("hi");
    window.location.replace("../pages/payroll_form.html");
}