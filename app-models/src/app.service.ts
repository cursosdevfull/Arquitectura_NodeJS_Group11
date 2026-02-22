import { Injectable } from '@nestjs/common';
import { MedicalModelData } from './models/model-data';
import { MedicalModelDomain } from './models/model-domain';

@Injectable()
export class AppService {
  private listMedics: MedicalModelDomain[] | MedicalModelData[] = []

  constructor() {
    /* this.listMedics = [
      new MedicalModelData(-1, '', '', 'john.doe@example.com', '1234567890', 'Cardiology', 'Pediatric Cardiology', 10, 5, 'Martian', 'New York', 'NY', '123 Main St', 'ABC123', 'example.com'),

      new MedicalModelData(20000000000000000000000000, 'Jane', 'Smith', 'jane.smithexample.com', '0987654321', 'Neurology', 'Pediatric Neurology', 8, 320, 'Dog', 'Los Angeles', 'CA', '456 Elm St', 'DEF456', 'https://example.com/profile2.pdf')
    ]

    this.listMedics.forEach(medic => {
      medic.age *= 2
      medic.medicId *=10
    }) */

    this.listMedics = [
      new MedicalModelDomain(1, 'ja', 'pe', 'john.doe@example.com', '1234567890', 'Cardiology', 'Pediatric Cardiology', 10, 25, 'Male', 'New York', 'NY', '123 Main St', 'ABC123', new Date("2026-01-01T00:00:00Z"), 'https://example.com/profile1.png'),

      new MedicalModelDomain(570, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Neurology', 'Pediatric Neurology', 8, 56, 'Female', 'Los Angeles', 'CA', '456 Elm St', 'DEF456', new Date("2026-03-01T00:00:00Z"), 'https://example.com/profile2.png')
    ]

    this.listMedics.forEach(medic => {
      const props = medic.properties()
      medic.updateAge(props.age * 1)
      //medic.updateId(props.medicId * 10)
    })

  }

  list(): any[] {
    return this.listMedics.map(medic => {
      return {...medic.properties(), daysUntilExpiration: medic.howManyDaysUntilExpiration() }
    });
  }
}
