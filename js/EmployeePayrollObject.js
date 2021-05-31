class EmployeePayroll {

    constructor(...parameters) {
        this.name = parameters[0];
        this.picture = parameters[1];
        this.gender = parameters[2];
        this.department = parameters[3];
        this.salary = parameters[4];
        this.startDate = parameters[5];
        this.notes = parameters[6];
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get picture() {
        return this._picture;
    }
    set picture(picture) {
        this._picture = picture;
    }

    get gender() {
        return this._gender;
    }

    set gender(gender) {
        this._gender = gender;
    }

    get department() {
        return this._department;
    }

    set department(department) {
        this._department = department;
    }

    get salary() {
        return this._salary;
    }

    set salary(salary) {
        this._salary = salary;
    }

    get startDate() {
        return this._startDate;
    }

    set startDate(startDate) {
        this._startDate = startDate;
    }

    get notes() {
        return this._notes;
    }

    set notes(notes) {
        this._notes = notes;
    }
}