const salary = document.querySelector('#salary');
const output = document.querySelector('.salary-output');
output.textContent = salary.value;
salary.addEventListener('input', function() {
    output.textContent = salary.value;
});

document.getElementById("submit").onclick = function() {
    let employee = new EmployeePayroll();
    employee._name = document.getElementById("name").value;
    employee._picture=document.getElementsByClassName("profile").value;
    employee._gender=document.getElementsByClassName("gender").value;
    employee._department = document.querySelector('input[name = department]:checked').value;
    employee._salary = document.getElementById("salary").value;
    employee._notes = document.getElementById("notes").value;
};