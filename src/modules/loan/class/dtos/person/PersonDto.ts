import { Person } from "../../../../auth/interfaces";


export class PersonDto {
  id: number;
  personType_id: number;
  typeDni: string;
  dni?: string;
  first_name: string;
  last_name: string;
  address?: number;
  telefono: string;
  email: string;
  position?: number;
  state: boolean;

  constructor(person: Person) {
    this.id = person.id;
    this.personType_id = person.personType_id;
    this.typeDni = person.typeDni;
    this.dni = person.dni;
    this.first_name = person.first_name;
    this.last_name = person.last_name;
    this.address = person.address;
    this.telefono = person.telefono;
    this.email = person.email;
    this.position = person.position;
    this.state = person.state;
  }
}
