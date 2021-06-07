const stringifyDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const empDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString('en-GB', options);
    return empDate;
}

const checkName = (name) => {
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$')
    if (!nameRegex.test(name))
        throw 'Name is Incorrect'
}

const checkStartDate = (startDate) => {
    let now = new Date();
    if (startDate > now)
        throw 'Start date is Future Date!!'
}