import { DataSource, EntityManager } from 'typeorm';
import * as sanitizeHtml from 'sanitize-html';
import { DataBaseConstraints } from './db_constraints.constants';
import { ConflictException } from '@nestjs/common';

export async function dbTransactionWrap(
  operation: (...args) => any,
  manager?: EntityManager,
): Promise<any> {
  if (manager) {
    return await operation(manager);
  } else {
    let dataSource: DataSource;
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

type DbContraintAndMsg = {
  dbConstraint: DataBaseConstraints;
  message: string;
};

export async function catchDbException(
  operation: () => any,
  dbConstraints: DbContraintAndMsg[],
): Promise<any> {
  try {
    return await operation();
  } catch (err) {
    dbConstraints.map((dbConstraint) => {
      if (err?.message?.includes(dbConstraint.dbConstraint)) {
        throw new ConflictException(dbConstraint.message);
      }
    });

    throw err;
  }
}

export const defaultAppEnvironments = [
  { name: 'production', isDefault: true, priority: 3 },
];

export const generateInviteURL = (
  invitationToken: string,
  organizationToken?: string,
  organizationId?: string,
  source?: string,
) => {
  const host = 'http://localhost:3000';
  const subpath = 'login';

  return `${host}/invitations/${invitationToken}${
    organizationToken
      ? `/workspaces/${organizationToken}${organizationId ? `?oid=${organizationId}` : ''}`
      : ''
  }${source ? `${organizationId ? '&' : '?'}source=${source}` : ''}`;
};

export const generateOrgInviteURL = (
  organizationToken: string,
  organizationId?: string,
) => {
  const host = process.env.TOOLJET_HOST;
  const subpath = process.env.SUB_PATH;
  return `${host}${subpath ? subpath : '/'}organization-invitations/${organizationToken}${
    organizationId ? `?oid=${organizationId}` : ''
  }`;
};

export const generateNextNameAndSlug = (firstWord: string) => {
  const name = `${firstWord} ${Date.now()}`;
  const slug = name.replace(/\s+/g, '-').toLowerCase();
  return {
    name,
    slug,
  };
};
