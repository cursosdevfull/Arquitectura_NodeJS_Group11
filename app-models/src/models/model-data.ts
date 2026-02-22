export class MedicalModelData {
    medicId: number;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    speciality: string;
    subSpeciality: string;
    experience: number;
    age: number;
    gender: string;
    city: string
    state: string;
    address: string;
    licenseNumber: string;
    profilePictureUrl: string;

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
        profilePictureUrl: string
    ) {
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
        this.profilePictureUrl = profilePictureUrl;
    }
}