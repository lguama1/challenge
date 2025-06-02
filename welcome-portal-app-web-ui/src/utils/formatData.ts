export default class FormatData {
    public static formatTitleCase(data: string): string {
        const exceptions = ['de', 'del', 'la', 'las', 'el', 'los', 'y'];

        return data
        .toLowerCase()
        .split(' ')
        .filter(word => word.trim() !== '')
        .map((word, index) => {
            if (exceptions.includes(word) && index !== 0) {
            return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    }

    public static formatDate(data: string | null) {
        if (data === null) return '';
        const date = new Date(data);
        return date.toLocaleDateString('es-ES');
    }

    public static requestTypeMapping(request: string) {
        const requestTypes: Record<string, string> = {
            computer: 'Asignación de computador',
            access: 'Solicitud de accesos',
            user: 'Creación de usuario'
        };
        return requestTypes[request] || request;
    }

    public static statusMapping(status: string) {
        const statusTypes: Record<string, string> = {
            pending: 'Pendiente',
            approved: 'Aprobada',
            rejected: 'Rechazada'
        };
        return statusTypes[status] || status;
    }
}
