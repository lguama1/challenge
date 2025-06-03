// Siderbar from dashboard
export const SIDERBAR_LIST = [
  {
    'icon':'ico-look',
    'label':'Historial'
  },
  {
    'icon':'ico-avartars-profile-settings',
    'label':'Creación de usuario'
  },
  {
    'icon':'ico-padlock-lock',
    'label':'Solicitud de accesos'
  },
  {
    'icon':'ico-laptop',
    'label':'Asignación de laptop'
  }
];

export const OPTIONS_ROL = [
  { text: 'Arquitecto', value: '01' },
  { text: 'Desarrollador', value: '02' },
  { text: 'DevOps', value: '03' },
  { text: 'Lider', value: '04' },
  { text: 'Tester', value: '05' },
  { text: 'Product Owner', value: '06' },
  { text: 'Agile', value: '07' },
  { text: 'Diseñador', value: '08' }
];

export const OPTIONS_ACCESS_ROLE = {
  'Arquitecto': ['GitHub', 'SonarCloud', 'AWS', 'Grafana', 'Jira', 'Confluence'],
  'Desarrollador': ['GitHub', 'SonarCloud', 'AWS', 'Grafana', 'Jira', 'Confluence'],
  'DevOps': ['GitHub', 'SonarCloud', 'AWS', 'Jira', 'Confluence'],
  'Lider': ['GitHub', 'SonarCloud', 'AWS', 'Grafana', 'Jira', 'Confluence'],
  'Tester': ['GitHub', 'SonarCloud', 'AWS', 'Grafana', 'Jira', 'Confluence'],
  'Product Owner': ['Grafana', 'Jira', 'Confluence'],
  'Diseñador': ['Jira', 'Confluence'],
  'Agile': ['Jira', 'Confluence']
};

export const TABS_LAPTOPS_ALLOCATION = [
  {
    'id':'1',
    'title':'Asignar laptop',
    'slotName': 'formLaptopAllocation',
    'disabled':false,
    'notification':false
  },
  {
    'id':'2',
    'title':'Inventario',
    'slotName': 'tableLaptopInventary',
    'disabled':false,
    'notification':false
  }
]

export const OPTIONS_LAPTOP = [
  { text: 'macOS', value: '01' },
  { text: 'Windows', value: '02' },
  { text: 'Linux', value: '03' }
];

export const COL_LAPTOP_INVENTORY = [
  {
    'colName':'Colaborador',
    'control':'text'
  },
  {
    'colName':'Equipo',
    'control':'text'
  },
  {
    'colName':'Número de serie',
    'control':'text'
  },
  {
    'colName': 'Fecha de entrega',
    'control':'date'
  }
]

export const COL_RECORD = [
  {
    'colName': 'Fecha de solicitud',
    'control':'date'
  },
  {
    'colName':'Colaborador',
    'control':'text'
  },
  {
    'colName':'Solicitud',
    'control':'text'
  },
  {
    'colName':'Estado',
    'control':'text'
  },
  {
    'colName': 'Detalles',
    'control':'button'
  }
]
