import { createNotification } from "../../helpers/Notification";
import { client } from '../graphql';
import { MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA, MUTATION_CREATE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA, MUTATION_DELETE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA, MUTATION_UPDATE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA } from '../graphql/ExperienceLearningRubricCriteria/ExperienceLearningRubricCriteriaMutations';
import { QUERY_GET_ALL_EXPERIENCE_LEARNING_RUBRIC_CRITERIA, QUERY_GET_EXPERIENCE_LEARNING_RUBRIC_CRITERIA, QUERY_GET_DROPDOWNS_EXPERIENCE_LEARNING_RUBRIC_CRITERIA } from '../graphql/ExperienceLearningRubricCriteria/ExperienceLearningRubricCriteriaQueries';


export const getListAllExperienceLearningRubricCriteria = (experienceLearningId  : string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_EXPERIENCE_LEARNING_RUBRIC_CRITERIA,
          variables:{
            experienceLearningId,
          },
        })
        .then((result: any) => {
          listData = result.data.data.edges;
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const dataExperienceLearningRubricCriteria = (id: any) => {
  return async (dispatch: any) => {
    try {
      let data = {};
      await client
        .query({
          query: QUERY_GET_EXPERIENCE_LEARNING_RUBRIC_CRITERIA,
          variables: {
            id,
          },
        })
        .then((result: any) => {
          data = result.data;
        });
      return data;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const saveNewExperienceLearningRubricCriteria = (data: any) => {
  return async (dispatch: any) => {
    try {
      let model: any = {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      let dataCreate = null;
      model.weight = model.weight && !isNaN(model.weight) ? parseFloat(model.weight) : null;
      await client
        .mutate({
          mutation: MUTATION_CREATE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA,
          variables: { input: model },
        })
        .then((dataResponse: any) => {
          if (dataResponse.errors?.length > 0) {
            dataResponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataCreate = dataResponse.data.create.id;
            createNotification('success', 'success', '');
          }
        });
      return dataCreate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const updateExperienceLearningRubricCriteria = (data: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let model: any = {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      let dataUpdate = null;
      model.weight = model.weight && !isNaN(model.weight) ? parseFloat(model.weight) : null;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA,
          variables: { id, input: model },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataUpdate = dataReponse.data.update.id;
            createNotification('success', 'success', '');
          }
        });
      return dataUpdate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const changeActiveExperienceLearningRubricCriteria = (active: any, id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataChangeActive = null;
      await client
        .mutate({
          mutation: MUTATION_CHANGE_ACTIVE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA,
          variables: { id, active },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              if (showToast) {
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataChangeActive = dataReponse.data.changeActive;
            if (showToast) {
              createNotification('success', 'success', '');
            }
          }
        });
      return dataChangeActive as any;
    } catch (error) {
      if (showToast) {
        createNotification('error', 'error', '');
      }
      return error;
    }
  };
};

export const deleteExperienceLearningRubricCriteria = (id: any, showToast: boolean) => {
  return async (dispatch: any) => {
    try {
      let dataDelete = null;
      await client
        .mutate({
          mutation: MUTATION_DELETE_EXPERIENCE_LEARNING_RUBRIC_CRITERIA,
          variables: { id },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              if (showToast) {
                createNotification('error', 'error', '');
              }
            });
          } else {
            dataDelete = dataReponse.data;
            if (showToast) {
              createNotification('success', 'success', '');
            }
          }
        });
      return dataDelete as any;
    } catch (error) {
      if (showToast) {
        createNotification('error', 'error', '');
      }
      return error;
    }
  };
};

export const getDropdownsExperienceLearningRubricCriteria = (id: string, schoolId: string) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_EXPERIENCE_LEARNING_RUBRIC_CRITERIA,
          variables:{
            id,
            schoolId,
          },
        })
        .then((result: any) => {
          listData = result.data;
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};
