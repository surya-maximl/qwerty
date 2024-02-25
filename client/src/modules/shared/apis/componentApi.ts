// type AppType = {
//   id: string;
//   name: string;
//   icon: any;
//   isPublic: boolean;
//   isMaintenanceOn: boolean;
//   currentVersionId: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type RenameAppProps = {
//   appName: string;
//   appId: string;
// };
import { Box } from '../../core/interfaces/container.interface';
import baseApi from './baseApi';

export const componentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchComponents: build.query<Box[], string>({
      query: (id) => {
        return {
          url: `components/${id}`,
          method: 'GET'
        };
      },
      transformResponse: (response) => {
        const transformedResponse = response.reduce(function (map, obj) {
          map[obj.id] = { ...obj };
          return map;
        }, {});

        return transformedResponse;
      },
      providesTags: ['Components']
    }),
    createComponent: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `components/${id}`,
          method: 'POST',
          body: data
        };
      },
      invalidatesTags: ['Components']
    }),
    updateComponents: build.mutation({
      query: ({ id, componentId, data }) => {
        return {
          url: `components/${id}/${componentId}`,
          method: 'PATCH',
          body: data
        };
      },
      invalidatesTags: ['Components']
    }),
    deleteComponent: build.mutation({
      query: ({ id, componentId }) => {
        return {
          url: `components/${id}/${componentId}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Components']
    })
  })
});

export const {
  useFetchComponentsQuery,
  useCreateComponentMutation,
  useUpdateComponentsMutation,
  useDeleteComponentMutation
} = componentApi;
