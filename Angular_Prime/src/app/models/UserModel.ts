import { Company } from "./comapny";
import { Department } from "./department";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    ph_number: string;
    role: string;
    status: boolean;
    register_name: string;
    registration_code: string;
    telegram_user_id: number;
    telegram_user_name: string;
    register_status: boolean;
    department: Department;
    company: Company;
    acceptedAnnouncements: any[];
    enabled: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    username: string;
    accountNonLocked: boolean;
}