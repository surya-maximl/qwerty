export interface UserLanguage {
  name: string;
  value: string;
}

export interface UserSettings {
  language: UserLanguage;
  timezone: string;
  locale: string;
}

export interface User {
  id: string;
  username: string;
  designation: string;
  role: string;
  department: string;
  email: string;
  skills: string[];
  signature: string;
  city: string;
  country: string;
  settings: UserSettings;
}

// {
//     "language": {
//         "name": "English",
//         "value": "en"
//     },
//     "timezone": "Asia/Kolkata",
//     "locale": "en_US"
// }
