export interface IRecord {
    createdAt: string;
    status: 'Pendiente' | 'Aprobada' | 'Rechazada';
    typeOfRequest: 'Creacion de usuario' | 'Solicitud de accesos' | 'Asiganción de computador';
    owner: string;
}