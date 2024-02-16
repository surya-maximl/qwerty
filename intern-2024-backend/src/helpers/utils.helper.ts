import { DataSource, EntityManager } from "typeorm";
import * as sanitizeHtml from 'sanitize-html';

export async function dbTransactionWrap(operation: (...args) => any, manager?: EntityManager): Promise<any> {
    if (manager) {
      return await operation(manager);
    } else {
        let dataSource:DataSource;
      return await dataSource.transaction(async (manager) => {
        return await operation(manager);
      });
    }
  }

  export function cleanObject(obj: any): any {
    // This will remove undefined properties, for self and its children
    Object.keys(obj).forEach((key) => {
      obj[key] === undefined && delete obj[key];
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        cleanObject(obj[key]);
      }
    });
  }

  export function sanitizeInput(value: string) {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'recursiveEscape',
    });
  }
  
  export function lowercaseString(value: string) {
    return value?.toLowerCase()?.trim();
  }