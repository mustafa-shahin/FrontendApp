export interface EntityConfig {
  name: string;
  pluralName: string;
  apiPath: string;
  icon: string;
  permissions?: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
  };
}

export const entityConfigs: Record<string, EntityConfig> = {
  users: {
    name: 'User',
    pluralName: 'Users',
    apiPath: '/user',
    icon: 'users',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  files: {
    name: 'File',
    pluralName: 'Files',
    apiPath: '/file',
    icon: 'file',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  folders: {
    name: 'Folder',
    pluralName: 'Folders',
    apiPath: '/folder',
    icon: 'folder',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
};
