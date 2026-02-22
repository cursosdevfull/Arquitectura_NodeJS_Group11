export class MedicalModelDomain {
    private readonly medicId: number;
    private name: string;
    private lastname: string;
    private email: string;
    private phone: string;
    private speciality: string;
    private subSpeciality: string;
    private experience: number;
    private age: number;
    private gender: string;
    private city: string
    private state: string;
    private address: string;
    private licenseNumber: string;
    private expirationDate: Date;
    private profilePictureUrl: string;

    constructor(
        medicId: number,
        name: string,
        lastname: string,
        email: string,
        phone: string,
        speciality: string,
        subSpeciality: string,
        experience: number,
        age: number,
        gender: string,
        city: string,
        state: string,
        address: string,
        licenseNumber: string,
        expirationDate: Date,
        profilePictureUrl: string
    ) {
        if (medicId <= 0) {
            throw new Error('Medic ID must be a positive number');
        }

        if (medicId > 20000) {
            throw new Error('Medic ID cannot be greater than 20000');
        }

        if (name.trim() === '') {
            throw new Error('Name cannot be empty');
        }

        if (lastname.trim() === '') {
            throw new Error('Lastname cannot be empty');
        }

        if (name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }

        if (lastname.trim().length < 2) {
            throw new Error('Lastname must be at least 2 characters long');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
        }

        if (experience < 0) {
            throw new Error('Experience cannot be negative');
        }

        if (experience > 100) {
            throw new Error('Experience cannot be greater than 100 years');
        }

        if (age < 18) {
            throw new Error('Age must be at least 18');
        }

        if (age > 110) {
            throw new Error('Age cannot be greater than 110');
        }

        if (gender !== "Female" && gender !== "Male") {
            throw new Error('Gender must be either "Female" or "Male"');
        }

        if (!/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg)$/.test(profilePictureUrl)) {
            throw new Error('Profile picture URL must be a valid image URL');
        }

        this.medicId = medicId;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.speciality = speciality;
        this.subSpeciality = subSpeciality;
        this.experience = experience;
        this.age = age;
        this.gender = gender;
        this.city = city;
        this.state = state;
        this.address = address;
        this.licenseNumber = licenseNumber;
        this.expirationDate = expirationDate;
        this.profilePictureUrl = profilePictureUrl;
    }

    updateAge(newAge: number) {
        if (newAge < 18) {
            throw new Error('Age must be at least 18');
        }

        if (newAge > 110) {
            throw new Error('Age cannot be greater than 110');
        }
        this.age = newAge;
    }

    properties() {
        return {
            medicId: this.medicId,
            name: this.name,
            lastname: this.lastname,
            email: this.email,
            phone: this.phone,
            speciality: this.speciality,
            subSpeciality: this.subSpeciality,
            experience: this.experience,
            age: this.age,
            gender: this.gender,
            city: this.city,
            state: this.state,
            address: this.address,
            licenseNumber: this.licenseNumber,
            expirationDate: this.expirationDate,
            profilePictureUrl: this.profilePictureUrl
        }
    }

    updateId(newId: number) {
        throw new Error("Medic ID cannot be updated");
        
        /* if (newId <= 0) {
            throw new Error('Medic ID must be a positive number');
        }

        if (newId > 20000) {
            throw new Error('Medic ID cannot be greater than 20000');
        }

        this.medicId = newId; */
    }

    howManyDaysUntilExpiration(): number {
        const currentDate = new Date();
        const timeDiff = this.expirationDate.getTime() - currentDate.getTime();
        const yearsUntilExpiration = timeDiff / (1000 * 3600 * 24);
        return Math.max(0, Math.floor(yearsUntilExpiration));
    }
}