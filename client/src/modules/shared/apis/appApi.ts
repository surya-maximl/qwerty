import baseApi from './baseApi';

type AppType = {
  id: string;
  name: string;
  icon: any;
  isPublic: boolean;
  isMaintenanceOn: boolean;
  currentVersionId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type RenameAppProps = {
  appName: string;
  appId: string;
};

type ChangeIconProps = {
  id: string;
  icon: string;
};

export const appApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllApps: build.query<AppType[], void>({
      query: () => {
        return {
          url: 'apps',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        };
      },
      transformResponse: (response) => {
        const transformedResponse = response.sort(
          (a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0)
        );
        return transformedResponse;
      },
      providesTags: ['Apps']
    }),
    createApp: build.mutation<AppType, string>({
      query: (appName) => {
        return {
          url: 'apps',
          method: 'POST',
          body: {
            name: appName
          }
        };
      },
      invalidatesTags: ['Apps']
    }),
    renameApp: build.mutation<AppType, RenameAppProps>({
      query: ({ appName, appId }) => {
        return {
          url: `apps/${appId}`,
          method: 'PATCH',
          body: {
            name: appName
          }
        };
      },
      invalidatesTags: ['Apps']
    }),
    deleteApp: build.mutation<AppType, string>({
      query: (appId) => {
        return {
          url: `apps/${appId}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Apps']
    }),
    changeIcon: build.mutation<AppType, ChangeIconProps>({
      query: ({ icon, id }) => {
        return {
          url: 'apps/icon',
          method: 'PUT',
          body: {
            icon,
            id
          }
        };
      },
      invalidatesTags: ['Apps']
    })
  })
});

export const {
  useGetAllAppsQuery,
  useCreateAppMutation,
  useRenameAppMutation,
  useDeleteAppMutation,
  useChangeIconMutation
} = appApi;
