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

export const appApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllApps: build.query<AppType[], void>({
      query: () => {
        return {
          url: 'apps',
          method: 'GET'
        };
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
    })
  })
});

export const { useGetAllAppsQuery, useCreateAppMutation, useRenameAppMutation } = appApi;

// const [createApp, { isLoading: isCreationLoading }] = useCreateAppMutation();

// function handleCreateApp() {
//   createApp(newAppName);
//   setOpen(false);
// }
