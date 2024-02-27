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
  phoneNumber: string;
  company: string;
  email: string;
  token: string;
}

// {
//     "language": {
//         "name": "English",
//         "value": "en"
//     },
//     "timezone": "Asia/Kolkata",
//     "locale": "en_US"
// }
