export interface Role {
    id: number;
    name: string;
    state: boolean;
  }
  
  export interface Permission {
    id: number;
    name: string;
  }
  
  export interface RolePermission {
    roleId: number;
    permissionId: number;
  }
  
  export interface User {
    id: string; // UUID
    username: string;
    password: string;
    roleId: number | null;
  }
  
  export interface Frequency {
    id: number;
    name: string;
    fnumber: number;
    state: boolean;
  }
  
  export interface Person {
    id: number;
    personType_id: number;
    typeDni: string;
    dni: string | null;
    first_name: string;
    last_name: string;
    address: number | null;
    telefono: string;
    email: string;
    position: number | null;
    state: boolean;
  }
  
  export interface LoanState {
    id: number;
    name: string;
    state: boolean;
  }
  
  export interface LoanHeader {
    id: number;
    user_id: string; // UUID
    person_id: number;
    frequency_id: number;
    loan_num: string;
    amount: number;
    dues: number;
    interest: number;
    start_date: string; // ISO 8601 date string
    end_date: string; // ISO 8601 date string
    state_id: number;
  }
  
  export interface LoanDetail {
    id: number;
    loan_id: number;
    dues_num: number;
    dues_amount: number;
    total_amount: number;
    total_interest: number;
    start_date: string; // ISO 8601 date string
    state_id: number;
  }
  
  export interface Payment {
    id: number;
    loan_id: number;
    user_id: string; // UUID
    payment_number: number | null;
    balance: number;
    capital: number;
    interest: number;
    dues: number;
    payment_amount: number;
    state_id: number;
  }
  
  export interface GeneralConfiguration {
    id: number;
    config_name: string;
    config_value: string;
    description: string | null;
  }
  
  export interface LoanConfiguration {
    id: number;
    config_name: string;
    config_value: string;
    description: string | null;
  }
  
  export interface AppConfiguration {
    id: number;
    config_name: string;
    config_value: string;
    description: string | null;
  }